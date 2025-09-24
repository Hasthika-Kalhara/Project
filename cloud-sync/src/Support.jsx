import { useEffect, useState } from 'react';
import './Support.css';

export default function Support() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]); // store file previews

  // SUPPORT TICKET FETCH
  useEffect(() => {
    fetch('https://your-backend.com/api/ticket')
      .then(response => response.json())
      .then(data => setTicketNumber(data.ticketNumber))
      .catch(error => setTicketNumber('Error fetching ticket'));
  }, []);

  // Handle file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const filePreviews = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    setSelectedFiles(filePreviews);
  };

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
          <select id="country" name="country" className="country-select">
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
          <select id="phone-code" name="phone-code" className="country-select">
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

        {/* EMAIL SECTION */}
        <div className="email-section">
          <label htmlFor="email" className="email-label">
            Email:
          </label>
          <input
            type="text"
            id="email"
            className="email-input"
            placeholder="Enter email"
          />
        </div>

        {/* DETAIL SECTION */}
        <div className="details-section">
          <label htmlFor="details" className="details-label">
            Please detail<br />your issue:
          </label>
          <textarea
            id="details"
            className="detail-textarea"
            placeholder="Enter your message here..."
            rows="5"
          ></textarea>
        </div>

        {/* ATTACH IMAGE SECTION */}
        <div className="attach-section">
          <label htmlFor="attach-image" className="attach-label">
            Attach images (if any):
          </label>
          <input
            type="file"
            id="attach-image"
            className="filename"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {/* IMAGE PREVIEW */}
        <div className="image-preview">
          {selectedFiles.map((file, index) => (
            <img
              key={index}
              src={file.url}
              alt={file.name}
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                borderRadius: '5px',
                margin: '10px 10px 0 70px'
              }}
            />
          ))}
        </div>
        <div className="button-section">
          <button type="submit">Submit</button>
        </div>
      </div>

      {/* SUPPORT TICKET */}
      <div className="support-ticket">
        <h3>Ticket No: {ticketNumber}</h3>
      </div>
    </>
  );
}
