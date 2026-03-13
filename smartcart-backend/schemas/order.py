from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderCreate(BaseModel):
    address: str

class OrderItemOut(BaseModel):
    id:                int
    product_id:        int
    quantity:          int
    price_at_purchase: float
    product_name:      Optional[str] = None
    emoji:             Optional[str] = None

    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id:           int
    buyer_id:     int
    total_amount: float
    status:       str
    address:      str
    created_at:   datetime
    items:        List[OrderItemOut] = []

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str