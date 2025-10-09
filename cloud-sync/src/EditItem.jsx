import { useState, useEffect, useRef } from "react";
import "./EditItem.css";

export default function EditItem() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tableData1, setTableData1] = useState([]);
  const [tableData2, setTableData2] = useState([]);
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

  // Fetch tables from backend
  const fetchItemData = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/edit-item?search=${searchQuery}`)
      .then((res) => res.json())
      .then((data) => {
        setTableData1(data.table1 || []);
        setTableData2(data.table2 || []);
      })
      .catch((err) => console.error("Error fetching data:", err))
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
    <div className="edit-item-container">
      {/* NAVBAR */}
      <div className="navbar">
        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className="nav-title">Edit Item</div>
        <div className="nav-company">Company Name</div>
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

      {/* SEARCH */}
      <div className="edit-item-search">
        <input
          type="text"
          placeholder="Search Item..."
          className="search-box"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-btn" onClick={fetchItemData}>
          Search
        </button>
      </div>

      {/* TABLES */}
      <div className="tables-section">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="item-table">
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {tableData1.length > 0 ? (
                  tableData1.map((item, i) => (
                    <tr key={i}>
                      <td>{item.itemCode}</td>
                      <td>{item.itemName}</td>
                      <td>{item.category}</td>
                      <td>{item.unit}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>

            <table className="item-table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Stock Qty</th>
                  <th>Reorder Level</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {tableData2.length > 0 ? (
                  tableData2.map((item, i) => (
                    <tr key={i}>
                      <td>{item.supplier}</td>
                      <td>{item.stockQty}</td>
                      <td>{item.reorderLevel}</td>
                      <td>{item.lastUpdated}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* SAVE BUTTON */}
      <div className="save-section">
        <button className="save-btn">Save Changes</button>
      </div>
    </div>
  );
}
