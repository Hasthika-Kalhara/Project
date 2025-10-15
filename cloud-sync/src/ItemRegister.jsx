import { useState, useEffect, useRef } from "react";
import "./ItemRegister.css";

export default function ItemRegister() {
  const [itemName, setItemName] = useState("");
  const [unit, setUnit] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [category, setCategory] = useState("");
  const [reorderQty, setReorderQty] = useState("");
  const [movingLimit, setMovingLimit] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [unitList, setUnitList] = useState([]);

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

  // Fetch category and unit data (optional backend endpoints)
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategoryList(data))
      .catch(() => setCategoryList([]));

    fetch("http://localhost:5000/api/units")
      .then((res) => res.json())
      .then((data) => setUnitList(data))
      .catch(() => setUnitList([]));
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
    const newItem = {
      itemName,
      unit,
      itemCode,
      category,
      reorderQty,
      movingLimit,
      qrCode,
    };

    // Send data to backend
    fetch("http://localhost:5000/api/items/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Item registered successfully!");
        setItemName("");
        setUnit("");
        setItemCode("");
        setCategory("");
        setReorderQty("");
        setMovingLimit("");
        setQrCode("");
      })
      .catch((err) => console.error("Error registering item:", err));
  };

  return (
    <div className="item-register-container">
      {/* NAVBAR */}
      <div className="navbar">
        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className="item-register-title">Item Register</div>
        <div className="nav-title">Company Name</div>
      </div>

      {/* NAVBAR DROPDOWN */}
      {menuOpen && (
        <div ref={dropdownRef} className="ir-dropdown">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="ir-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              <span className="ir-nav-link-icon">{item.icon}</span>
              <span className="ir-nav-link-text">{item.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* FORM SECTION */}
      <form className="item-register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          >
            <option value="">Select Unit</option>
            {unitList.map((u, index) => (
              <option key={index} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Item Code</label>
          <input
            type="text"
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categoryList.map((c, index) => (
              <option key={index} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Reorder Quantity</label>
          <input
            type="number"
            value={reorderQty}
            onChange={(e) => setReorderQty(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Moving Limit</label>
          <input
            type="number"
            value={movingLimit}
            onChange={(e) => setMovingLimit(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>QR Code</label>
          <input
            type="text"
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
}
