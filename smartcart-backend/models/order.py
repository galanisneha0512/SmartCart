from sqlalchemy import Column, Integer, String, Float, Enum, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Order(Base):
    __tablename__ = "orders"

    id           = Column(Integer, primary_key=True, index=True)
    buyer_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    status       = Column(Enum('placed','confirmed','shipped','delivered','cancelled'), default='placed')
    address      = Column(String(500), nullable=True)
    created_at   = Column(DateTime, server_default=func.now())

    buyer = relationship("User", foreign_keys=[buyer_id])
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id                = Column(Integer, primary_key=True, index=True)
    order_id          = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id        = Column(Integer, ForeignKey("products.id"), nullable=True)
    seller_id         = Column(Integer, ForeignKey("users.id"), nullable=False)
    quantity          = Column(Integer, nullable=False)
    price_at_purchase = Column(Float, nullable=False)

    order   = relationship("Order", back_populates="items")
    product = relationship("Product", foreign_keys=[product_id])