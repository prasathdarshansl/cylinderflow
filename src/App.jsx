import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthChange } from "./auth";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupEmail from "./pages/SignupEmail";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Inventory from "./pages/Inventory";
import NewSale from "./pages/NewSale";
import Search from "./pages/Search";
import Invoice from "./pages/Invoice";

import BottomNav from "./components/BottomNav";
import "./styles/app.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u);
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) return <div className="loading">Loading...</div>;

  return (
    <div className="app-shell">
      <Routes>
        {/* AUTH */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-email" element={<SignupEmail />} />

        {/* APP (PROTECTED) */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/products"
          element={user ? <Products /> : <Navigate to="/" />}
        />
        <Route
          path="/products/add"
          element={user ? <AddProduct /> : <Navigate to="/" />}
        />
        <Route
          path="/products/edit/:id"
          element={user ? <EditProduct /> : <Navigate to="/" />}
        />
        <Route
          path="/inventory"
          element={user ? <Inventory /> : <Navigate to="/" />}
        />
        <Route
          path="/sale"
          element={user ? <NewSale /> : <Navigate to="/" />}
        />
        <Route
          path="/invoice/:id"
          element={user ? <Invoice /> : <Navigate to="/" />}
        />
        <Route
          path="/search"
          element={user ? <Search /> : <Navigate to="/" />}
        />
      </Routes>

      {user && <BottomNav />}
    </div>
  );
}
