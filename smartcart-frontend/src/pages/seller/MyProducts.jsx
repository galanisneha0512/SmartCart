import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    api.get("/products/seller/mine")
      .then(({ data }) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleActive = async (product) => {
    try {
      const { data } = await api.patch(`/products/${product.id}`, { is_active: !product.is_active });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: data.is_active } : p));
    } catch { alert("Failed to update product."); }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/products/${deleteId}`);
      setProducts(prev => prev.filter(p => p.id !== deleteId));
      setDeleteId(null);
    } catch { alert("Failed to delete product."); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const active   = products.filter(p => p.is_active).length;
  const lowStock = products.filter(p => p.stock <= 5).length;

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif text-stone-900">My Products</h1>
            <p className="text-stone-500 text-sm mt-1">{products.length} products · {active} active</p>
          </div>
          <a href="/add-product" className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all">
            + Add Product
          </a>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total",     value: products.length, emoji: "📦", color: "text-stone-900" },
            { label: "Active",    value: active,          emoji: "✅", color: "text-green-600" },
            { label: "Low Stock", value: lowStock,        emoji: "⚠️", color: "text-red-500"   },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-stone-200 p-5 text-center">
              <p className="text-2xl mb-1">{s.emoji}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 py-3 mb-6 focus-within:border-orange-400 transition-all">
          <span className="text-stone-400">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your products..."
            className="flex-1 text-sm bg-transparent outline-none text-stone-900 placeholder:text-stone-400"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl border border-stone-200 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-stone-600 font-semibold">No products found</p>
            <p className="text-stone-400 text-sm mt-1">Try a different search or add new products</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-stone-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className={`border-b border-stone-50 hover:bg-stone-50 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.emoji ?? "📦"}</span>
                        <div>
                          <p className="font-semibold text-stone-900 line-clamp-1">{p.name}</p>
                          <p className="text-xs text-stone-400 line-clamp-1 max-w-[200px]">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-stone-500 text-xs">{p.category_name ?? "—"}</td>
                    <td className="px-5 py-4 font-bold text-stone-900">₹{p.price?.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`font-bold ${p.stock <= 5 ? "text-red-500" : "text-stone-700"}`}>
                        {p.stock} {p.stock <= 5 && <span className="text-xs font-normal">(low)</span>}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleActive(p)}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${p.is_active ? "bg-green-500" : "bg-stone-200"}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${p.is_active ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="text-xs text-red-400 hover:text-red-600 font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <p className="text-4xl mb-4 text-center">🗑️</p>
            <h3 className="text-lg font-bold text-stone-900 text-center mb-2">Delete Product?</h3>
            <p className="text-sm text-stone-500 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50">
                Cancel
              </button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}