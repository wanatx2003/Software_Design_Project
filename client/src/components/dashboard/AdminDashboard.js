import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { mockEventsApi, mockVolunteersApi, mockMatchesApi } from '../../utils/mockApi';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalVolunteers: 0,
    pendingMatches: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [pendingMatches, setPendingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch events
      const eventsData = await mockEventsApi.getAllEvents();
      
      // Fetch volunteers
      const volunteersData = await mockVolunteersApi.getAllVolunteers();
      
      // Fetch matches
      const matchesData = await mockMatchesApi.getAllMatches();
      
      // Calculate statistics
      const now = new Date();
      const upcoming = eventsData.filter(event => new Date(event.date) > now);
      const pending = matchesData.filter(match => match.status === 'pending');
      
      setStats({
        totalEvents: eventsData.length,
        upcomingEvents: upcoming.length,
        totalVolunteers: volunteersData.length,
        pendingMatches: pending.length
      });
      
      // Get recent events (upcoming and sorted by date)
      const sortedEvents = [...upcoming].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      ).slice(0, 3);
      setRecentEvents(sortedEvents);
      
      // Get pending matches
      setPendingMatches(pending);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-welcome">
        <h2>Welcome, {user.firstName}!</h2>
        <p>Administrator Dashboard</p>
      </div>
      
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalEvents}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.upcomingEvents}</div>
          <div className="stat-label">Upcoming Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalVolunteers}</div>
          <div className="stat-label">Registered Volunteers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pendingMatches}</div>
          <div className="stat-label">Pending Matches</div>
        </div>
      </div>
      
      <div className="admin-panels">
        <div className="admin-panel">
          <h3>Upcoming Events</h3>
          {recentEvents.length === 0 ? (
            <p>No upcoming events.</p>
          ) : (
            <div className="admin-panel-content">
              {recentEvents.map(event => (
                <div className="admin-panel-item" key={event._id}>
                  <div className="admin-panel-item-main">
                    <h4>{event.name}</h4>
                    <span className={`urgency-badge ${event.urgency}`}>
                      {event.urgency.charAt(0).toUpperCase() + event.urgency.slice(1)}
                    </span>
                  </div>
                  <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
                  <p>{event.description.substring(0, 80)}...</p>
                </div>
              ))}
              <Link to="/admin/events" className="admin-panel-link">Manage All Events →</Link>
            </div>
          )}
        </div>
        
        <div className="admin-panel">
          <h3>Pending Volunteer Matches</h3>
          {pendingMatches.length === 0 ? (
            <p>No pending matches.</p>
          ) : (
            <div className="admin-panel-content">
              {pendingMatches.map(match => (
                <div className="admin-panel-item" key={match._id}>
                  <p><strong>Volunteer ID:</strong> {match.volunteerId}</p>
                  <p><strong>Event ID:</strong> {match.eventId}</p>
                  <p><span className="status-badge pending">Pending</span></p>
                </div>
              ))}
              <Link to="/admin/matching" className="admin-panel-link">Manage Volunteer Matching →</Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="admin-quick-actions">
        <h3>Quick Actions</h3>
        <div className="admin-button-group">
          <Link to="/admin/events" className="admin-button">
            <i className="icon-event"></i> Create Event
          </Link>
          <Link to="/admin/matching" className="admin-button">
            <i className="icon-match"></i> Match Volunteers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
