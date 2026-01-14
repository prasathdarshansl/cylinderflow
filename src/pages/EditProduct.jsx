import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import "../styles/editProduct.css";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    unit: "",
    price: 0,
    taxPercent: 0,
    totalCount: 0,
    availableCount: 0,
    imageUrl: "",
  });

  useEffect(() => {
    async function loadProduct() {
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) {
        setProduct(snap.data());
      }
      setLoading(false);
    }
    loadProduct();
  }, [id]);

  async function saveChanges() {
    try {
      let imageUrl = product.imageUrl;

      if (imageFile) {
        const imgRef = ref(
          storage,
          `products/${Date.now()}-${imageFile.name}`
        );
        await uploadBytes(imgRef, imageFile);
        imageUrl = await getDownloadURL(imgRef);
      }

      await updateDoc(doc(db, "products", id), {
        ...product,
        imageUrl,
      });

      navigate("/products");
    } catch (e) {
      alert("Failed to update product");
      console.error(e);
    }
  }

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="page edit-product-page">
      <h2>Edit Product</h2>

      {/* 1️⃣ PRODUCT INFO */}
      <div className="card">
        <h3>Product Information</h3>

        <label>Product Name</label>
        <input
          value={product.name}
          onChange={(e) =>
            setProduct({ ...product, name: e.target.value })
          }
        />

        <label>Category</label>
        <input
          value={product.category}
          onChange={(e) =>
            setProduct({ ...product, category: e.target.value })
          }
        />

        <label>Unit</label>
        <input
          value={product.unit}
          onChange={(e) =>
            setProduct({ ...product, unit: e.target.value })
          }
        />
      </div>

      {/* 2️⃣ PRICING */}
      <div className="card">
        <h3>Pricing & Tax</h3>

        <label>Price per Unit</label>
        <input
          type="number"
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: Number(e.target.value) })
          }
        />

        <label>Tax Percentage (%)</label>
        <input
          type="number"
          value={product.taxPercent}
          onChange={(e) =>
            setProduct({
              ...product,
              taxPercent: Number(e.target.value),
            })
          }
        />

        <p className="hint">
          These values affect billing & invoices
        </p>
      </div>

      {/* 3️⃣ INVENTORY */}
      <div className="card">
        <h3>Inventory</h3>

        <label>Total Cylinders</label>
        <input
          type="number"
          value={product.totalCount}
          onChange={(e) =>
            setProduct({
              ...product,
              totalCount: Number(e.target.value),
            })
          }
        />

        <label>Available Cylinders</label>
        <input
          type="number"
          value={product.availableCount}
          onChange={(e) =>
            setProduct({
              ...product,
              availableCount: Number(e.target.value),
            })
          }
        />

        <p className="hint">
          Available ≤ Total (do not reduce below issued stock)
        </p>
      </div>

      {/* 4️⃣ IMAGE */}
      <div className="card">
        <h3>Product Image</h3>

        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt="Product"
            className="preview"
          />
        )}

        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>

      {/* ACTIONS */}
      <div className="actions">
        <button className="secondary" onClick={() => navigate("/products")}>
          Cancel
        </button>

        <button className="primary-btn" onClick={saveChanges}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
