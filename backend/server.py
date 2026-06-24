from fastapi import FastAPI, APIRouter, HTTPException, Request
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

STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY")

app = FastAPI(title="Hearthwood Studio API")
api_router = APIRouter(prefix="/api")


# ---------- Product catalog (server-authoritative) ----------
PRODUCTS: Dict[str, Dict] = {
    "walnut-cutting-board": {
        "id": "walnut-cutting-board",
        "name": "Walnut End-Grain Cutting Board",
        "tagline": "Built for a lifetime of meals.",
        "price": 145.00,
        "currency": "usd",
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
        "price": 2850.00,
        "currency": "usd",
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
        "price": 220.00,
        "currency": "usd",
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
        "price": 685.00,
        "currency": "usd",
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
    price: float
    currency: str
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


class CheckoutCreateRequest(BaseModel):
    product_id: str
    origin_url: str


class CheckoutCreateResponse(BaseModel):
    url: str
    session_id: str


class PaymentStatusResponse(BaseModel):
    session_id: str
    status: str
    payment_status: str
    amount_total: float
    currency: str
    product_id: Optional[str] = None


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Hearthwood Studio API"}


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


@api_router.post("/checkout/session", response_model=CheckoutCreateResponse)
async def create_checkout_session(payload: CheckoutCreateRequest, request: Request):
    product = PRODUCTS.get(payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if not STRIPE_API_KEY:
        raise HTTPException(status_code=500, detail="Payment service unavailable")

    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/payment/return?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/shop/{product['id']}"

    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    checkout_req = CheckoutSessionRequest(
        amount=float(product["price"]),
        currency=product["currency"],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "product_id": product["id"],
            "product_name": product["name"],
        },
    )
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_req)

    txn_doc = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "product_id": product["id"],
        "product_name": product["name"],
        "amount": float(product["price"]),
        "currency": product["currency"],
        "metadata": {"product_id": product["id"], "product_name": product["name"]},
        "payment_status": "initiated",
        "status": "open",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.payment_transactions.insert_one(txn_doc)

    return CheckoutCreateResponse(url=session.url, session_id=session.session_id)


@api_router.get("/checkout/status/{session_id}", response_model=PaymentStatusResponse)
async def get_payment_status(session_id: str):
    if not STRIPE_API_KEY:
        raise HTTPException(status_code=500, detail="Payment service unavailable")

    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
    status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)

    txn = await db.payment_transactions.find_one({"session_id": session_id})
    if txn and txn.get("payment_status") != "paid":
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "status": status.status,
                "payment_status": status.payment_status,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }},
        )

    return PaymentStatusResponse(
        session_id=session_id,
        status=status.status,
        payment_status=status.payment_status,
        amount_total=float(status.amount_total) / 100.0,
        currency=status.currency,
        product_id=(status.metadata or {}).get("product_id"),
    )


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    if not STRIPE_API_KEY:
        raise HTTPException(status_code=500, detail="Payment service unavailable")
    body = await request.body()
    signature = request.headers.get("Stripe-Signature", "")
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    event = await stripe_checkout.handle_webhook(body, signature)

    await db.payment_transactions.update_one(
        {"session_id": event.session_id},
        {"$set": {
            "payment_status": event.payment_status,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }},
    )
    return {"received": True}


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
