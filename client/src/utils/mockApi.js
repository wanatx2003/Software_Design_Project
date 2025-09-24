import { users, events, matches, history } from './mockData';

// Helper to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock auth API functions
export const mockAuthApi = {
  login: async (credentials) => {
    await delay(800); // Simulate network delay
    
    const user = users.find(u => u.email === credentials.email);
    if (user && credentials.password === "password") { // Simple password check for mock
      return { 
        success: true, 
        token: "mock-jwt-token", 
        user
      };
    } else {
      throw new Error("Invalid credentials");
    }
  },
  
  register: async (userData) => {
    await delay(1000);
    
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      throw new Error("Email already registered");
    }
    
    // Create new user (would be done by backend)
    const newUser = {
      id: (users.length + 1).toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: "volunteer", // Default role
      profile: null // Profile not yet completed
    };
    
    users.push(newUser);
    
    return {
      success: true,
      token: "mock-jwt-token",
      user: newUser
    };
  },
  
  verify: async () => {
    await delay(500);
    // For demo purposes, always return the volunteer user
    return { 
      success: true, 
      user: users[1]
    };
  }
};

// Mock profile API functions
export const mockProfileApi = {
  getProfile: async (userId) => {
    await delay(600);
    
    const user = users.find(u => u.id === userId);
    return user ? user.profile : null;
  },
  
  saveProfile: async (userId, profileData) => {
    await delay(800);
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].profile = profileData;
      return { 
        success: true, 
        profile: profileData 
      };
    } else {
      throw new Error("User not found");
    }
  }
};

// Mock events API functions
export const mockEventsApi = {
  getAllEvents: async () => {
    await delay(700);
    return [...events];
  },
  
  createEvent: async (eventData) => {
    await delay(900);
    
    const newEvent = {
      ...eventData,
      _id: (events.length + 1).toString()
    };
    
    events.push(newEvent);
    return newEvent;
  },
  
  updateEvent: async (eventId, eventData) => {
    await delay(800);
    
    const eventIndex = events.findIndex(e => e._id === eventId);
    if (eventIndex !== -1) {
      events[eventIndex] = { ...events[eventIndex], ...eventData };
      return events[eventIndex];
    } else {
      throw new Error("Event not found");
    }
  },
  
  deleteEvent: async (eventId) => {
    await delay(700);
    
    const eventIndex = events.findIndex(e => e._id === eventId);
    if (eventIndex !== -1) {
      events.splice(eventIndex, 1);
      return { success: true };
    } else {
      throw new Error("Event not found");
    }
  }
};

// Other mock API functions as needed
export const mockVolunteersApi = {
  getAllVolunteers: async () => {
    await delay(700);
    
    return users
      .filter(u => u.role === "volunteer" && u.profile)
      .map(u => ({
        _id: u.id,
        fullName: u.profile.fullName,
        skills: u.profile.skills,
        availability: u.profile.availability
      }));
  }
};

export const mockMatchesApi = {
  getAllMatches: async () => {
    await delay(600);
    return [...matches];
  },
  
  getUserMatches: async (userId) => {
    await delay(500);
    return matches.filter(m => m.volunteerId === userId);
  }
};

export const mockHistoryApi = {
  getVolunteerHistory: async (userId) => {
    await delay(800);
    return history.filter(h => h.volunteerId === userId);
  }
};
