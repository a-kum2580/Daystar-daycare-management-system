import api from './api';

const incidentService = {
  getAll: () => api.get('/incidents'),
  getById: (id) => api.get(`/incidents/${id}`),
  create: (data) => api.post('/incidents', data),
  update: (id, data) => api.put(`/incidents/${id}`, data),
  delete: (id) => api.delete(`/incidents/${id}`),
  getByChild: (childId) => api.get(`/incidents/child/${childId}`),
  getByDateRange: (startDate, endDate) => 
    api.get(`/incidents/range/${startDate}/${endDate}`),
  getSeverityStats: () => api.get('/incidents/stats/severity'),
  getMonthlyStats: (year, month) => 
    api.get(`/incidents/stats/monthly/${year}/${month}`)
};




export default incidentService; 