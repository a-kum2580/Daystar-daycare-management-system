import api from './api.config';

export const enrollmentService = {
  submitEnrollment: async (enrollmentData) => {
    try {
      const response = await api.post('/enrollments', enrollmentData);
      return response.data;
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      throw error;
    }
  },
  
  getEnrollmentStatus: async (enrollmentId) => {
    try {
      const response = await api.get(`/enrollments/${enrollmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting enrollment status:', error);
      throw error;
    }
  }
}; 