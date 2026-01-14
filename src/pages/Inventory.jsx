import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "../styles/inventory.css";

const TABS = ["All", "Issued", "Returned"];

export default function Inventory() {
  const [cylinders, setCylinders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  // 🔹 REAL-TIME CYLINDER LIST
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "cylinders"), (snap) => {
      setCylinders(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return unsub;
  }, []);

  // 🔹 FILTER
  const filtered =
    activeTab === "All"
      ? cylinders
      : cylinders.filter(
          (c) => c.status.toLowerCase() === activeTab.toLowerCase()
        );

  // 🔹 MARK CYLINDER AS RETURNED + RESTOCK PRODUCT
  async function markReturned(cylinder) {
    try {
      if (cylinder.status === "returned") return;

      // 1️⃣ Update cylinder status
      await updateDoc(doc(db, "cylinders", cylinder.id), {
        status: "returned",
        updatedAt: serverTimestamp(),
      });

      // 2️⃣ Restore product stock
      if (cylinder.productId) {
        const productRef = doc(db, "products", cylinder.productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          await updateDoc(productRef, {
            availableCount: increment(1),
          });
        }
      }
    } catch (e) {
      console.error(e);
      alert("Failed to mark cylinder as returned");
    }
  }

  return (
    <div className="page inventory-page">
      <h2>Inventory</h2>

      {/* FILTER TABS */}
      <div className="inventory-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* INVENTORY LIST */}
      <div className="inventory-list">
        {filtered.length === 0 && (
          <p className="empty">No cylinders found</p>
        )}

        {filtered.map((c) => (
          <div className="inventory-card" key={c.id}>
            <div className="left">
              <h4>{c.serial}</h4>
              <p className="product">{c.productName}</p>
              <span className={`status ${c.status}`}>
                {c.status.toUpperCase()}
              </span>
            </div>

            {c.status === "issued" && (
              <button
                className="return-btn"
                onClick={() => markReturned(c)}
              >
                Mark Returned
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
