import os
import traceback
from groq import Groq
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from database import get_db
from models.product import Product
from models.order import Order, OrderItem
from models.user import User
from core.deps import get_current_user

router = APIRouter(prefix="/chat", tags=["Chatbot"])

class Message(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Message]] = []
    mode:    str = "buyer"


def get_buyer_context(db: Session, user: User) -> str:
    products = db.query(Product).filter(
        Product.is_active == True, Product.stock > 0
    ).limit(10).all()

    product_list = "\n".join([
        f"- {p.name} | ₹{p.price} | Category: {p.category.name if p.category else 'N/A'} | {p.description or ''}"
        for p in products
    ]) or "No products available"

    return f"""You are a helpful shopping assistant for SmartCart, an Indian multi-vendor marketplace.
Help buyers find the right products and make purchase decisions.
Current user: {user.name}

Available products:
{product_list}

Keep responses short (2-4 sentences), friendly, and use ₹ for prices."""


def get_seller_context(db: Session, user: User) -> str:
    products = db.query(Product).filter(Product.seller_id == user.id).all()
    orders   = db.query(Order).join(OrderItem).filter(OrderItem.seller_id == user.id).all()

    product_list = "\n".join([
        f"- {p.name} | ₹{p.price} | Stock: {p.stock}"
        for p in products
    ]) or "No products listed yet"

    total_revenue  = sum(o.total_amount for o in orders if o.status != "cancelled")
    pending_orders = len([o for o in orders if o.status in ["placed", "confirmed"]])

    return f"""You are a smart business advisor for SmartCart sellers.
Seller: {user.name} | Store: {user.store_name or 'My Store'}
Products: {len(products)} | Orders: {len(orders)} | Revenue: ₹{total_revenue:,.0f} | Pending: {pending_orders}

Products:
{product_list}

Give practical, actionable advice. Keep responses concise (3-5 sentences)."""


@router.post("/")
def chat(
    body:         ChatRequest,
    current_user: User    = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))

        if body.mode == "seller":
            system_prompt = get_seller_context(db, current_user)
        else:
            system_prompt = get_buyer_context(db, current_user)

        # Build messages for Groq
        messages = [{"role": "system", "content": system_prompt}]

        for msg in (body.history or [])[-6:]:
            messages.append({
                "role":    "user"      if msg.role == "user" else "assistant",
                "content": msg.text,
            })

        messages.append({"role": "user", "content": body.message})

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            max_tokens=300,
        )

        return { "reply": response.choices[0].message.content }

    except Exception as e:
        print(f"CHATBOT ERROR: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))