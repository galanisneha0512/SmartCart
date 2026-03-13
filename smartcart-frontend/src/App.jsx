import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Shop from "./pages/buyer/Shop";
import MyOrders from "./pages/buyer/MyOrders";
import Checkout from "./pages/buyer/Checkout";

import Dashboard from "./pages/seller/Dashboard";
import MyProducts from "./pages/seller/MyProducts";
import AddProduct from "./pages/seller/AddProduct";
import OrdersReceived from "./pages/seller/OrdersReceived";
import MarketView from "./pages/seller/MarketView";

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role && user.active_mode !== role)
    return <Navigate to="/" />;
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Landing />;
  if (user.active_mode === "selling") return <Navigate to="/dashboard" />;
  return <Navigate to="/shop" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Buyer */}
      <Route
        path="/shop"
        element={
          <ProtectedRoute>
            <Shop />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      {/* Seller */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-products"
        element={
          <ProtectedRoute>
            <MyProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-product"
        element={
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders-received"
        element={
          <ProtectedRoute>
            <OrdersReceived />
          </ProtectedRoute>
        }
      />
      <Route
        path="/market-view"
        element={
          <ProtectedRoute>
            <MarketView />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
