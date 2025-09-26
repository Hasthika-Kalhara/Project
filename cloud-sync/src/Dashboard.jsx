import { useState, useEffect, useRef } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target) &&
          !hamburgerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setMenuOpen(false);
    }
    if (event.key === 'Enter' || event.key === ' ') {
      setMenuOpen(!menuOpen);
    }
  };

  const menuItems = [
    { icon: '👤', label: 'Accounts', href: '/accounts' },
    { icon: '💰', label: 'Costing and Inventory', href: '/costing-inventory' },
    { icon: '👨', label: 'Customer Related', href: '/customers' },
    { icon: '🗒️', label: 'Invoice and Billing', href: '/invoicing' },
    { icon: '🛒', label: 'Inventory Management', href: '/inventory' },
    { icon: '📋', label: 'Item Related', href: '/items' },
    { icon: '🛠️', label: 'Maintenance', href: '/maintenance' },
    { icon: '📝', label: 'Reports', href: '/reports' }
  ];

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          onKeyDown={handleKeyDown}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="dropdown-menu"
        >
          ☰
        </button>

        <h2 className="nav-title">Company Name</h2>
      </div>

      {menuOpen && (
        <div 
          ref={dropdownRef}
          className="dropdown"
          id="dropdown-menu"
          role="menu"
          aria-label="Navigation menu"
        >
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="nav-link"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span className="nav-link-text">{item.label}</span>
            </a>
          ))}
        </div>
      )}

      <div className="main-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome to Your Dashboard</h1>
          <p className="welcome-subtitle">
            Manage all aspects of your business from one central location. 
            Use the navigation menu to access different sections of your system.
          </p>
        </div>

        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-label">Active Accounts</div>
            <div className="stat-value">1,247</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🗒️</div>
            <div className="stat-label">Pending Invoices</div>
            <div className="stat-value">23</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-label">Inventory Items</div>
            <div className="stat-value">5,681</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-label">Monthly Revenue</div>
            <div className="stat-value">$45.2K</div>
          </div>
        </div>
      </div>
    </div>
  );
}