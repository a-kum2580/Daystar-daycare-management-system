import api from './api';

export const parentService = {
  getAll: () => api.get('/parents'),
  getById: (id) => api.get(`/parents/${id}`),
  create: (data) => api.post('/parents', data),
  update: (id, data) => api.put(`/parents/${id}`, data),
  delete: (id) => api.delete(`/parents/${id}`),
  getChildren: (id) => api.get(`/parents/${id}/children`),
  getPayments: (id) => api.get(`/parents/${id}/payments`)
}; 