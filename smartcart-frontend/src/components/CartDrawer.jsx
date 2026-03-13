import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ onClose }) {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQty, totalItems, totalPrice } = useCart();

  const shipping = totalPrice >= 999 ? 0 : 79;

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Your Cart</h2>
            <p className="text-xs text-stone-400 mt-0.5">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 transition-all text-stone-500 font-bold text-sm">
            ✕
          </button>
        </div>

        {/* Free shipping banner */}
        {totalPrice < 999 && totalItems > 0 && (
          <div className="mx-4 mt-3 px-4 py-2.5 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-700 font-medium">
            🚚 Add ₹{(999 - totalPrice).toLocaleString()} more for <span className="font-bold">FREE shipping!</span>
          </div>
        )}
        {totalPrice >= 999 && totalItems > 0 && (
          <div className="mx-4 mt-3 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-semibold">
            🎉 You've unlocked FREE shipping!
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <span className="text-5xl mb-3">🛒</span>
              <p className="text-stone-500 font-medium">Your cart is empty</p>
              <p className="text-xs text-stone-400 mt-1">Add products to get started</p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-all">
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-stone-50 rounded-xl p-3 border border-stone-100">
                <div className="w-14 h-14 bg-white border border-stone-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    : <span className="text-2xl">{item.emoji ?? "📦"}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800 truncate">{item.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5">₹{item.price?.toLocaleString()} each</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-md bg-white border border-stone-200 text-stone-600 font-bold text-sm flex items-center justify-center hover:border-orange-400 hover:text-orange-600 transition-all">
                      −
                    </button>
                    <span className="text-sm font-semibold text-stone-800 w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-md bg-white border border-stone-200 text-stone-600 font-bold text-sm flex items-center justify-center hover:border-orange-400 hover:text-orange-600 transition-all">
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-sm font-bold text-stone-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium">
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-stone-100 px-6 py-5 flex flex-col gap-3">
            <div className="flex justify-between text-sm text-stone-500">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-500">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 border-t border-stone-100 pt-2">
              <span>Total</span>
              <span>₹{(totalPrice + shipping).toLocaleString()}</span>
            </div>
            <button onClick={handleCheckout}
              className="w-full py-3.5 bg-stone-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-all text-sm mt-1">
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}