import { useState, useEffect, useRef } from "react";
import "./SAReport.css";

export default function SAReport() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch item names from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  // Fetch stock adjustment report
  const fetchReport = () => {
    setLoading(true);
    fetch(
      `http://localhost:5000/api/stock-adjustments?item=${selectedItem}&from=${fromDate}&to=${toDate}`
    )
      .then((res) => res.json())
      .then((data) => setReportData(data))
      .catch((err) => console.error("Error fetching report:", err))
      .finally(() => setLoading(false));
  };

  // Close dropdown when clicking outside
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

  return (
    <div className="stock-adjustment-container">
      {/* Navbar */}
      <div className="navbar">
        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="dropdown-menu"
        >
          ☰
        </button>
        <h2 className="report-title">Stock Adjustment Report</h2>
        <h2 className="nav-title">Company Name</h2>
      </div>

      {/* Dropdown */}
      {menuOpen && (
        <div ref={dropdownRef} className="dropdown" id="dropdown-menu">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span className="nav-link-text">{item.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="report-filters">
        <input
          type="date"
          className="date-selector"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          className="date-selector"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <select
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          className="item-selector"
        >
          <option value="">Select Item</option>
          {items.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="report-table-container">
        {loading ? (
          <p>Loading...</p>
        ) : reportData.length === 0 ? (
          <p>No stock adjustments found.</p>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Item Name</th>
                <th>Adjustment Type</th>
                <th>Quantity</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index}>
                  <td>{row.date}</td>
                  <td>{row.itemName}</td>
                  <td>{row.type}</td>
                  <td>{row.quantity}</td>
                  <td>{row.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
