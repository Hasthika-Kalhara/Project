import { useEffect, useState } from 'react';
import './Support.css';

export default function Support() {
  const [ticketNumber, setTicketNumber] = useState('');

  // SUPPORT TICKET FETCH
  useEffect(() => {
    // Replace with your backend API endpoint
    fetch('https://your-backend.com/api/ticket')
      .then(response => response.json())
      .then(data => setTicketNumber(data.ticketNumber))
      .catch(error => setTicketNumber('Error fetching ticket'));
  }, []);

  return (
    <>
      <div className="support-square">
        <h1>Contact Us</h1>

        {/* CUSTOMER SECTION */}
        <div className="customer-section">
          <label htmlFor="customer-name" className="customer-label">
            Customer Name:
          </label>
          <select id="title" name="title" className="dropdown-select">
            <option value="" disabled selected>
              Title
            </option>
            <option value="man">Mr</option>
            <option value="woman">Ms</option>
          </select>
          <input
            type="text"
            id="first-name"
            placeholder="First Name"
            className="customer-input"
          />
          <input
            type="text"
            id="last-name"
            placeholder="Last Name"
            className="customer-input"
          />
        </div>

        {/* COMPANY SECTION */}
        <div className="company-section">
          <label htmlFor="company-name" className="company-label">
            Company Name:
          </label>
          <input
            type="text"
            id="company-name"
            className="company-input"
            placeholder="Enter company name"
          />
        </div>

        {/* COUNTRY SECTION */}
        <div className="country-section">
          <label htmlFor="country" className="country-label">
            Country:
          </label>
          <select id="title" name="title" className="country-select">
            <option value="" disabled selected>
              Select Country:
            </option>
            <option value="1">Sri Lanka</option>
            <option value="2">India</option>
          </select>
        </div>

        {/* PHONE NUMBER SECTION */}
        <div className="phone-section">
          <label htmlFor="phone-number" className="phone-label">
            Phone No:
          </label>
          <select id="title" name="title" className="country-select">
            <option value="" disabled selected>
              Country code
            </option>
            <option value="1">+94</option>
            <option value="2">+97</option>
          </select>
          <input
            type="text"
            id="phone-number"
            className="phone-input"
            placeholder="Enter phone number"
          />
        </div>
      </div>

      {/* SUPPORT TICKET */}
      <div className="support-ticket">
        <h3>Ticket No: {ticketNumber}</h3>
      </div>
    </>
  );
}
