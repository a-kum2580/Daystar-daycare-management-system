import api from './api.config';

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
  login: async (credentials) => {
    try {
      // Check if it's the manager
      if (credentials.email === MANAGER_CREDENTIALS.email && 
          credentials.password === MANAGER_CREDENTIALS.password) {
        localStorage.setItem('token', 'mock-token-manager');
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(MANAGER_CREDENTIALS));
        return { user: MANAGER_CREDENTIALS, token: 'mock-token-manager' };
      }

      // Check if it's a babysitter
      const babysitter = babysitters.find(
        b => b.email === credentials.email && b.password === credentials.password
      );

      if (babysitter) {
        localStorage.setItem('token', `mock-token-babysitter-${babysitter.id}`);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(babysitter));
        return { user: babysitter, token: `mock-token-babysitter-${babysitter.id}` };
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  register: async (userData) => {
    try {
      // Ensure only babysitters can register
      if (userData.role !== 'babysitter') {
        throw new Error('Only babysitter accounts can be created');
      }

      // Check if email already exists
      if (babysitters.some(b => b.email === userData.email)) {
        throw new Error('Email already registered');
      }

      // Create new babysitter account
      const newBabysitter = {
        ...userData,
        id: babysitters.length + 1,
        status: 'active'
      };

      babysitters.push(newBabysitter);
      return { success: true, user: newBabysitter };
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  forgotPassword: async (email) => {
    try {
      // Check if email exists (manager or babysitter)
      if (email === MANAGER_CREDENTIALS.email || 
          babysitters.some(b => b.email === email)) {
        return { success: true, message: 'Password reset email sent' };
      }
      throw new Error('Email not found');
    } catch (error) {
      throw error.response?.data || { message: 'Password reset request failed' };
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      // In a real app, this would verify the token and update the password
      return { success: true, message: 'Password reset successful' };
    } catch (error) {
      throw error.response?.data || { message: 'Password reset failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
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