import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useCart } from "../../context/CartContext";
import api from "../../api/axios";

const STATES = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "West Bengal",
  "Punjab",
  "Kerala",
  "Madhya Pradesh",
  "Bihar",
  "Odisha",
  "Haryana",
];

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = totalPrice >= 999 ? 0 : 79;
  const total = totalPrice + shipping;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (
      !form.full_name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      setError("Please fill in all delivery details.");
      return;
    }
    if (form.phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (form.pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const address = `${form.full_name}, ${form.phone}, ${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;
      await api.post("/orders/", { address });
      await clearCart();
      navigate("/orders?success=true");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to place order. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f4ef]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <span className="text-6xl mb-4">🛒</span>
          <p className="text-lg font-semibold text-stone-700 mb-2">
            Your cart is empty
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 px-6 py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-stone-900">
            Checkout
          </h1>
          <p className="text-sm text-stone-500 mt-1.5">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Delivery Form ── */}
          <form
            onSubmit={handlePlaceOrder}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col gap-4">
              <h2 className="text-base font-bold text-stone-900">
                📦 Delivery Address
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-stone-700 block mb-1.5">
                    Full Name
                  </label>
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Arjun Sharma"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700 block mb-1.5">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    type="tel"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-stone-700 block mb-1.5">
                  Address
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={2}
                  placeholder="House/Flat no, Street, Area, Landmark"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-stone-700 block mb-1.5">
                    City
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Nashik"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700 block mb-1.5">
                    State
                  </label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-orange-400 transition-all"
                  >
                    <option value="">Select</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700 block mb-1.5">
                    Pincode
                  </label>
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="422001"
                    maxLength={6}
                    type="tel"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="text-base font-bold text-stone-900 mb-4">
                💳 Payment Method
              </h2>
              <div className="flex items-center gap-3 p-4 bg-orange-50 border-2 border-orange-400 rounded-xl">
                <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-stone-500">
                    Pay when your order arrives
                  </p>
                </div>
                <span className="ml-auto text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                  Free
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-3 text-center">
                Online payment coming soon
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all text-sm disabled:opacity-60 text-base"
            >
              {loading
                ? "Placing order..."
                : `🎉 Place Order — ₹${total.toLocaleString()}`}
            </button>
          </form>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="text-base font-bold text-stone-900 mb-4">
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 max-h-64 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-center text-xl shrink-0 overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (item.emoji ?? "📦")
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-stone-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-stone-900 shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-100 pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Shipping</span>
                  <span
                    className={
                      shipping === 0 ? "text-green-600 font-semibold" : ""
                    }
                  >
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                    🎉 You saved ₹79 on shipping!
                  </p>
                )}
                <div className="flex justify-between text-base font-bold text-stone-900 border-t border-stone-100 pt-2 mt-1">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
