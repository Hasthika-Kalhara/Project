import { useState, useEffect, useRef } from "react";
import "./StockReport.css";

export default function StockReport() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch item names from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/items") // change to your backend endpoint
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  // Fetch stock report
  const fetchStockReport = () => {
    setLoading(true);
    fetch(
      `http://localhost:5000/api/stock-report?item=${selectedItem}&search=${searchQuery}`
    )
      .then((res) => res.json())
      .then((data) => setStockData(data))
      .catch((err) => console.error("Error fetching stock report:", err))
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
    <div className="report-container">
      {/* Navbar */}
      <div className="report-navbar">
        <button
          ref={hamburgerRef}
          className="report-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="dropdown-menu"
        >
          ☰
        </button>
        <h2 className="stock-title">Stock Report</h2>
        <h2 className="stock-company">Company Name</h2>
      </div>

      {/* Dropdown */}
      {menuOpen && (
        <div ref={dropdownRef} className="report-dropdown" id="dropdown-menu">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="report-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              <span className="report-nav-link-icon">{item.icon}</span>
              <span className="report-nav-link-text">{item.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="report-content">
        {/* Filters */}
        <div className="report-filters">
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="report-select"
          >
            <option value="">Select Item</option>
            {items.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search..."
            className="report-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

        </div>

        {/* Stock Table */}
        <div className="report-table-container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Available Stock</th>
                  <th>Unit Price</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {stockData.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No stock data found.
                    </td>
                  </tr>
                ) : (
                  stockData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.itemName}</td>
                      <td>{row.category}</td>
                      <td>{row.stockQty}</td>
                      <td>{row.unitPrice}</td>
                      <td>{row.updatedAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}