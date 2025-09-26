import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './UserProfile.css';
import Select from "react-select"

const STATE_OPTIONS = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

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

const UserProfile = ({ user }) => {
  const navigate = useNavigate();
  const[selectedOptions, setSelectedOptions] = useState([]);

  const handleNewChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };
  const [profile, setProfile] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    skills: [],
    preferences: '',
    availability: []
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setIsProfileComplete(true);
        } else if (response.status !== 404) {
          console.error('Error fetching profile');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  const handleChange = e => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  
  
  const handleDateChange = dates => {
    setProfile({ ...profile, availability: dates });
    
    // Clear error when field is edited
    if (errors.availability) {
      setErrors({ ...errors, availability: undefined });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Full Name validation
    if (!profile.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (profile.fullName.length > 50) {
      newErrors.fullName = 'Full name must be 50 characters or less';
    }
    
    // Address validation
    if (!profile.address1) {
      newErrors.address1 = 'Address is required';
    } else if (profile.address1.length > 100) {
      newErrors.address1 = 'Address must be 100 characters or less';
    }
    
    if (profile.address2 && profile.address2.length > 100) {
      newErrors.address2 = 'Address 2 must be 100 characters or less';
    }
    
    // City validation
    if (!profile.city) {
      newErrors.city = 'City is required';
    } else if (profile.city.length > 100) {
      newErrors.city = 'City must be 100 characters or less';
    }
    
    // State validation
    if (!profile.state) {
      newErrors.state = 'State is required';
    }
    
    // Zip code validation
    if (!profile.zipCode) {
      newErrors.zipCode = 'Zip code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(profile.zipCode)) {
      newErrors.zipCode = 'Zip code must be a valid 5 or 9 digit code (e.g., 12345 or 12345-6789)';
    }
    
    // Skills validation
    if (!profile.skills || profile.skills.length === 0) {
      newErrors.skills = 'Please select at least one skill';
    }
    
    // Availability validation
    if (!profile.availability || profile.availability.length === 0) {
      newErrors.availability = 'Please select at least one date';
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
      const response = await fetch('/api/profile', {
        method: isProfileComplete ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setIsProfileComplete(true);
        navigate('/');
      } else {
        const error = await response.json();
        setErrors({ 
          general: error.message || 'Error saving profile. Please try again.' 
        });
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setErrors({ general: 'Error saving profile. Please try again.' });
    } finally {
      setSaveLoading(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h2>{isProfileComplete ? 'Update Profile' : 'Complete Your Profile'}</h2>
      {errors.general && <div className="error-message">{errors.general}</div>}
      
      <form onSubmit={handleSubmit} className="profile-form">
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullName">Full Name <span className="required">*</span></label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            maxLength="50"
            className={errors.fullName ? 'error' : ''}
          />
          {errors.fullName && <span className="error-text">{errors.fullName}</span>}
        </div>
        
        {/* Address 1 */}
        <div className="form-group">
          <label htmlFor="address1">Address <span className="required">*</span></label>
          <input
            type="text"
            id="address1"
            name="address1"
            value={profile.address1}
            onChange={handleChange}
            maxLength="100"
            className={errors.address1 ? 'error' : ''}
          />
          {errors.address1 && <span className="error-text">{errors.address1}</span>}
        </div>
        
        {/* Address 2 */}
        <div className="form-group">
          <label htmlFor="address2">Address 2</label>
          <input
            type="text"
            id="address2"
            name="address2"
            value={profile.address2}
            onChange={handleChange}
            maxLength="100"
            className={errors.address2 ? 'error' : ''}
          />
          {errors.address2 && <span className="error-text">{errors.address2}</span>}
        </div>
        
        {/* City */}
        <div className="form-group">
          <label htmlFor="city">City <span className="required">*</span></label>
          <input
            type="text"
            id="city"
            name="city"
            value={profile.city}
            onChange={handleChange}
            maxLength="100"
            className={errors.city ? 'error' : ''}
          />
          {errors.city && <span className="error-text">{errors.city}</span>}
        </div>
        
        {/* State */}
        <div className="form-group">
          <label htmlFor="state">State <span className="required">*</span></label>
          <select
            id="state"
            name="state"
            value={profile.state}
            onChange={handleChange}
            className={errors.state ? 'error' : ''}
          >
            <option value="">Select State</option>
            {STATE_OPTIONS.map(state => (
              <option key={state.value} value={state.value}>{state.label}</option>
            ))}
          </select>
          {errors.state && <span className="error-text">{errors.state}</span>}
        </div>
        
        {/* Zip Code */}
        <div className="form-group">
          <label htmlFor="zipCode">Zip Code <span className="required">*</span></label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={profile.zipCode}
            onChange={handleChange}
            maxLength="10"
            placeholder="12345"
            className={errors.zipCode ? 'error' : ''}
          />
          {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
        </div>
        
        {/* Skills */}
        <div className="form-group">
           <label htmlFor="Skills">Skills<span className="required">*</span></label>
          <Select
           options={SKILL_OPTIONS}
           value={selectedOptions}
           onChange={handleNewChange}
           isMulti={true}
           />
        </div>
        
        {/* Preferences */}
        <div className="form-group">
          <label htmlFor="preferences">Preferences</label>
          <textarea
            id="preferences"
            name="preferences"
            value={profile.preferences}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>
        
        {/* Availability */}
        <div className="form-group">
          <label>Availability <span className="required">*</span></label>
          <DatePicker
            selected={null}
            onChange={handleDateChange}
            selectsRange={false}
            startDate={null}
            endDate={null}
            monthsShown={1}
            inline
            highlightDates={profile.availability}
            onSelect={date => {
              const newDates = [...profile.availability];
              const dateIndex = newDates.findIndex(d => 
                d && new Date(d).toDateString() === date.toDateString()
              );
              
              if (dateIndex > -1) {
                newDates.splice(dateIndex, 1);
              } else {
                newDates.push(date);
              }
              
              setProfile({ ...profile, availability: newDates });
            }}
          />
          <div className="date-list">
            <h4>Selected Dates:</h4>
            {profile.availability.length === 0 ? (
              <p>No dates selected</p>
            ) : (
              <ul>
                {profile.availability.sort((a, b) => new Date(a) - new Date(b)).map((date, index) => (
                  <li key={index}>
                    {new Date(date).toLocaleDateString()}
                    <button 
                      type="button" 
                      onClick={() => {
                        const newDates = profile.availability.filter((_, i) => i !== index);
                        setProfile({ ...profile, availability: newDates });
                      }}
                      className="remove-date"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.availability && <span className="error-text">{errors.availability}</span>}
        </div>
        
        <button type="submit" className="submit-button" disabled={saveLoading}>
          {saveLoading ? 'Saving...' : (isProfileComplete ? 'Update Profile' : 'Save Profile')}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;