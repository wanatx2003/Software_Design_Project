import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { mockData } from '../../utils/mockData';
import './Admin.css';

const USE_MOCK = true;

const MIN_SKILL_MATCHES = 1;          // ✅ at least 1 shared skill
const REQUIRE_AVAILABILITY = true;    // set false if you want to ignore date matching
const countOverlap = (a = [], b = []) => {
  const A = new Set(a);
  return (b || []).reduce((n, x) => n + (A.has(x) ? 1 : 0), 0);
};

const VolunteerMatching = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [filter, setFilter] = useState({ eventId: '', skill: '' });
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ---------- data load ----------
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        // Map mock -> UI shape your table expects
        const volunteersData = (mockData.volunteers || []).map(v => ({
          _id: v.id,
          fullName: v.name,
          skills: v.skills || [],
          availability: v.availability || [],
          homeZip: v.homeZip,
          maxDistanceKm: v.maxDistanceKm,
        }));
        const eventsData = (mockData.events || []).map(e => ({
          _id: e.id,
          name: e.title,
          date: e.date,
          locationZip: e.locationZip,
          requiredSkills: e.requiredSkills || [],
          capacity: e.capacity ?? 0,
          assignedVolunteerIds: e.assignedVolunteerIds || [],
        }));
        setVolunteers(volunteersData);
        setEvents(eventsData);
        setMatches([]); // start empty
        return;
      }

      // Real API path (unchanged)
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [volRes, evtRes, matRes] = await Promise.all([
        fetch('/api/volunteers', { headers }),
        fetch('/api/events', { headers }),
        fetch('/api/matches', { headers }),
      ]);
      if (!volRes.ok || !evtRes.ok || !matRes.ok) throw new Error('Fetch failed');

      const [volunteersData, eventsData, matchesData] = await Promise.all([
        volRes.json(),
        evtRes.json(),
        matRes.json(),
      ]);

      setVolunteers(Array.isArray(volunteersData) ? volunteersData : []);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setMatches(Array.isArray(matchesData) ? matchesData : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setVolunteers([]);
      setEvents([]);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---------- filters ----------
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const filteredVolunteers = useMemo(() => {
    const skill = filter.skill;
    if (!skill) return volunteers;
    return volunteers.filter(v => (Array.isArray(v?.skills) ? v.skills : []).includes(skill));
  }, [volunteers, filter.skill]);

  const filteredEvents = useMemo(() => {
    const id = filter.eventId;
    if (!id) return events;
    return events.filter(e => e?._id === id);
  }, [events, filter.eventId]);

  const allSkills = useMemo(
    () => [...new Set(volunteers.flatMap(v => (Array.isArray(v?.skills) ? v.skills : [])))],
    [volunteers]
  );

  // ---------- selections & matching ----------
const handleVolunteerSelect = (volunteer) => {
  setSelectedVolunteer(volunteer);

  const matchingEvents = events.filter(event => {
    const req = Array.isArray(event?.requiredSkills) ? event.requiredSkills : [];
    const vSkills = Array.isArray(volunteer?.skills) ? volunteer.skills : [];

    // ✅ require at least MIN_SKILL_MATCHES overlapping skills
    const overlap = countOverlap(vSkills, req);
    const hasEnoughSkills = overlap >= MIN_SKILL_MATCHES;

    // availability (optional)
    let isAvailable = true;
    if (REQUIRE_AVAILABILITY) {
      const avail = Array.isArray(volunteer?.availability) ? volunteer.availability : [];
      isAvailable = avail.some(d => {
        const a = new Date(d);
        const b = new Date(event?.date);
        return !isNaN(a) && !isNaN(b) && a.toDateString() === b.toDateString();
      });
    }

    return hasEnoughSkills && isAvailable;
  });

  // Auto-select only if exactly one match
  setSelectedEvent(matchingEvents.length === 1 ? matchingEvents[0] : null);
};


  const handleEventSelect = (event) => setSelectedEvent(event);

  const alreadyMatched = useMemo(() => {
    if (!selectedVolunteer?._id || !selectedEvent?._id) return false;
    return matches.some(
      m => m?.volunteerId === selectedVolunteer._id && m?.eventId === selectedEvent._id
    );
  }, [matches, selectedVolunteer, selectedEvent]);

  // ---------- mutations ----------
  const createMatch = async () => {
    if (!selectedVolunteer || !selectedEvent) return;
    setSaveLoading(true);
    try {
      if (USE_MOCK) {
        if (!alreadyMatched) {
          setMatches(prev => [
            ...prev,
            {
              _id: String(Date.now()),
              volunteerId: selectedVolunteer._id,
              eventId: selectedEvent._id,
              status: 'pending',
            },
          ]);
        }
        setSelectedVolunteer(null);
        setSelectedEvent(null);
        return;
      }

      // real API
      const token = localStorage.getItem('token');
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          volunteerId: selectedVolunteer._id,
          eventId: selectedEvent._id,
          status: 'pending',
        }),
      });
      if (!res.ok) throw new Error('Error creating match');
      await fetchData();
      setSelectedVolunteer(null);
      setSelectedEvent(null);
    } catch (err) {
      console.error('Error creating match:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  const removeMatch = async (matchId) => {
    if (!window.confirm('Are you sure you want to remove this match?')) return;

    try {
      if (USE_MOCK) {
        setMatches(prev => prev.filter(m => m._id !== matchId));
        return;
      }

      const token = localStorage.getItem('token');
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error removing match');
      await fetchData();
    } catch (err) {
      console.error('Error removing match:', err);
    }
  };

  // ---------- helpers ----------
  const getVolunteerById = (id) => volunteers.find(v => v?._id === id) || { fullName: 'Unknown' };
  const getEventById = (id) => events.find(e => e?._id === id) || { name: 'Unknown' };

  // ---------- UI ----------
  if (loading) return <div className="loading">Loading data...</div>;

  return (
    <div className="admin-container">
      <h2 style={{ marginBottom: 16 }}>Volunteer Matching</h2>

      {/* Filters */}
      <div className="matching-filters">
        <h3 style={{ marginTop: 0 }}>Filter Options</h3>
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
                <option key={event._id} value={event._id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="skill">Filter by Skill:</label>
            <select id="skill" name="skill" value={filter.skill} onChange={handleFilterChange}>
              <option value="">All Skills</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setFilter({ eventId: '', skill: '' })}
            className="filter-button"
            style={{ alignSelf: 'end', height: 38 }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Lists */}
      <div className="matching-container">
        <div className="matching-column">
          <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Available Volunteers</span>
            <span style={{ fontWeight: 400, color: '#666' }}>{filteredVolunteers.length}</span>
          </h3>

          {filteredVolunteers.length === 0 ? (
            <p>No volunteers found.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Skills</th>
                    <th style={{ width: 100 }}>Action</th>
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
                        {(volunteer.skills || []).length === 0
                          ? '—'
                          : volunteer.skills.map(skill => (
                              <span key={skill} className="skill-badge">
                                {skill.charAt(0).toUpperCase() + skill.slice(1)}
                              </span>
                            ))}
                      </td>
                      <td>
                        <button
                          type="button"
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
            </div>
          )}
        </div>

        <div className="matching-column">
          <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Available Events</span>
            <span style={{ fontWeight: 400, color: '#666' }}>{filteredEvents.length}</span>
          </h3>

          {filteredEvents.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Required Skills</th>
                    <th style={{ width: 100 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map(event => (
                    <tr
                      key={event._id}
                      className={selectedEvent?._id === event._id ? 'selected-row' : ''}
                    >
                      <td>{event.name}</td>
                      <td>
                        {event?.date ? new Date(event.date).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        {(event.requiredSkills || []).length === 0
                          ? '—'
                          : event.requiredSkills.map(skill => (
                              <span key={skill} className="skill-badge">
                                {skill.charAt(0).toUpperCase() + skill.slice(1)}
                              </span>
                            ))}
                      </td>
                      <td>
                        <button
                          type="button"
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
            </div>
          )}
        </div>
      </div>

      {/* Selected match */}
      <div className="matching-actions">
        <div className="selected-match">
          <h3 style={{ marginTop: 0 }}>
            {selectedVolunteer && selectedEvent ? 'Selected Match' : 'Create a Match'}
          </h3>

          {selectedVolunteer && selectedEvent ? (
            <>
              <p>
                <strong>Volunteer:</strong> {selectedVolunteer.fullName}
              </p>
              <p>
                <strong>Event:</strong> {selectedEvent.name}
              </p>

              {alreadyMatched ? (
                <div className="match-status">
                  <p className="match-exists">
                    This volunteer is already matched to this event.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={createMatch}
                  className="create-match-button"
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Creating…' : 'Create Match'}
                </button>
              )}
            </>
          ) : (
            <p>Select a volunteer and an event to create a match.</p>
          )}
        </div>
      </div>

      {/* Existing matches */}
      <div className="existing-matches">
        <h3>Existing Matches</h3>
        {matches.length === 0 ? (
          <p>No matches found.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Volunteer</th>
                  <th>Event</th>
                  <th>Status</th>
                  <th style={{ width: 120 }}>Action</th>
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
                        type="button"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerMatching;
