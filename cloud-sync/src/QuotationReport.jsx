import { useState, useEffect, useRef } from "react";
import "./QuotationReport.css";

export default function QuotationReport() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);

  const [date, setDate] = useState("");
  const [quotationNumber, setQuotationNumber] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [quotationData, setQuotationData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch customers
  useEffect(() => {
    fetch("http://localhost:5000/api/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  // Fetch quotation data
  const fetchQuotationReport = () => {
    setLoading(true);
    const params = new URLSearchParams({
      date,
      quotationNumber,
      customer: selectedCustomer,
      search: searchQuery,
    });
    fetch(`http://localhost:5000/api/quotations?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setQuotationData(data))
      .catch((err) => console.error("Error fetching quotations:", err))
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
    <div className="quotation-container">
      {/* Navbar */}
      <div className="navbar">
        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <h2 className="report-title">Quotation Report</h2>
        <h2 className="nav-title">Company Name</h2>
      </div>

      {/* Dropdown */}
      {menuOpen && (
        <div ref={dropdownRef} className="q-dropdown">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="q-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              <span className="q-nav-link-icon">{item.icon}</span>
              <span className="q-nav-link-text">{item.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="quotation-filters">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-picker"
        />

        <input
          type="text"
          placeholder="Quotation Number"
          className="quotation-input"
          value={quotationNumber}
          onChange={(e) => setQuotationNumber(e.target.value)}
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

      {/* Table */}
      <div className="quotation-table-container">
        {loading ? (
          <p>Loading quotations...</p>
        ) : (
          <table className="quotation-table">
            <thead>
              <tr>
                <th>S/NO</th>
                <th>Quotation No</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {quotationData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No quotations found.
                  </td>
                </tr>
              ) : (
                quotationData.map((q, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{q.quotationNumber}</td>
                    <td>{q.customerName}</td>
                    <td>{q.date}</td>
                    <td>{q.total}</td>
                    <td>
                      <button 
                        className="view-btn"
                        onClick={() => alert(`Viewing quotation: ${q.quotationNumber}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}