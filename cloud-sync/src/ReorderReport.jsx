import { useState, useEffect, useRef } from "react";
import "./ReorderReport.css";

export default function ReorderReport() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Navbar dropdown state
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

  // Fetch reorder report
  const fetchReorderReport = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/reorder-report")
      .then((res) => res.json())
      .then((data) => setReportData(data))
      .catch((err) => console.error("Error fetching reorder report:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReorderReport();
  }, []);

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

  return (
    <div className="reorder-report-container">
      {/* NAVBAR */}
      <div className="navbar">
        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className="reorder-title">Reorder Report</div>
        <div className="nav-title">Company Name</div>
      </div>

      {/* DROPDOWN */}
      {menuOpen && (
        <div ref={dropdownRef} className="dropdown">
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

      {/* TABLE */}
      <div className="reorder-table-container">
        {loading ? (
          <p>Loading...</p>
        ) : reportData.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <table className="reorder-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Stock Qty</th>
                <th>Reorder Level</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index}>
                  <td>{row.itemName}</td>
                  <td>{row.category}</td>
                  <td>{row.stockQty}</td>
                  <td>{row.reorderLevel}</td>
                  <td>{row.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
