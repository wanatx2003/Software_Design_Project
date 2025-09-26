import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Admin.css';
import Select from "react-select"

const SKILL_OPTIONS = [
  { value: 'medical', label: 'Medical' },
  { value: 'construction', label: 'Construction' },
  { value: 'teaching', label: 'Teaching' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'counseling', label: 'Counseling' },
  { value: 'driving', label: 'Driving' },
  { value: 'tech', label: 'Technology' },
  { value: 'language', label: 'Language Translation' },
  { value: 'organizing', label: 'Event Organizing' },
  { value: 'fundraising', label: 'Fundraising' }
];

const URGENCY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
];

const EventManagement = () => {
  const [events, setEvents] = useState([]);

  const [currentEvent, setCurrentEvent] = useState({
    _id: null,
    name: '',
    description: '',
    location: '',
    requiredSkills: [],
    urgency: 'medium',
    date: new Date()
  });
  const[selectedOptions, setSelectedOptions] = useState([]);

  const handleNewChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Fetch all events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error('Error fetching events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentEvent({
      _id: null,
      name: '',
      description: '',
      location: '',
      requiredSkills: [],
      urgency: 'medium',
      date: new Date()
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setCurrentEvent({ ...currentEvent, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  
  const handleDateChange = date => {
    setCurrentEvent({ ...currentEvent, date });
    
    // Clear error when field is edited
    if (errors.date) {
      setErrors({ ...errors, date: undefined });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Event Name validation
    if (!currentEvent.name) {
      newErrors.name = 'Event name is required';
    } else if (currentEvent.name.length > 100) {
      newErrors.name = 'Event name must be 100 characters or less';
    }
    
    // Description validation
    if (!currentEvent.description) {
      newErrors.description = 'Event description is required';
    }
    
    // Location validation
    if (!currentEvent.location) {
      newErrors.location = 'Location is required';
    }
    
    // Required Skills validation
    if (!currentEvent.requiredSkills || currentEvent.requiredSkills.length === 0) {
      newErrors.requiredSkills = 'Please select at least one required skill';
    }
    
    // Urgency validation
    if (!currentEvent.urgency) {
      newErrors.urgency = 'Please select urgency level';
    }
    
    // Date validation
    if (!currentEvent.date) {
      newErrors.date = 'Event date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaveLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const url = isEditing 
        ? `/api/events/${currentEvent._id}`
        : '/api/events';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentEvent)
      });
      
      if (response.ok) {
        await fetchEvents();
        resetForm();
        setShowForm(false);
      } else {
        const error = await response.json();
        setErrors({ 
          general: error.message || `Error ${isEditing ? 'updating' : 'creating'} event. Please try again.` 
        });
      }
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} event:`, err);
      setErrors({ general: `Error ${isEditing ? 'updating' : 'creating'} event. Please try again.` });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEdit = event => {
    setCurrentEvent({
      ...event,
      date: new Date(event.date)
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        await fetchEvents();
        // If deleting the event currently being edited, reset the form
        if (currentEvent._id === eventId) {
          resetForm();
          setShowForm(false);
        }
      } else {
        console.error('Error deleting event');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  if (loading && events.length === 0) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="admin-container">
      <h2>Event Management</h2>
      
      <div className="admin-actions">
        <button 
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }} 
          className="action-button"
        >
          {showForm ? 'Hide Form' : 'Create New Event'}
        </button>
      </div>
      
      {showForm && (
        <div className="event-form-container">
          <h3>{isEditing ? 'Edit Event' : 'Create New Event'}</h3>
          {errors.general && <div className="error-message">{errors.general}</div>}
          
          <form onSubmit={handleSubmit} className="event-form">
            {/* Event Name */}
            <div className="form-group">
              <label htmlFor="name">Event Name <span className="required">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={currentEvent.name}
                onChange={handleChange}
                maxLength="100"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            
            {/* Event Description */}
            <div className="form-group">
              <label htmlFor="description">Description <span className="required">*</span></label>
              <textarea
                id="description"
                name="description"
                value={currentEvent.description}
                onChange={handleChange}
                rows="4"
                className={errors.description ? 'error' : ''}
              ></textarea>
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
            
            {/* Location */}
            <div className="form-group">
              <label htmlFor="location">Location <span className="required">*</span></label>
              <textarea
                id="location"
                name="location"
                value={currentEvent.location}
                onChange={handleChange}
                rows="2"
                className={errors.location ? 'error' : ''}
              ></textarea>
              {errors.location && <span className="error-text">{errors.location}</span>}
            </div>
            
            {/* Required Skills */}
            <div className="form-group">
              <label htmlFor="requiredSkills">Required Skills<span className="required">*</span></label>
              <Select
              options={SKILL_OPTIONS}
              value={selectedOptions}
              onChange={handleNewChange}
              isMulti={true}
              />
            </div>

            {/* Urgency */}
            <div className="form-group">
              <label htmlFor="urgency">Urgency <span className="required">*</span></label>
              <select
                id="urgency"
                name="urgency"
                value={currentEvent.urgency}
                onChange={handleChange}
                className={errors.urgency ? 'error' : ''}
              >
                {URGENCY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.urgency && <span className="error-text">{errors.urgency}</span>}
            </div>
            
            {/* Event Date */}
            <div className="form-group">
              <label htmlFor="date">Event Date <span className="required">*</span></label>
              <DatePicker
                selected={currentEvent.date}
                onChange={handleDateChange}
                className={errors.date ? 'error' : ''}
                dateFormat="MM/dd/yyyy"
              />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }} 
                className="cancel-button"
              >
                Cancel
              </button>
              <button type="submit" className="submit-button" disabled={saveLoading}>
                {saveLoading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="events-list">
        <h3>All Events</h3>
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Location</th>
                <th>Urgency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event._id}>
                  <td>{event.name}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.location}</td>
                  <td>
                    <span className={`urgency-badge ${event.urgency}`}>
                      {event.urgency.charAt(0).toUpperCase() + event.urgency.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleEdit(event)} 
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(event._id)} 
                      className="delete-button"
                    >
                      Delete
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

export default EventManagement;
