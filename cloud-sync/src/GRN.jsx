import { useState, useEffect, useRef } from "react";
import "./GRN.css";

export default function GRN() {
  const [grnNumber, setGrnNumber] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [goodsReceivedDate, setGoodsReceivedDate] = useState("");
  const [subTotal, setSubTotal] = useState("");
  const [discount, setDiscount] = useState("");
  const [grnTotal, setGrnTotal] = useState("");
  const [items, setItems] = useState([]);

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

  // Calculate GRN Total whenever subtotal or discount changes
  useEffect(() => {
    const sub = parseFloat(subTotal) || 0;
    const disc = parseFloat(discount) || 0;
    const total = sub - disc;
    setGrnTotal(total.toFixed(2));
  }, [subTotal, discount]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { itemName: "", quantity: "", unitPrice: "", total: "" },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    // Calculate total for the row
    if (field === "quantity" || field === "unitPrice") {
      const qty = parseFloat(updatedItems[index].quantity) || 0;
      const price = parseFloat(updatedItems[index].unitPrice) || 0;
      updatedItems[index].total = (qty * price).toFixed(2);
    }

    setItems(updatedItems);

    // Calculate subtotal
    const newSubTotal = updatedItems.reduce((sum, item) => {
      return sum + (parseFloat(item.total) || 0);
    }, 0);
    setSubTotal(newSubTotal.toFixed(2));
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);

    // Recalculate subtotal
    const newSubTotal = updatedItems.reduce((sum, item) => {
      return sum + (parseFloat(item.total) || 0);
    }, 0);
    setSubTotal(newSubTotal.toFixed(2));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const grnData = {
      grnNumber,
      supplierName,
      invoiceNo,
      invoiceDate,
      goodsReceivedDate,
      items,
      subTotal,
      discount,
      grnTotal,
    };

    // Send data to backend
    fetch("http://localhost:5000/api/grn/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(grnData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("GRN registered successfully!");
        // Reset form
        setGrnNumber("");
        setSupplierName("");
        setInvoiceNo("");
        setInvoiceDate("");
        setGoodsReceivedDate("");
        setSubTotal("");
        setDiscount("");
        setGrnTotal("");
        setItems([]);
      })
      .catch((err) => console.error("Error registering GRN:", err));
  };

  return (
    <div className="grn-container">
      {/* NAVBAR */}
      <div className="navbar">
        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className="grn-title">GRN</div>
        <div className="nav-title">Company Name</div>
      </div>

      {/* NAVBAR DROPDOWN */}
      {menuOpen && (
        <div ref={dropdownRef} className="grn-dropdown">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="grn-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              <span className="grn-nav-link-icon">{item.icon}</span>
              <span className="grn-nav-link-text">{item.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* FORM SECTION */}
      <form className="grn-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <div className="form-group">
            <label>GRN Number</label>
            <input
              type="text"
              value={grnNumber}
              onChange={(e) => setGrnNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Supplier Name</label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Invoice No</label>
            <input
              type="text"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Invoice Date</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Goods Received Date</label>
            <input
              type="date"
              value={goodsReceivedDate}
              onChange={(e) => setGoodsReceivedDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="table-section">
          <div className="table-header">
            <h3>Items</h3>
            <button
              type="button"
              className="add-item-btn"
              onClick={handleAddItem}
            >
              + Add Item
            </button>
          </div>

          <table className="items-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) =>
                          handleItemChange(index, "itemName", e.target.value)
                        }
                        placeholder="Enter item name"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        placeholder="0"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(index, "unitPrice", e.target.value)
                        }
                        placeholder="0.00"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.total}
                        readOnly
                        className="readonly-input"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDeleteItem(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No items added. Click "Add Item" to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TOTALS SECTION */}
        <div className="totals-section">
          <div className="form-group">
            <label>Sub Total</label>
            <input
              type="text"
              value={subTotal}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label>Discount</label>
            <input
              type="number"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>GRN Total</label>
            <input
              type="text"
              value={grnTotal}
              readOnly
              className="readonly-input"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Submit GRN
        </button>
      </form>
    </div>
  );
}