import api from './api';

export const budgetService = {
  getAll: () => api.get('/budgets'),
  getById: (id) => api.get(`/budgets/${id}`),
  create: (data) => api.post('/budgets', data),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
  getByCategory: (category) => api.get(`/budgets/category/${category}`),
  getByStatus: (status) => api.get(`/budgets/status/${status}`),
  getMonthlyReport: (year, month) => 
    api.get(`/budgets/report/monthly/${year}/${month}`),
  getCategories: () => api.get('/budgets/categories'),
  approve: (id) => api.post(`/budgets/${id}/approve`),
  reject: (id) => api.post(`/budgets/${id}/reject`)
}; 