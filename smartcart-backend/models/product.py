from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Category(Base):
    __tablename__ = "categories"
    id   = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)

class Product(Base):
    __tablename__ = "products"

    id             = Column(Integer, primary_key=True, index=True)
    seller_id      = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id    = Column(Integer, ForeignKey("categories.id"), nullable=True)
    name           = Column(String(255), nullable=False)
    description    = Column(String(1000), nullable=True)
    price          = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    stock          = Column(Integer, default=0)
    emoji          = Column(String(10), default="📦")
    tag            = Column(String(50), nullable=True)
    is_active      = Column(Boolean, default=True)
    image_url      = Column(String(500), nullable=True)
    created_at     = Column(DateTime, server_default=func.now())

    seller   = relationship("User", foreign_keys=[seller_id])
    category = relationship("Category")