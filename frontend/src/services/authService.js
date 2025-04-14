import api from './api';

// Manager account (single account)
const MANAGER_CREDENTIALS = {
  email: 'manager@daystar.com',
  password: 'manager123',
  role: 'manager',
  name: 'DayStar Manager'
};

// Mock database for babysitters (in a real app, this would be a backend database)
let babysitters = [];

const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Babysitter management functions
  getAllBabysitters: () => {
    return babysitters;
  },

  getBabysitterById: (id) => {
    return babysitters.find(b => b.id === id);
  },

  updateBabysitter: (id, updates) => {
    const index = babysitters.findIndex(b => b.id === id);
    if (index !== -1) {
      babysitters[index] = { ...babysitters[index], ...updates };
      return babysitters[index];
    }
    return null;
  },

  deleteBabysitter: (id) => {
    babysitters = babysitters.filter(b => b.id !== id);
  }
};

export default authService; 