import React from 'react';
import { Car } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container grid-cols-4 footer-grid">
        <div className="footer-brand">
          <div className="brand" style={{ marginBottom: '16px' }}>
            <Car size={32} color="var(--primary-color)" />
            <span className="brand-text">Spanny</span>
          </div>
          <p className="footer-desc">
            Your trusted partner for buying and selling premium quality used cars with complete peace of mind.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">IG</a>
            <a href="#" className="social-link">TW</a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Explore Cars</a></li>
            <li><a href="#">Sell Your Car</a></li>
            <li><a href="#">About Us</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Info</h4>
          <p>123 Auto Avenue, Tech Park</p>
          <p>Bangalore, Karnataka 560001</p>
          <p className="mt-2">support@spanny.com</p>
          <p>+91 98765 43210</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Spanny. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
