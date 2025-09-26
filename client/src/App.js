// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Home Component
import Home from './components/home/Home';

// User Components
import UserProfile from './components/user/UserProfile';
import Dashboard from './components/dashboard/Dashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';

// Admin Components
import EventManagement from './components/admin/EventManagement';
import VolunteerMatching from './components/admin/VolunteerMatching';

// Common Components
// Note: Do not render NotificationSystem here (no default export / provider handles toasts)
// import NotificationSystem from './components/common/NotificationSystem';

import VolunteerHistory from './components/volunteer/VolunteerHistory';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Mock API
import { mockAuthApi } from './utils/mockApi';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const data = await mockAuthApi.verify();
          if (data.user) {
            setIsAuthenticated(true);
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error('Auth error:', err);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} user={user} logout={logout} />

        <div className="main-content">
          <Routes>
            {/* Home route: landing for guests, dashboards for logged-in users */}
            <Route
              path="/"
              element={
                !isAuthenticated
                  ? <Home />
                  : user?.role === 'admin'
                    ? <AdminDashboard user={user} />
                    : <Dashboard user={user} />
              }
            />

            <Route path="/login" element={<Login login={login} isAuthenticated={isAuthenticated} />} />
            <Route path="/register" element={<Register login={login} isAuthenticated={isAuthenticated} />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <UserProfile user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/history"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <VolunteerHistory user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={user?.role === 'admin'}>
                  <AdminDashboard user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/events"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={user?.role === 'admin'}>
                  <EventManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/matching"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={user?.role === 'admin'}>
                  <VolunteerMatching />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
