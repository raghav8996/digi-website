from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr


# ---------- Config ----------
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 12  # 12h admin sessions

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(
    mongo_url,
    readPreference="primary"
)
db = client[os.environ["DB_NAME"]]

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("digiconnect")


@asynccontextmanager
async def lifespan(_: FastAPI):
    # ---- Startup ----
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.products.create_index([("order", 1)])
    await db.announcements.create_index([("order", 1)])
    await db.offers.create_index([("order", 1)])
    await db.testimonials.create_index([("order", 1)])
    await db.instagram_posts.create_index([("order", 1)])

    admin_email = os.environ["ADMIN_EMAIL"].lower().strip()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": now_utc().isoformat(),
        })
        logger.info("Seeded admin user: %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info("Updated admin password for: %s", admin_email)

    await _seed_defaults()

    yield

    # ---- Shutdown ----
    client.close()


app = FastAPI(title="DigiConnect API", version="1.0.0", lifespan=lifespan)
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)


# ---------- Utils ----------
def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": now_utc() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "iat": now_utc(),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_admin(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> dict:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Admin not found")
    return user


# ---------- Models ----------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    price: str = ""  # display string like "₹79,999"
    image_url: str = ""
    highlight: str = ""  # short tagline
    is_active: bool = True
    order: int = 0
    created_at: str = Field(default_factory=lambda: now_utc().isoformat())


class ProductCreate(BaseModel):
    name: str
    category: str
    price: str = ""
    image_url: str = ""
    highlight: str = ""
    is_active: bool = True
    order: int = 0


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[str] = None
    image_url: Optional[str] = None
    highlight: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class Announcement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    message: str
    is_active: bool = True
    order: int = 0
    created_at: str = Field(default_factory=lambda: now_utc().isoformat())


class AnnouncementCreate(BaseModel):
    message: str
    is_active: bool = True
    order: int = 0


class AnnouncementUpdate(BaseModel):
    message: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class Offer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str = ""
    valid_until: str = ""  # ISO date string, optional display
    image_url: str = ""
    store: str = "both"  # both | gaur-city | grand-venice
    tag: str = ""  # e.g., "Limited time", "In-store only"
    is_active: bool = True
    order: int = 0
    created_at: str = Field(default_factory=lambda: now_utc().isoformat())


class OfferCreate(BaseModel):
    title: str
    description: str = ""
    valid_until: str = ""
    image_url: str = ""
    store: str = "both"
    tag: str = ""
    is_active: bool = True
    order: int = 0


class OfferUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    valid_until: Optional[str] = None
    image_url: Optional[str] = None
    store: Optional[str] = None
    tag: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    author: str
    rating: int = 5  # 1-5
    text: str
    store: str = "both"  # both | gaur-city | grand-venice
    source: str = "Google"  # e.g., Google, Walk-in, Instagram
    date: str = ""  # display string, e.g., "Nov 2025"
    avatar_url: str = ""
    is_active: bool = True
    order: int = 0
    created_at: str = Field(default_factory=lambda: now_utc().isoformat())


class TestimonialCreate(BaseModel):
    author: str
    rating: int = 5
    text: str
    store: str = "both"
    source: str = "Google"
    date: str = ""
    avatar_url: str = ""
    is_active: bool = True
    order: int = 0


class TestimonialUpdate(BaseModel):
    author: Optional[str] = None
    rating: Optional[int] = None
    text: Optional[str] = None
    store: Optional[str] = None
    source: Optional[str] = None
    date: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class InstagramPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image_url: str
    caption: str = ""
    post_url: str = ""  # link to actual IG post
    is_active: bool = True
    order: int = 0
    created_at: str = Field(default_factory=lambda: now_utc().isoformat())


class InstagramPostCreate(BaseModel):
    image_url: str
    caption: str = ""
    post_url: str = ""
    is_active: bool = True
    order: int = 0


class InstagramPostUpdate(BaseModel):
    image_url: Optional[str] = None
    caption: Optional[str] = None
    post_url: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class SiteContent(BaseModel):
    # Singleton document — home page editable content
    hero_image_url: str = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80"
    hero_image_alt: str = "Galaxy device on display"
    hero_live_demo_label: str = "Live demo"
    hero_live_demo_title: str = "Galaxy Z Fold — feel the fold in person."
    hero_live_demo_cta: str = "Visit"
    hero_live_demo_href: str = "/stores"
    story_image_url: str = "https://images.pexels.com/photos/11297769/pexels-photo-11297769.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=940"
    story_image_alt: str = "DigiConnect Samsung Experience Store interior"
    # Fold8 / Pre-reserve banner (fully editable)
    banner_active: bool = True
    banner_badge: str = "Coming soon · Pre-reserve"
    banner_title_line1: str = "Galaxy Z Fold8."
    banner_title_line2: str = "Be first in line."
    banner_description: str = (
        "India's most anticipated foldable is landing at DigiConnect. Reserve your unit today, "
        "unlock launch-day priority pickup and an exclusive in-store gift bundle."
    )
    banner_button_text: str = "Reserve"
    banner_image_url: str = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=940&q=80"
    banner_image_alt: str = "Galaxy Z Fold concept"
    banner_image_caption: str = "Concept · Actual product may vary"
    banner_whatsapp_message: str = "Hi DigiConnect, I'd like to pre-reserve the Galaxy Z Fold8."


class SiteContentUpdate(BaseModel):
    hero_image_url: Optional[str] = None
    hero_image_alt: Optional[str] = None
    hero_live_demo_label: Optional[str] = None
    hero_live_demo_title: Optional[str] = None
    hero_live_demo_cta: Optional[str] = None
    hero_live_demo_href: Optional[str] = None
    story_image_url: Optional[str] = None
    story_image_alt: Optional[str] = None
    banner_active: Optional[bool] = None
    banner_badge: Optional[str] = None
    banner_title_line1: Optional[str] = None
    banner_title_line2: Optional[str] = None
    banner_description: Optional[str] = None
    banner_button_text: Optional[str] = None
    banner_image_url: Optional[str] = None
    banner_image_alt: Optional[str] = None
    banner_image_caption: Optional[str] = None
    banner_whatsapp_message: Optional[str] = None


# ---------- Startup ----------
async def _seed_announcements():
    if await db.announcements.count_documents({}) != 0:
        return
    defaults = [
        "Galaxy Z Fold8 — Pre-reserve now at DigiConnect",
        "Live demos daily: Galaxy S, Z & A series",
        "Now open at Gaur City Mall & Grand Venice Mall — Greater Noida",
        "Authorized Samsung Experience Store & SmartCafé partner",
    ]
    for i, msg in enumerate(defaults):
        await db.announcements.insert_one(Announcement(message=msg, order=i).model_dump())


async def _seed_products():
    if await db.products.count_documents({}) != 0:
        return
    sample = [
        {"name": "Galaxy S25 Ultra", "category": "Smartphone", "price": "From ₹1,29,999",
         "image_url": "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&w=940&q=80",
         "highlight": "The new AI flagship. Experience it live in store.", "order": 0},
        {"name": "Galaxy Z Fold6", "category": "Foldable", "price": "From ₹1,64,999",
         "image_url": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=940&q=80",
         "highlight": "Unfold the future. Hands-on demo available.", "order": 1},
        {"name": "Galaxy A55 5G", "category": "Smartphone", "price": "From ₹39,999",
         "image_url": "https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=940&q=80",
         "highlight": "Flagship-grade design, everyday value. A-series demo in store.", "order": 2},
        {"name": "Galaxy Buds3 Pro", "category": "Audio", "price": "From ₹24,999",
         "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=940&q=80",
         "highlight": "Studio-grade sound. Try them at the SmartCafé.", "order": 3},
        {"name": "Galaxy Watch7", "category": "Wearable", "price": "From ₹32,999",
         "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=940&q=80",
         "highlight": "Your health, elevated. Fit it live in store.", "order": 4},
        {"name": "Galaxy Tab S10", "category": "Tablet", "price": "From ₹1,04,999",
         "image_url": "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=940&q=80",
         "highlight": "Studio meets pocket. Demo the Tab S10 today.", "order": 5},
    ]
    for item in sample:
        await db.products.insert_one(Product(**item).model_dump())


async def _seed_offers():
    if await db.offers.count_documents({}) != 0:
        return
    offers = [
        {"title": "Pre-reserve Galaxy Z Fold8",
         "description": "Be first in line for India’s most anticipated foldable. Reserve at DigiConnect and unlock exclusive launch-day pickup + a Galaxy gift bundle in store.",
         "tag": "Coming soon · Pre-reserve", "valid_until": "",
         "image_url": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=940&q=80",
         "store": "both", "order": 0},
        {"title": "Galaxy S25 Ultra — In-store bundle",
         "description": "Walk in to demo the S25 Ultra and unlock a bundled Galaxy Buds3 offer, exclusive to DigiConnect Greater Noida stores.",
         "tag": "Limited time · In-store only", "valid_until": "",
         "image_url": "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&w=940&q=80",
         "store": "both", "order": 1},
        {"title": "A-series trade-in bonus",
         "description": "Trade in your old phone at Grand Venice Mall and get an extra bonus on the Galaxy A55 & A35 series. Available only in store.",
         "tag": "In-store only", "valid_until": "",
         "image_url": "https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=940&q=80",
         "store": "grand-venice", "order": 2},
    ]
    for item in offers:
        await db.offers.insert_one(Offer(**item).model_dump())


async def _seed_testimonials():
    if await db.testimonials.count_documents({}) != 0:
        return
    testimonials = [
        {"author": "Rohan Sharma", "rating": 5, "store": "gaur-city", "source": "Google", "date": "Dec 2025", "order": 0,
         "text": "Best Samsung store in Greater Noida. Got a full walkthrough of the S25 Ultra and Watch7 before deciding — no pressure, all facts. Highly recommend."},
        {"author": "Priya Verma", "rating": 5, "store": "grand-venice", "source": "Google", "date": "Nov 2025", "order": 1,
         "text": "The SmartCafé setup is exactly how a Samsung store should feel. Staff let me play with the Z Fold6 for 20 minutes. Ended up buying the Buds3 Pro too!"},
        {"author": "Aditya Kapoor", "rating": 5, "store": "gaur-city", "source": "Google", "date": "Oct 2025", "order": 2,
         "text": "Picked up the Galaxy A55 5G here. Genuine stock, quick billing, and they helped me set up everything before I left. 10/10."},
        {"author": "Sneha Iyer", "rating": 5, "store": "grand-venice", "source": "Google", "date": "Nov 2025", "order": 3,
         "text": "The team knows their products inside out. Compared the Tab S10 vs the S9 with me for 15 minutes and helped me pick the right one for my kid’s studies."},
        {"author": "Karan Mehta", "rating": 5, "store": "both", "source": "Google", "date": "Jan 2026", "order": 4,
         "text": "Reserved the Z Fold8 pre-launch here. Whole process was on WhatsApp, super smooth. Can’t wait to pick it up."},
    ]
    for item in testimonials:
        await db.testimonials.insert_one(Testimonial(**item).model_dump())


async def _seed_instagram_posts():
    if await db.instagram_posts.count_documents({}) != 0:
        return
    ig_posts = [
        {"image_url": "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&w=940&q=80",
         "caption": "S25 Ultra just landed. Come feel the AI in your hand.", "post_url": "https://www.instagram.com/digi.connect_/", "order": 0},
        {"image_url": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=940&q=80",
         "caption": "Galaxy Z Fold8 pre-reserves are open at both stores.", "post_url": "https://www.instagram.com/digi.connect_/", "order": 1},
        {"image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=940&q=80",
         "caption": "Buds3 Pro demo bar is now live at the SmartCafé.", "post_url": "https://www.instagram.com/digi.connect_/", "order": 2},
        {"image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=940&q=80",
         "caption": "Watch7 straps — pick your color, live at Grand Venice.", "post_url": "https://www.instagram.com/digi.connect_/", "order": 3},
        {"image_url": "https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=940&q=80",
         "caption": "A-series deals of the week — trade-in bonus at Gaur City.", "post_url": "https://www.instagram.com/digi.connect_/", "order": 4},
        {"image_url": "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=940&q=80",
         "caption": "Tab S10 x S Pen. Studio in your bag.", "post_url": "https://www.instagram.com/digi.connect_/", "order": 5},
    ]
    for item in ig_posts:
        await db.instagram_posts.insert_one(InstagramPost(**item).model_dump())


async def _seed_site_content():
    defaults = SiteContent().model_dump()
    existing = await db.site_content.find_one({"_id": "singleton"})
    if existing is None:
        doc = {**defaults, "_id": "singleton"}
        await db.site_content.insert_one(doc)
        return
    # Backfill any newly-added fields on existing singleton without overwriting user edits
    missing = {k: v for k, v in defaults.items() if k not in existing}
    if missing:
        await db.site_content.update_one({"_id": "singleton"}, {"$set": missing})


async def _seed_defaults():
    await _seed_announcements()
    await _seed_products()
    await _seed_offers()
    await _seed_testimonials()
    await _seed_instagram_posts()
    await _seed_site_content()

# ---------- Routes: Auth ----------
@api_router.get("/")
async def root():
    return {"service": "DigiConnect API", "status": "ok"}


@api_router.post("/auth/login", response_model=LoginResponse)
async def login(data: LoginRequest):
    email = data.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    return LoginResponse(
        access_token=token,
        user={"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]},
    )


@api_router.get("/auth/me")
async def me(current: dict = Depends(get_current_admin)):
    return {"id": current["id"], "email": current["email"], "name": current["name"], "role": current["role"]}


# ---------- Routes: Products ----------
@api_router.get("/products")
async def list_products(active_only: bool = False):
    query = {"is_active": True} if active_only else {}
    cursor = db.products.find(query, {"_id": 0}).sort("order", 1)
    return await cursor.to_list(500)


@api_router.post("/products", status_code=201)
async def create_product(data: ProductCreate, _: dict = Depends(get_current_admin)):
    p = Product(**data.model_dump())
    await db.products.insert_one(p.model_dump())
    return p.model_dump()


@api_router.patch("/products/{product_id}")
async def update_product(product_id: str, data: ProductUpdate, _: dict = Depends(get_current_admin)):
    updates = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.products.update_one({"id": product_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    return updated


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, _: dict = Depends(get_current_admin)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"success": True}


# ---------- Routes: Announcements ----------
@api_router.get("/announcements")
async def list_announcements(active_only: bool = False):
    query = {"is_active": True} if active_only else {}
    cursor = db.announcements.find(query, {"_id": 0}).sort("order", 1)
    return await cursor.to_list(500)


@api_router.post("/announcements", status_code=201)
async def create_announcement(data: AnnouncementCreate, _: dict = Depends(get_current_admin)):
    a = Announcement(**data.model_dump())
    await db.announcements.insert_one(a.model_dump())
    return a.model_dump()


@api_router.patch("/announcements/{announcement_id}")
async def update_announcement(announcement_id: str, data: AnnouncementUpdate, _: dict = Depends(get_current_admin)):
    updates = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.announcements.update_one({"id": announcement_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Announcement not found")
    updated = await db.announcements.find_one({"id": announcement_id}, {"_id": 0})
    return updated


@api_router.delete("/announcements/{announcement_id}")
async def delete_announcement(announcement_id: str, _: dict = Depends(get_current_admin)):
    result = await db.announcements.delete_one({"id": announcement_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return {"success": True}


# ---------- Routes: Offers ----------
@api_router.get("/offers")
async def list_offers(active_only: bool = False):
    query = {"is_active": True} if active_only else {}
    cursor = db.offers.find(query, {"_id": 0}).sort("order", 1)
    return await cursor.to_list(500)


@api_router.post("/offers", status_code=201)
async def create_offer(data: OfferCreate, _: dict = Depends(get_current_admin)):
    o = Offer(**data.model_dump())
    await db.offers.insert_one(o.model_dump())
    return o.model_dump()


@api_router.patch("/offers/{offer_id}")
async def update_offer(offer_id: str, data: OfferUpdate, _: dict = Depends(get_current_admin)):
    updates = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.offers.update_one({"id": offer_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Offer not found")
    updated = await db.offers.find_one({"id": offer_id}, {"_id": 0})
    return updated


@api_router.delete("/offers/{offer_id}")
async def delete_offer(offer_id: str, _: dict = Depends(get_current_admin)):
    result = await db.offers.delete_one({"id": offer_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Offer not found")
    return {"success": True}


# ---------- Routes: Testimonials ----------
@api_router.get("/testimonials")
async def list_testimonials(active_only: bool = False, store: Optional[str] = None):
    query = {}
    if active_only:
        query["is_active"] = True
    if store and store != "all":
        query["store"] = {"$in": [store, "both"]}
    cursor = db.testimonials.find(query, {"_id": 0}).sort("order", 1)
    return await cursor.to_list(500)


@api_router.post("/testimonials", status_code=201)
async def create_testimonial(data: TestimonialCreate, _: dict = Depends(get_current_admin)):
    t = Testimonial(**data.model_dump())
    await db.testimonials.insert_one(t.model_dump())
    return t.model_dump()


@api_router.patch("/testimonials/{testimonial_id}")
async def update_testimonial(testimonial_id: str, data: TestimonialUpdate, _: dict = Depends(get_current_admin)):
    updates = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.testimonials.update_one({"id": testimonial_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    updated = await db.testimonials.find_one({"id": testimonial_id}, {"_id": 0})
    return updated


@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, _: dict = Depends(get_current_admin)):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"success": True}


# ---------- Routes: Instagram Posts ----------
@api_router.get("/instagram-posts")
async def list_instagram_posts(active_only: bool = False):
    query = {"is_active": True} if active_only else {}
    cursor = db.instagram_posts.find(query, {"_id": 0}).sort("order", 1)
    return await cursor.to_list(500)


@api_router.post("/instagram-posts", status_code=201)
async def create_instagram_post(data: InstagramPostCreate, _: dict = Depends(get_current_admin)):
    p = InstagramPost(**data.model_dump())
    await db.instagram_posts.insert_one(p.model_dump())
    return p.model_dump()


@api_router.patch("/instagram-posts/{post_id}")
async def update_instagram_post(post_id: str, data: InstagramPostUpdate, _: dict = Depends(get_current_admin)):
    updates = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.instagram_posts.update_one({"id": post_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Instagram post not found")
    updated = await db.instagram_posts.find_one({"id": post_id}, {"_id": 0})
    return updated


@api_router.delete("/instagram-posts/{post_id}")
async def delete_instagram_post(post_id: str, _: dict = Depends(get_current_admin)):
    result = await db.instagram_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Instagram post not found")
    return {"success": True}


# ---------- Routes: Site Content (singleton) ----------
@api_router.get("/site-content")
async def get_site_content():
    doc = await db.site_content.find_one({"_id": "singleton"}, {"_id": 0})
    if not doc:
        # Return defaults if somehow missing
        return SiteContent().model_dump()
    return doc


@api_router.patch("/site-content")
async def update_site_content(data: SiteContentUpdate, _: dict = Depends(get_current_admin)):
    updates = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    defaults = SiteContent().model_dump()
    # Only insert defaults for fields NOT being $set (MongoDB rejects overlapping paths)
    set_on_insert = {k: v for k, v in defaults.items() if k not in updates}
    update_doc = {"$set": updates}
    if set_on_insert:
        update_doc["$setOnInsert"] = set_on_insert
    await db.site_content.update_one(
        {"_id": "singleton"},
        update_doc,
        upsert=True,
    )
    updated = await db.site_content.find_one({"_id": "singleton"}, {"_id": 0})
    return updated
    
@api_router.get("/debug-site-content")
async def debug_site_content():
    doc = await db.site_content.find_one({"_id": "singleton"})

    return {
        "mongo_database": db.name,
        "mongo_host": mongo_url.split("@")[-1] if "@" in mongo_url else mongo_url,
        "hero_image": doc.get("hero_image_url") if doc else None
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
