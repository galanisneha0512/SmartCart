from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.order import Order, OrderItem
from models.cart import CartItem
from models.product import Product
from models.user import User
from schemas.order import OrderCreate, OrderOut, OrderStatusUpdate
from core.deps import get_current_user, require_seller

router = APIRouter(prefix="/orders", tags=["Orders"])

def enrich_order(order: Order) -> dict:
    items = []
    for item in order.items:
        items.append({
            "id":                item.id,
            "product_id":        item.product_id,
            "quantity":          item.quantity,
            "price_at_purchase": item.price_at_purchase,
            "product_name":      item.product.name  if item.product else None,
            "emoji":             item.product.emoji if item.product else None,
            "image_url":         item.product.image_url if item.product else None,
        })
    return {
        "id":           order.id,
        "buyer_id":     order.buyer_id,
        "total_amount": order.total_amount,
        "status":       order.status,
        "address":      order.address,
        "created_at":   order.created_at,
        "items":        items,
    }


# PLACE order
@router.post("/", response_model=OrderOut, status_code=201)
def place_order(
    body:         OrderCreate,
    current_user: User = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total = 0.0
    order_items = []

    for cart_item in cart_items:
        product = db.query(Product).filter(Product.id == cart_item.product_id).first()
        if not product or product.stock < cart_item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"'{product.name if product else 'Product'}' is out of stock"
            )
        total += product.price * cart_item.quantity
        order_items.append((product, cart_item.quantity))

    order = Order(
        buyer_id     = current_user.id,
        total_amount = total,
        status       = "placed",
        address      = body.address,
    )
    db.add(order)
    db.flush()

    for product, qty in order_items:
        db.add(OrderItem(
            order_id          = order.id,
            product_id        = product.id,
            seller_id         = product.seller_id,
            quantity          = qty,
            price_at_purchase = product.price,
        ))
        product.stock -= qty

    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    db.refresh(order)
    return enrich_order(order)


# GET buyer's orders
# NOTE: /my and /seller/received must come BEFORE /{order_id}
@router.get("/my", response_model=List[OrderOut])
def get_my_orders(
    current_user: User = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    orders = db.query(Order).filter(
        Order.buyer_id == current_user.id
    ).order_by(Order.created_at.desc()).all()
    return [enrich_order(o) for o in orders]


# GET seller's received orders
@router.get("/seller/received", response_model=List[OrderOut])
def get_received_orders(
    seller: User = Depends(require_seller),
    db:     Session = Depends(get_db),
):
    order_ids = db.query(OrderItem.order_id).filter(
        OrderItem.seller_id == seller.id
    ).distinct().all()
    order_ids = [oid[0] for oid in order_ids]

    orders = db.query(Order).filter(
        Order.id.in_(order_ids)
    ).order_by(Order.created_at.desc()).all()

    return [enrich_order(o) for o in orders]


# GET single order
@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id:     int,
    current_user: User = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.buyer_id != current_user.id and current_user.role != "seller":
        raise HTTPException(status_code=403, detail="Access denied")
    return enrich_order(order)


# UPDATE order status (seller)
@router.patch("/{order_id}/status", response_model=OrderOut)
def update_order_status(
    order_id: int,
    body:     OrderStatusUpdate,
    seller:   User = Depends(require_seller),
    db:       Session = Depends(get_db),
):
    valid = ["placed","confirmed","shipped","delivered","cancelled"]
    if body.status not in valid:
        raise HTTPException(status_code=400, detail="Invalid status")

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = body.status
    db.commit()
    db.refresh(order)
    return enrich_order(order)


# CANCEL order (buyer)
@router.patch("/{order_id}/cancel", response_model=OrderOut)
def cancel_order(
    order_id:     int,
    current_user: User = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    order = db.query(Order).filter(
        Order.id == order_id, Order.buyer_id == current_user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status in ("delivered","cancelled"):
        raise HTTPException(status_code=400, detail=f"Cannot cancel a {order.status} order")

    order.status = "cancelled"
    db.commit()
    db.refresh(order)
    return enrich_order(order)