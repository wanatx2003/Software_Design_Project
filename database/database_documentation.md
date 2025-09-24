# Volunteer Management System - Database Documentation

## Overview

This document explains the database schema for the Volunteer Management System, detailing all tables, relationships, and design decisions.

## Tables

### 1. users
- Core user information for authentication
- Fields:
  - `id`: Primary key
  - `email`: Unique user identifier (also username)
  - `password_hash`: Securely stored password
  - `first_name`: User's first name
  - `last_name`: User's last name
  - `role`: Either 'volunteer' or 'admin'
  - `created_at`: When the account was created

### 2. profiles
- Extended user information
- One-to-one relationship with users
- Fields:
  - `id`: Primary key
  - `user_id`: Foreign key to users table
  - `full_name`: Full name (50 chars max, required)
  - `address1`: Primary address (100 chars max, required)
  - `address2`: Secondary address (100 chars max, optional)
  - `city`: City name (100 chars max, required)
  - `state`: Two-character state code (required)
  - `zip_code`: Postal code (5-9 chars, required)
  - `preferences`: Free-form text for volunteer preferences (optional)

### 3. skills
- Lookup table for available skills
- Fields:
  - `id`: Primary key
  - `name`: Skill name (unique)

### 4. profile_skills
- Junction table for many-to-many relationship between profiles and skills
- Fields:
  - `profile_id`: Foreign key to profiles
  - `skill_id`: Foreign key to skills
  - Primary key is the combination of both fields

### 5. availability
- Stores dates when volunteers are available
- Fields:
  - `id`: Primary key
  - `profile_id`: Foreign key to profiles
  - `available_date`: Date when volunteer is available

### 6. events
- Information about volunteer events
- Fields:
  - `id`: Primary key
  - `name`: Event name (100 chars max, required)
  - `description`: Event description (required)
  - `location`: Event location (required)
  - `urgency`: Enum ('low', 'medium', 'high', 'critical')
  - `event_date`: When the event takes place
  - `created_by`: Foreign key to users (admin who created the event)

### 7. event_skills
- Junction table for many-to-many relationship between events and skills
- Fields:
  - `event_id`: Foreign key to events
  - `skill_id`: Foreign key to skills
  - Primary key is the combination of both fields

### 8. matches
- Connects volunteers to events
- Fields:
  - `id`: Primary key
  - `volunteer_id`: Foreign key to users (volunteer)
  - `event_id`: Foreign key to events
  - `status`: Enum ('pending', 'confirmed', 'declined', 'completed', 'canceled')
  - `matched_at`: When the match was created
  - Unique constraint on the combination of volunteer_id and event_id

### 9. volunteer_history
- Tracks completed volunteer participation
- Fields:
  - `id`: Primary key
  - `match_id`: Foreign key to matches
  - `hours`: Number of hours volunteered
  - `feedback`: Volunteer's feedback
  - `completed_at`: When the volunteering was completed

### 10. notifications
- System for alerting users
- Fields:
  - `id`: Primary key
  - `user_id`: Foreign key to users
  - `message`: Notification text
  - `type`: Type of notification
  - `is_read`: Boolean flag for read status
  - `created_at`: When the notification was created

### 11. sessions
- Manages authentication tokens
- Fields:
  - `id`: Primary key
  - `user_id`: Foreign key to users
  - `token`: Unique token
  - `expires_at`: Token expiration timestamp

## Views

1. `volunteer_profiles_view`: Shows volunteer information with their skills
2. `event_details_view`: Shows events with their required skills
3. `volunteer_history_view`: Shows complete volunteer history with event details
4. `pending_matches_view`: Shows matches awaiting admin approval

## Database Relationships

- User → Profile: One-to-one
- Profile → Skills: Many-to-many (via profile_skills)
- Profile → Availability: One-to-many
- Event → Skills: Many-to-many (via event_skills)
- User → Events (created_by): One-to-many
- User → Matches (volunteer_id): One-to-many
- Event → Matches: One-to-many
- Match → Volunteer History: One-to-one
- User → Notifications: One-to-many
- User → Sessions: One-to-many
