import { useState, useEffect, useRef } from 'react';
import './SalesReport.css';

export default function SalesReport()
{
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
        <div className="sr-container">
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

            <div className="sales-content">
                
            </div>
        </div>
    )
}