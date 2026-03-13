from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProductCreate(BaseModel):
    name:           str
    description:    Optional[str] = None
    price:          float
    original_price: Optional[float] = None
    stock:          int = 0
    emoji:          Optional[str] = "📦"
    tag:            Optional[str] = None
    category_id:    Optional[int] = None
    image_url:      Optional[str] = None

class ProductUpdate(BaseModel):
    name:           Optional[str] = None
    description:    Optional[str] = None
    price:          Optional[float] = None
    original_price: Optional[float] = None
    stock:          Optional[int] = None
    emoji:          Optional[str] = None
    tag:            Optional[str] = None
    is_active:      Optional[bool] = None
    category_id:    Optional[int] = None
    image_url:      Optional[str] = None

class ProductOut(BaseModel):
    id:             int
    seller_id:      int
    name:           str
    description:    Optional[str]
    price:          float
    original_price: Optional[float]
    stock:          int
    emoji:          Optional[str]
    tag:            Optional[str]
    is_active:      bool
    image_url:      Optional[str] = None
    created_at:     datetime
    store_name:     Optional[str] = None
    category_name:  Optional[str] = None

    class Config:
        from_attributes = True