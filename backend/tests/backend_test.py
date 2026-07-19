"""DigiConnect backend API test suite (pytest).

Runs against the public REACT_APP_BACKEND_URL for parity with what the
frontend actually calls.  Covers:
- Service health
- Auth (login, me, invalid creds)
- Products (public list, active_only filter, admin CRUD, auth-guard)
- Announcements (public list, admin CRUD, auth-guard)
- MongoDB admin user + index checks
"""
import os
import uuid
import pytest
import requests
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get(
    "REACT_APP_BACKEND_URL"
) else "https://modern-digiconnect.preview.emergentagent.com"

# Fallback: frontend .env holds the external URL used by the browser.
if not os.environ.get("REACT_APP_BACKEND_URL"):
    fe_env = Path("/app/frontend/.env")
    if fe_env.exists():
        for line in fe_env.read_text().splitlines():
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

ADMIN_EMAIL = "admin@digiconnect.net.in"
ADMIN_PASSWORD = "DigiConnect@2026"


# ---------- fixtures ----------
@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(api):
    r = api.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=15,
    )
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---------- health ----------
class TestHealth:
    def test_service_ok(self, api):
        r = api.get(f"{BASE_URL}/api/", timeout=10)
        assert r.status_code == 200
        j = r.json()
        assert j.get("status") == "ok"
        assert "DigiConnect" in j.get("service", "")


# ---------- auth ----------
class TestAuth:
    def test_login_success(self, api):
        r = api.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            timeout=15,
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert "access_token" in body and isinstance(body["access_token"], str)
        assert body.get("token_type") == "bearer"
        user = body.get("user") or {}
        assert user.get("email") == ADMIN_EMAIL
        assert user.get("role") == "admin"
        assert "id" in user

    def test_login_wrong_password(self, api):
        r = api.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": "not-the-password"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_login_unknown_email(self, api):
        r = api.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "nope@digiconnect.net.in", "password": "whatever"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_me_without_token(self, api):
        r = api.get(f"{BASE_URL}/api/auth/me", timeout=15)
        assert r.status_code == 401

    def test_me_with_token(self, api, admin_headers):
        r = api.get(f"{BASE_URL}/api/auth/me", headers=admin_headers, timeout=15)
        assert r.status_code == 200
        body = r.json()
        assert body["email"] == ADMIN_EMAIL
        assert body["role"] == "admin"

    def test_me_with_bad_token(self, api):
        r = api.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": "Bearer garbage.token.here"},
            timeout=15,
        )
        assert r.status_code == 401


# ---------- products ----------
class TestProducts:
    def test_list_seeded(self, api):
        r = api.get(f"{BASE_URL}/api/products", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 4, f"expected >=4 seeded products, got {len(items)}"
        for p in items:
            assert "_id" not in p, "MongoDB _id must be excluded"
            for k in ("id", "name", "category", "is_active"):
                assert k in p

    def test_active_only_filter(self, api, admin_headers):
        # Create an inactive product then check filter excludes it
        payload = {
            "name": f"TEST_inactive_{uuid.uuid4().hex[:6]}",
            "category": "Test",
            "is_active": False,
            "order": 999,
        }
        created = api.post(
            f"{BASE_URL}/api/products", json=payload, headers=admin_headers, timeout=15
        )
        assert created.status_code == 201, created.text
        pid = created.json()["id"]
        try:
            active = api.get(f"{BASE_URL}/api/products?active_only=true", timeout=15).json()
            all_items = api.get(f"{BASE_URL}/api/products", timeout=15).json()
            ids_active = {p["id"] for p in active}
            ids_all = {p["id"] for p in all_items}
            assert pid in ids_all
            assert pid not in ids_active
            assert all(p.get("is_active") is True for p in active)
        finally:
            api.delete(
                f"{BASE_URL}/api/products/{pid}", headers=admin_headers, timeout=15
            )

    def test_create_requires_auth(self, api):
        r = api.post(
            f"{BASE_URL}/api/products",
            json={"name": "TEST_x", "category": "cat"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_update_requires_auth(self, api):
        r = api.patch(
            f"{BASE_URL}/api/products/does-not-exist",
            json={"name": "x"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_delete_requires_auth(self, api):
        r = api.delete(f"{BASE_URL}/api/products/does-not-exist", timeout=15)
        assert r.status_code == 401

    def test_product_crud_flow(self, api, admin_headers):
        # CREATE
        payload = {
            "name": f"TEST_prod_{uuid.uuid4().hex[:6]}",
            "category": "TestCat",
            "price": "₹1",
            "image_url": "https://example.com/x.jpg",
            "highlight": "hi",
            "is_active": True,
            "order": 42,
        }
        r = api.post(f"{BASE_URL}/api/products", json=payload, headers=admin_headers, timeout=15)
        assert r.status_code == 201, r.text
        created = r.json()
        pid = created["id"]
        assert created["name"] == payload["name"]
        assert created["order"] == 42

        # READ (verify persistence)
        listed = api.get(f"{BASE_URL}/api/products", timeout=15).json()
        assert any(p["id"] == pid and p["name"] == payload["name"] for p in listed)

        # UPDATE
        upd = api.patch(
            f"{BASE_URL}/api/products/{pid}",
            json={"name": payload["name"] + "_upd", "order": 7},
            headers=admin_headers,
            timeout=15,
        )
        assert upd.status_code == 200
        assert upd.json()["name"].endswith("_upd")
        assert upd.json()["order"] == 7

        # Verify persisted
        listed = api.get(f"{BASE_URL}/api/products", timeout=15).json()
        got = next(p for p in listed if p["id"] == pid)
        assert got["name"].endswith("_upd")
        assert got["order"] == 7

        # DELETE
        d = api.delete(f"{BASE_URL}/api/products/{pid}", headers=admin_headers, timeout=15)
        assert d.status_code == 200
        assert d.json().get("success") is True

        # Verify gone
        listed = api.get(f"{BASE_URL}/api/products", timeout=15).json()
        assert not any(p["id"] == pid for p in listed)

        # Update non-existent
        r404 = api.patch(
            f"{BASE_URL}/api/products/{pid}",
            json={"name": "x"},
            headers=admin_headers,
            timeout=15,
        )
        assert r404.status_code == 404


# ---------- announcements ----------
class TestAnnouncements:
    def test_list_seeded(self, api):
        r = api.get(f"{BASE_URL}/api/announcements", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 1
        for a in items:
            assert "_id" not in a
            assert "id" in a and "message" in a

    def test_create_requires_auth(self, api):
        r = api.post(
            f"{BASE_URL}/api/announcements", json={"message": "TEST_x"}, timeout=15
        )
        assert r.status_code == 401

    def test_announcement_crud_flow(self, api, admin_headers):
        payload = {"message": f"TEST_ann_{uuid.uuid4().hex[:6]}", "order": 100, "is_active": True}
        r = api.post(f"{BASE_URL}/api/announcements", json=payload, headers=admin_headers, timeout=15)
        assert r.status_code == 201, r.text
        created = r.json()
        aid = created["id"]
        assert created["message"] == payload["message"]

        upd = api.patch(
            f"{BASE_URL}/api/announcements/{aid}",
            json={"message": payload["message"] + "_upd", "is_active": False},
            headers=admin_headers,
            timeout=15,
        )
        assert upd.status_code == 200
        assert upd.json()["message"].endswith("_upd")
        assert upd.json()["is_active"] is False

        # active_only filter excludes it
        active_ids = {a["id"] for a in api.get(
            f"{BASE_URL}/api/announcements?active_only=true", timeout=15
        ).json()}
        assert aid not in active_ids

        d = api.delete(f"{BASE_URL}/api/announcements/{aid}", headers=admin_headers, timeout=15)
        assert d.status_code == 200


# ---------- offers (new) ----------
class TestOffers:
    def test_list_seeded(self, api):
        r = api.get(f"{BASE_URL}/api/offers", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 3, f"expected >=3 seeded offers, got {len(items)}"
        titles = [o["title"] for o in items]
        # Verify key seeded offers
        assert any("Z Fold8" in t for t in titles), f"Fold8 pre-reserve missing: {titles}"
        assert any("S25 Ultra" in t for t in titles), f"S25 Ultra bundle missing: {titles}"
        assert any("A-series" in t or "A55" in t for t in titles), f"A-series trade-in missing: {titles}"
        for o in items:
            assert "_id" not in o
            for k in ("id", "title", "is_active", "store"):
                assert k in o

    def test_active_only_filter(self, api, admin_headers):
        payload = {
            "title": f"TEST_offer_inactive_{uuid.uuid4().hex[:6]}",
            "description": "hidden",
            "is_active": False,
            "order": 999,
        }
        created = api.post(f"{BASE_URL}/api/offers", json=payload, headers=admin_headers, timeout=15)
        assert created.status_code == 201, created.text
        oid = created.json()["id"]
        try:
            active = api.get(f"{BASE_URL}/api/offers?active_only=true", timeout=15).json()
            all_items = api.get(f"{BASE_URL}/api/offers", timeout=15).json()
            assert oid in {o["id"] for o in all_items}
            assert oid not in {o["id"] for o in active}
            assert all(o.get("is_active") is True for o in active)
        finally:
            api.delete(f"{BASE_URL}/api/offers/{oid}", headers=admin_headers, timeout=15)

    def test_create_requires_auth(self, api):
        r = api.post(f"{BASE_URL}/api/offers", json={"title": "TEST_x"}, timeout=15)
        assert r.status_code == 401

    def test_update_requires_auth(self, api):
        r = api.patch(f"{BASE_URL}/api/offers/does-not-exist", json={"title": "x"}, timeout=15)
        assert r.status_code == 401

    def test_delete_requires_auth(self, api):
        r = api.delete(f"{BASE_URL}/api/offers/does-not-exist", timeout=15)
        assert r.status_code == 401

    def test_offer_crud_flow(self, api, admin_headers):
        # CREATE
        payload = {
            "title": f"TEST_offer_{uuid.uuid4().hex[:6]}",
            "description": "an in-store offer",
            "tag": "TEST",
            "valid_until": "2026-12-31",
            "image_url": "https://example.com/o.jpg",
            "store": "gaur-city",
            "is_active": True,
            "order": 55,
        }
        r = api.post(f"{BASE_URL}/api/offers", json=payload, headers=admin_headers, timeout=15)
        assert r.status_code == 201, r.text
        created = r.json()
        oid = created["id"]
        assert created["title"] == payload["title"]
        assert created["store"] == "gaur-city"
        assert created["tag"] == "TEST"

        # READ (verify persistence)
        listed = api.get(f"{BASE_URL}/api/offers", timeout=15).json()
        assert any(o["id"] == oid and o["title"] == payload["title"] for o in listed)

        # UPDATE
        upd = api.patch(
            f"{BASE_URL}/api/offers/{oid}",
            json={"title": payload["title"] + "_upd", "store": "grand-venice", "is_active": False},
            headers=admin_headers,
            timeout=15,
        )
        assert upd.status_code == 200
        body = upd.json()
        assert body["title"].endswith("_upd")
        assert body["store"] == "grand-venice"
        assert body["is_active"] is False

        # Verify persisted via GET
        listed = api.get(f"{BASE_URL}/api/offers", timeout=15).json()
        got = next(o for o in listed if o["id"] == oid)
        assert got["title"].endswith("_upd")
        assert got["store"] == "grand-venice"
        assert got["is_active"] is False

        # active_only excludes inactive
        active_ids = {o["id"] for o in api.get(f"{BASE_URL}/api/offers?active_only=true", timeout=15).json()}
        assert oid not in active_ids

        # DELETE
        d = api.delete(f"{BASE_URL}/api/offers/{oid}", headers=admin_headers, timeout=15)
        assert d.status_code == 200
        assert d.json().get("success") is True

        # Verify gone
        listed = api.get(f"{BASE_URL}/api/offers", timeout=15).json()
        assert not any(o["id"] == oid for o in listed)

        # 404 on update non-existent
        r404 = api.patch(
            f"{BASE_URL}/api/offers/{oid}", json={"title": "x"}, headers=admin_headers, timeout=15
        )
        assert r404.status_code == 404


# ---------- product seed verification (post-migration) ----------
class TestProductSeed:
    def test_seeded_names(self, api):
        r = api.get(f"{BASE_URL}/api/products", timeout=15)
        assert r.status_code == 200
        names = [p["name"] for p in r.json()]
        for expected in [
            "Galaxy S25 Ultra",
            "Galaxy Z Fold6",
            "Galaxy A55 5G",
            "Galaxy Buds3 Pro",
            "Galaxy Watch7",
            "Galaxy Tab S10",
        ]:
            assert expected in names, f"missing seeded product: {expected} — got {names}"


class TestAnnouncementSeed:
    def test_fold8_present(self, api):
        r = api.get(f"{BASE_URL}/api/announcements", timeout=15)
        assert r.status_code == 200
        msgs = [a["message"] for a in r.json()]
        assert any("Fold8" in m and "Pre-reserve" in m for m in msgs), f"Fold8 announcement missing: {msgs}"


# ---------- DB checks (direct) ----------
class TestMongoState:
    def test_admin_seeded_and_indexes(self):
        try:
            from pymongo import MongoClient
        except ImportError:
            pytest.skip("pymongo not available")
        mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
        db_name = os.environ.get("DB_NAME", "digiconnect_db")
        c = MongoClient(mongo_url, serverSelectionTimeoutMS=3000)
        try:
            c.admin.command("ping")
        except Exception as e:
            pytest.skip(f"cannot reach mongo locally: {e}")
        db = c[db_name]
        u = db.users.find_one({"email": ADMIN_EMAIL})
        assert u is not None, "admin user not seeded"
        assert u.get("role") == "admin"
        assert u.get("password_hash", "").startswith("$2b$"), "password_hash must be bcrypt $2b$"

        idx = db.users.index_information()
        # unique index on email
        email_idx = [v for v in idx.values() if v.get("key") == [("email", 1)]]
        assert email_idx and email_idx[0].get("unique"), "users.email must have unique index"



# ---------- testimonials (new in iter 4) ----------
class TestTestimonials:
    def test_list_seeded(self, api):
        r = api.get(f"{BASE_URL}/api/testimonials", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 5, f"expected >=5 seeded testimonials, got {len(items)}"
        authors = {t["author"] for t in items}
        for expected in ["Rohan Sharma", "Priya Verma", "Aditya Kapoor", "Sneha Iyer", "Karan Mehta"]:
            assert expected in authors, f"missing seeded author: {expected} — got {authors}"
        for t in items:
            assert "_id" not in t
            for k in ("id", "author", "rating", "text", "store", "source", "is_active"):
                assert k in t
            assert isinstance(t["rating"], int) and 1 <= t["rating"] <= 5
            assert t["text"], "text must be non-empty"
            assert t["store"] in ("both", "gaur-city", "grand-venice")
            assert t["source"] == "Google"

    def test_active_only_filter(self, api, admin_headers):
        payload = {
            "author": f"TEST_tm_inactive_{uuid.uuid4().hex[:6]}",
            "rating": 3,
            "text": "hidden review",
            "is_active": False,
            "order": 999,
        }
        r = api.post(f"{BASE_URL}/api/testimonials", json=payload, headers=admin_headers, timeout=15)
        assert r.status_code == 201, r.text
        tid = r.json()["id"]
        try:
            active = api.get(f"{BASE_URL}/api/testimonials?active_only=true", timeout=15).json()
            all_items = api.get(f"{BASE_URL}/api/testimonials", timeout=15).json()
            assert tid in {t["id"] for t in all_items}
            assert tid not in {t["id"] for t in active}
            assert all(t.get("is_active") is True for t in active)
        finally:
            api.delete(f"{BASE_URL}/api/testimonials/{tid}", headers=admin_headers, timeout=15)

    def test_store_filter_inclusive(self, api):
        # store=gaur-city should return items with store in {gaur-city, both}
        r = api.get(f"{BASE_URL}/api/testimonials?store=gaur-city", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert len(items) >= 1
        stores = {t["store"] for t in items}
        assert stores.issubset({"gaur-city", "both"}), f"store filter must be inclusive of 'both', got {stores}"
        # Karan Mehta is "both" — should be included in gaur-city filter
        authors = {t["author"] for t in items}
        assert "Karan Mehta" in authors, "'both' testimonials must appear when filtering by a specific store"

        r2 = api.get(f"{BASE_URL}/api/testimonials?store=grand-venice", timeout=15)
        stores2 = {t["store"] for t in r2.json()}
        assert stores2.issubset({"grand-venice", "both"})

    def test_create_requires_auth(self, api):
        r = api.post(
            f"{BASE_URL}/api/testimonials",
            json={"author": "TEST_x", "text": "hi", "rating": 5},
            timeout=15,
        )
        assert r.status_code == 401

    def test_update_requires_auth(self, api):
        r = api.patch(
            f"{BASE_URL}/api/testimonials/does-not-exist",
            json={"rating": 4},
            timeout=15,
        )
        assert r.status_code == 401

    def test_delete_requires_auth(self, api):
        r = api.delete(f"{BASE_URL}/api/testimonials/does-not-exist", timeout=15)
        assert r.status_code == 401

    def test_testimonial_crud_flow(self, api, admin_headers):
        # CREATE with rating=4
        payload = {
            "author": f"TEST_tm_{uuid.uuid4().hex[:6]}",
            "rating": 4,
            "text": "solid experience, walked out with the phone.",
            "store": "gaur-city",
            "source": "Google",
            "date": "Jan 2026",
            "is_active": True,
            "order": 55,
        }
        r = api.post(f"{BASE_URL}/api/testimonials", json=payload, headers=admin_headers, timeout=15)
        assert r.status_code == 201, r.text
        created = r.json()
        tid = created["id"]
        assert created["author"] == payload["author"]
        assert created["rating"] == 4
        assert created["store"] == "gaur-city"

        # READ verify persistence
        listed = api.get(f"{BASE_URL}/api/testimonials", timeout=15).json()
        assert any(t["id"] == tid and t["rating"] == 4 for t in listed)

        # PATCH rating only (partial)
        upd = api.patch(
            f"{BASE_URL}/api/testimonials/{tid}",
            json={"rating": 5},
            headers=admin_headers,
            timeout=15,
        )
        assert upd.status_code == 200
        body = upd.json()
        assert body["rating"] == 5
        assert body["author"] == payload["author"]  # unchanged
        assert body["text"] == payload["text"]  # unchanged

        # Verify persisted
        listed = api.get(f"{BASE_URL}/api/testimonials", timeout=15).json()
        got = next(t for t in listed if t["id"] == tid)
        assert got["rating"] == 5

        # PATCH is_active only (partial)
        upd2 = api.patch(
            f"{BASE_URL}/api/testimonials/{tid}",
            json={"is_active": False},
            headers=admin_headers,
            timeout=15,
        )
        assert upd2.status_code == 200
        assert upd2.json()["is_active"] is False
        assert upd2.json()["rating"] == 5

        # DELETE
        d = api.delete(f"{BASE_URL}/api/testimonials/{tid}", headers=admin_headers, timeout=15)
        assert d.status_code == 200
        assert d.json().get("success") is True

        # 404 on subsequent PATCH
        r404 = api.patch(
            f"{BASE_URL}/api/testimonials/{tid}",
            json={"rating": 1},
            headers=admin_headers,
            timeout=15,
        )
        assert r404.status_code == 404

        # 404 on subsequent DELETE
        d404 = api.delete(f"{BASE_URL}/api/testimonials/{tid}", headers=admin_headers, timeout=15)
        assert d404.status_code == 404


# ---------- instagram posts (new in iter 4) ----------
class TestInstagramPosts:
    def test_list_seeded(self, api):
        r = api.get(f"{BASE_URL}/api/instagram-posts", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 6, f"expected >=6 seeded instagram posts, got {len(items)}"
        for p in items:
            assert "_id" not in p
            for k in ("id", "image_url", "is_active"):
                assert k in p
            assert p["image_url"], "image_url must be non-empty"

    def test_active_only_filter(self, api, admin_headers):
        payload = {
            "image_url": "https://example.com/hidden.jpg",
            "caption": f"TEST_ig_inactive_{uuid.uuid4().hex[:6]}",
            "is_active": False,
            "order": 999,
        }
        r = api.post(f"{BASE_URL}/api/instagram-posts", json=payload, headers=admin_headers, timeout=15)
        assert r.status_code == 201, r.text
        pid = r.json()["id"]
        try:
            active = api.get(f"{BASE_URL}/api/instagram-posts?active_only=true", timeout=15).json()
            all_items = api.get(f"{BASE_URL}/api/instagram-posts", timeout=15).json()
            assert pid in {p["id"] for p in all_items}
            assert pid not in {p["id"] for p in active}
            assert all(p.get("is_active") is True for p in active)
        finally:
            api.delete(f"{BASE_URL}/api/instagram-posts/{pid}", headers=admin_headers, timeout=15)

    def test_create_requires_auth(self, api):
        r = api.post(
            f"{BASE_URL}/api/instagram-posts",
            json={"image_url": "https://example.com/x.jpg"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_update_requires_auth(self, api):
        r = api.patch(
            f"{BASE_URL}/api/instagram-posts/does-not-exist",
            json={"caption": "x"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_delete_requires_auth(self, api):
        r = api.delete(f"{BASE_URL}/api/instagram-posts/does-not-exist", timeout=15)
        assert r.status_code == 401

    def test_instagram_crud_flow(self, api, admin_headers):
        # CREATE with only image_url (caption + post_url optional)
        payload = {
            "image_url": f"https://example.com/ig_{uuid.uuid4().hex[:6]}.jpg",
        }
        r = api.post(f"{BASE_URL}/api/instagram-posts", json=payload, headers=admin_headers, timeout=15)
        assert r.status_code == 201, r.text
        created = r.json()
        pid = created["id"]
        assert created["image_url"] == payload["image_url"]
        assert created["caption"] == ""  # default
        assert created["post_url"] == ""  # default
        assert created["is_active"] is True  # default

        # READ verify
        listed = api.get(f"{BASE_URL}/api/instagram-posts", timeout=15).json()
        assert any(p["id"] == pid for p in listed)

        # PATCH caption only
        new_caption = "TEST_ig_updated_caption"
        upd = api.patch(
            f"{BASE_URL}/api/instagram-posts/{pid}",
            json={"caption": new_caption},
            headers=admin_headers,
            timeout=15,
        )
        assert upd.status_code == 200
        assert upd.json()["caption"] == new_caption
        assert upd.json()["image_url"] == payload["image_url"]  # unchanged

        # Verify persisted
        listed = api.get(f"{BASE_URL}/api/instagram-posts", timeout=15).json()
        got = next(p for p in listed if p["id"] == pid)
        assert got["caption"] == new_caption

        # DELETE
        d = api.delete(f"{BASE_URL}/api/instagram-posts/{pid}", headers=admin_headers, timeout=15)
        assert d.status_code == 200
        assert d.json().get("success") is True

        # 404 on already-deleted PATCH
        r404 = api.patch(
            f"{BASE_URL}/api/instagram-posts/{pid}",
            json={"caption": "x"},
            headers=admin_headers,
            timeout=15,
        )
        assert r404.status_code == 404

        # 404 on already-deleted DELETE
        d404 = api.delete(f"{BASE_URL}/api/instagram-posts/{pid}", headers=admin_headers, timeout=15)
        assert d404.status_code == 404


# ---------- index checks on testimonials + instagram_posts ----------
class TestNewCollectionIndexes:
    def test_order_indexes(self):
        try:
            from pymongo import MongoClient
        except ImportError:
            pytest.skip("pymongo not available")
        mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
        db_name = os.environ.get("DB_NAME", "digiconnect_db")
        c = MongoClient(mongo_url, serverSelectionTimeoutMS=3000)
        try:
            c.admin.command("ping")
        except Exception as e:
            pytest.skip(f"cannot reach mongo locally: {e}")
        db = c[db_name]

        for coll_name in ("testimonials", "instagram_posts"):
            idx = db[coll_name].index_information()
            order_idx = [v for v in idx.values() if v.get("key") == [("order", 1)]]
            assert order_idx, f"{coll_name}.order asc index missing (indexes: {list(idx.keys())})"
