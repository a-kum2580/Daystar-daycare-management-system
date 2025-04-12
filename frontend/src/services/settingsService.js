import api from './api.config';

const settingsService = {
  getSettings: async () => {
    try {
      const response = await api.get('/settings');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch settings' };
    }
  },

  updateSettings: async (settingsData) => {
    try {
      const response = await api.put('/settings', settingsData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update settings' };
    }
  },

  getNotificationSettings: async () => {
    try {
      const response = await api.get('/settings/notifications');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch notification settings' };
    }
  },

  updateNotificationSettings: async (notificationSettings) => {
    try {
      const response = await api.put('/settings/notifications', notificationSettings);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update notification settings' };
    }
  },

  getEmailSettings: async () => {
    try {
      const response = await api.get('/settings/email');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch email settings' };
    }
  },

  updateEmailSettings: async (emailSettings) => {
    try {
      const response = await api.put('/settings/email', emailSettings);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update email settings' };
    }
  },

  getBackupSettings: async () => {
    try {
      const response = await api.get('/settings/backup');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch backup settings' };
    }
  },

  updateBackupSettings: async (backupSettings) => {
    try {
      const response = await api.put('/settings/backup', backupSettings);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update backup settings' };
    }
  },

  createBackup: async () => {
    try {
      const response = await api.post('/settings/backup');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create backup' };
    }
  },

  restoreBackup: async (backupId) => {
    try {
      const response = await api.post(`/settings/backup/${backupId}/restore`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to restore backup' };
    }
  }
};

export default settingsService; 