// Mock data for front-end development before backend integration

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
        new Date(2023, 9, 10), 
        new Date(2023, 9, 17), 
        new Date(2023, 9, 24)
      ]
    }
  }
];

// Sample events
export const events = [
  {
    _id: "1",
    name: "Community Health Fair",
    description: "Annual health fair providing free check-ups and health education for the community",
    location: "Community Center, 789 Main St, Centertown, CA 12345",
    requiredSkills: ["medical", "organizing"],
    urgency: "medium",
    date: new Date(2023, 9, 15)
  },
  {
    _id: "2",
    name: "Food Drive",
    description: "Collecting and distributing food to those in need",
    location: "Food Bank, 101 Charity Ln, Givingville, NY 67890",
    requiredSkills: ["cooking", "driving", "organizing"],
    urgency: "high",
    date: new Date(2023, 9, 20)
  },
  {
    _id: "3",
    name: "Technology Workshop",
    description: "Teaching basic computer skills to seniors",
    location: "Senior Center, 202 Elder Rd, Ageville, CA 54321",
    requiredSkills: ["tech", "teaching"],
    urgency: "low",
    date: new Date(2023, 9, 25)
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
