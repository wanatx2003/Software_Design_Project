import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Navbar = ({ isAuthenticated, user, logout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Software Design Project</Link>
      </div>
      
      <ul className="navbar-links">
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/history">Volunteer History</Link>
            </li>
            {/* Admin links */}
            {user?.role === 'admin' && (
              <>
                <li>
                  <Link to="/admin/events">Manage Events</Link>
                </li>
                <li>
                  <Link to="/admin/matching">Volunteer Matching</Link>
                </li>
              </>
            )}
            <li>
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
