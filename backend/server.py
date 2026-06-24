from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionResponse,
    CheckoutStatusResponse,
    CheckoutSessionRequest,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Oak & Iron API")
api_router = APIRouter(prefix="/api")


# ---------- Product catalog (server-authoritative) ----------
PRODUCTS: Dict[str, Dict] = {
    "arched-picture-frame": {
        "id": "arched-picture-frame",
        "name": "Arched Picture Frame",
        "tagline": "",
        "year": "2025",
        "status": "for_sale",
        "category": "Frames",
        "image": "https://customer-assets.emergentagent.com/job_timber-works-9/artifacts/2rtqwvhm_IMG_1688.jpg",
        "description": "",
        "specs": ["Red oak frame", "Steam-bent arch", "Walnut peg accents", "Hand-finished"],
    },
    "crucifix": {
        "id": "crucifix",
        "name": "Hand-Carved Crucifix",
        "tagline": "Small piece. Quiet wall.",
        "year": "2024",
        "status": "not_for_sale",
        "category": "Devotional",
        "image": "https://customer-assets.emergentagent.com/job_timber-works-9/artifacts/mdk5r26i_IMG_2805.jpg",
        "description": "Carved one evening at a time. Hangs in our hallway.",
        "specs": ["Basswood", "Hand-carved corpus", "Twine binding", "Wall-mounted"],
    },
    "harp": {
        "id": "harp",
        "name": "Lever Harp",
        "tagline": "Took longer than I thought. Worth it.",
        "year": "2025",
        "status": "for_sale",
        "category": "Instruments",
        "image": "https://customer-assets.emergentagent.com/job_timber-works-9/artifacts/0jxvakcb_IMG_2809.jpg",
        "description": "Strung, tuned, and ready to play. First harp I've built — won't be the last.",
        "specs": ["Poplar frame", "Cedar soundbox", "Strung and tuned", "Built 2025"],
    },
    "japanese-bench": {
        "id": "japanese-bench",
        "name": "Japanese-Style Bench",
        "tagline": "No screws. No nails. Just wood.",
        "year": "2026",
        "status": "for_sale",
        "category": "Furniture",
        "image": "https://customer-assets.emergentagent.com/job_timber-works-9/artifacts/8xjriywo_IMG_2810.jpg",
        "description": "Built for the front porch but it ended up in the living room. Sits two if you're friendly.",
        "specs": ["White oak top", "White oak legs", "Red oak braces", "Through-tenon joinery"],
    },
    "dovetail-jewelry-box": {
        "id": "dovetail-jewelry-box",
        "name": "Dovetail Jewelry Box",
        "tagline": "Cut every dovetail by hand. Every single one.",
        "year": "2026",
        "status": "for_sale",
        "category": "Boxes",
        "image": "https://customer-assets.emergentagent.com/job_timber-works-9/artifacts/rsos94ah_IMG_2811.jpg",
        "description": "A small box for small things. The padauk lid was a gift from a friend.",
        "specs": ["Oak sides", "Padauk top", "Felt-lined interior", "Hand-cut dovetails"],
    },
}


# ---------- Pydantic Models ----------
class Product(BaseModel):
    id: str
    name: str
    tagline: str
    year: str
    status: str
    category: str
    image: str
    description: str
    specs: List[str]


class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    subject: Optional[str] = Field(None, max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)


class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Oak & Iron API"}


@api_router.get("/products", response_model=List[Product])
async def list_products():
    return list(PRODUCTS.values())


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = PRODUCTS.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(payload: ContactMessageCreate):
    msg = ContactMessage(**payload.model_dump())
    doc = msg.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.contact_messages.insert_one(doc)
    return msg


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
