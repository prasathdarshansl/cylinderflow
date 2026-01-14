import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

export default function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [taxPercent, setTaxPercent] = useState("");
  const [totalCount, setTotalCount] = useState("");
  const [imageFile, setImageFile] = useState(null);

  async function handleSave() {
    if (!name || !category || !price || !unit || taxPercent === "" || !totalCount) {
      alert("Fill all fields");
      return;
    }

    let imageUrl = "";

    if (imageFile) {
      const refImg = ref(storage, `products/${Date.now()}-${imageFile.name}`);
      await uploadBytes(refImg, imageFile);
      imageUrl = await getDownloadURL(refImg);
    }

    await addDoc(collection(db, "products"), {
      name,
      category,
      price: Number(price),
      unit,
      taxPercent: Number(taxPercent),
      totalCount: Number(totalCount),
      availableCount: Number(totalCount),
      imageUrl,
      createdAt: serverTimestamp(),
    });

    navigate("/products");
  }

  return (
    <div className="page">
      <h2>Add Product</h2>

      <input placeholder="Product Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Category" onChange={(e) => setCategory(e.target.value)} />
      <input placeholder="Unit" onChange={(e) => setUnit(e.target.value)} />
      <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
      <input type="number" placeholder="Tax %" onChange={(e) => setTaxPercent(e.target.value)} />
      <input type="number" placeholder="Total Cylinders" onChange={(e) => setTotalCount(e.target.value)} />

      <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />

      <button className="primary-btn" onClick={handleSave}>
        Save Product
      </button>
    </div>
  );
}
