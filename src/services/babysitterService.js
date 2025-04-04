import api from './api.config';

const babysitterService = {
  getAllBabysitters: async () => {
    try {
      const response = await api.get('/babysitters');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch babysitters' };
    }
  },

  getBabysitterById: async (id) => {
    try {
      const response = await api.get(`/babysitters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch babysitter details' };
    }
  },

  createBabysitter: async (babysitterData) => {
    try {
      const response = await api.post('/babysitters', babysitterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create babysitter' };
    }
  },

  updateBabysitter: async (id, babysitterData) => {
    try {
      const response = await api.put(`/babysitters/${id}`, babysitterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update babysitter' };
    }
  },

  deleteBabysitter: async (id) => {
    try {
      const response = await api.delete(`/babysitters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete babysitter' };
    }
  },

  getBabysitterSchedule: async (id) => {
    try {
      const response = await api.get(`/babysitters/${id}/schedule`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch babysitter schedule' };
    }
  },

  updateBabysitterSchedule: async (id, scheduleData) => {
    try {
      const response = await api.put(`/babysitters/${id}/schedule`, scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update babysitter schedule' };
    }
  },

  getBabysitterPerformance: async (id) => {
    try {
      const response = await api.get(`/babysitters/${id}/performance`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch babysitter performance' };
    }
  }
};

export default babysitterService; 