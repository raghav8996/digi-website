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
