import api from './api.config';

const incidentService = {
  // Submit a new incident report
  submitIncident: async (incidentData) => {
    try {
      const response = await api.post('/incidents', incidentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit incident report' };
    }
  },

  // Get all incidents (for managers)
  getAllIncidents: async () => {
    try {
      const response = await api.get('/incidents');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch incidents' };
    }
  },

  // Get incidents for a specific child
  getChildIncidents: async (childId) => {
    try {
      const response = await api.get(`/incidents/child/${childId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch child incidents' };
    }
  },

  // Update incident status (for managers)
  updateIncidentStatus: async (incidentId, status) => {
    try {
      const response = await api.patch(`/incidents/${incidentId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update incident status' };
    }
  }
};

export default incidentService; 