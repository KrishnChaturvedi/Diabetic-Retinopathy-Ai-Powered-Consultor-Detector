import React from 'react';
import './Contact.css';

export default function Contact() {
  return (
    <div className="page-card contact-page">
      <div className="page-body">
        <h2>Contact Us</h2>
        <p>
          For queries, collaboration, or feedback please reach out to:
        </p>

        <ul>
          <li>Email: <a href="mailto:info@retinopathy.local">info@retinopathy.local</a></li>
          <li>Team: MAIT · HackXTract 2026</li>
        </ul>

        <h3>Report an issue</h3>
        <p>If you find problems with the app or camera capture, send details and screenshots to the email above.</p>
      </div>
    </div>
  );
}
