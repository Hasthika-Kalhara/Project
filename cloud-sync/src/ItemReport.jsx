import { useState, useEffect, useRef } from "react";
import "./ItemReport.css";

export default function ItemReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [itemData, setItemData] = useState([]);
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

  // Fetch item report
  const fetchItemReport = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/item-report?search=${searchQuery}`)
      .then((res) => res.json())
      .then((data) => setItemData(data))
      .catch((err) => console.error("Error fetching item report:", err))
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

  return (
    <div className="item-report-container">
      {/* NAVBAR */}
      <div className="navbar">
        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className="item-title">Item Report</div>
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
      <div className="item-filters">
        <input
          type="text"
          placeholder="Search items..."
          className="item-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="item-btn" onClick={fetchItemReport}>
          Search
        </button>
      </div>

      {/* TABLE */}
      <div className="item-table-container">
        {loading ? (
          <p>Loading...</p>
        ) : itemData.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <table className="item-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Unit Price</th>
                <th>Stock Qty</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {itemData.map((row, index) => (
                <tr key={index}>
                  <td>{row.itemName}</td>
                  <td>{row.category}</td>
                  <td>{row.unitPrice}</td>
                  <td>{row.stockQty}</td>
                  <td>{row.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
