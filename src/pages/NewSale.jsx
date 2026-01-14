import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";
import "../styles/sale.css";

export default function NewSale() {
  const navigate = useNavigate();

  /* ---------- PRODUCTS ---------- */
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  // cart = [{ product, serials: [], serialInput: "" }]

  /* ---------- CUSTOMER ---------- */
  const [customerName, setCustomerName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");

  /* ---------- BILLING ---------- */
  const [depositAmount, setDepositAmount] = useState("");

  /* ---------- LOAD PRODUCTS ---------- */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  /* ---------- ADD PRODUCT ---------- */
  function addProductToCart(product) {
    if (cart.some((c) => c.product.id === product.id)) return;

    setCart((prev) => [
      ...prev,
      { product, serials: [], serialInput: "" },
    ]);
  }

  /* ---------- ADD SERIAL ---------- */
  function addSerial(index) {
    setCart((prev) => {
      const updated = [...prev];
      const item = updated[index];
      const value = item.serialInput.trim();

      if (!value || item.serials.includes(value)) return prev;

      item.serials.push(value);
      item.serialInput = "";
      return updated;
    });
  }

  /* ---------- REMOVE SERIAL ---------- */
  function removeSerial(index, serial) {
    setCart((prev) => {
      const updated = [...prev];
      updated[index].serials = updated[index].serials.filter(
        (s) => s !== serial
      );
      return updated;
    });
  }

  /* ---------- COMPLETE SALE ---------- */
  async function completeSale() {
    if (!customerName.trim()) {
      alert("Customer name is required");
      return;
    }

    if (cart.length === 0) {
      alert("Select at least one product");
      return;
    }

    try {
      const createdSaleIds = [];

      for (const item of cart) {
        if (item.serials.length === 0) continue;

        const baseAmount = item.product.price * item.serials.length;
        const taxPercent = Number(item.product.taxPercent || 0);
        const taxAmount = (baseAmount * taxPercent) / 100;
        const deposit = Number(depositAmount || 0);

        const totalAmount = baseAmount + taxAmount + deposit;

        /* 1️⃣ CREATE SALE */
        const saleRef = await addDoc(collection(db, "sales"), {
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.serials.length,

          taxPercent,
          taxAmount,
          deposit,
          totalAmount,

          customerName,
          location,
          phone,
          vehicle,

          cylinders: item.serials,
          createdAt: serverTimestamp(),
        });

        createdSaleIds.push(saleRef.id);

        /* 2️⃣ CREATE CYLINDERS */
        for (const serial of item.serials) {
          await addDoc(collection(db, "cylinders"), {
            serial,
            productId: item.product.id,
            productName: item.product.name,
            status: "issued",
            saleId: saleRef.id,
            issuedAt: serverTimestamp(),
          });
        }

        /* 3️⃣ UPDATE STOCK */
        await updateDoc(doc(db, "products", item.product.id), {
          availableCount: increment(-item.serials.length),
        });
      }

      /* 👉 OPEN FIRST INVOICE */
      navigate(`/invoice/${createdSaleIds[0]}`);
    } catch (err) {
      console.error(err);
      alert("Failed to complete sale");
    }
  }

  /* ---------- UI ---------- */
  return (
    <div className="page sale-page">
      <h2>Add Purchase</h2>

      {/* PRODUCT SELECTION */}
      <h3>Select Products</h3>
      <div className="product-grid">
        {products.map((p) => (
          <div
            key={p.id}
            className="product-card"
            onClick={() => addProductToCart(p)}
          >
            <img src={p.imageUrl || "https://via.placeholder.com/200"} />
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <small>Available: {p.availableCount}</small>
          </div>
        ))}
      </div>

      {/* CART */}
      {cart.map((item, index) => {
        const base = item.product.price * item.serials.length;
        const tax =
          (base * Number(item.product.taxPercent || 0)) / 100;

        return (
          <div className="card" key={item.product.id}>
            <h3>{item.product.name}</h3>

            <div className="serial-row">
              <input
                placeholder="Enter serial number"
                value={item.serialInput}
                onChange={(e) =>
                  setCart((prev) => {
                    const updated = [...prev];
                    updated[index].serialInput = e.target.value;
                    return updated;
                  })
                }
              />
              <button onClick={() => addSerial(index)}>+</button>
            </div>

            {item.serials.map((s) => (
              <div className="serial-item" key={s}>
                {s}
                <button onClick={() => removeSerial(index, s)}>✕</button>
              </div>
            ))}

            <p className="summary">
              Base: ₹{base} <br />
              Tax ({item.product.taxPercent || 0}%): ₹{tax}
            </p>
          </div>
        );
      })}

      {/* CUSTOMER DETAILS */}
      <div className="card">
        <h3>Customer Details</h3>
        <input
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          placeholder="Vehicle Number"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
        />
      </div>

      {/* DEPOSIT */}
      <div className="card">
        <h3>Deposit (one-time)</h3>
        <input
          type="number"
          placeholder="Enter deposit amount"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />
      </div>

      <button className="complete-btn" onClick={completeSale}>
        Generate Bills
      </button>
    </div>
  );
}
