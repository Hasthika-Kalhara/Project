import { useState, useEffect, useRef } from "react";
import "./UserRegister.css";

export default function UserRegister() {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [contactId, setContactId] = useState("");
  const [contactNoHome, setContactNoHome] = useState("");
  const [birthday, setBirthday] = useState("");
  const [userSelector, setUserSelector] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [userTypeList, setUserTypeList] = useState([]);

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

  // Fetch users and user types from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setUsers([]));

    fetch("http://localhost:5000/api/user-types")
      .then((res) => res.json())
      .then((data) => setUserTypeList(data))
      .catch(() => setUserTypeList([]));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      name,
      userId,
      contactId,
      contactNoHome,
      birthday,
      userSelector,
      address,
      username,
      password,
    };

    // Send data to backend
    fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("User registered successfully!");
        setUsers([...users, data]);
        setName("");
        setUserId("");
        setContactId("");
        setContactNoHome("");
        setBirthday("");
        setUserSelector("");
        setAddress("");
        setUsername("");
        setPassword("");
      })
      .catch((err) => console.error("Error registering user:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          setUsers(users.filter((user) => user.id !== id));
          alert("User deleted successfully!");
        })
        .catch((err) => console.error("Error deleting user:", err));
    }
  };

  return (
    <div className="user-register-container">
      {/* NAVBAR */}
      <div className="navbar">
        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className="user-register-title">User Register</div>
        <div className="nav-title">Company Name</div>
      </div>

      {/* NAVBAR DROPDOWN */}
      {menuOpen && (
        <div ref={dropdownRef} className="ur-dropdown">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="ur-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              <span className="ur-nav-link-icon">{item.icon}</span>
              <span className="ur-nav-link-text">{item.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* FORM SECTION */}
      <form className="user-register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact ID</label>
          <input
            type="text"
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact No Home</label>
          <input
            type="tel"
            value={contactNoHome}
            onChange={(e) => setContactNoHome(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Birthday</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>User Selector</label>
          <select
            value={userSelector}
            onChange={(e) => setUserSelector(e.target.value)}
            required
          >
            <option value="">Select User Type</option>
            {userTypeList.map((type, index) => (
              <option key={index} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>User Name</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>

      {/* EDIT USER TABLE */}
      <div className="ur-table-container">
        <h2>Edit User</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>User ID</th>
              <th>Contact ID</th>
              <th>Contact No Home</th>
              <th>Birthday</th>
              <th>User Type</th>
              <th>Address</th>
              <th>User Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id || index}>
                  <td>{user.name}</td>
                  <td>{user.userId}</td>
                  <td>{user.contactId}</td>
                  <td>{user.contactNoHome}</td>
                  <td>{user.birthday}</td>
                  <td>{user.userSelector}</td>
                  <td>{user.address}</td>
                  <td>{user.username}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  No users registered yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}