import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-main">
      <div className="footer-content">
        <div className="footer-logo">
          <img
            src="https://i.ibb.co/Z68NNkzK/hotel-logo-silhouette-hotel-icon-vector.jpg"
            alt="Hotel_M Logo"
            style={{ height: 38, borderRadius: 8, background: '#fff', padding: 2 }}
          />
          <span>Hotel_M</span>
        </div>
        <div className="footer-links">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="mailto:support@hotel_m.com">Contact</a>
          <a href="#">Privacy Policy</a>
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Hotel_M. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
