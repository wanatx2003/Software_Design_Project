import React, { useState, useEffect } from 'react';
import './Admin.css';

const VolunteerMatching = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [filter, setFilter] = useState({
    eventId: '',
    skill: ''
  });
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch volunteers
      const volunteersResponse = await fetch('/api/volunteers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Fetch events
      const eventsResponse = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Fetch existing matches
      const matchesResponse = await fetch('/api/matches', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (volunteersResponse.ok && eventsResponse.ok && matchesResponse.ok) {
        const volunteersData = await volunteersResponse.json();
        const eventsData = await eventsResponse.json();
        const matchesData = await matchesResponse.json();
        
        setVolunteers(volunteersData);
        setEvents(eventsData);
        setMatches(matchesData);
      } else {
        console.error('Error fetching data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    if (filter.skill && !volunteer.skills.includes(filter.skill)) {
      return false;
    }
    return true;
  });

  const filteredEvents = events.filter(event => {
    if (filter.eventId && event._id !== filter.eventId) {
      return false;
    }
    return true;
  });

  const handleVolunteerSelect = volunteer => {
    setSelectedVolunteer(volunteer);
    
    // Find matching events for this volunteer
    const matchingEvents = events.filter(event => {
      const hasRequiredSkill = event.requiredSkills.some(skill => 
        volunteer.skills.includes(skill)
      );
      
      const isAvailable = volunteer.availability.some(date => {
        const availDate = new Date(date);
        const eventDate = new Date(event.date);
        return availDate.toDateString() === eventDate.toDateString();
      });
      
      return hasRequiredSkill && isAvailable;
    });
    
    // If there's only one matching event, select it automatically
    if (matchingEvents.length === 1) {
      setSelectedEvent(matchingEvents[0]);
    } else {
      setSelectedEvent(null);
    }
  };

  const handleEventSelect = event => {
    setSelectedEvent(event);
  };

  const isAlreadyMatched = () => {
    return matches.some(match => 
      match.volunteerId === selectedVolunteer?._id && 
      match.eventId === selectedEvent?._id
    );
  };

  const createMatch = async () => {
    if (!selectedVolunteer || !selectedEvent) {
      return;
    }
    
    setSaveLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          volunteerId: selectedVolunteer._id,
          eventId: selectedEvent._id,
          status: 'pending'
        })
      });
      
      if (response.ok) {
        await fetchData();
        setSelectedVolunteer(null);
        setSelectedEvent(null);
      } else {
        console.error('Error creating match');
      }
    } catch (err) {
      console.error('Error creating match:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  const removeMatch = async (matchId) => {
    if (!window.confirm('Are you sure you want to remove this match?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/matches/${matchId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        await fetchData();
      } else {
        console.error('Error removing match');
      }
    } catch (err) {
      console.error('Error removing match:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  const getVolunteerById = (id) => {
    return volunteers.find(v => v._id === id) || { fullName: 'Unknown' };
  };

  const getEventById = (id) => {
    return events.find(e => e._id === id) || { name: 'Unknown' };
  };

  // Extract unique skills from all volunteers
  const allSkills = [...new Set(volunteers.flatMap(v => v.skills))];

  return (
    <div className="admin-container">
      <h2>Volunteer Matching</h2>
      
      <div className="matching-filters">
        <h3>Filter Options</h3>
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="eventId">Filter by Event:</label>
            <select
              id="eventId"
              name="eventId"
              value={filter.eventId}
              onChange={handleFilterChange}
            >
              <option value="">All Events</option>
              {events.map(event => (
                <option key={event._id} value={event._id}>{event.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="skill">Filter by Skill:</label>
            <select
              id="skill"
              name="skill"
              value={filter.skill}
              onChange={handleFilterChange}
            >
              <option value="">All Skills</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => setFilter({ eventId: '', skill: '' })}
            className="filter-button"
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      <div className="matching-container">
        <div className="matching-column">
          <h3>Available Volunteers</h3>
          {filteredVolunteers.length === 0 ? (
            <p>No volunteers found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Skills</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteers.map(volunteer => (
                  <tr 
                    key={volunteer._id} 
                    className={selectedVolunteer?._id === volunteer._id ? 'selected-row' : ''}
                  >
                    <td>{volunteer.fullName}</td>
                    <td>
                      {volunteer.skills.map(skill => (
                        <span key={skill} className="skill-badge">
                          {skill.charAt(0).toUpperCase() + skill.slice(1)}
                        </span>
                      ))}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleVolunteerSelect(volunteer)} 
                        className="select-button"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="matching-column">
          <h3>Available Events</h3>
          {filteredEvents.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Required Skills</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(event => (
                  <tr 
                    key={event._id}
                    className={selectedEvent?._id === event._id ? 'selected-row' : ''}
                  >
                    <td>{event.name}</td>
                    <td>{new Date(event.date).toLocaleDateString()}</td>
                    <td>
                      {event.requiredSkills.map(skill => (
                        <span key={skill} className="skill-badge">
                          {skill.charAt(0).toUpperCase() + skill.slice(1)}
                        </span>
                      ))}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleEventSelect(event)} 
                        className="select-button"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <div className="matching-actions">
        {selectedVolunteer && selectedEvent ? (
          <div className="selected-match">
            <h3>Selected Match:</h3>
            <p><strong>Volunteer:</strong> {selectedVolunteer.fullName}</p>
            <p><strong>Event:</strong> {selectedEvent.name}</p>
            
            {isAlreadyMatched() ? (
              <div className="match-status">
                <p className="match-exists">This volunteer is already matched to this event.</p>
              </div>
            ) : (
              <button 
                onClick={createMatch} 
                className="create-match-button"
                disabled={saveLoading}
              >
                {saveLoading ? 'Creating...' : 'Create Match'}
              </button>
            )}
          </div>
        ) : (
          <div className="selected-match">
            <h3>Create a Match</h3>
            <p>Select a volunteer and an event to create a match.</p>
          </div>
        )}
      </div>
      
      <div className="existing-matches">
        <h3>Existing Matches</h3>
        {matches.length === 0 ? (
          <p>No matches found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Volunteer</th>
                <th>Event</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {matches.map(match => (
                <tr key={match._id}>
                  <td>{getVolunteerById(match.volunteerId).fullName}</td>
                  <td>{getEventById(match.eventId).name}</td>
                  <td>
                    <span className={`status-badge ${match.status}`}>
                      {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => removeMatch(match._id)} 
                      className="delete-button"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VolunteerMatching;
