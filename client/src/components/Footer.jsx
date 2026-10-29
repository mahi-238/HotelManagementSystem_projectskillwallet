import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHotel, FaShieldAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-section mt-auto">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h4 className="footer-brand mb-3">RoomsForUse</h4>
            <p className="text-muted">
              Experience unparalleled hospitality and comfort. Browse luxury suites, standard rooms, and book your unforgettable stay with real-time reservation guarantees.
            </p>
            <div className="d-flex align-items-center gap-2 text-muted mt-3">
              <FaShieldAlt className="text-primary" /> Verified & Secure Online Booking
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/rooms">All Rooms</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="footer-heading">Room Categories</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/rooms?type=delux">Deluxe Rooms</Link></li>
              <li><Link to="/rooms?type=ordinary">Standard Rooms</Link></li>
              <li><Link to="/rooms?type=suite">Presidential Suites</Link></li>
              <li><Link to="/rooms?type=family">Family Suites</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="footer-heading">Contact & Support</h6>
            <ul className="list-unstyled contact-info">
              <li className="d-flex align-items-center gap-2 mb-2">
                <FaMapMarkerAlt className="text-secondary" /> 104 Grand Boulevard, City Center
              </li>
              <li className="d-flex align-items-center gap-2 mb-2">
                <FaPhoneAlt className="text-secondary" /> +91 97049 27807 / 98765 43210
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaEnvelope className="text-secondary" /> contact@roomsforuse.com
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-25" />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
          <p className="mb-0">© {new Date().getFullYear()} RoomsForUse / SB Hotel. All rights reserved.</p>
          <div className="d-flex gap-3">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Guest Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;