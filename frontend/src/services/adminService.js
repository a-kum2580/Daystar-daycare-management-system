import api from './api';

const adminService = {
  // Dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard statistics' };
    }
  },

  // User management
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user role' };
    }
  },

  // System settings
  getSystemSettings: async () => {
    try {
      const response = await api.get('/admin/settings');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch system settings' };
    }
  },

  updateSystemSettings: async (settings) => {
    try {
      const response = await api.put('/admin/settings', settings);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update system settings' };
    }
  },

  // Reports
  generateReport: async (reportType, dateRange) => {
    try {
      const response = await api.post('/admin/reports', { reportType, dateRange });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate report' };
    }
  },

  // Audit logs
  getAuditLogs: async (filters = {}) => {
    try {
      const response = await api.get('/admin/audit-logs', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch audit logs' };
    }
  }
};

export default adminService; 