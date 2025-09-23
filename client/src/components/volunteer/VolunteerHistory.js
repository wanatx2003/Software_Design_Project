import React, { useState, useEffect } from 'react';
import './VolunteerHistory.css';

const VolunteerHistory = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'upcoming'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch volunteer history
      const historyResponse = await fetch('/api/volunteer/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Fetch events for details
      const eventsResponse = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (historyResponse.ok && eventsResponse.ok) {
        const historyData = await historyResponse.json();
        const eventsData = await eventsResponse.json();
        
        setHistory(historyData);
        setEvents(eventsData);
      } else {
        console.error('Error fetching data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventDetails = (eventId) => {
    return events.find(event => event._id === eventId) || {};
  };

  const calculateVolunteerHours = (historyItem) => {
    // Calculate hours based on history item data
    // This is a placeholder - real calculation would depend on actual data structure
    return historyItem.hours || 'N/A';
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredHistory = history.filter(item => {
    const eventDate = new Date(getEventDetails(item.eventId)?.date);
    const now = new Date();
    
    if (filter === 'completed') {
      return eventDate < now;
    } else if (filter === 'upcoming') {
      return eventDate >= now;
    }
    return true; // For 'all' filter
  });

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (loading) {
    return <div className="loading">Loading volunteer history...</div>;
  }

  return (
    <div className="history-container">
      <h2>Your Volunteer History</h2>
      
      <div className="history-filter">
        <label htmlFor="history-filter">Filter:</label>
        <select 
          id="history-filter" 
          value={filter} 
          onChange={handleFilterChange}
        >
          <option value="all">All Events</option>
          <option value="completed">Completed Events</option>
          <option value="upcoming">Upcoming Events</option>
        </select>
      </div>
      
      {filteredHistory.length === 0 ? (
        <p className="no-history">No volunteer history found.</p>
      ) : (
        <div className="history-list">
          {filteredHistory.map(item => {
            const event = getEventDetails(item.eventId);
            const eventDate = new Date(event.date);
            const isPast = eventDate < new Date();
            
            return (
              <div className="history-item" key={item._id}>
                <div className="history-header">
                  <h3>{event.name}</h3>
                  <span className={`status-badge ${item.status}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
                
                <div className="history-details">
                  <p className="history-date">
                    <strong>Date:</strong> {eventDate.toLocaleDateString()}
                  </p>
                  
                  <p className="history-location">
                    <strong>Location:</strong> {event.location}
                  </p>
                  
                  {isPast && (
                    <p className="history-hours">
                      <strong>Hours Served:</strong> {calculateVolunteerHours(item)}
                    </p>
                  )}
                  
                  <p className="history-skills">
                    <strong>Skills Used:</strong>
                    <div className="skills-container">
                      {event.requiredSkills?.map(skill => (
                        <span key={skill} className="skill-badge">
                          {skill.charAt(0).toUpperCase() + skill.slice(1)}
                        </span>
                      ))}
                    </div>
                  </p>
                  
                  <div className="history-description">
                    <strong>Event Description:</strong>
                    <p>{event.description}</p>
                  </div>
                  
                  {item.feedback && (
                    <div className="history-feedback">
                      <strong>Your Feedback:</strong>
                      <p>{item.feedback}</p>
                    </div>
                  )}
                  
                  {isPast && item.status === 'completed' && !item.feedback && (
                    <div className="feedback-section">
                      <button className="feedback-button">
                        Provide Feedback
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="history-summary">
        <h3>Volunteer Summary</h3>
        <div className="summary-stats">
          <div className="stat-box">
            <span className="stat-number">
              {history.filter(item => item.status === 'completed').length}
            </span>
            <span className="stat-label">Events Completed</span>
          </div>
          
          <div className="stat-box">
            <span className="stat-number">
              {history.filter(item => {
                const eventDate = new Date(getEventDetails(item.eventId)?.date);
                return eventDate >= new Date() && item.status !== 'cancelled';
              }).length}
            </span>
            <span className="stat-label">Upcoming Events</span>
          </div>
          
          <div className="stat-box">
            <span className="stat-number">
              {history.reduce((total, item) => total + (item.hours || 0), 0)}
            </span>
            <span className="stat-label">Total Hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerHistory;
