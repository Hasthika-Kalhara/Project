import { useState, useEffect, useRef } from "react";
import "./GRNReport.css";

export default function GRNReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [grnNo, setGrnNo] = useState("");
  const [itemName, setItemName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  
  const [itemList, setItemList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);

  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);

  const menuItems = [
    { icon: "👤", label: "Accounts", href: "/accounts" },
    { icon: "💰", label: "Costing and Inventory", href: "/costing-inventory" },
    { icon: "👨", label: "Customer Related", href: "/customers" },
    { icon: "🗒️", label: "Invoice and Billing", href: "/invoicing" },
    { icon: "🛒", label: "Inventory Management", href: "/inventory" },
    { icon: "📋", label: "Item Related", href: "/items" },
    { icon: "🛠️", label: "Maintenance", href: "/maintenance" },
    { icon: "📝", label: "Reports", href: "/reports" },
  ];

  // Fetch items and suppliers from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then((res) => res.json())
      .then((data) => setItemList(data))
      .catch(() => setItemList([]));

    fetch("http://localhost:5000/api/suppliers")
      .then((res) => res.json())
      .then((data) => setSupplierList(data))
      .catch(() => setSupplierList([]));
  }, []);

  // Close navbar dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reportData = {
      fromDate,
      toDate,
      grnNo,
      itemName,
      supplier,
      invoiceNo,
    };

    // Send data to backend to generate report
    fetch("http://localhost:5000/api/grn/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Report generated successfully!");
        console.log("Report data:", data);
        // You can handle the report data here (display, download, etc.)
      })
      .catch((err) => console.error("Error generating report:", err));
  };

  return (
    <div className="grn-report-container">
      {/* NAVBAR */}
      <div className="navbar">
        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className="grn-report-title">GRN Report</div>
        <div className="nav-title">Company Name</div>
      </div>

      {/* NAVBAR DROPDOWN */}
      {menuOpen && (
        <div ref={dropdownRef} className="grn-dropdown">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="grn-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              <span className="grn-nav-link-icon">{item.icon}</span>
              <span className="grn-nav-link-text">{item.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* FORM SECTION */}
      <form className="grn-report-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>GRN No</label>
          <input
            type="text"
            value={grnNo}
            onChange={(e) => setGrnNo(e.target.value)}
            placeholder="Enter GRN number"
          />
        </div>

        <div className="form-group">
          <label>Item Name</label>
          <select
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          >
            <option value="">Select Item</option>
            {itemList.map((item, index) => (
              <option key={index} value={item.itemName}>
                {item.itemName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Supplier</label>
          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          >
            <option value="">Select Supplier</option>
            {supplierList.map((sup, index) => (
              <option key={index} value={sup.supplierName}>
                {sup.supplierName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Invoice No</label>
          <input
            type="text"
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
            placeholder="Enter invoice number"
          />
        </div>

        <button type="submit" className="submit-btn">
          Generate Report
        </button>
      </form>
    </div>
  );
}