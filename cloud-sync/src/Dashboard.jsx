import { useState } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="navbar">
        {/* Hamburger on the left */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        {/* Title on the right */}
        <h2 className="nav-title">Company Name</h2>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="dropdown">
          <a href="/dashboard" className="nav-link">👤 Accounts</a>
          <a href="/settings" className="nav-link">💰 Costing and Inventory</a>
          <a href="/profile" className="nav-link">👨 Customer Related</a>
          <a href="/logout" className="nav-link">🗒️ Invoice and Billing</a>
          <a href="/logout" className="nav-link">🛒 Inventory Management</a>
          <a href="/logout" className="nav-link">📋 Item Related</a>
          <a href="/logout" className="nav-link">🛠️ Meintenance</a>
          <a href="/logout" className="nav-link">📝 Report</a>
        </div>
      )}
    </>
  );
}
