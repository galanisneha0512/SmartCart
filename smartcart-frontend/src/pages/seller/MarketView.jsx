import { useState } from "react";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";

// Mock Data 
const MOCK_PRODUCTS = [
  { id: 1,  name: "Wireless Noise-Cancelling Headphones", category: "Electronics", price: 2499, originalPrice: 3499, rating: 4.5, reviews: 128, emoji: "🎧", tag: "Best Seller", description: "Premium sound with 30hr battery life.",  storeName: "TechZone" },
  { id: 2,  name: "Minimalist Leather Wallet",            category: "Fashion",     price: 799,  originalPrice: 1299, rating: 4.7, reviews: 89,  emoji: "👛", tag: "Top Rated",  description: "Slim bifold with RFID protection.",  storeName: "StyleHub" },
  { id: 3,  name: "Stainless Steel Water Bottle",         category: "Lifestyle",   price: 499,  originalPrice: 799,  rating: 4.6, reviews: 214, emoji: "🍶", tag: "Eco Pick",   description: "Double-walled, keeps cold 24hrs.",   storeName: "GreenGoods" },
  { id: 4,  name: "Mechanical Keyboard TKL",              category: "Electronics", price: 3299, originalPrice: 4499, rating: 4.8, reviews: 67,  emoji: "⌨️", tag: "New",         description: "Tactile switches, RGB backlit.",     storeName: "TechZone" },
  { id: 5,  name: "Yoga Mat Premium",                     category: "Sports",      price: 899,  originalPrice: 1499, rating: 4.4, reviews: 156, emoji: "🧘", tag: null,          description: "Non-slip, 6mm thick, carry strap.", storeName: "FitLife" },
  { id: 6,  name: "Ceramic Coffee Mug Set",               category: "Home",        price: 649,  originalPrice: 999,  rating: 4.3, reviews: 93,  emoji: "☕", tag: null,          description: "Set of 4, microwave safe.",          storeName: "HomeNest" },
  { id: 7,  name: "Portable Bluetooth Speaker",           category: "Electronics", price: 1799, originalPrice: 2499, rating: 4.6, reviews: 178, emoji: "🔊", tag: "Best Seller", description: "IPX7 waterproof, 12hr playtime.",    storeName: "TechZone" },
  { id: 8,  name: "Cotton Tote Bag",                      category: "Fashion",     price: 299,  originalPrice: 499,  rating: 4.2, reviews: 312, emoji: "👜", tag: "Eco Pick",   description: "100% organic cotton, washable.",    storeName: "StyleHub" },
  { id: 9,  name: "Desk Lamp LED",                        category: "Home",        price: 1299, originalPrice: 1799, rating: 4.5, reviews: 74,  emoji: "💡", tag: null,          description: "3 color modes, USB charging port.", storeName: "HomeNest" },
  { id: 10, name: "Running Shoes",                        category: "Sports",      price: 2199, originalPrice: 3499, rating: 4.7, reviews: 201, emoji: "👟", tag: "Top Rated",  description: "Lightweight mesh, cushioned sole.", storeName: "FitLife" },
  { id: 11, name: "Hardcover Notebook A5",                category: "Stationery",  price: 349,  originalPrice: 499,  rating: 4.4, reviews: 445, emoji: "📓", tag: null,          description: "200 pages, dotted grid.",           storeName: "PaperCo" },
  { id: 12, name: "Succulent Plant Kit",                  category: "Lifestyle",   price: 599,  originalPrice: 899,  rating: 4.8, reviews: 132, emoji: "🌵", tag: "New",         description: "3 plants + ceramic pots included.", storeName: "GreenGoods" },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Lifestyle", "Sports", "Home", "Stationery"];

const SORT_OPTIONS = [
  { value: "default",    label: "Featured" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
];

// Insight cards — what a seller sees as market intelligence
const INSIGHTS = [
  { emoji: "🏆", label: "Best Avg. Rating",  value: "Electronics", sub: "4.6 avg across 4 products" },
  { emoji: "🔥", label: "Most Reviews",      value: "Stationery",  sub: "445 reviews on top product" },
  { emoji: "💰", label: "Highest Priced",    value: "Electronics", sub: "₹3,299 avg in category" },
  { emoji: "📦", label: "Most Listings",     value: "Electronics", sub: "4 products listed" },
];

export default function MarketView() {
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("All");
  const [sort, setSort]           = useState("default");

  let products = MOCK_PRODUCTS
    .filter((p) => category === "All" || p.category === category)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  if (sort === "price-asc")  products = [...products].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);
  if (sort === "rating")     products = [...products].sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif text-stone-900">Market View</h1>
              <p className="text-sm text-stone-500 mt-1.5">
                Browse the full marketplace — see what competitors are offering
              </p>
            </div>
            {/* View-only badge */}
            <span className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-full mt-1">
              👁️ View Only
            </span>
          </div>

          {/* Info Banner */}
          <div className="mt-5 bg-orange-50 border border-orange-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
            <span className="text-orange-500 text-lg shrink-0 mt-0.5">💡</span>
            <p className="text-sm text-orange-800">
              You're browsing as a <span className="font-semibold">Seller</span>. You can view all products but cannot add to cart.
              <span className="text-orange-600 font-semibold"> Switch to Buyer mode</span> from the navbar to shop.
            </p>
          </div>
        </div>

        {/* ── Market Insights ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {INSIGHTS.map((ins) => (
            <div key={ins.label} className="bg-white rounded-2xl border border-stone-200 p-5 hover:shadow-sm transition-all">
              <div className="text-2xl mb-3">{ins.emoji}</div>
              <p className="text-xs text-stone-400 font-medium mb-1">{ins.label}</p>
              <p className="text-sm font-bold text-stone-900">{ins.value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{ins.sub}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-8">

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 flex-1 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products across the marketplace..."
                className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-stone-400 hover:text-stone-700 text-xs font-bold">✕</button>
              )}
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 outline-none cursor-pointer hover:border-orange-400 transition-all min-w-[180px]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                  ${category === c
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-stone-50 text-stone-500 border-stone-200 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-stone-500">
            Showing <span className="font-semibold text-stone-900">{products.length}</span> products
            {category !== "All" && (
              <span> in <span className="font-semibold text-orange-600">{category}</span></span>
            )}
          </p>
          {(search || category !== "All") && (
            <button
              onClick={() => { setSearch(""); setCategory("All"); }}
              className="text-xs text-orange-600 hover:underline font-semibold"
            >
              ✕ Clear filters
            </button>
          )}
        </div>

        {/* Product Grid — viewOnly mode */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-16">
            {products.map((product, i) => (
              <div
                key={product.id}
                style={{ animationDelay: `${i * 0.04}s` }}
                className="animate-[fadeUp_0.4s_ease_both]"
              >
                <ProductCard product={product} viewOnly />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 py-24 text-center">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-base font-semibold text-stone-700 mb-1">No products found</p>
            <p className="text-sm text-stone-400 mb-6">Try a different search or category</p>
            <button
              onClick={() => { setSearch(""); setCategory("All"); }}
              className="px-6 py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}