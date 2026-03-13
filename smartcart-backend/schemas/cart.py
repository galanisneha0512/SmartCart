from pydantic import BaseModel
from typing import Optional

class CartAddRequest(BaseModel):
    product_id: int
    quantity:   int = 1

class CartUpdateRequest(BaseModel):
    quantity: int

class CartItemOut(BaseModel):
    id:         int
    product_id: int
    quantity:   int
    name:       str
    price:      float
    emoji:      Optional[str]
    store_name: Optional[str]

    class Config:
        from_attributes = True