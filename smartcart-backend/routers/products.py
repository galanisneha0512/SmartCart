from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.product import Product, Category
from models.user import User
from schemas.product import ProductCreate, ProductUpdate, ProductOut
from core.deps import get_current_user, require_seller

router = APIRouter(prefix="/products", tags=["Products"])

def enrich(product: Product) -> dict:
    """Add store_name and category_name to product dict."""
    data = {c.name: getattr(product, c.name) for c in product.__table__.columns}
    data["store_name"]    = product.seller.store_name if product.seller else None
    data["category_name"] = product.category.name if product.category else None
    return data


# GET all products (marketplace)
@router.get("/", response_model=List[ProductOut])
def get_all_products(
    search:      Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    sort:        Optional[str] = Query("default"),
    db:          Session = Depends(get_db),
):
    query = db.query(Product).filter(Product.is_active == True, Product.stock > 0)

    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if sort == "price-asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price-desc":
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    products = query.all()
    return [enrich(p) for p in products]


# GET single product
@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return enrich(product)


# GET seller's own products
@router.get("/seller/mine", response_model=List[ProductOut])
def get_my_products(
    seller: User = Depends(require_seller),
    db:     Session = Depends(get_db),
):
    products = db.query(Product).filter(Product.seller_id == seller.id).all()
    return [enrich(p) for p in products]


# CREATE product
@router.post("/", response_model=ProductOut, status_code=201)
def create_product(
    body:   ProductCreate,
    seller: User = Depends(require_seller),
    db:     Session = Depends(get_db),
):
    product = Product(**body.model_dump(), seller_id=seller.id)
    db.add(product)
    db.commit()
    db.refresh(product)
    return enrich(product)


# UPDATE product
@router.patch("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    body:       ProductUpdate,
    seller:     User = Depends(require_seller),
    db:         Session = Depends(get_db),
):
    product = db.query(Product).filter(
        Product.id == product_id, Product.seller_id == seller.id
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or not yours")

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return enrich(product)


# DELETE product
@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: int,
    seller:     User = Depends(require_seller),
    db:         Session = Depends(get_db),
):
    product = db.query(Product).filter(
        Product.id == product_id, Product.seller_id == seller.id
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or not yours")
    db.delete(product)
    db.commit()


# GET all categories
@router.get("/categories/all")
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()