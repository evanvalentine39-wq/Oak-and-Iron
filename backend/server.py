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
    "crucifix": {
        "id": "crucifix",
        "name": "Hand-Carved Crucifix",
        "tagline": "A quiet piece for a quiet wall.",
        "year": "2025",
        "status": "not_for_sale",
        "category": "Devotional",
        "image": "https://customer-assets.emergentagent.com/job_timber-works-9/artifacts/mdk5r26i_IMG_2805.jpg",
        "description": "A small wall crucifix shaped from a single length of pale hardwood, with a hand-finished corpus lashed in place with natural twine. Built slowly, by hand, as a personal devotional piece.",
        "specs": ["Wall-mounted", "Solid hardwood cross", "Hand-shaped corpus", "Natural twine binding"],
    },
    "harp": {
        "id": "harp",
        "name": "Lever Harp",
        "tagline": "Strings, oak, and a lot of patience.",
        "year": "2025",
        "status": "not_for_sale",
        "category": "Instruments",
        "image": "https://customer-assets.emergentagent.com/job_timber-works-9/artifacts/0jxvakcb_IMG_2809.jpg",
        "description": "A small lever harp built from maple and oak, with a hand-shaped neck and a soundbox joined with traditional methods. Strung, tuned, and ready to play.",
        "specs": ["Maple neck and pillar", "Oak soundbox", "Hand-tuned", "Built 2025"],
    },
    "japanese-bench": {
        "id": "japanese-bench",
        "name": "Japanese-Style Bench",
        "tagline": "Simple lines. Honest joinery.",
        "year": "2025",
        "status": "for_sale",
        "category": "Furniture",
        "image": "https://customer-assets.emergentagent.com/job_timber-works-9/artifacts/8xjriywo_IMG_2810.jpg",
        "description": "A low bench in the Japanese tradition — oak top, splayed legs, and through-tenons with contrasting wedges. Finished with a hand-rubbed oil so the grain reads in the morning sun.",
        "specs": ["Solid oak", "Through-tenon joinery", "Contrasting wedges", "Hand-rubbed oil finish"],
    },
    "dovetail-jewelry-box": {
        "id": "dovetail-jewelry-box",
        "name": "Dovetail Jewelry Box",
        "tagline": "Every corner, cut by hand.",
        "year": "2025",
        "status": "for_sale",
        "category": "Boxes",
        "image": "https://customer-assets.emergentagent.com/job_timber-works-9/artifacts/rsos94ah_IMG_2811.jpg",
        "description": "A two-tone keepsake box with hand-cut through-dovetails in oak and a contrasting padauk lid. The interior is fitted with a small lined tray for rings and small treasures.",
        "specs": ["Oak body, padauk lid", "Hand-cut through-dovetails", "Felt-lined interior tray", "Oil and wax finish"],
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
