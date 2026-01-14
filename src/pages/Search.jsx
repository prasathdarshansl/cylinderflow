import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import "../styles/search.css";

export default function Search() {
  const [query, setQuery] = useState("");
  const [sales, setSales] = useState([]);
  const [cylinders, setCylinders] = useState([]);

  useEffect(() => {
    // SALES LISTENER
    const unsubSales = onSnapshot(collection(db, "sales"), (snap) => {
      setSales(
        snap.docs.map((d) => ({
          id: d.id,
          type: "sale",
          ...d.data(),
        }))
      );
    });

    // CYLINDERS LISTENER
    const unsubCyl = onSnapshot(collection(db, "cylinders"), (snap) => {
      setCylinders(
        snap.docs.map((d) => ({
          id: d.id,
          type: "cylinder",
          ...d.data(),
        }))
      );
    });

    return () => {
      unsubSales();
      unsubCyl();
    };
  }, []);

  const q = query.toLowerCase();

  const saleResults = sales.filter((s) =>
    s.customerName?.toLowerCase().includes(q) ||
    s.productName?.toLowerCase().includes(q) ||
    s.cylinders?.some((c) => c.toLowerCase().includes(q))
  );

  const cylinderResults = cylinders.filter((c) =>
    c.serial?.toLowerCase().includes(q)
  );

  return (
    <div className="page search-page">
      <h2>Search</h2>

      <input
        className="search-input"
        placeholder="Search customer, product or cylinder serial"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query && (
        <>
          {/* SALES RESULTS */}
          <div className="results-section">
            <h4>Sales</h4>

            {saleResults.length === 0 && (
              <p className="empty">No sales found</p>
            )}

            {saleResults.map((s) => (
              <div className="result-card" key={s.id}>
                <strong>{s.productName}</strong>
                <p>Customer: {s.customerName}</p>
                <p>Cylinders: {s.cylinders.join(", ")}</p>
                <p>Total: ₹{s.totalAmount}</p>
              </div>
            ))}
          </div>

          {/* CYLINDER RESULTS */}
          <div className="results-section">
            <h4>Cylinders</h4>

            {cylinderResults.length === 0 && (
              <p className="empty">No cylinders found</p>
            )}

            {cylinderResults.map((c) => (
              <div className="result-card" key={c.id}>
                <strong>{c.serial}</strong>
                <p>Product: {c.productName}</p>
                <p>Status: {c.status}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
