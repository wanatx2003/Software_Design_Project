-- Volunteer Management System Database Schema

-- Create the database
CREATE DATABASE IF NOT EXISTS volunteer_management;
USE volunteer_management;

-- Users table for authentication and basic user info
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('volunteer', 'admin') NOT NULL DEFAULT 'volunteer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles with all required fields
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    full_name VARCHAR(50) NOT NULL,
    address1 VARCHAR(100) NOT NULL,
    address2 VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state CHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    preferences TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Skills lookup table
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Junction table for profile-skills many-to-many relationship
CREATE TABLE profile_skills (
    profile_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (profile_id, skill_id),
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Volunteer availability dates
CREATE TABLE availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    available_date DATE NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    UNIQUE (profile_id, available_date)
);

-- Events table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    urgency ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    event_date DATE NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Junction table for event-skills many-to-many relationship
CREATE TABLE event_skills (
    event_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (event_id, skill_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Volunteer-Event matches
CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    volunteer_id INT NOT NULL,
    event_id INT NOT NULL,
    status ENUM('pending', 'confirmed', 'declined', 'completed', 'canceled') NOT NULL DEFAULT 'pending',
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE (volunteer_id, event_id)
);

-- Volunteer participation history
CREATE TABLE volunteer_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL UNIQUE,
    hours DECIMAL(5,2),
    feedback TEXT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);

-- Notifications system
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Authentication tokens/sessions
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_state ON profiles(state);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_urgency ON events(urgency);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_availability_date ON availability(available_date);

-- Populate skills table with initial values
INSERT INTO skills (name) VALUES 
    ('medical'),
    ('construction'),
    ('teaching'),
    ('cooking'),
    ('counseling'),
    ('driving'),
    ('tech'),
    ('language'),
    ('organizing'),
    ('fundraising');

-- Create helpful views for common queries

-- View to see volunteer profiles with their skills
CREATE VIEW volunteer_profiles_view AS
SELECT 
    u.id AS user_id,
    u.email,
    u.first_name,
    u.last_name,
    p.id AS profile_id,
    p.full_name,
    p.address1,
    p.address2,
    p.city,
    p.state,
    p.zip_code,
    p.preferences,
    GROUP_CONCAT(DISTINCT s.name) AS skills,
    COUNT(DISTINCT a.id) AS availability_count
FROM 
    users u
JOIN 
    profiles p ON u.id = p.user_id
LEFT JOIN 
    profile_skills ps ON p.id = ps.profile_id
LEFT JOIN 
    skills s ON ps.skill_id = s.id
LEFT JOIN 
    availability a ON p.id = a.profile_id
WHERE 
    u.role = 'volunteer'
GROUP BY 
    u.id;

-- View to see events with their required skills
CREATE VIEW event_details_view AS
SELECT 
    e.id,
    e.name,
    e.description,
    e.location,
    e.urgency,
    e.event_date,
    u.email AS created_by_email,
    CONCAT(u.first_name, ' ', u.last_name) AS created_by_name,
    GROUP_CONCAT(DISTINCT s.name) AS required_skills
FROM 
    events e
JOIN
    users u ON e.created_by = u.id
LEFT JOIN 
    event_skills es ON e.id = es.event_id
LEFT JOIN 
    skills s ON es.skill_id = s.id
GROUP BY 
    e.id;

-- View to see volunteer match history with event details
CREATE VIEW volunteer_history_view AS
SELECT 
    vh.id AS history_id,
    m.id AS match_id,
    u.id AS volunteer_id,
    u.email AS volunteer_email,
    p.full_name AS volunteer_name,
    e.id AS event_id,
    e.name AS event_name,
    e.description AS event_description,
    e.location AS event_location,
    e.urgency AS event_urgency,
    e.event_date,
    m.status,
    vh.hours,
    vh.feedback,
    vh.completed_at
FROM 
    volunteer_history vh
JOIN 
    matches m ON vh.match_id = m.id
JOIN 
    users u ON m.volunteer_id = u.id
JOIN 
    profiles p ON u.id = p.user_id
JOIN 
    events e ON m.event_id = e.id
ORDER BY
    vh.completed_at DESC;

-- View for pending matches that need admin attention
CREATE VIEW pending_matches_view AS
SELECT
    m.id AS match_id,
    u.id AS volunteer_id,
    p.full_name AS volunteer_name,
    e.id AS event_id,
    e.name AS event_name,
    e.event_date,
    m.matched_at,
    GROUP_CONCAT(DISTINCT ps.skill_id) AS volunteer_skills,
    GROUP_CONCAT(DISTINCT es.skill_id) AS event_skills
FROM
    matches m
JOIN
    users u ON m.volunteer_id = u.id
JOIN
    profiles p ON u.id = p.user_id
JOIN
    events e ON m.event_id = e.id
LEFT JOIN
    profile_skills ps ON p.id = ps.profile_id
LEFT JOIN
    event_skills es ON e.id = es.event_id
WHERE
    m.status = 'pending'
GROUP BY
    m.id
ORDER BY
    e.event_date ASC;
