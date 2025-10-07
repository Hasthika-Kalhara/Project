import { useState, useEffect, useRef } from "react";
import "./MovingItemReport.css";

export default function MovingItemReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemData, setItemData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const fetchReport = () => {
    setLoading(true);
    fetch(
      `http://localhost:5000/api/moving-item-report?from=${fromDate}&to=${toDate}&search=${searchQuery}`
    )
      .then((res) => res.json())
      .then((data) => setItemData(data))
      .catch((err) => console.error("Error fetching moving item report:", err))
      .finally(() => setLoading(false));
  };

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
    <div className="moving-report-container">
      {/* NAVBAR */}
      <div className="navbar">
        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className="moving-title">Moving Item Report</div>
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

      {/* FILTERS */}
      <div className="report-filters">
        <label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="date-input"
          />
        </label>
        <label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="date-input"
          />
        </label>
        <input
          type="text"
          placeholder="Search item..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="search-btn" onClick={fetchReport}>
          Search
        </button>
      </div>

      {/* TABLE */}
      <div className="report-table-container">
        {loading ? (
          <p>Loading...</p>
        ) : itemData.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity Moved</th>
                <th>Last Moved Date</th>
              </tr>
            </thead>
            <tbody>
              {itemData.map((row, index) => (
                <tr key={index}>
                  <td>{row.itemName}</td>
                  <td>{row.category}</td>
                  <td>{row.qtyMoved}</td>
                  <td>{row.lastMoved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
