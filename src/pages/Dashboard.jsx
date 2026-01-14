import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [todaySales, setTodaySales] = useState(0);
  const [issuedCount, setIssuedCount] = useState(0);
  const [recentReturns, setRecentReturns] = useState(0);

  useEffect(() => {
    // SALES (TOTAL)
    const unsubSales = onSnapshot(collection(db, "sales"), (snap) => {
      let total = 0;
      snap.forEach((doc) => {
        total += doc.data().totalAmount || 0;
      });
      setTodaySales(total);
    });

    // CYLINDERS
    const unsubCylinders = onSnapshot(
      collection(db, "cylinders"),
      (snap) => {
        let issued = 0;
        let returned = 0;

        snap.forEach((doc) => {
          const data = doc.data();
          if (data.status === "issued") issued++;
          if (data.status === "returned") returned++;
        });

        setIssuedCount(issued);
        setRecentReturns(returned);
      }
    );

    return () => {
      unsubSales();
      unsubCylinders();
    };
  }, []);

  return (
    <div className="page dashboard-page">
      {/* HEADER */}
      <div className="dashboard-header">
        <div className="brand">CylinderFlow</div>
        <div className="notify">🔔</div>
      </div>

      <h2 className="section-title">Overview</h2>

      {/* STATS */}
      <div className="stats">
        <div className="stat-card">
          <div>
            <p className="label">Total Sales</p>
            <h3>₹{todaySales.toLocaleString()}</h3>
            <span className="sub">all time</span>
          </div>
          <div className="icon blue">⬢</div>
        </div>

        <div className="stat-card">
          <div>
            <p className="label">Outstanding Cylinders</p>
            <h3>{issuedCount}</h3>
            <span className="sub">issued</span>
          </div>
          <div className="icon orange">🚚</div>
        </div>

        <div className="stat-card">
          <div>
            <p className="label">Returned Cylinders</p>
            <h3>{recentReturns}</h3>
            <span className="sub">total</span>
          </div>
          <div className="icon gray">↩</div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <h2 className="section-title">Quick Actions</h2>

      <div
        className="action-card primary"
        onClick={() => navigate("/sale")}
      >
        <div className="action-icon">➕</div>
        <div>
          <h4>New Sale</h4>
          <p>Process a new cylinder sale</p>
        </div>
      </div>

      <div
        className="action-card"
        onClick={() => navigate("/products/add")}
      >
        <div className="action-icon">📦</div>
        <div>
          <h4>Add Product</h4>
          <p>Introduce a new gas product</p>
        </div>
      </div>
    </div>
  );
}
