import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";
import api from "../../api/axios";

const STATUS_STYLES = {
  placed:     { dot: "bg-blue-400",   badge: "bg-blue-50 text-blue-700 border-blue-200",     label: "Placed" },
  confirmed:  { dot: "bg-yellow-400", badge: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Confirmed" },
  shipped:    { dot: "bg-purple-400", badge: "bg-purple-50 text-purple-700 border-purple-200", label: "Shipped" },
  delivered:  { dot: "bg-green-500",  badge: "bg-green-50 text-green-700 border-green-200",   label: "Delivered" },
  cancelled:  { dot: "bg-red-400",    badge: "bg-red-50 text-red-600 border-red-200",         label: "Cancelled" },
};

const STEPS = ["Placed", "Confirmed", "Shipped", "Delivered"];
const FILTERS = ["All", "placed", "confirmed", "shipped", "delivered", "cancelled"];

function OrderProgress({ status }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-red-500 font-medium bg-red-50 border border-red-200 px-3 py-1 rounded-full">
          ✕ This order was cancelled
        </span>
      </div>
    );
  }
  const activeStep = ["placed","confirmed","shipped","delivered"].indexOf(status);
  return (
    <div className="mt-4">
      <div className="flex items-center gap-0">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0
              ${i <= activeStep ? "bg-green-500 border-green-500 text-white" : "bg-white border-stone-300 text-stone-400"}`}>
              {i <= activeStep ? "✓" : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${i < activeStep ? "bg-green-500" : "bg-stone-200"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        {STEPS.map((step, i) => (
          <p key={step} className={`text-[10px] font-medium flex-1 ${i <= activeStep ? "text-green-600" : "text-stone-400"} ${i === 0 ? "text-left" : i === STEPS.length - 1 ? "text-right" : "text-center"}`}>
            {step}
          </p>
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const style = STATUS_STYLES[order.status] ?? STATUS_STYLES["placed"];

  const handleCancel = async () => {
    try {
      await api.patch(`/orders/${order.id}/cancel`);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.detail || "Could not cancel order.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md transition-all">
      <div className="flex items-center justify-between px-5 py-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-4">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${style.dot}`} />
          <div>
            <p className="text-sm font-bold text-stone-900">ORD-{order.id}</p>
            <p className="text-xs text-stone-400 mt-0.5">
              {new Date(order.created_at).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
              {" · "}{order.items?.length} {order.items?.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm font-bold text-stone-900 hidden sm:block">₹{order.total_amount?.toLocaleString()}</p>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${style.badge}`}>{style.label}</span>
          <span className={`text-stone-400 text-sm transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>▾</span>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-stone-100 animate-[fadeUp_0.2s_ease]">
          <div className="mt-4 mb-5"><OrderProgress status={order.status} /></div>
          <div className="flex flex-col gap-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="w-11 h-11 bg-white border border-stone-200 rounded-lg flex items-center justify-center text-2xl shrink-0">
                  {item.emoji || "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800 truncate">{item.product_name}</p>
                  <p className="text-xs text-stone-400 mt-0.5">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-stone-900 shrink-0">
                  ₹{(item.price_at_purchase * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
            <div>
              <p className="text-xs text-stone-400">Order Total</p>
              <p className="text-base font-bold text-stone-900">₹{order.total_amount?.toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              {["placed","confirmed","shipped"].includes(order.status) && (
                <button onClick={handleCancel} className="px-4 py-2 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all">
                  Cancel Order
                </button>
              )}
              <button className="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200 transition-all">
                Get Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyOrders() {
  const [cartOpen, setCartOpen]     = useState(false);
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeFilter, setFilter]   = useState("All");

  useEffect(() => {
    api.get("/orders/my")
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === "All"
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-stone-900">My Orders</h1>
          <p className="text-sm text-stone-500 mt-1.5">{orders.length} orders placed</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize
                ${activeFilter === f
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                }`}
            >
              {f === "All" ? "All" : STATUS_STYLES[f]?.label}
              {f !== "All" && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({orders.filter(o => o.status === f).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl border border-stone-200 animate-pulse" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filtered.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">📦</span>
            <p className="text-lg font-semibold text-stone-700 mb-2">No orders yet</p>
            <p className="text-sm text-stone-400 mb-6">Orders will appear here once you place them</p>
            <button onClick={() => setFilter("All")} className="px-6 py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-all">
              View All Orders
            </button>
          </div>
        )}
      </div>
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </div>
  );
}