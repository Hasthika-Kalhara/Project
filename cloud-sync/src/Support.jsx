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
        <div className="customer-section">
          <label htmlFor="customer-name" className="customer-label">Customer Name:</label>
        </div>
        <div className="dropdown-section">
          <select id="issue-type" name="issue-type">
            <option value="" disabled selected>Title</option>
            <option value="man">Mr</option>
            <option value="women">Ms</option>
          </select>
          <input type="text" id="customer-name" className="customer-input" />
          <input type="text" id="customer-name" className="customer-input" />
        </div>
      </div>
      <div className="support-ticket">
        <h3>Ticket No: {ticketNumber}</h3>
      </div>
    </>
  );
}