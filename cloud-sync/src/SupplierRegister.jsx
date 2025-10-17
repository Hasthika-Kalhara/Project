import { useState, useEffect, useRef } from "react";
import "./SupplierRegister.css";

export default function SupplierRegister() {
  const [supplierName, setSupplierName] = useState("");
  const [supplierCode, setSupplierCode] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [fax, setFax] = useState("");
  const [email, setEmail] = useState("");
  const [suppliers, setSuppliers] = useState([]);

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

  // Fetch suppliers from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/suppliers")
      .then((res) => res.json())
      .then((data) => setSuppliers(data))
      .catch(() => setSuppliers([]));
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
    const newSupplier = {
      supplierName,
      supplierCode,
      contactPerson,
      telephone,
      address,
      fax,
      email,
    };

    // Send data to backend
    fetch("http://localhost:5000/api/suppliers/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSupplier),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Supplier registered successfully!");
        setSuppliers([...suppliers, data]);
        setSupplierName("");
        setSupplierCode("");
        setContactPerson("");
        setTelephone("");
        setAddress("");
        setFax("");
        setEmail("");
      })
      .catch((err) => console.error("Error registering supplier:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      fetch(`http://localhost:5000/api/suppliers/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
          alert("Supplier deleted successfully!");
        })
        .catch((err) => console.error("Error deleting supplier:", err));
    }
  };

  return (
    <div className="supplier-register-container">
      {/* NAVBAR */}
      <div className="navbar">
        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className="supplier-register-title">Supplier Register</div>
        <div className="nav-title">Company Name</div>
      </div>

      {/* NAVBAR DROPDOWN */}
      {menuOpen && (
        <div ref={dropdownRef} className="sup-dropdown">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="sup-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              <span className="sup-nav-link-icon">{item.icon}</span>
              <span className="sup-nav-link-text">{item.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* FORM SECTION */}
      <form className="supplier-register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Supplier Name</label>
          <input
            type="text"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Supplier Code</label>
          <input
            type="text"
            value={supplierCode}
            onChange={(e) => setSupplierCode(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Person</label>
          <input
            type="text"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Telephone</label>
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Fax</label>
          <input
            type="text"
            value={fax}
            onChange={(e) => setFax(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>

      {/* SUPPLIERS TABLE */}
      <div className="sup-table-container">
        <h2>Registered Suppliers</h2>
        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Supplier Code</th>
              <th>Contact Person</th>
              <th>Telephone</th>
              <th>Address</th>
              <th>Fax</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier, index) => (
                <tr key={supplier.id || index}>
                  <td>{supplier.supplierName}</td>
                  <td>{supplier.supplierCode}</td>
                  <td>{supplier.contactPerson}</td>
                  <td>{supplier.telephone}</td>
                  <td>{supplier.address}</td>
                  <td>{supplier.fax || "N/A"}</td>
                  <td>{supplier.email}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(supplier.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No suppliers registered yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}