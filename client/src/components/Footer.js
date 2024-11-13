import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Common/Footer.css';

const Footer = () => {
  const usertype = sessionStorage.getItem('userType'); // Get the user type from sessionStorage
  const isAdmin = usertype === "admin";

  return (
    <div className="Footer">
      {/* Render the main footer content only for customers */}
      {!isAdmin && (
        <>
          <h4>@ShopEZ : Unwrap Your Style with Every Click!</h4>
          <div className="footer-body">
            {/* Customer Service Section */}
            <div className="footer-section">
              <h5>Customer Service</h5>
              <ul>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/returns">Returns</Link></li>
                <li><Link to="/shipping">Shipping Info</Link></li>
              </ul>
            </div>

            {/* Navigation Links */}
            <div className="footer-section">
              <h5>Quick Links</h5>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/category">Categories</Link></li>
                <li><Link to="/">All Products</Link></li>
              </ul>
            </div>

            {/* Social Media Links */}
            <div className="footer-section">
              <h5>Follow Us</h5>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="footer-section">
              <h5>Newsletter</h5>
              <p>Stay updated with our latest offers!</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Your email" />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Footer bottom with dynamic copyright text based on user type */}
      <div className="footer-bottom">
        <p>{isAdmin ? '@ Admin - ShopEZ.com - All rights reserved' : '@ ShopEZ.com - All rights reserved'}</p>
      </div>
    </div>
  );
}

export default Footer;
