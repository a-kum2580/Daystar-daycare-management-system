import api from './api';

export const attendanceService = {
  getAll: () => api.get('/attendance'),
  getById: (id) => api.get(`/attendance/${id}`),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  delete: (id) => api.delete(`/attendance/${id}`),
  getByDate: (date) => api.get(`/attendance/date/${date}`),
  getByChild: (childId) => api.get(`/attendance/child/${childId}`),
  getByDateRange: (startDate, endDate) => 
    api.get(`/attendance/range/${startDate}/${endDate}`),
  getDailyReport: (date) => api.get(`/attendance/report/daily/${date}`),
  getMonthlyReport: (year, month) => 
    api.get(`/attendance/report/monthly/${year}/${month}`)
}; 