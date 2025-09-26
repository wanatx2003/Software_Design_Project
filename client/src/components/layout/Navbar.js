// client/src/components/layout/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

import { NotificationBell } from '../common/NotificationSystem';

const Navbar = ({ isAuthenticated, user, logout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Volunteer Management System</Link>
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      <ul className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
        {isAuthenticated ? (
          <>
            {/* Common links for all users */}
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>

            {/* Volunteer specific links */}
            {user?.role === 'volunteer' && (
              <li>
                <Link to="/history">My Volunteer History</Link>
              </li>
            )}

            {/* Admin specific links */}
            {user?.role === 'admin' && (
              <li className="dropdown">
                <span className="dropdown-toggle">Admin</span>
                <div className="dropdown-menu">
                  <Link to="/admin/dashboard">Admin Dashboard</Link>
                  <Link to="/admin/events">Manage Events</Link>
                  <Link to="/admin/matching">Volunteer Matching</Link>
                </div>
              </li>
            )}

            {/* 🔔 Notification bell — EXACTLY here */}
            <li className="navbar-bell">
              <NotificationBell />
            </li>

            {/* User info and logout */}
            <li className="navbar-user-info">
              <span className="user-greeting">
                Hello, {user?.firstName || 'User'}
              </span>
              <button onClick={logout} className="logout-button">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
