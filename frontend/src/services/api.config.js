import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

// Babysitter API calls
export const babysitterAPI = {
  getAll: () => api.get('/babysitters'),
  getById: (id) => api.get(`/babysitters/${id}`),
  create: (data) => api.post('/babysitters', data),
  update: (id, data) => api.put(`/babysitters/${id}`, data),
  delete: (id) => api.delete(`/babysitters/${id}`),
  getAttendanceStats: (id) => api.get(`/babysitters/${id}/attendance-stats`),
};

// Child API calls
export const childAPI = {
  getAll: () => api.get('/children'),
  getById: (id) => api.get(`/children/${id}`),
  create: (data) => api.post('/children', data),
  update: (id, data) => api.put(`/children/${id}`, data),
  delete: (id) => api.delete(`/children/${id}`),
  getAttendanceStats: (id) => api.get(`/children/${id}/attendance-stats`),
  getRecentAttendance: (id) => api.get(`/children/${id}/recent-attendance`),
};

// Parent API calls
export const parentAPI = {
  getAll: () => api.get('/parents'),
  getById: (id) => api.get(`/parents/${id}`),
  create: (data) => api.post('/parents', data),
  update: (id, data) => api.put(`/parents/${id}`, data),
  delete: (id) => api.delete(`/parents/${id}`),
  getChildren: (id) => api.get(`/parents/${id}/children`),
  getAttendanceStats: (id) => api.get(`/parents/${id}/attendance-stats`),
};

// Attendance API calls
export const attendanceAPI = {
  create: (data) => api.post('/attendance', data),
  checkIn: (id) => api.post(`/attendance/${id}/check-in`),
  checkOut: (id) => api.post(`/attendance/${id}/check-out`),
  getByDate: (date) => api.get(`/attendance/date/${date}`),
  getByChild: (childId) => api.get(`/attendance/child/${childId}`),
  getByBabysitter: (babysitterId) => api.get(`/attendance/babysitter/${babysitterId}`),
  getDailyStats: (date) => api.get(`/attendance/stats/daily/${date}`),
  getMonthlyStats: (year, month) => api.get(`/attendance/stats/monthly/${year}/${month}`),
};

// Financial API calls
export const financialAPI = {
  createRecord: (data) => api.post('/financial/records', data),
  getAllRecords: () => api.get('/financial/records'),
  getRecordsByDateRange: (startDate, endDate) => 
    api.get(`/financial/records?startDate=${startDate}&endDate=${endDate}`),
  getMonthlySummary: (year, month) => 
    api.get(`/financial/summary/monthly/${year}/${month}`),
  getCategorySummary: (year, month) => 
    api.get(`/financial/summary/category/${year}/${month}`),
  createBabysitterPayment: (data) => api.post('/financial/payments', data),
  updatePaymentStatus: (id, status) => 
    api.put(`/financial/payments/${id}/status`, { status }),
  getBabysitterPayments: (babysitterId) => 
    api.get(`/financial/payments/babysitter/${babysitterId}`),
  getPendingPayments: () => api.get('/financial/payments/pending'),
  createBudgetCategory: (data) => api.post('/financial/budget-categories', data),
  updateBudgetCategory: (id, data) => 
    api.put(`/financial/budget-categories/${id}`, data),
  getBudgetCategories: () => api.get('/financial/budget-categories'),
  getBudgetVsActual: (year, month) => 
    api.get(`/financial/budget-vs-actual/${year}/${month}`),
};

// Incident API calls
export const incidentAPI = {
  create: (data) => api.post('/incidents', data),
  getAll: () => api.get('/incidents'),
  getById: (id) => api.get(`/incidents/${id}`),
  getByChild: (childId) => api.get(`/incidents/child/${childId}`),
  getByBabysitter: (babysitterId) => api.get(`/incidents/babysitter/${babysitterId}`),
  getByDateRange: (startDate, endDate) => 
    api.get(`/incidents?startDate=${startDate}&endDate=${endDate}`),
  getSeverityStats: () => api.get('/incidents/stats/severity'),
  getMonthlyStats: (year, month) => 
    api.get(`/incidents/stats/monthly/${year}/${month}`),
  update: (id, data) => api.put(`/incidents/${id}`, data),
};

export default api; 