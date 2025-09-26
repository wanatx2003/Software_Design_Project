import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Admin.css';
import Select from 'react-select';

// ✅ import your mock data
import { mockData } from '../../utils/mockData';

const USE_MOCK = true; // flip to false to use /api/events

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
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const mapMockEventToUi = (e) => ({
    _id: e.id,                               // normalize
    name: e.name ?? e.title ?? 'Untitled',
    description: e.description ?? '',
    location: e.location ?? e.locationZip ?? '',
    requiredSkills: e.requiredSkills ?? [],
    urgency: e.urgency ?? 'medium',
    date: e.date ? new Date(e.date) : new Date()
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        // 🔹 events list comes from mockData here
        const mapped = (mockData.events || []).map(mapMockEventToUi);
        setEvents(mapped);
        return;
      }

      // real API path
      const token = localStorage.getItem('token');
      const response = await fetch('/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error fetching events');
      const data = await response.json();
      // assume backend already returns UI shape
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents([]);
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
    setSelectedOptions([]);
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleDateChange = (date) => {
    setCurrentEvent((prev) => ({ ...prev, date }));
    if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
  };

  const handleSkillsChange = (opts) => {
    setSelectedOptions(opts || []);
    setCurrentEvent((prev) => ({
      ...prev,
      requiredSkills: (opts || []).map((o) => o.value)
    }));
    if (errors.requiredSkills) setErrors((prev) => ({ ...prev, requiredSkills: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!currentEvent.name) newErrors.name = 'Event name is required';
    if (!currentEvent.description) newErrors.description = 'Event description is required';
    if (!currentEvent.location) newErrors.location = 'Location is required';
    if (!currentEvent.requiredSkills?.length) newErrors.requiredSkills = 'Select at least one skill';
    if (!currentEvent.urgency) newErrors.urgency = 'Select urgency';
    if (!currentEvent.date) newErrors.date = 'Event date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaveLoading(true);

    try {
      if (USE_MOCK) {
        // in-memory create/update
        if (isEditing) {
          setEvents((prev) =>
            prev.map((ev) => (ev._id === currentEvent._id ? { ...currentEvent } : ev))
          );
        } else {
          const newEvent = {
            ...currentEvent,
            _id: `mock-${Date.now()}`
          };
          setEvents((prev) => [newEvent, ...prev]);
        }
        resetForm();
        setShowForm(false);
        return;
      }

      // real API
      const token = localStorage.getItem('token');
      const url = isEditing ? `/api/events/${currentEvent._id}` : '/api/events';
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(currentEvent)
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Save failed');
      }
      await fetchEvents();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error(`Save error:`, err);
      setErrors({ general: err.message || 'Error saving event. Please try again.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEdit = (event) => {
    setCurrentEvent({
      ...event,
      date: new Date(event.date)
    });
    // hydrate select from existing skills
    setSelectedOptions(
      (event.requiredSkills || [])
        .map((v) => SKILL_OPTIONS.find((o) => o.value === v))
        .filter(Boolean)
    );
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      if (USE_MOCK) {
        setEvents((prev) => prev.filter((e) => e._id !== eventId));
        if (currentEvent._id === eventId) {
          resetForm();
          setShowForm(false);
        }
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Delete failed');
      await fetchEvents();
      if (currentEvent._id === eventId) {
        resetForm();
        setShowForm(false);
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
            <div className="form-group">
              <label htmlFor="name">
                Event Name <span className="required">*</span>
              </label>
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

            <div className="form-group">
              <label htmlFor="description">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={currentEvent.description}
                onChange={handleChange}
                rows="4"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location">
                Location <span className="required">*</span>
              </label>
              <textarea
                id="location"
                name="location"
                value={currentEvent.location}
                onChange={handleChange}
                rows="2"
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="error-text">{errors.location}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="requiredSkills">
                Required Skills <span className="required">*</span>
              </label>
              <Select
                options={SKILL_OPTIONS}
                value={selectedOptions}
                onChange={handleSkillsChange}
                isMulti
              />
              {errors.requiredSkills && (
                <span className="error-text">{errors.requiredSkills}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="urgency">
                Urgency <span className="required">*</span>
              </label>
              <select
                id="urgency"
                name="urgency"
                value={currentEvent.urgency}
                onChange={handleChange}
                className={errors.urgency ? 'error' : ''}
              >
                {URGENCY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {errors.urgency && <span className="error-text">{errors.urgency}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="date">
                Event Date <span className="required">*</span>
              </label>
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
                {saveLoading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
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
        {events.map((raw) => {
          // normalize to support mockData (id/title/locationZip) or API (_id/name/location)
          const id = raw._id ?? raw.id;
          const name = raw.name ?? raw.title ?? 'Untitled';
          const dateObj = raw.date ? new Date(raw.date) : null;
          const location = raw.location ?? raw.locationZip ?? '—';
          const urgency = raw.urgency ?? 'low';

          // ensure Edit receives the normalized fields your form expects
          const normalizedForEdit = {
            ...raw,
            _id: id,
            name,
            location,
            urgency,
            date: dateObj || new Date()
          };

          return (
            <tr key={id}>
              <td>{name}</td>
              <td>{dateObj ? dateObj.toLocaleDateString() : '—'}</td>
              <td>{location}</td>
              <td>
                <span className={`urgency-badge ${urgency}`}>
                  {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleEdit(normalizedForEdit)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )}
</div>
    </div>
  );
};

export default EventManagement;
