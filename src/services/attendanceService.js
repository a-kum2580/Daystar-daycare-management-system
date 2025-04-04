import api from './api.config';

export const attendanceService = {
  // Get all attendance records with optional filters
  getAllAttendance: async (filters = {}) => {
    const response = await api.get('/attendance', { params: filters });
    return response.data;
  },

  // Get daily attendance records
  getDailyAttendance: async (date, personType) => {
    const response = await api.get('/attendance/daily', {
      params: { date, person_type: personType }
    });
    return response.data;
  },

  // Get a single attendance record
  getAttendanceRecord: async (recordId) => {
    const response = await api.get(`/attendance/${recordId}`);
    return response.data;
  },

  // Check in a person (child or babysitter)
  checkIn: async (data) => {
    const response = await api.post('/attendance/check-in', data);
    return response.data;
  },

  // Check out a person
  checkOut: async (data) => {
    const response = await api.post('/attendance/check-out', data);
    return response.data;
  },

  // Update an attendance record
  updateAttendance: async (recordId, data) => {
    const response = await api.put(`/attendance/${recordId}`, data);
    return response.data;
  },

  // Delete an attendance record
  deleteAttendance: async (recordId) => {
    const response = await api.delete(`/attendance/${recordId}`);
    return response.data;
  }
}; 