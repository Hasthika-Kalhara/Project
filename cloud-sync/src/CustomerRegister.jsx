import { useState, useEffect, useRef } from "react";
import "./CustomerRegister.css";

export default function CustomerRegister() {
  const [customerName, setCustomerName] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [fax, setFax] = useState("");
  const [email, setEmail] = useState("");
  const [customers, setCustomers] = useState([]);

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

  // Fetch customers from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch(() => setCustomers([]));
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
    const newCustomer = {
      customerName,
      customerCode,
      contactPerson,
      telephone,
      address,
      fax,
      email,
    };

    // Send data to backend
    fetch("http://localhost:5000/api/customers/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomer),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Customer registered successfully!");
        setCustomers([...customers, data]);
        setCustomerName("");
        setCustomerCode("");
        setContactPerson("");
        setTelephone("");
        setAddress("");
        setFax("");
        setEmail("");
      })
      .catch((err) => console.error("Error registering customer:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      fetch(`http://localhost:5000/api/customers/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          setCustomers(customers.filter((customer) => customer.id !== id));
          alert("Customer deleted successfully!");
        })
        .catch((err) => console.error("Error deleting customer:", err));
    }
  };

  return (
    <div className="customer-register-container">
      {/* NAVBAR */}
      <div className="navbar">
        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className="customer-register-title">Customer Register</div>
        <div className="nav-title">Company Name</div>
      </div>

      {/* NAVBAR DROPDOWN */}
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

      {/* FORM SECTION */}
      <form className="customer-register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Customer Code</label>
          <input
            type="text"
            value={customerCode}
            onChange={(e) => setCustomerCode(e.target.value)}
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

      {/* CUSTOMERS TABLE */}
      <div className="table-container">
        <h2>Registered Customers</h2>
        <table className="customers-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Customer Code</th>
              <th>Contact Person</th>
              <th>Telephone</th>
              <th>Address</th>
              <th>Fax</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer, index) => (
                <tr key={customer.id || index}>
                  <td>{customer.customerName}</td>
                  <td>{customer.customerCode}</td>
                  <td>{customer.contactPerson}</td>
                  <td>{customer.telephone}</td>
                  <td>{customer.address}</td>
                  <td>{customer.fax || "N/A"}</td>
                  <td>{customer.email}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No customers registered yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}