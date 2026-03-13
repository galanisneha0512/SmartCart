import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";

const STATUS_FLOW  = ["placed","confirmed","shipped","delivered"];
const STATUS_STYLES = {
  placed:    { badge: "bg-blue-50 text-blue-700 border-blue-200",     label: "Placed"    },
  confirmed: { badge: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Confirmed" },
  shipped:   { badge: "bg-purple-50 text-purple-700 border-purple-200", label: "Shipped"   },
  delivered: { badge: "bg-green-50 text-green-700 border-green-200",   label: "Delivered" },
  cancelled: { badge: "bg-red-50 text-red-600 border-red-200",         label: "Cancelled" },
};

function OrderCard({ order, onStatusUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading]   = useState(false);
  const style = STATUS_STYLES[order.status] ?? STATUS_STYLES["placed"];
  const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1];

  const advance = async () => {
    if (!nextStatus) return;
    setLoading(true);
    try {
      await api.patch(`/orders/${order.id}/status`, { status: nextStatus });
      onStatusUpdate(order.id, nextStatus);
    } catch { alert("Failed to update status."); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md transition-all">
      <div className="flex items-center justify-between px-5 py-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm font-bold text-stone-900">ORD-{order.id}</p>
            <p className="text-xs text-stone-400 mt-0.5">
              {new Date(order.created_at).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm font-bold text-stone-900 hidden sm:block">₹{order.total_amount?.toLocaleString()}</p>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${style.badge}`}>{style.label}</span>
          <span className={`text-stone-400 text-sm transition-transform ${expanded ? "rotate-180" : ""}`}>▾</span>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-stone-100">
          <div className="flex flex-col gap-3 mt-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="w-10 h-10 bg-white border border-stone-200 rounded-lg flex items-center justify-center text-xl shrink-0">
                  {item.emoji ?? "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800 truncate">{item.product_name}</p>
                  <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-stone-900 shrink-0">
                  ₹{(item.price_at_purchase * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {nextStatus && order.status !== "cancelled" && (
            <div className="mt-4 pt-4 border-t border-stone-100 flex justify-end">
              <button onClick={advance} disabled={loading}
                className="px-5 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-60 capitalize">
                {loading ? "Updating..." : `Mark as ${nextStatus} →`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersReceived() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("All");
  const FILTERS = ["All", ...STATUS_FLOW, "cancelled"];

  useEffect(() => {
    api.get("/orders/seller/received")
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter);
  const revenue  = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + (o.total_amount ?? 0), 0);
  const pending  = orders.filter(o => ["placed","confirmed"].includes(o.status)).length;

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-8 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-stone-900">Orders Received</h1>
          <p className="text-stone-500 text-sm mt-1">{orders.length} total · {pending} pending action</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Orders", value: orders.length,  emoji: "🛒" },
            { label: "Revenue",      value: `₹${revenue.toLocaleString()}`, emoji: "💰" },
            { label: "Pending",      value: pending,         emoji: "⏳" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-stone-200 p-5 text-center">
              <p className="text-2xl mb-1">{s.emoji}</p>
              <p className="text-xl font-black text-stone-900">{s.value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize
                ${filter === f ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"}`}>
              {f === "All" ? "All" : STATUS_STYLES[f]?.label}
              <span className="ml-1.5 text-xs opacity-60">
                ({f === "All" ? orders.length : orders.filter(o => o.status === f).length})
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl border border-stone-200 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-stone-200">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-stone-600 font-semibold">No orders here</p>
            <p className="text-stone-400 text-sm mt-1">Orders will appear once buyers purchase your products</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(o => (
              <OrderCard key={o.id} order={o} onStatusUpdate={handleStatusUpdate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}