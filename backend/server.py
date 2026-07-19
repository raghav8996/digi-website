from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
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
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="DigiConnect API", version="1.0.0")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("digiconnect")


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


# ---------- Startup ----------
@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.products.create_index([("order", 1)])
    await db.announcements.create_index([("order", 1)])

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

    # Seed initial announcements & products if empty
    if await db.announcements.count_documents({}) == 0:
        defaults = [
            "Now open at Gaur City Mall & Grand Venice Mall — Greater Noida",
            "Live Samsung Galaxy S & Z-series demos every day",
            "Exclusive SmartCafé experience — try before you buy",
            "Authorized Samsung Experience Store & Service Partner",
        ]
        for i, msg in enumerate(defaults):
            ann = Announcement(message=msg, order=i)
            await db.announcements.insert_one(ann.model_dump())

    if await db.products.count_documents({}) == 0:
        sample = [
            {
                "name": "Galaxy S24 Ultra",
                "category": "Smartphone",
                "price": "From ₹1,29,999",
                "image_url": "https://images.pexels.com/photos/36768424/pexels-photo-36768424.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                "highlight": "AI-powered flagship. See it live in store.",
                "order": 0,
            },
            {
                "name": "Galaxy Z Fold6",
                "category": "Foldable",
                "price": "From ₹1,64,999",
                "image_url": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=940&q=80",
                "highlight": "Unfold the future. Hands-on demo available.",
                "order": 1,
            },
            {
                "name": "Galaxy Buds3 Pro",
                "category": "Audio",
                "price": "From ₹24,999",
                "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=940&q=80",
                "highlight": "Studio-grade sound. Try them at the SmartCafé.",
                "order": 2,
            },
            {
                "name": "Galaxy Watch7",
                "category": "Wearable",
                "price": "From ₹32,999",
                "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=940&q=80",
                "highlight": "Your health, elevated. Fit it live in store.",
                "order": 3,
            },
        ]
        for item in sample:
            p = Product(**item)
            await db.products.insert_one(p.model_dump())


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


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


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
