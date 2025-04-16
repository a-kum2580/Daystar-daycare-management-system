import api from './api';

const childService = {
  getAllChildren: async () => {
    try {
      const response = await api.get('/children');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch children' };
    }
  },

  getChildById: async (id) => {
    try {
      const response = await api.get(`/children/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch child details' };
    }
  },

  createChild: async (childData) => {
    try {
      const response = await api.post('/children', childData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create child record' };
    }
  },

  updateChild: async (id, childData) => {
    try {
      const response = await api.put(`/children/${id}`, childData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update child record' };
    }
  },

  deleteChild: async (id) => {
    try {
      const response = await api.delete(`/children/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete child record' };
    }
  },

  getChildAttendance: async (id) => {
    try {
      const response = await api.get(`/children/${id}/attendance`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch child attendance' };
    }
  },

  updateChildAttendance: async (id, attendanceData) => {
    try {
      const response = await api.post(`/children/${id}/attendance`, attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update child attendance' };
    }
  },

  getChildProgress: async (id) => {
    try {
      const response = await api.get(`/children/${id}/progress`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch child progress' };
    }
  },

  updateChildProgress: async (id, progressData) => {
    try {
      const response = await api.post(`/children/${id}/progress`, progressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update child progress' };
    }
  }
};

export default childService; 