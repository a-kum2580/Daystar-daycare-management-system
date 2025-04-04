import api from './api.config';

export const childService = {
  // Get all children
  getAllChildren: async () => {
    const response = await api.get('/children');
    return response.data;
  },

  // Get a single child by ID
  getChild: async (childId) => {
    const response = await api.get(`/children/${childId}`);
    return response.data;
  },

  // Create a new child
  createChild: async (childData) => {
    const response = await api.post('/children', childData);
    return response.data;
  },

  // Update a child
  updateChild: async (childId, childData) => {
    const response = await api.put(`/children/${childId}`, childData);
    return response.data;
  },

  // Delete a child
  deleteChild: async (childId) => {
    const response = await api.delete(`/children/${childId}`);
    return response.data;
  }
}; 