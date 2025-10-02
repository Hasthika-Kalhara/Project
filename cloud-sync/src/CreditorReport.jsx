import { useState, useEffect, useRef } from "react";
import "./CreditorReport.css";

export default function CreditorReport() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);

  const [date, setDate] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [creditorData, setCreditorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch suppliers from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/suppliers")
      .then((res) => res.json())
      .then((data) => setSuppliers(data))
      .catch((err) => console.error("Error fetching suppliers:", err));
  }, []);

  // Fetch creditor data whenever filters change
  useEffect(() => {
    if (!date) return;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      date,
      supplier: selectedSupplier,
      search: searchQuery,
    });

    fetch(`http://localhost:5000/api/creditors?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch creditor data");
        return res.json();
      })
      .then((data) => {
        setCreditorData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [date, selectedSupplier, searchQuery]);

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
    <div className="creditor-container">
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
        <h2 className="cred-title">Creditor Report</h2>
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
      <div className="creditor-content">
        {/* Filters */}
        <div className="date-range">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-picker"
          />

          <select
            className="supplier-type"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
          >
            <option value="">All Suppliers</option>
            {suppliers.map((supp, idx) => (
              <option key={idx} value={supp.name || supp}>
                {supp.name || supp}
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

        {/* Creditor Table */}
        <div className="creditor-table-container">
          {loading && <p>Loading creditor data...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && creditorData.length === 0 && (
            <p>No creditor data for the selected filters.</p>
          )}
          {!loading && !error && creditorData.length > 0 && (
            <table className="creditor-table">
              <thead>
                <tr>
                  <th>S/No</th>
                  <th>Invoice No</th>
                  <th>Supplier Name</th>
                  <th>GRN Amount</th>
                  <th>Paid Amount</th>
                  <th>Due Amount</th>
                </tr>
              </thead>
              <tbody>
                {creditorData.map((creditor, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{creditor.invoice}</td>
                    <td>{creditor.supplier}</td>
                    <td>{creditor.grnAmount}</td>
                    <td>{creditor.paid}</td>
                    <td>{creditor.due}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" style={{ fontWeight: "bold" }}>Total</td>
                  <td style={{ fontWeight: "bold" }}>
                    {creditorData.reduce((sum, c) => sum + Number(c.paid || 0), 0)}
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {creditorData.reduce((sum, c) => sum + Number(c.due || 0), 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
