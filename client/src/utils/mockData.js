// Mock data for front-end development before backend integration

// Sample events
export const events = [
  {
    _id: "1",
    name: "Community Health Fair",
    description: "Free health checkups and wellness information for everyone in the community",
    location: "Community Center, 789 Main St, Centertown, CA 12345",
    requiredSkills: ["medical", "organizing"],
    urgency: "medium",
    date: new Date(2026, 11, 15) // December 15, 2026
  },
  {
    _id: "2",
    name: "Food Drive",
    description: "Help collect and sort food donations for families in need",
    location: "Food Bank, 101 Charity Ln, Givingville, NY 67890",
    requiredSkills: ["cooking", "driving", "organizing"],
    urgency: "high",
    date: new Date(2026, 11, 20) // December 20, 2026
  },
  {
    _id: "3",
    name: "Technology Workshop",
    description: "Teach older adults how to use computers and smartphones",
    location: "Senior Center, 202 Elder Rd, Ageville, CA 54321",
    requiredSkills: ["tech", "teaching"],
    urgency: "low",
    date: new Date(2026, 11, 25) // December 25, 2026
  }
];

// Sample volunteer-event matches
export const matches = [
  {
    _id: "1",
    volunteerId: "2",
    eventId: "1",
    status: "confirmed"
  },
  {
    _id: "2",
    volunteerId: "2",
    eventId: "2",
    status: "pending"
  }
];

// Sample volunteer history
export const history = [
  {
    _id: "1",
    volunteerId: "2",
    eventId: "1",
    status: "completed",
    hours: 4,
    feedback: "It was a great experience helping at the health fair!"
  }
];

// Sample users with different roles
export const users = [
  {
    id: "1",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    profile: {
      fullName: "Admin User",
      address1: "123 Admin St",
      address2: "Suite 100",
      city: "Adminville",
      state: "CA",
      zipCode: "12345",
      skills: ["organizing", "tech", "management"],
      preferences: "I prefer administrative tasks",
      availability: [
        new Date(2023, 9, 15), 
        new Date(2023, 9, 16), 
        new Date(2023, 9, 20)
      ]
    }
  },
  {
    id: "2",
    email: "volunteer@example.com",
    firstName: "Volunteer",
    lastName: "User",
    role: "volunteer",
    profile: {
      fullName: "Volunteer User",
      address1: "456 Helper Ave",
      address2: "",
      city: "Helptown",
      state: "NY",
      zipCode: "67890",
      skills: ["medical", "cooking", "driving"],
      preferences: "I enjoy helping with medical services",
      availability: [
        new Date(2026, 11, 10), 
        new Date(2026, 11, 17), 
        new Date(2026, 11, 24)
      ]
    }
  }
];
