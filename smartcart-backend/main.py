from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import Base, engine
from routers import auth, products, cart, orders
from routers.upload import router as upload_router
from routers.chatbot import router as chatbot_router
import os

from models import user, product, order
from models import cart as cart_model

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartCart API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(upload_router)
app.include_router(chatbot_router)

@app.get("/")
def root():
    return {"message": "SmartCart API running 🚀"}