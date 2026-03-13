import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user && token) {
      api
        .get("/cart/")
        .then(({ data }) => setCart(data))
        .catch(() => setCart([]));
    } else {
      setCart([]);
    }
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    try {
      const { data } = await api.post("/cart/", {
        product_id: product.id,
        quantity,
      });
      setCart((prev) => {
        const exists = prev.find((i) => i.product_id === product.id);
        if (exists)
          return prev.map((i) => (i.product_id === product.id ? data : i));
        return [...prev, data];
      });
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  const updateQty = async (cartItemId, qty) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    try {
      const { data } = await api.patch(`/cart/${cartItemId}`, {
        quantity: qty,
      });
      setCart((prev) => prev.map((i) => (i.id === cartItemId ? data : i)));
    } catch (err) {
      console.error("Update qty failed:", err);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/");
      setCart([]);
    } catch (err) {
      console.error("Clear cart failed:", err);
    }
  };

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
