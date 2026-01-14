import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import "../styles/products.css";

const CATEGORIES = [
  "All",
  "Industrial Gases",
  "Medical Gases",
  "Specialty Gases",
];

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const filtered =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  async function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
  }

  return (
    <div className="page products-page">
      <div className="products-header">
        <h2>Product Catalog</h2>
      </div>

      <div className="product-tabs">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`tab ${category === c ? "active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c.replace(" Gases", "")}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filtered.length === 0 && <p className="empty">No products added yet</p>}

        {filtered.map((p) => (
          <div key={p.id} className="product-card">
            <img
              src={p.imageUrl || "https://via.placeholder.com/200"}
              alt={p.name}
            />

            <div className="card-body">
              <h4>{p.name}</h4>
              <p>{p.category}</p>

              <p className="price">
                ₹{p.price} / {p.unit}
              </p>

              <p className="stock">
                Available: {p.availableCount} / {p.totalCount}
              </p>

              <div className="card-actions">
                <button
                  className="edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/products/edit/${p.id}`);
                  }}
                >
                  Edit
                </button>

                <button
                  className="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProduct(p.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="fab" onClick={() => navigate("/products/add")}>
        +
      </button>
    </div>
  );
}
