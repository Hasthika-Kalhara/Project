import { useState, useEffect, useRef } from "react";
import "./DebtorReport.css";

export default function DebtorReport() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);

  const [date, setDate] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debtorData, setDebtorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch customers from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  // Fetch debtor data whenever filters change
  useEffect(() => {
    if (!date) return;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      date,
      customer: selectedCustomer,
      search: searchQuery,
    });

    fetch(`http://localhost:5000/api/debtors?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch debtor data");
        return res.json();
      })
      .then((data) => {
        setDebtorData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [date, selectedCustomer, searchQuery]);

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
    <div className="debtor-container">
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
        <h2 className="deb-title">Debtor Report</h2>
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

      {/* Content */}
      <div className="debtor-content">
        {/* Filters */}
        <div className="date-range">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-picker"
          />

          <select
            className="customer-type"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">All Customers</option>
            {customers.map((cust, idx) => (
              <option key={idx} value={cust.name || cust}>
                {cust.name || cust}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="all-search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Debtor Table */}
        <div className="debtor-table-container">
          {loading && <p>Loading debtor data...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && debtorData.length === 0 && (
            <p>No debtor data for the selected filters.</p>
          )}
          {!loading && !error && debtorData.length > 0 && (
            <table className="debtor-table">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {debtorData.map((debtor, index) => (
                  <tr key={index}>
                    <td>{debtor.invoice}</td>
                    <td>{debtor.customer}</td>
                    <td>{debtor.date}</td>
                    <td>{debtor.amount}</td>
                    <td>{debtor.paid}</td>
                    <td>{debtor.balance}</td>
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
