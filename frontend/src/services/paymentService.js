import api from './api';

export const paymentService = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  delete: (id) => api.delete(`/payments/${id}`),
  getByParent: (parentId) => api.get(`/payments/parent/${parentId}`),
  getByDateRange: (startDate, endDate) => 
    api.get(`/payments/range/${startDate}/${endDate}`),
  getMonthlyReport: (year, month) => 
    api.get(`/payments/report/monthly/${year}/${month}`),
  getOutstanding: () => api.get('/payments/outstanding'),
  processPayment: (id) => api.post(`/payments/${id}/process`)
}; 