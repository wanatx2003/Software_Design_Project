// AdminDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

// If you keep these mock APIs, we can still call them when USE_MOCK=false
import { mockEventsApi, mockVolunteersApi, mockMatchesApi  } from '../../utils/mockApi';
// You also generated mockData; we’ll use it directly when USE_MOCK=true
import { mockData } from '../../utils/mockData';


// ✅ Use mocks by default; flip to false when real APIs are ready
const USE_MOCK = true;

// -------- helpers: normalize shapes so the UI can assume {_id, name, ...} --------
const normEvent = (e) => ({
  _id: e._id ?? e.id ?? String(Math.random()),
  name: e.name ?? e.title ?? 'Untitled Event',
  date: e.date ?? null,
  urgency: e.urgency ?? 'low',
  description: e.description ?? '',
});
const normMatch = (m) => ({
  _id: m._id ?? m.id ?? String(Math.random()),
  volunteerId: m.volunteerId,
  eventId: m.eventId,
  status: m.status ?? 'pending',
});
const normVolunteer = (v) => ({
  _id: v._id ?? v.id ?? String(Math.random()),
  fullName: v.fullName ?? v.name ?? 'Unnamed Volunteer',
  email: v.email ?? '',
});

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalVolunteers: 0,   // 👈 drives “Registered Volunteers”
    pendingMatches: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [pendingMatches, setPendingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      let events = [];
      let volunteers = [];
      let matches = [];

      if (USE_MOCK) {
        // ---------- MOCK BRANCH ----------
        events = (mockData.events || []).map(normEvent);
        volunteers = (mockData.volunteers || []).map(normVolunteer);
        matches = (mockData.matches || []).map(normMatch);
      } else {
        // ---------- REAL API BRANCH (or your mockApi functions that hit a service) ----------
        const [eventsData, volunteersData, matchesData] = await Promise.all([
          // adapt to whatever functions your mockApi exposes in “real” mode
          mockEventsApi.getAllEvents?.() ?? mockEventsApi.list?.() ?? [],
          mockVolunteersApi.getAllVolunteers?.() ?? mockVolunteersApi.list?.() ?? [],
          mockMatchesApi.getAllMatches?.() ?? mockMatchesApi.list?.() ?? [],
        ]);
        events = (eventsData || []).map(normEvent);
        volunteers = (volunteersData || []).map(normVolunteer);
        matches = (matchesData || []).map(normMatch);
      }

      // ----- stats -----
      const nowMidnight = new Date(); nowMidnight.setHours(0,0,0,0);
      const upcoming = events
        .filter(e => e.date && !isNaN(new Date(e.date)) && new Date(e.date) >= nowMidnight)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const pending = matches.filter(m => m.status === 'pending');

      setStats({
        totalEvents: events.length,
        upcomingEvents: upcoming.length,
        totalVolunteers: volunteers.length,        // ✅ updates “Registered Volunteers”
        pendingMatches: pending.length,
      });

      setRecentEvents(upcoming.slice(0, 3));
      setPendingMatches(pending);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setStats({ totalEvents: 0, upcomingEvents: 0, totalVolunteers: 0, pendingMatches: 0 });
      setRecentEvents([]);
      setPendingMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-welcome">
        <h2>Welcome, {user?.firstName || 'Admin'}!</h2>
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
                  <p className="event-date">
                    {event.date ? new Date(event.date).toLocaleDateString() : '—'}
                  </p>
                  <p>{(event.description || '').slice(0, 80)}{(event.description || '').length > 80 ? '…' : ''}</p>
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
}
