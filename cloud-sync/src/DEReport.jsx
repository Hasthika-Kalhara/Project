import { useState, useEffect, useRef } from "react";
import "./DEReport.css";

export default function DEReport() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);

  const [date, setDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch day end sales data
  useEffect(() => {
    if (!date) return;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      date,
      search: searchQuery,
    });

    fetch(`http://localhost:5000/api/dayend?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch day end report");
        return res.json();
      })
      .then((data) => {
        setReportData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [date, searchQuery]);

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
    <div className="der-container">
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
        <h2 className="de-title">Day End Report</h2>
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
      <div className="der-content">
        {/* Filters */}
        <div className="date-range">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-picker"
          />

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
        <div className="der-table-container">
          {loading && <p>Loading day end report...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && reportData.length === 0 && (
            <p>No data found for the selected date.</p>
          )}
          {!loading && !error && reportData.length > 0 && (
            <table className="der-table">
              <thead>
                <tr>
                  <th>s/NO</th>
                  <th>User</th>
                  <th>Opening Balance</th>
                  <th>Day Start Time</th>
                  <th>Day End Time</th>
                  <th>Total Hours</th>
                  <th>Cash Out</th>
                  <th>Day End Amount</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{row.user}</td>
                    <td>{row.open}</td>
                    <td>{row.start}</td>
                    <td>{row.end}</td>
                    <td>{row.hours}</td>
                    <td>{row.cash}</td>
                    <td>{row.amount}</td>
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
