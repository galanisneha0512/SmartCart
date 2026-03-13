"""
SmartCart Seed Script
Run once to populate the database with sample data:
    python seed.py

To clear and reseed:
    python seed.py --force
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
from models.user import User
from models.product import Product, Category
from core.security import hash_password

Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed():
    print("🌱 Starting seed...")

    if db.query(User).count() > 0:
        print("⚠️  Database already has data. Skipping seed.")
        print("   To reseed, run: python seed.py --force")
        if "--force" not in sys.argv:
            return

        print("🗑️  Clearing existing data...")
        db.query(Product).delete()
        db.query(Category).delete()
        db.query(User).delete()
        db.commit()

    # Categories
    print("📂 Creating categories...")
    categories = {}
    for name in ["Electronics", "Fashion", "Lifestyle", "Sports", "Home", "Stationery"]:
        cat = Category(name=name)
        db.add(cat)
        db.flush()
        categories[name] = cat
    db.commit()
    print(f"   ✅ {len(categories)} categories created")

    # Sellers
    print("👤 Creating seller accounts...")
    sellers = []
    seller_data = [
        { "name": "Rahul Mehta",  "email": "techzone@test.com",   "store": "TechZone",   "password": "test123" },
        { "name": "Priya Sharma", "email": "stylehub@test.com",   "store": "StyleHub",   "password": "test123" },
        { "name": "Arjun Gupta",  "email": "greengoods@test.com", "store": "GreenGoods", "password": "test123" },
        { "name": "Neha Patel",   "email": "fitlife@test.com",    "store": "FitLife",    "password": "test123" },
        { "name": "Vikram Singh", "email": "homenest@test.com",   "store": "HomeNest",   "password": "test123" },
        { "name": "Sneha Joshi",  "email": "paperco@test.com",    "store": "PaperCo",    "password": "test123" },
    ]
    for s in seller_data:
        seller = User(
            name        = s["name"],
            email       = s["email"],
            password    = hash_password(s["password"]),
            role        = "seller",
            active_mode = "selling",
            store_name  = s["store"],
        )
        db.add(seller)
        db.flush()
        sellers.append({ "user": seller, "store": s["store"] })
    db.commit()
    print(f"   ✅ {len(sellers)} sellers created")

    def seller(store_name):
        return next(s["user"] for s in sellers if s["store"] == store_name)

    # Products with real images
    print("📦 Creating products...")
    products = [
        # TechZone — Electronics
        {
            "name": "Wireless Noise-Cancelling Headphones",
            "description": "Premium sound quality with 30hr battery life and active noise cancellation.",
            "price": 2499, "original_price": 3499, "stock": 25,
            "emoji": "🎧", "tag": "Best Seller", "category": "Electronics", "store": "TechZone",
            "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
        },
        {
            "name": "Mechanical Keyboard TKL",
            "description": "Tactile switches with RGB backlit keys. Perfect for gaming and typing.",
            "price": 3299, "original_price": 4499, "stock": 15,
            "emoji": "⌨️", "tag": "New", "category": "Electronics", "store": "TechZone",
            "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80",
        },
        {
            "name": "Portable Bluetooth Speaker",
            "description": "IPX7 waterproof with 12hr playtime. Perfect for outdoor adventures.",
            "price": 1799, "original_price": 2499, "stock": 30,
            "emoji": "🔊", "tag": "Best Seller", "category": "Electronics", "store": "TechZone",
            "image_url": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
        },
        {
            "name": "USB-C Hub 7-in-1",
            "description": "Expand your laptop ports with HDMI, USB 3.0, SD card reader and more.",
            "price": 1599, "original_price": 2199, "stock": 20,
            "emoji": "🔌", "tag": None, "category": "Electronics", "store": "TechZone",
            "image_url": "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400&q=80",
        },
        {
            "name": "Laptop Stand Aluminium",
            "description": "Adjustable ergonomic stand for laptops 10-17 inch. Foldable and portable.",
            "price": 1899, "original_price": 2599, "stock": 18,
            "emoji": "💻", "tag": "New", "category": "Electronics", "store": "TechZone",
            "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",
        },

        # StyleHub — Fashion
        {
            "name": "Minimalist Leather Wallet",
            "description": "Slim bifold wallet with RFID blocking protection. Fits 8 cards.",
            "price": 799, "original_price": 1299, "stock": 50,
            "emoji": "👛", "tag": "Top Rated", "category": "Fashion", "store": "StyleHub",
            "image_url": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80",
        },
        {
            "name": "Cotton Tote Bag",
            "description": "100% organic cotton, washable and eco-friendly. Perfect for daily use.",
            "price": 299, "original_price": 499, "stock": 80,
            "emoji": "👜", "tag": "Eco Pick", "category": "Fashion", "store": "StyleHub",
            "image_url": "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&q=80",
        },
        {
            "name": "Canvas Backpack 20L",
            "description": "Durable canvas with laptop compartment and multiple pockets.",
            "price": 1499, "original_price": 1999, "stock": 22,
            "emoji": "🎒", "tag": None, "category": "Fashion", "store": "StyleHub",
            "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
        },

        # GreenGoods — Lifestyle
        {
            "name": "Stainless Steel Water Bottle",
            "description": "Double-walled insulation keeps drinks cold 24hrs, hot 12hrs.",
            "price": 499, "original_price": 799, "stock": 60,
            "emoji": "🍶", "tag": "Eco Pick", "category": "Lifestyle", "store": "GreenGoods",
            "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80",
        },
        {
            "name": "Succulent Plant Kit",
            "description": "3 beautiful succulents with ceramic pots included. Perfect for desk decor.",
            "price": 599, "original_price": 899, "stock": 35,
            "emoji": "🌵", "tag": "New", "category": "Lifestyle", "store": "GreenGoods",
            "image_url": "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&q=80",
        },
        {
            "name": "Bamboo Desk Organizer",
            "description": "Eco-friendly bamboo organizer with 5 compartments for your workspace.",
            "price": 849, "original_price": 1199, "stock": 28,
            "emoji": "🗂️", "tag": None, "category": "Lifestyle", "store": "GreenGoods",
            "image_url": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80",
        },

        # FitLife — Sports
        {
            "name": "Yoga Mat Premium",
            "description": "Non-slip surface, 6mm thick with carry strap. Supports all yoga styles.",
            "price": 899, "original_price": 1499, "stock": 40,
            "emoji": "🧘", "tag": None, "category": "Sports", "store": "FitLife",
            "image_url": "https://images.unsplash.com/photo-1601925228008-5dc79ce0f069?w=400&q=80",
        },
        {
            "name": "Running Shoes",
            "description": "Lightweight mesh upper with cushioned sole. Ideal for long distance running.",
            "price": 2199, "original_price": 3499, "stock": 20,
            "emoji": "👟", "tag": "Top Rated", "category": "Sports", "store": "FitLife",
            "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
        },
        {
            "name": "Resistance Bands Set",
            "description": "Set of 5 bands with different resistance levels. Includes carry bag.",
            "price": 499, "original_price": 799, "stock": 55,
            "emoji": "💪", "tag": None, "category": "Sports", "store": "FitLife",
            "image_url": "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&q=80",
        },

        # HomeNest — Home
        {
            "name": "Ceramic Coffee Mug Set",
            "description": "Set of 4 handcrafted ceramic mugs, microwave and dishwasher safe.",
            "price": 649, "original_price": 999, "stock": 32,
            "emoji": "☕", "tag": None, "category": "Home", "store": "HomeNest",
            "image_url": "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80",
        },
        {
            "name": "Desk Lamp LED",
            "description": "3 color modes with USB charging port. Adjustable brightness and arm.",
            "price": 1299, "original_price": 1799, "stock": 5,
            "emoji": "💡", "tag": None, "category": "Home", "store": "HomeNest",
            "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",
        },
        {
            "name": "Scented Candle Set",
            "description": "Set of 3 soy wax candles in lavender, vanilla and sandalwood scents.",
            "price": 749, "original_price": 1099, "stock": 45,
            "emoji": "🕯️", "tag": "New", "category": "Home", "store": "HomeNest",
            "image_url": "https://images.unsplash.com/photo-1603905880407-a5f06a50e8d4?w=400&q=80",
        },

        # PaperCo — Stationery
        {
            "name": "Hardcover Notebook A5",
            "description": "200 pages dotted grid paper, lay-flat binding and bookmark ribbon.",
            "price": 349, "original_price": 499, "stock": 100,
            "emoji": "📓", "tag": None, "category": "Stationery", "store": "PaperCo",
            "image_url": "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80",
        },
        {
            "name": "Fountain Pen Set",
            "description": "Premium brass fountain pen with 5 ink cartridges in a gift box.",
            "price": 1199, "original_price": 1699, "stock": 18,
            "emoji": "✒️", "tag": "Top Rated", "category": "Stationery", "store": "PaperCo",
            "image_url": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&q=80",
        },
        {
            "name": "Sticky Notes Pack",
            "description": "400 sticky notes in 4 colors, 4 sizes. Perfect for office and study.",
            "price": 199, "original_price": 299, "stock": 120,
            "emoji": "📝", "tag": None, "category": "Stationery", "store": "PaperCo",
            "image_url": "https://images.unsplash.com/photo-1612345854013-5e2ac86f6169?w=400&q=80",
        },
    ]

    for p in products:
        product = Product(
            seller_id      = seller(p["store"]).id,
            category_id    = categories[p["category"]].id,
            name           = p["name"],
            description    = p["description"],
            price          = p["price"],
            original_price = p["original_price"],
            stock          = p["stock"],
            emoji          = p["emoji"],
            tag            = p["tag"],
            is_active      = True,
            image_url      = p["image_url"],
        )
        db.add(product)

    db.commit()
    print(f"   ✅ {len(products)} products with images created")

    # Test buyer
    print("👤 Creating test buyer...")
    buyer = User(
        name        = "Arjun Sharma",
        email       = "buyer@test.com",
        password    = hash_password("test123"),
        role        = "buyer",
        active_mode = "buying",
        store_name  = None,
    )
    db.add(buyer)
    db.commit()

    print("\n🎉 Seed complete!")
    print("─" * 40)
    print(f"  📂 Categories : {len(categories)}")
    print(f"  👤 Sellers    : {len(sellers)}")
    print(f"  📦 Products   : {len(products)} (with images)")
    print(f"  🛒 Buyer      : buyer@test.com / test123")
    print(f"  🏪 Seller     : techzone@test.com / test123")
    print("─" * 40)

if __name__ == "__main__":
    try:
        seed()
    finally:
        db.close()