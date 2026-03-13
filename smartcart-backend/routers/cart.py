from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.cart import CartItem
from models.product import Product
from models.user import User
from schemas.cart import CartAddRequest, CartUpdateRequest, CartItemOut
from core.deps import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])

def enrich_cart(item: CartItem) -> dict:
    return {
        "id":         item.id,
        "product_id": item.product_id,
        "quantity":   item.quantity,
        "name":       item.product.name,
        "price":      item.product.price,
        "emoji":      item.product.emoji,
        "store_name": item.product.seller.store_name if item.product.seller else None,
    }


# GET cart
@router.get("/", response_model=List[CartItemOut])
def get_cart(
    current_user: User = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    return [enrich_cart(i) for i in items]


# ADD to cart
@router.post("/", response_model=CartItemOut, status_code=201)
def add_to_cart(
    body:         CartAddRequest,
    current_user: User = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == body.product_id).first()
    if not product or not product.is_active:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock < body.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")

    # If already in cart — update quantity
    existing = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == body.product_id,
    ).first()

    if existing:
        existing.quantity += body.quantity
        db.commit()
        db.refresh(existing)
        return enrich_cart(existing)

    item = CartItem(user_id=current_user.id, product_id=body.product_id, quantity=body.quantity)
    db.add(item)
    db.commit()
    db.refresh(item)
    return enrich_cart(item)


# UPDATE quantity
@router.patch("/{item_id}", response_model=CartItemOut)
def update_cart_item(
    item_id:      int,
    body:         CartUpdateRequest,
    current_user: User = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    item = db.query(CartItem).filter(
        CartItem.id == item_id, CartItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if body.quantity <= 0:
        db.delete(item)
        db.commit()
        raise HTTPException(status_code=204, detail="Item removed")

    item.quantity = body.quantity
    db.commit()
    db.refresh(item)
    return enrich_cart(item)


# REMOVE item
@router.delete("/{item_id}", status_code=204)
def remove_from_cart(
    item_id:      int,
    current_user: User = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    item = db.query(CartItem).filter(
        CartItem.id == item_id, CartItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()


# CLEAR cart
@router.delete("/", status_code=204)
def clear_cart(
    current_user: User = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()