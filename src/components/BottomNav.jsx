import { NavLink } from "react-router-dom";
import "./BottomNav.css";

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/products">Products</NavLink>
      <NavLink to="/inventory">Inventory</NavLink>
      <NavLink to="/search">Search</NavLink>
    </nav>
  );
}
