import api from './api';

const notificationService = {
  // Get unread notifications count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread/count');
      return response.data.count;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch unread notifications count' };
    }
  },

  // Get recent notifications
  getRecentNotifications: async (limit = 5) => {
    try {
      const response = await api.get('/notifications/recent', { params: { limit } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch recent notifications' };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark notification as read' };
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark all notifications as read' };
    }
  }
};

export default notificationService; 