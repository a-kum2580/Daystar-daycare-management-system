import api from './api.config';

const reportService = {
  generateAttendanceReport: async (params) => {
    try {
      const response = await api.get('/reports/attendance', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate attendance report' };
    }
  },

  generateFinancialReport: async (params) => {
    try {
      const response = await api.get('/reports/financial', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate financial report' };
    }
  },

  generateChildReport: async (params) => {
    try {
      const response = await api.get('/reports/children', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate child report' };
    }
  },

  generateBabysitterReport: async (params) => {
    try {
      const response = await api.get('/reports/babysitters', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate babysitter report' };
    }
  },

  generatePerformanceReport: async (params) => {
    try {
      const response = await api.get('/reports/performance', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate performance report' };
    }
  },

  exportReport: async (reportType, format, params) => {
    try {
      const response = await api.get(`/reports/export/${reportType}`, {
        params: { ...params, format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to export report' };
    }
  },

  getReportTemplates: async () => {
    try {
      const response = await api.get('/reports/templates');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch report templates' };
    }
  },

  saveReportTemplate: async (templateData) => {
    try {
      const response = await api.post('/reports/templates', templateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to save report template' };
    }
  }
};

export default reportService; 