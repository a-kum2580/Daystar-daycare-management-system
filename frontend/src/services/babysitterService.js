import api from './api';

const babysitterService = {
  // Get all babysitters
  getAllBabysitters: async () => {
    try {
      const response = await api.get('/babysitters');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch babysitters' };
    }
  },

  // Get a single babysitter by ID
  getBabysitterById: async (id) => {
    try {
      const response = await api.get(`/babysitters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch babysitter details' };
    }
  },

  // Create a new babysitter
  createBabysitter: async (babysitterData) => {
    try {
      const response = await api.post('/babysitters', babysitterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create babysitter' };
    }
  },

  // Update a babysitter
  updateBabysitter: async (id, babysitterData) => {
    try {
      const response = await api.put(`/babysitters/${id}`, babysitterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update babysitter' };
    }
  },

  // Delete a babysitter
  deleteBabysitter: async (id) => {
    try {
      const response = await api.delete(`/babysitters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete babysitter' };
    }
  },

  // Reset babysitter password
  resetBabysitterPassword: async (id) => {
    try {
      const response = await api.post(`/babysitters/${id}/reset-password`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reset babysitter password' };
    }
  },

  // Get babysitter schedule
  getBabysitterSchedule: async (id) => {
    try {
      const response = await api.get(`/babysitters/${id}/schedule`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch babysitter schedule' };
    }
  },

  // Update babysitter schedule
  updateBabysitterSchedule: async (id, scheduleData) => {
    try {
      const response = await api.put(`/babysitters/${id}/schedule`, scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update babysitter schedule' };
    }
  },

  // Get babysitter payments
  getBabysitterPayments: async (id) => {
    const response = await api.get(`/babysitters/${id}/payments`);
    return response.data;
  },

  // Record babysitter payment
  recordBabysitterPayment: async (id, paymentData) => {
    const response = await api.post(`/babysitters/${id}/payments`, paymentData);
    return response.data;
  },
};

export default babysitterService; 