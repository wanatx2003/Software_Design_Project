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


export const mockData = {
  volunteers: [
    { id: 'v1',  name: 'Alex Kim',        skills: ['medical','driving'],                availability: ['2025-10-01','2025-10-05'], maxDistanceKm: 25, homeZip: '77001' },
    { id: 'v2',  name: 'Priya Singh',     skills: ['teaching','language','organizing'], availability: ['2025-10-02','2025-10-05'], maxDistanceKm: 50, homeZip: '77002' },
    { id: 'v3',  name: 'Marco Alvarez',   skills: ['construction','driving'],           availability: ['2025-10-01','2025-10-03'], maxDistanceKm: 35, homeZip: '77006' },
    { id: 'v4',  name: 'Jasmine Patel',   skills: ['medical','organizing'],             availability: ['2025-10-02','2025-10-06'], maxDistanceKm: 20, homeZip: '77007' },
    { id: 'v5',  name: 'Ethan Chen',      skills: ['tech','language'],                  availability: ['2025-10-03','2025-10-05'], maxDistanceKm: 40, homeZip: '77008' },
    { id: 'v6',  name: 'Sara Johnson',    skills: ['cooking','organizing'],             availability: ['2025-10-01','2025-10-03','2025-10-06'], maxDistanceKm: 30, homeZip: '77009' },
    { id: 'v7',  name: 'Omar Hassan',     skills: ['counseling','language'],            availability: ['2025-10-02','2025-10-06'], maxDistanceKm: 45, homeZip: '77010' },
    { id: 'v8',  name: 'Mia Rodriguez',   skills: ['teaching','fundraising'],           availability: ['2025-10-03','2025-10-04'], maxDistanceKm: 30, homeZip: '77011' },
    { id: 'v9',  name: 'Liam Nguyen',     skills: ['tech','organizing','driving'],      availability: ['2025-10-01','2025-10-02','2025-10-05'], maxDistanceKm: 50, homeZip: '77012' },
    { id: 'v10', name: 'Ava Thompson',    skills: ['medical','counseling'],             availability: ['2025-10-05','2025-10-06'], maxDistanceKm: 25, homeZip: '77013' },
    { id: 'v11', name: 'Diego Morales',   skills: ['construction','organizing'],        availability: ['2025-10-02','2025-10-05'], maxDistanceKm: 60, homeZip: '77014' },
    { id: 'v12', name: 'Hannah Lee',      skills: ['cooking','fundraising'],            availability: ['2025-10-01','2025-10-04','2025-10-06'], maxDistanceKm: 35, homeZip: '77015' },
    { id: 'v13', name: 'Noah Williams',   skills: ['tech','teaching'],                  availability: ['2025-10-02','2025-10-03'], maxDistanceKm: 30, homeZip: '77016' },
    { id: 'v14', name: 'Sophia Garcia',   skills: ['language','organizing','medical'],  availability: ['2025-10-01','2025-10-06'], maxDistanceKm: 20, homeZip: '77017' },
  ],

  // Updated events with fields your UI expects: name, location, urgency, description
  events: [
    {
      id: 'e1',
      title: 'Health Camp – Midtown',
      name: 'Health Camp – Midtown',
      date: '2025-10-01',
      locationZip: '77003',
      location: 'Midtown Clinic, 77003',
      urgency: 'high',
      description: 'Pop-up health screening and basic care services.',
      requiredSkills: ['medical','organizing'],
      capacity: 5,
      assignedVolunteerIds: ['v1']
    },
    {
      id: 'e2',
      title: 'Community Tutoring',
      name: 'Community Tutoring',
      date: '2025-10-02',
      locationZip: '77002',
      location: 'Downtown Library, 77002',
      urgency: 'medium',
      description: 'After-school tutoring for K–12 students.',
      requiredSkills: ['teaching','language'],
      capacity: 3,
      assignedVolunteerIds: []
    },
    {
      id: 'e3',
      title: 'Food Drive Prep',
      name: 'Food Drive Prep',
      date: '2025-10-01',
      locationZip: '77008',
      location: 'Warehouse 5, 77008',
      urgency: 'low',
      description: 'Sort and package donations for weekend distribution.',
      requiredSkills: ['cooking','organizing'],
      capacity: 4,
      assignedVolunteerIds: ['v6']
    },
    {
      id: 'e4',
      title: 'Neighborhood Repairs',
      name: 'Neighborhood Repairs',
      date: '2025-10-03',
      locationZip: '77006',
      location: 'Montrose Block A, 77006',
      urgency: 'medium',
      description: 'Light repairs and accessibility improvements for seniors.',
      requiredSkills: ['construction','driving'],
      capacity: 6,
      assignedVolunteerIds: ['v3']
    },
    {
      id: 'e5',
      title: 'Career Tech Workshop',
      name: 'Career Tech Workshop',
      date: '2025-10-03',
      locationZip: '77012',
      location: 'Community Center East, 77012',
      urgency: 'low',
      description: 'Intro to coding and job readiness in tech.',
      requiredSkills: ['tech','teaching'],
      capacity: 4,
      assignedVolunteerIds: []
    },
    {
      id: 'e6',
      title: 'Mental Health Booth',
      name: 'Mental Health Booth',
      date: '2025-10-06',
      locationZip: '77007',
      location: 'Bayou Park, 77007',
      urgency: 'high',
      description: 'Resource booth with counselors and support groups info.',
      requiredSkills: ['counseling','organizing'],
      capacity: 3,
      assignedVolunteerIds: []
    },
    {
      id: 'e7',
      title: 'Bilingual Help Desk',
      name: 'Bilingual Help Desk',
      date: '2025-10-02',
      locationZip: '77010',
      location: 'Civic Hall, 77010',
      urgency: 'medium',
      description: 'Language support for forms and city services.',
      requiredSkills: ['language','organizing'],
      capacity: 5,
      assignedVolunteerIds: []
    },
    {
      id: 'e8',
      title: 'Fundraising Gala Setup',
      name: 'Fundraising Gala Setup',
      date: '2025-10-04',
      locationZip: '77015',
      location: 'Grand Ballroom, 77015',
      urgency: 'critical',
      description: 'Set up and logistics for the annual fundraiser.',
      requiredSkills: ['fundraising','organizing'],
      capacity: 8,
      assignedVolunteerIds: ['v12','v8']
    },
    {
      id: 'e9',
      title: 'Mobile Clinic – Eastside',
      name: 'Mobile Clinic – Eastside',
      date: '2025-10-05',
      locationZip: '77013',
      location: 'Eastside Market Lot, 77013',
      urgency: 'high',
      description: 'Mobile clinic providing basic care and vaccinations.',
      requiredSkills: ['medical','driving'],
      capacity: 5,
      assignedVolunteerIds: []
    },
    {
      id: 'e10',
      title: 'Community Hack Night',
      name: 'Community Hack Night',
      date: '2025-10-05',
      locationZip: '77011',
      location: 'Innovation Hub, 77011',
      urgency: 'low',
      description: 'Build tools and dashboards for local orgs.',
      requiredSkills: ['tech','organizing'],
      capacity: 10,
      assignedVolunteerIds: ['v9']
    },
  ],

  // optional: seed matches if you want the dashboard’s "Pending Matches" to show something
  matches: [
    // { id: 'm1', volunteerId: 'v1', eventId: 'e1', status: 'pending' },
  ],
};


export const mockVolunteerApi = {
  async list() {
    await delay(150);
    return mockData.volunteers;
  },
};

export const mockEventApi = {
  async list() {
    await delay(150);
    return mockData.events;
  },
  async assignVolunteer(eventId, volunteerId) {
    await delay(150);
    const event = mockData.events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');
    if (event.assignedVolunteerIds.includes(volunteerId)) return event;
    if (event.assignedVolunteerIds.length >= event.capacity) {
      throw new Error('Event is at capacity');
    }
    event.assignedVolunteerIds.push(volunteerId);
    return event;
  },
};

function delay(ms){ return new Promise(r=>setTimeout(r, ms)); }