// src/components/ContactUsPage/ContactUsPage.js
import React from "react";
// import "./ContactUsPage.css";

const ContactUsPage = () => {
  return (
    <div className="contact-us-page">
      <h1>Contact Us</h1>
      <p>
        If you have any questions or need assistance, feel free to contact us:
      </p>

      <div className="contact-info">
        <h2>Contact Information</h2>
        <ul>
          <li>
            <strong>Phone:</strong> +91 9763224602
          </li>
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@kumbhtsmonitoring.com">
              support@kumbhtsmonitoring.com
            </a>
          </li>
          <li>
            <strong>Address:</strong>
            Kumbh Mela Adhikari, Triveni Bhawan, Prayagraj, Uttar Pradesh
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactUsPage;
