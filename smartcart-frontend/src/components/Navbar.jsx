import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar({ onCartOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, switchMode } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const isSeller  = user?.role === "seller";
  const isSelling = user?.active_mode === "selling";

  const buyerLinks  = [
    { path: "/shop",   label: "Shop" },
    { path: "/orders", label: "My Orders" },
  ];
  const sellerLinks = [
    { path: "/dashboard",       label: "Dashboard" },
    { path: "/my-products",     label: "Products" },
    { path: "/add-product",     label: "Add Product" },
    { path: "/orders-received", label: "Orders" },
    { path: "/market-view",     label: "Market" },
  ];

  const activeLinks = isSelling ? sellerLinks : buyerLinks;
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 px-6 md:px-10 h-[60px] flex items-center justify-between shadow-sm">

      {/* Logo */}
      <h1
        onClick={() => navigate(user ? (isSelling ? "/dashboard" : "/shop") : "/")}
        className="text-xl font-black cursor-pointer shrink-0 tracking-tight"
      >
        <span className="text-stone-900">Smart</span>
        <span className="text-orange-500">Cart</span>
      </h1>

      {/* Nav Links */}
      {user && (
        <div className="hidden md:flex items-center gap-0.5">
          {activeLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all
                ${isActive(link.path)
                  ? "bg-orange-50 text-orange-600"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-2">

        {/* Mode Switch */}
        {user && isSeller && (
          <button
            onClick={async () => {
              const updated = await switchMode(isSelling ? "buying" : "selling");
              navigate(updated.active_mode === "selling" ? "/dashboard" : "/shop");
            }}
            className={`hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all
              ${isSelling
                ? "bg-stone-900 text-white border-stone-900 hover:bg-stone-700"
                : "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
              }`}
          >
            <span>{isSelling ? "🏪" : "🛍️"}</span>
            <span>{isSelling ? "Selling" : "Buying"}</span>
            <span className="opacity-50 font-normal">· Switch</span>
          </button>
        )}

        {/* Cart */}
        {user && !isSelling && (
          <button
            onClick={onCartOpen}
            className="relative p-2 text-stone-600 hover:text-orange-500 transition-colors rounded-xl hover:bg-orange-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>
        )}

        {/* User Menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex items-center gap-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-2xl pl-1.5 pr-3 py-1.5 transition-all"
            >
              <div className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xs font-black">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-stone-800 hidden sm:block">{user.name?.split(" ")[0]}</span>
            </button>

            {menuOpen && (
              <div
                onClick={() => setMenuOpen(false)}
                className="absolute right-0 top-12 bg-white border border-stone-100 rounded-2xl shadow-xl min-w-[200px] p-2 z-50"
              >
                <div className="px-3 py-2.5 mb-1 border-b border-stone-50">
                  <p className="text-sm font-bold text-stone-900">{user.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5 capitalize">{user.role}</p>
                  {(user.store_name || user.storeName) && (
                    <p className="text-xs text-orange-500 mt-0.5 font-medium">🏪 {user.store_name || user.storeName}</p>
                  )}
                </div>

                {isSeller && (
                  <button
                    onClick={async () => {
                      const updated = await switchMode(isSelling ? "buying" : "selling");
                      navigate(updated.active_mode === "selling" ? "/dashboard" : "/shop");
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 rounded-xl transition-colors font-medium"
                  >
                    {isSelling ? "🛍️ Switch to Buying" : "🏪 Switch to Selling"}
                  </button>
                )}
                <button
                  onClick={() => { logout(); navigate("/"); }}
                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium mt-0.5"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => navigate("/login")} className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors">
              Log in
            </button>
            <button onClick={() => navigate("/signup")} className="px-4 py-2 text-sm font-bold bg-stone-900 text-white rounded-xl hover:bg-orange-500 transition-all">
              Sign up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}