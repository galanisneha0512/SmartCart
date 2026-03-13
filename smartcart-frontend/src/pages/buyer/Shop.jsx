import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import CartDrawer from "../../components/CartDrawer";
import api from "../../api/axios";

const CATEGORIES = [
  { label: "All",         emoji: "✦" },
  { label: "Electronics", emoji: "⚡" },
  { label: "Fashion",     emoji: "👜" },
  { label: "Lifestyle",   emoji: "🌿" },
  { label: "Sports",      emoji: "🏃" },
  { label: "Home",        emoji: "🏠" },
  { label: "Stationery",  emoji: "✏️" },
];

const SORT_OPTIONS = [
  { value: "default",    label: "Featured" },
  { value: "price-asc",  label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
];

export default function Shop() {
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort]         = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        const { data } = await api.get("/products/", { params });
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetchProducts, 280);
    return () => clearTimeout(t);
  }, [search]);

  // Client-side filter + sort
  let displayed = category === "All"
    ? products
    : products.filter(p => p.category_name === category);

  if (sort === "price-asc")  displayed = [...displayed].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") displayed = [...displayed].sort((a, b) => b.price - a.price);

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      {/* Hero */}
      <div className="bg-stone-950 text-white overflow-hidden relative">
        {/* decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-8 py-12 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 text-orange-400 text-xs font-bold tracking-widest uppercase mb-4 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                New arrivals every week
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight">
                Discover<br />
                <span className="text-orange-400">Top Products</span>
              </h2>
              <p className="text-stone-400 text-sm mt-3 max-w-xs leading-relaxed">
                Thousands of products from verified sellers across India.
              </p>
            </div>

            <div className="flex gap-8">
              {[
                { value: products.length || "–", label: "Products" },
                { value: "6+",  label: "Categories" },
                { value: "Free", label: "Shipping ₹999+" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black text-white tabular-nums">{s.value}</p>
                  <p className="text-xs text-stone-500 mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/10 rounded-2xl px-5 py-3.5 flex-1 focus-within:bg-white/15 focus-within:border-orange-400/50 transition-all">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products, brands..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-stone-500 outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-stone-400 hover:text-white text-xs font-bold transition-colors">✕</button>
              )}
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-stone-300 outline-none hover:border-orange-400/50 transition-all min-w-[150px] cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-stone-900">{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8">
        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap py-6">
          {CATEGORIES.map(c => (
            <button
              key={c.label}
              onClick={() => setCategory(c.label)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border transition-all
                ${category === c.label
                  ? "bg-stone-900 text-white border-stone-900 shadow-md"
                  : "bg-white text-stone-500 border-stone-200 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50"
                }`}
            >
              <span className="text-base leading-none">{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-stone-500 font-medium">
            <span className="font-black text-stone-900">{displayed.length}</span> products
            {category !== "All" && <span> in <span className="text-orange-500 font-bold">{category}</span></span>}
            {search && <span> for "<span className="font-bold">{search}</span>"</span>}
          </p>
          {(search || category !== "All") && (
            <button
              onClick={() => { setSearch(""); setCategory("All"); }}
              className="text-xs text-orange-500 hover:underline font-bold"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-20">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-stone-100 overflow-hidden">
                <div className="h-52 bg-stone-100 animate-pulse" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-2.5 bg-stone-100 rounded-full w-1/3 animate-pulse" />
                  <div className="h-3 bg-stone-100 rounded-full w-4/5 animate-pulse" />
                  <div className="h-3 bg-stone-100 rounded-full w-3/5 animate-pulse" />
                  <div className="h-5 bg-stone-100 rounded-full w-1/2 animate-pulse mt-2" />
                  <div className="h-10 bg-stone-100 rounded-2xl animate-pulse mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && displayed.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-20">
            {displayed.map((product, i) => (
              <div
                key={product.id}
                style={{ animationDelay: `${i * 0.05}s` }}
                className="opacity-0 animate-[fadeUp_0.4s_ease_forwards]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-stone-100 rounded-3xl flex items-center justify-center text-5xl mb-5 border border-stone-200">
              🔍
            </div>
            <p className="text-lg font-black text-stone-800 mb-2">No products found</p>
            <p className="text-sm text-stone-400 mb-6 max-w-xs">
              Try a different search term or browse another category.
            </p>
            <button
              onClick={() => { setSearch(""); setCategory("All"); }}
              className="px-6 py-3 bg-stone-900 text-white text-sm font-bold rounded-2xl hover:bg-orange-500 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </div>
  );
}