import { useState, useEffect, useRef } from "react";
import "./AttendsReport.css";

export default function AttendsReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [attendData, setAttendData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Fetch attendance report data
  const fetchReport = () => {
    setLoading(true);
    fetch(
      `http://localhost:5000/api/attends-report?from=${fromDate}&to=${toDate}&employee=${employeeName}&search=${searchQuery}`
    )
      .then((res) => res.json())
      .then((data) => setAttendData(data))
      .catch((err) => console.error("Error fetching attends report:", err))
      .finally(() => setLoading(false));
  };

  // Fetch employee names from backend
  const fetchEmployees = () => {
    fetch("http://localhost:5000/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployeeList(data))
      .catch((err) => console.error("Error fetching employees:", err));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Automatically fetch report when filters change
  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchReport();
    }, 400);
    return () => clearTimeout(debounceFetch);
  }, [fromDate, toDate, employeeName, searchQuery]);

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

  // 🧮 Calculate totals
  const totalCheckOut = attendData.reduce(
    (sum, item) => sum + (parseFloat(item.checkOut) || 0),
    0
  );
  const totalWorkingHours = attendData.reduce(
    (sum, item) => sum + (parseFloat(item.workedHours) || 0),
    0
  );
  const totalWorkingDays = attendData.reduce(
    (sum, item) => sum + (parseFloat(item.workedDays) || 0),
    0
  );

  return (
    <div className="attends-report-container">
      {/* NAVBAR */}
      <div className="navbar">
        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className="attends-title">Attends Report</div>
        <div className="nav-title">Company Name</div>
      </div>

      {/* NAVBAR DROPDOWN */}
      {menuOpen && (
        <div ref={dropdownRef} className="attend-dropdown">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="attend-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              <span className="attend-nav-link-icon">{item.icon}</span>
              <span className="attend-nav-link-text">{item.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* FILTER SECTION */}
      <div className="report-filters">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="date-input"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="date-input"
        />
        <select
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          className="employee-select"
        >
          <option value="">All Employees</option>
          {employeeList.map((emp, index) => (
            <option key={index} value={emp.name}>
              {emp.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* TABLE SECTION */}
      <div className="report-table-container">
        {loading ? (
          <p>Loading...</p>
        ) : attendData.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>s/NO</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Working Days</th>
              </tr>
            </thead>
            <tbody>
              {attendData.map((row, index) => (
                <tr key={index}>
                  <td>{row.sNo}</td>
                  <td>{row.employeeName}</td>
                  <td>{row.date}</td>
                  <td>{row.checkIn}</td>
                  <td>{row.checkOut}</td>
                  <td>{row.workedHours}</td>
                  <td>{row.workedDays}</td>
                </tr>
              ))}
            </tbody>

            {/* ✅ TOTAL ROW */}
            <tfoot>
              <tr className="total-row">
                <td colSpan="4" style={{ textAlign: "right", fontWeight: "600" }}>
                  Total:
                </td>
                <td>{totalCheckOut.toFixed(2)}</td>
                <td>{totalWorkingHours.toFixed(2)}</td>
                <td>{totalWorkingDays.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
