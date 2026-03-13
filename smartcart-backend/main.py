from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import Base, engine
from routers import auth, products, cart, orders
from routers.upload import router as upload_router
import os

# Import all models so SQLAlchemy knows about them
from models import user, product, order
from models import cart as cart_model

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartCart API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded images as static files
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(upload_router)

@app.get("/")
def root():
    return {"message": "SmartCart API running 🚀"}