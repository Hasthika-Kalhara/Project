import { useState, useEffect, useRef } from "react";
import "./ItemWiseReport.css";

export default function ItemWiseReport() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);

  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemData, setItemData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch items from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  // Fetch filtered item-wise sales data
  useEffect(() => {
    if (!dateRange.from || !dateRange.to) return;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      from: dateRange.from,
      to: dateRange.to,
      item: selectedItem,
      search: searchQuery,
    });

    fetch(`http://localhost:5000/api/sales?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sales data");
        return res.json();
      })
      .then((data) => {
        setItemData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [dateRange, selectedItem, searchQuery]);

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
    <div className="iw-container">
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
        <h2 className="page-title">Item Wise Report</h2>
        <h2 className="nav-title">Company Name</h2>
      </div>

      {/* Dropdown menu */}
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

      {/* Filters + Table */}
      <div className="iw-content">
        {/* Filters */}
        <div className="date-range">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, from: e.target.value }))
            }
            className="date-picker"
          />

          <input
            type="date"
            value={dateRange.to}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, to: e.target.value }))
            }
            className="date-picker2"
          />

          {/* Item dropdown */}
          <select
            className="item-type"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">All Items</option>
            {items.map((itm, idx) => (
              <option key={idx} value={itm.name || itm}>
                {itm.name || itm}
              </option>
            ))}
          </select>

          {/* Search input */}
          <input
            type="text"
            className="all-search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="iw-table-container">
          {loading && <p>Loading item wise data...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && itemData.length === 0 && (
            <p>No item wise data for the selected filters.</p>
          )}
          {!loading && !error && itemData.length > 0 && (
            <table className="iw-table">
              <thead>
                <tr>
                  <th>s/NO</th>
                  <th>Invoice NO</th>
                  <th>Item Name</th>
                  <th>QTY</th>
                  <th>Sales Price</th>
                  <th>Discount Amount</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {itemData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.invoice}</td>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>{item.price}</td>
                    <td>{item.discount}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
