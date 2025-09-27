import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { mockEventsApi, mockMatchesApi } from '../../utils/mockApi';

const Dashboard = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [matchedEvents, setMatchedEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchMatches();
  }, [user]);

  const fetchEvents = async () => {
    try {
      const data = await mockEventsApi.getAllEvents();
      setEvents(data);
      
      // Filter for upcoming events
      const now = new Date();
      const upcoming = data.filter(event => new Date(event.date) > now);
      setUpcomingEvents(upcoming);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      if (user && user.id) {
        const data = await mockMatchesApi.getUserMatches(user.id);
        setMatchedEvents(data);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
    }
  };

  const handleVolunteerClick = async (eventId) => {
    try {
      if (user && user.id) {
        await mockMatchesApi.createMatch({
          volunteerId: user.id,
          eventId: eventId,
          status: 'pending'
        });
        
        // Refresh matched events
        fetchMatches();
        
        // Find the event name for the notification
        const event = events.find(e => e._id === eventId);
        
        // Display success notification
        const notificationEvent = document.createEvent('CustomEvent');
        notificationEvent.initCustomEvent('notification', true, true, {
          message: `You have successfully volunteered for ${event?.name || 'this event'}!`,
          type: 'success'
        });
        window.dispatchEvent(notificationEvent);

        // Add bell notification for event assignment
        const bellNotificationEvent = document.createEvent('CustomEvent');
        bellNotificationEvent.initCustomEvent('bellNotification', true, true, {
          message: `You have been matched to '${event?.name || 'Unknown Event'}' event`,
          type: 'assignment',
          eventName: event?.name || 'Unknown Event',
          eventId: eventId
        });
        window.dispatchEvent(bellNotificationEvent);
      }
    } catch (err) {
      console.error('Error volunteering:', err);
      // Display error notification
      const event = document.createEvent('CustomEvent');
      event.initCustomEvent('notification', true, true, {
        message: 'An error occurred. Please try again.',
        type: 'error'
      });
      window.dispatchEvent(event);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  // Check if user has completed profile
  const profileIncomplete = !(user?.profile?.fullName);
  const nameIncomplete = !user?.firstName || !user?.lastName;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.firstName || 'Volunteer'}</h2>
      
      {nameIncomplete && (
        <div className="profile-alert">
          <p>Please complete your profile with your first and last name.</p>
          <a href="/profile" className="profile-link">Complete Profile</a>
        </div>
      )}
      
      {profileIncomplete && (
        <div className="profile-alert">
          <p>Please complete your profile to volunteer for events.</p>
          <a href="/profile" className="profile-link">Complete Profile</a>
        </div>
      )}
      
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>Your Upcoming Events</h3>
          {matchedEvents.length === 0 ? (
            <p>You haven't signed up for any events yet.</p>
          ) : (
            <div className="events-grid">
              {matchedEvents.map(match => {
                const event = events.find(e => e._id === match.eventId);
                return event ? (
                  <div className="event-card" key={match._id}>
                    <div className="event-header">
                      <h4>{event.name}</h4>
                      <span className={`status-badge ${match.status}`}>
                        {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                      </span>
                    </div>
                    <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
                    <p className="event-location">{event.location}</p>
                    <p className="event-description">{event.description.substring(0, 100)}...</p>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
        
        <div className="dashboard-section">
          <h3>Available Volunteer Opportunities</h3>
          {upcomingEvents.length === 0 ? (
            <p>No upcoming events available.</p>
          ) : (
            <div className="events-grid">
              {upcomingEvents.map(event => {
                // Check if user already volunteered for this event
                const alreadyVolunteered = matchedEvents.some(match => match.eventId === event._id);
                
                return (
                  <div className="event-card" key={event._id}>
                    <div className="event-header">
                      <h4>{event.name}</h4>
                      <span className={`urgency-badge ${event.urgency}`}>
                        {event.urgency.charAt(0).toUpperCase() + event.urgency.slice(1)}
                      </span>
                    </div>
                    <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
                    <p className="event-location">{event.location}</p>
                    <div className="skills-container">
                      {event.requiredSkills.map(skill => (
                        <span key={skill} className="skill-badge">
                          {skill.charAt(0).toUpperCase() + skill.slice(1)}
                        </span>
                      ))}
                    </div>
                    <p className="event-description">{event.description.substring(0, 100)}...</p>
                    {!alreadyVolunteered ? (
                      <button 
                        onClick={() => handleVolunteerClick(event._id)} 
                        className="volunteer-button"
                        disabled={profileIncomplete}
                      >
                        Volunteer
                      </button>
                    ) : (
                      <button className="already-volunteered" disabled>
                        Already Volunteered
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
