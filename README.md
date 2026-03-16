# 🛒 SmartCart — Multi-Vendor E-Commerce Platform

A full-stack marketplace where sellers manage their own stores and buyers can browse, cart, and track orders — built with React and FastAPI.

> **Live Demo:** [smartcart.vercel.app](https://smart-cart-5v0santiy-sneha-galanis-projects.vercel.app) | **Backend:** Runs locally (setup below)

---

## Screenshots
Landing Page

Shop Page

Seller Dashboard

Checkout

AI Chatbot

---

## Features

### 🛍️ Buyer
- Browse 20+ products across 6 categories
- Search and filter by category, price (low→high, high→low)
- Add to cart with quantity controls
- Free shipping on orders above ₹999
- Checkout with delivery address form
- Track orders through every stage — Placed → Confirmed → Shipped → Delivered
- Cancel orders before they ship
- AI Shopping Assistant powered by Groq (Llama 3)

### 🏪 Seller
- Dual role — switch between Buyer and Seller mode
- Dashboard with real-time stats (revenue, orders, stock levels)
- Add products with image upload, emoji fallback, category and tag
- Toggle products active/inactive
- View and manage incoming orders
- Advance order status (Placed → Confirmed → Shipped → Delivered)
- Market View — browse competitor products
- AI Store Advisor powered by Groq (Llama 3)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS v3, Vite |
| Backend | FastAPI, Python 3.13 |
| Database | MySQL + SQLAlchemy |
| AI Chatbot | Groq API (Llama 3.1) |
| Image Upload | FastAPI Static Files |
| Deployment | Vercel (Frontend) |

---

## Database Schema

```
users         → id, name, email, password, role, active_mode, store_name
categories    → id, name
products      → id, seller_id, category_id, name, price, stock, image_url, tag
cart_items    → id, user_id, product_id, quantity
orders        → id, buyer_id, total_amount, status, address
order_items   → id, order_id, product_id, seller_id, quantity, price_at_purchase
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- MySQL 8.0+

### Backend Setup

```bash
cd smartcart-backend

# Create virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows
# source venv/bin/activate    # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Fill in your MySQL credentials and API keys

# Start server
uvicorn main:app --reload
```

Backend runs on **http://localhost:8000**
API docs available at **http://localhost:8000/docs**

### Frontend Setup

```bash
cd smartcart-frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on **http://localhost:5173**

### Seed Database

```bash
cd smartcart-backend
python seed.py
```

This creates 6 categories, 6 seller accounts, 20 products with images, and 1 test buyer.

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Buyer | buyer@test.com | test123 |
| Seller (TechZone) | techzone@test.com | test123 |
| Seller (StyleHub) | stylehub@test.com | test123 |
| Seller (FitLife) | fitlife@test.com | test123 |

---

## 📁 Project Structure

```
SmartCart/
├── smartcart-frontend/
│   └── src/
│       ├── pages/
│       │   ├── buyer/        # Shop, MyOrders, Checkout
│       │   └── seller/       # Dashboard, MyProducts, AddProduct, OrdersReceived, MarketView
│       ├── components/       # Navbar, ProductCard, CartDrawer, ChatBot
│       ├── context/          # AuthContext, CartContext
│       └── api/              # axios config
│
└── smartcart-backend/
    ├── routers/              # auth, products, cart, orders, upload, chatbot
    ├── models/               # SQLAlchemy models
    ├── schemas/              # Pydantic schemas
    ├── core/                 # security, deps
    └── main.py
```

---

## AI Chatbot

SmartCart includes two context-aware AI assistants:

**Buyer Bot 🛍️** — Knows your full product catalog. Ask it to recommend products, compare prices, or find items in a specific category.

**Seller Bot 📊** — Knows your store stats, product inventory and order history. Ask it for pricing advice, restocking alerts, or sales strategies.

Both powered by **Groq API** running **Llama 3.1 8B Instant** — completely free.

---

## 🔮 Future Improvements

- [ ] Cloud image storage (Cloudinary/Supabase)
- [ ] Online payment integration (Razorpay)
- [ ] Product reviews and ratings
- [ ] Email notifications for order updates
- [ ] Backend deployment (Render + cloud DB)
- [ ] Mobile app (React Native)

---
