import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";
import ChatBot from "../../components/ChatBot";

const COLORS = [
  "#f97316",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
];

function StatCard({ emoji, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 flex items-start gap-4 hover:shadow-md transition-all">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
        style={{ background: color + "18" }}
      >
        {emoji}
      </div>
      <div>
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-black text-stone-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function MiniBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs text-stone-500 w-20 truncate shrink-0">{label}</p>
      <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <p className="text-xs font-bold text-stone-700 w-10 text-right shrink-0">
        {value}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products/seller/mine"),
      api.get("/orders/seller/received"),
    ])
      .then(([prodRes, orderRes]) => {
        const products = prodRes.data;
        const orders = orderRes.data;

        const totalRevenue = orders
          .filter((o) => o.status !== "cancelled")
          .reduce((s, o) => s + (o.seller_total ?? o.total_amount ?? 0), 0);

        const statusCounts = orders.reduce((acc, o) => {
          acc[o.status] = (acc[o.status] || 0) + 1;
          return acc;
        }, {});

        const recentOrders = orders.slice(0, 5);
        setStats({
          products,
          orders,
          totalRevenue,
          statusCounts,
          recentOrders,
        });
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#f7f4ef]">
        <Navbar />
        <div className="max-w-6xl mx-auto px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 bg-white rounded-2xl border border-stone-200 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );

  const products = stats?.products ?? [];
  const orders = stats?.orders ?? [];
  const recentOrders = stats?.recentOrders ?? [];

  const activeProducts = products.filter((p) => p.is_active).length;
  const pendingOrders =
    (stats?.statusCounts?.["placed"] ?? 0) +
    (stats?.statusCounts?.["confirmed"] ?? 0);
  const lowStock = products.filter((p) => p.stock <= 5).length;
  const maxOrderVal =
    recentOrders.length > 0
      ? Math.max(...recentOrders.map((o) => o.total_amount ?? 0))
      : 1;

  const STATUS_COLORS = {
    placed: "#3b82f6",
    confirmed: "#f59e0b",
    shipped: "#8b5cf6",
    delivered: "#10b981",
    cancelled: "#ef4444",
  };

  return (
    <>
      <div className="min-h-screen bg-[#f7f4ef]">
        <Navbar />
        <div className="max-w-6xl mx-auto px-8 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-stone-900">
              Dashboard
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Your store's performance overview
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              emoji="💰"
              label="Total Revenue"
              value={`₹${(stats?.totalRevenue ?? 0).toLocaleString()}`}
              sub="From delivered orders"
              color="#f97316"
            />
            <StatCard
              emoji="📦"
              label="Total Products"
              value={activeProducts}
              sub={`${products.length} total listed`}
              color="#3b82f6"
            />
            <StatCard
              emoji="🛒"
              label="Total Orders"
              value={orders.length}
              sub={`${pendingOrders} pending`}
              color="#10b981"
            />
            <StatCard
              emoji="⚠️"
              label="Low Stock"
              value={lowStock}
              sub="Items with ≤5 stock"
              color="#ef4444"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="text-base font-bold text-stone-900 mb-5">
                Recent Orders
              </h2>
              {recentOrders.length === 0 ? (
                <div className="text-center py-10 text-stone-400">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="text-sm">No orders yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {recentOrders.map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-stone-800">
                          ORD-{o.id}
                        </p>
                        <p className="text-xs text-stone-400">
                          {new Date(o.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <MiniBar
                          label=""
                          value={o.total_amount ?? 0}
                          max={maxOrderVal}
                          color="#f97316"
                        />
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                          style={{
                            background:
                              (STATUS_COLORS[o.status] ?? "#888") + "18",
                            color: STATUS_COLORS[o.status] ?? "#888",
                          }}
                        >
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="text-base font-bold text-stone-900 mb-5">
                Order Status
              </h2>
              {orders.length === 0 ? (
                <div className="text-center py-10 text-stone-400">
                  <p className="text-3xl mb-2">📊</p>
                  <p className="text-sm">No data yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {Object.entries(STATUS_COLORS).map(([status, color]) => (
                    <MiniBar
                      key={status}
                      label={status.charAt(0).toUpperCase() + status.slice(1)}
                      value={stats?.statusCounts?.[status] ?? 0}
                      max={orders.length}
                      color={color}
                    />
                  ))}
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-stone-100">
                <h3 className="text-sm font-bold text-stone-700 mb-3">
                  Product Stock
                </h3>
                <div className="flex flex-col gap-3">
                  {products.slice(0, 4).map((p, i) => (
                    <MiniBar
                      key={p.id}
                      label={p.name}
                      value={p.stock}
                      max={Math.max(...products.map((x) => x.stock), 1)}
                      color={COLORS[i % COLORS.length]}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatBot mode="seller" />
    </>
  );
}
