import { useState, useEffect, useRef } from "react";
import "./UserPermission.css";

export default function UserPermission() {
  const [selectedUser, setSelectedUser] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState([]);

  // Main modules permissions
  const [invoiceAndBilling, setInvoiceAndBilling] = useState(false);
  const [report, setReport] = useState(false);
  const [itemRelated, setItemRelated] = useState(false);
  const [supplierRelated, setSupplierRelated] = useState(false);
  const [customerRelated, setCustomerRelated] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  // Invoice and Billing sub-permissions
  const [billingNormalPos, setBillingNormalPos] = useState(false);
  const [quotationInvoice, setQuotationInvoice] = useState(false);
  const [debtorInvoice, setDebtorInvoice] = useState(false);
  const [creditorInvoice, setCreditorInvoice] = useState(false);

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

  // Fetch users from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUserList(data))
      .catch(() => setUserList([]));
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

  // Load permissions when user is selected
  useEffect(() => {
    if (selectedUser) {
      fetch(`http://localhost:5000/api/permissions/${selectedUser}`)
        .then((res) => res.json())
        .then((data) => {
          // Set main permissions
          setInvoiceAndBilling(data.invoiceAndBilling || false);
          setReport(data.report || false);
          setItemRelated(data.itemRelated || false);
          setSupplierRelated(data.supplierRelated || false);
          setCustomerRelated(data.customerRelated || false);
          setMaintenance(data.maintenance || false);
          
          // Set sub-permissions
          setBillingNormalPos(data.billingNormalPos || false);
          setQuotationInvoice(data.quotationInvoice || false);
          setDebtorInvoice(data.debtorInvoice || false);
          setCreditorInvoice(data.creditorInvoice || false);
        })
        .catch(() => console.log("No permissions found for this user"));
    }
  }, [selectedUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const permissionsData = {
      userId: selectedUser,
      mainModules: {
        invoiceAndBilling,
        report,
        itemRelated,
        supplierRelated,
        customerRelated,
        maintenance,
      },
      invoiceAndBillingSubModules: {
        billingNormalPos,
        quotationInvoice,
        debtorInvoice,
        creditorInvoice,
      },
    };

    // Send data to backend
    fetch("http://localhost:5000/api/permissions/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(permissionsData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("User permissions updated successfully!");
      })
      .catch((err) => console.error("Error updating permissions:", err));
  };

  return (
    <div className="user-permission-container">
      {/* NAVBAR */}
      <div className="navbar">
        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className="user-permission-title">User Permission</div>
        <div className="nav-title">Company Name</div>
      </div>

      {/* NAVBAR DROPDOWN */}
      {menuOpen && (
        <div ref={dropdownRef} className="up-dropdown">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="up-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              <span className="up-nav-link-icon">{item.icon}</span>
              <span className="up-nav-link-text">{item.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* FORM SECTION */}
      <form className="user-permission-form" onSubmit={handleSubmit}>
        {/* User Selection Section */}
        <div className="selection-section">
          <div className="form-group">
            <label>User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Select User</option>
              {userList.map((user, index) => (
                <option key={index} value={user.id}>
                  {user.name} ({user.username})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search permissions..."
            />
          </div>
        </div>

        {/* Main Modules Permissions */}
        <div className="permissions-section">
          <h3>Main Modules</h3>
          <div className="checkbox-list">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={invoiceAndBilling}
                onChange={(e) => setInvoiceAndBilling(e.target.checked)}
              />
              <span>Invoice and Billing</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={report}
                onChange={(e) => setReport(e.target.checked)}
              />
              <span>Report</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={itemRelated}
                onChange={(e) => setItemRelated(e.target.checked)}
              />
              <span>Item Related</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={supplierRelated}
                onChange={(e) => setSupplierRelated(e.target.checked)}
              />
              <span>Supplier Related</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={customerRelated}
                onChange={(e) => setCustomerRelated(e.target.checked)}
              />
              <span>Customer Related</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={maintenance}
                onChange={(e) => setMaintenance(e.target.checked)}
              />
              <span>Maintenance</span>
            </label>
          </div>
        </div>

        {/* Invoice and Billing Sub-Permissions */}
        <div className="permissions-section">
          <h3>Invoice and Billing</h3>
          <div className="checkbox-list">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={billingNormalPos}
                onChange={(e) => setBillingNormalPos(e.target.checked)}
              />
              <span>Billing (Normal POS)</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={quotationInvoice}
                onChange={(e) => setQuotationInvoice(e.target.checked)}
              />
              <span>Quotation Invoice</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={debtorInvoice}
                onChange={(e) => setDebtorInvoice(e.target.checked)}
              />
              <span>Debtor Invoice</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={creditorInvoice}
                onChange={(e) => setCreditorInvoice(e.target.checked)}
              />
              <span>Creditor Invoice</span>
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Save Permissions
        </button>
      </form>
    </div>
  );
}