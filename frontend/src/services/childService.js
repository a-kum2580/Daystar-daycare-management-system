import api from './api.config';

// Mock data for demonstration
const mockChildren = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2020-01-01',
    gender: 'male',
    parentName: 'Jane Doe',
    parentPhone: '+256 700 123 456',
    parentEmail: 'jane@example.com',
    address: '123 Main St, Kampala',
    emergencyContact: 'Mike Doe',
    medicalNotes: 'None',
    allergies: 'None',
    medications: 'None',
    specialNeeds: 'None',
    enrollmentDate: '2023-01-01',
    sessionType: 'full-day'
  },
  // Add more mock children as needed
];

const mockAttendance = [
  {
    childId: '1',
    childName: 'John Doe',
    sessionType: 'full-day',
    checkInTime: '08:00',
    checkOutTime: '16:00',
    status: 'present'
  },
  // Add more mock attendance records as needed
];

const mockIncidents = [
  {
    id: '1',
    childId: '1',
    incidentType: 'health',
    date: '2023-12-01',
    time: '10:30',
    description: 'Child had a mild fever',
    actionTaken: 'Given medication and monitored',
    reportedBy: 'Sarah Smith',
    severity: 'low',
    followUpRequired: true,
    followUpNotes: 'Parent informed, will monitor temperature'
  },
  // Add more mock incidents as needed
];

export const childService = {
  // Get all children
  getAllChildren: async () => {
    try {
      // In a real application, this would make an API call
      return mockChildren;
    } catch (error) {
      console.error('Error fetching children:', error);
      throw new Error('Failed to fetch children list');
    }
  },

  // Get a single child by ID
  getChild: async (childId) => {
    const response = await api.get(`/children/${childId}`);
    return response.data;
  },

  // Create a new child
  createChild: async (childData) => {
    try {
      // In a real application, this would make an API call
      console.log('Creating child:', childData);
      return { success: true, data: { ...childData, id: Date.now().toString() } };
    } catch (error) {
      console.error('Error creating child:', error);
      throw new Error('Failed to create child record');
    }
  },

  // Update a child
  updateChild: async (childId, childData) => {
    try {
      // In a real application, this would make an API call
      console.log('Updating child:', childId, childData);
      const response = await api.put(`/children/${childId}`, childData);
      return response.data;
    } catch (error) {
      console.error('Error updating child:', error);
      throw new Error('Failed to update child record');
    }
  },

  // Delete a child
  deleteChild: async (childId) => {
    const response = await api.delete(`/children/${childId}`);
    return response.data;
  },

  getChildById: async (childId) => {
    try {
      // In a real application, this would make an API call
      const child = mockChildren.find(child => child.id === childId);
      if (!child) {
        throw new Error('Child not found');
      }
      return child;
    } catch (error) {
      console.error('Error fetching child:', error);
      throw new Error('Failed to fetch child data');
    }
  },

  // Attendance Tracking
  getAttendance: async (date) => {
    try {
      // In a real application, this would make an API call with the date parameter
      return mockAttendance;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw new Error('Failed to fetch attendance data');
    }
  },

  updateAttendance: async (childId, date, status) => {
    try {
      // In a real application, this would make an API call
      console.log('Updating attendance:', { childId, date, status });
      return { success: true };
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw new Error('Failed to update attendance record');
    }
  },

  // Incident Reporting
  reportIncident: async (incidentData) => {
    try {
      // In a real application, this would make an API call
      console.log('Reporting incident:', incidentData);
      return { success: true, data: { ...incidentData, id: Date.now().toString() } };
    } catch (error) {
      console.error('Error reporting incident:', error);
      throw new Error('Failed to report incident');
    }
  },

  getIncidents: async (childId) => {
    try {
      // In a real application, this would make an API call
      return mockIncidents.filter(incident => incident.childId === childId);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      throw new Error('Failed to fetch incident records');
    }
  }
}; 