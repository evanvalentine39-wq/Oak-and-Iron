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
    "walnut-cutting-board": {
        "id": "walnut-cutting-board",
        "name": "Walnut End-Grain Cutting Board",
        "tagline": "Built for a lifetime of meals.",
        "year": "2025",
        "status": "for_sale",
        "category": "Kitchen",
        "image": "https://images.unsplash.com/photo-1617695615794-a5abcece0f48",
        "description": (
            "Hand-cut from kiln-dried American black walnut, this end-grain board "
            "is finished with food-safe mineral oil and beeswax. Each piece is "
            "sanded through eight grits for a glass-smooth surface that gets "
            "softer with age."
        ),
        "specs": ["18\" x 12\" x 1.75\"", "American Black Walnut", "Food-safe finish", "Hand-signed"],
    },
    "oak-dining-table": {
        "id": "oak-dining-table",
        "name": "Live-Edge Oak Dining Table",
        "tagline": "A table that anchors a room.",
        "year": "2025",
        "status": "sold",
        "category": "Furniture",
        "image": "https://images.unsplash.com/photo-1758977403865-f79e156415b3",
        "description": (
            "Crafted from a single slab of reclaimed white oak with hand-forged "
            "steel hairpin legs. The live edge is preserved and stabilized with "
            "natural epoxy. Seats six comfortably."
        ),
        "specs": ["84\" x 38\" x 30\"", "Reclaimed White Oak", "Hand-forged steel base", "8-12 week lead time"],
    },
    "cherry-bowl": {
        "id": "cherry-bowl",
        "name": "Turned Cherry Wood Bowl",
        "tagline": "A vessel turned from a single block.",
        "year": "2025",
        "status": "not_for_sale",
        "category": "Decor",
        "image": "https://images.pexels.com/photos/31703678/pexels-photo-31703678.jpeg",
        "description": (
            "Turned on a manual lathe from locally sourced wild cherry. The "
            "subtle figure of the grain is brought forward with a hand-rubbed "
            "tung oil finish. Each bowl is signed and dated."
        ),
        "specs": ["10\" diameter x 4\" deep", "Wild Cherry", "Hand-turned", "Tung oil finish"],
    },
    "ash-side-chair": {
        "id": "ash-side-chair",
        "name": "Steam-Bent Ash Side Chair",
        "tagline": "Patience, bent into form.",
        "year": "2025",
        "status": "for_sale",
        "category": "Furniture",
        "image": "https://images.unsplash.com/photo-1640938776314-4d303f8a1380",
        "description": (
            "The back and arms are steam-bent ash, joined by hand-cut mortise "
            "and tenon to a hand-shaped seat. Finished with our shop-made "
            "linseed wax. Comfortable enough for long dinners."
        ),
        "specs": ["32\" tall, 18\" seat", "White Ash", "Mortise & tenon joinery", "Linseed wax finish"],
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
