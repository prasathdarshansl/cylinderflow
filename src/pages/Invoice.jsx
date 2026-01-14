import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Share } from "@capacitor/share";
import jsPDF from "jspdf";
import "../styles/invoice.css";

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);

  useEffect(() => {
    async function loadSale() {
      const snap = await getDoc(doc(db, "sales", id));
      if (snap.exists()) setSale(snap.data());
    }
    loadSale();
  }, [id]);

  if (!sale) return <p className="loading">Loading invoice…</p>;

  function generatePDF() {
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text("TAX INVOICE", 105, 15, { align: "center" });

    pdf.setFontSize(11);
    pdf.text(`Customer: ${sale.customerName}`, 20, 30);
    pdf.text(`Phone: ${sale.phone || "-"}`, 20, 38);
    pdf.text(`Location: ${sale.location || "-"}`, 20, 46);

    pdf.text(`Product: ${sale.productName}`, 20, 62);
    pdf.text(`Quantity: ${sale.quantity}`, 20, 70);
    pdf.text(`Rate: ₹${sale.price}`, 20, 78);

    pdf.text(`Base Amount: ₹${sale.price * sale.quantity}`, 20, 94);
    pdf.text(`Tax (${sale.taxPercent}%): ₹${sale.taxAmount}`, 20, 102);
    pdf.text(`Deposit: ₹${sale.deposit}`, 20, 110);

    pdf.setFontSize(13);
    pdf.text(`TOTAL: ₹${sale.totalAmount}`, 20, 126);

    pdf.save(`Invoice-${id}.pdf`);
  }

  async function shareInvoice() {
    await Share.share({
      title: "Invoice",
      text: `Invoice for ${sale.customerName}`,
    });
  }

  return (
    <div className="page invoice-page">
      <h2>Invoice</h2>

      <div className="invoice-card">
        <p><b>Customer:</b> {sale.customerName}</p>
        <p><b>Product:</b> {sale.productName}</p>
        <p><b>Qty:</b> {sale.quantity}</p>
        <p><b>Total:</b> ₹{sale.totalAmount}</p>
      </div>

      <button onClick={generatePDF}>Download PDF</button>
      <button onClick={shareInvoice}>Share</button>
      <button onClick={() => navigate("/dashboard")}>Done</button>
    </div>
  );
}
