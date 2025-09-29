import { useState, useEffect, useRef } from "react";
import "./SalesReport.css";

export default function SalesReport() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);

  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [paymentType, setPaymentType] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch customers from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  // Fetch sales data whenever filters change
  useEffect(() => {
    if (!dateRange.from || !dateRange.to) return;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      from: dateRange.from,
      to: dateRange.to,
      paymentType: paymentType,
      customer: selectedCustomer,
      search: searchQuery,
    });

    fetch(`http://localhost:5000/api/sales?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sales data");
        return res.json();
      })
      .then((data) => {
        setSalesData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [dateRange, paymentType, selectedCustomer, searchQuery]);

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
    <div className="sr-container">
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
        <h2 className="sr-title">Sales Report</h2>
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
      <div className="sales-content">
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

          <select
            className="payment-type"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            <option value="">All Payments</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank">Bank Transfer</option>
            <option value="credit">Credit</option>
          </select>

          <select
            className="payment-type"
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

        {/* Sales Table */}
        <div className="sales-table-container">
          {loading && <p>Loading sales data...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && salesData.length === 0 && (
            <p>No sales data for the selected filters.</p>
          )}
          {!loading && !error && salesData.length > 0 && (
            <table className="sales-table">
              <thead>
                <tr>
                  <th>s/NO</th>
                  <th>Invoice NO</th>
                  <th>Customer Name</th>
                  <th>Time</th>
                  <th>Invoice Amount</th>
                  <th>Invoice Discount</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale, index) => (
                  <tr key={index}>
                    <td>{sale.no}</td>
                    <td>{sale.invoice}</td>
                    <td>{sale.customer}</td>
                    <td>{sale.time}</td>
                    <td>{sale.amount}</td>
                    <td>{sale.discount}</td>
                    <td>{sale.total}</td>
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
