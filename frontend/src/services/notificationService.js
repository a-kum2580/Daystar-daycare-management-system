// Mock API for development
const mockApi = {
  post: async (endpoint, data) => {
    console.log('API Call:', endpoint, data);
    return { data: { success: true } };
  },
  get: async (endpoint) => {
    console.log('API Call:', endpoint);
    return { data: {} };
  },
  put: async (endpoint, data) => {
    console.log('API Call:', endpoint, data);
    return { data: { success: true } };
  },
  put: async (endpoint, data) => {
    console.log('API Call:', endpoint, data);
    return { data: { success: true } };
  }
};

class NotificationService {
  // Parent Notifications
  async sendParentNotification(parentId, type, message, data = {}) {
    try {
      // Get parent's notification preferences
      const preferences = await this.getParentPreferences(parentId);
      
      // Send notification through preferred channels
      const promises = [];
      
      if (preferences.inApp) {
        promises.push(
          mockApi.post('/notifications/parent', {
            parentId,
            type,
            message,
            data,
            channel: 'inApp'
          })
        );
      }
      
      if (preferences.email) {
        promises.push(
          mockApi.post('/notifications/email', {
            parentId,
            type,
            message,
            data,
            channel: 'email'
          })
        );
      }
      
      if (preferences.sms) {
        promises.push(
          mockApi.post('/notifications/sms', {
            parentId,
            type,
            message,
            data,
            channel: 'sms'
          })
        );
      }

      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      console.error('Error sending parent notification:', error);
      throw new Error('Failed to send parent notification');
    }
  }

  // Get Parent Preferences
  async getParentPreferences(parentId) {
    try {
      const response = await mockApi.get(`/notifications/preferences/${parentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching parent preferences:', error);
      // Return default preferences if not set
      return {
        inApp: true,
        email: false,
        sms: false
      };
    }
  }

  // Update Parent Preferences
  async updateParentPreferences(parentId, preferences) {
    try {
      const response = await mockApi.put(`/notifications/preferences/${parentId}`, preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating parent preferences:', error);
      throw new Error('Failed to update notification preferences');
    }
  }

  // Child Status Updates
  async notifyChildStatusUpdate(childId, status, timestamp) {
    try {
      const response = await mockApi.get(`/children/${childId}/parent`);
      const parentId = response.data.parentId;
      
      const message = `Your child has been ${status} at ${new Date(timestamp).toLocaleTimeString()}`;
      return this.sendParentNotification(parentId, 'STATUS_UPDATE', message, {
        childId,
        status,
        timestamp
      });
    } catch (error) {
      console.error('Error notifying child status update:', error);
      throw new Error('Failed to send child status notification');
    }
  }

  // Payment Notifications
  async sendPaymentReminder(parentId, amount, dueDate) {
    const message = `Reminder: Payment of ${amount} UGX is due on ${new Date(dueDate).toLocaleDateString()}`;
    return this.sendParentNotification(parentId, 'PAYMENT_REMINDER', message, {
      amount,
      dueDate
    });
  }

  async sendOverduePaymentNotification(parentId, amount, daysOverdue) {
    const message = `URGENT: Payment of ${amount} UGX is ${daysOverdue} days overdue`;
    return this.sendParentNotification(parentId, 'PAYMENT_OVERDUE', message, {
      amount,
      daysOverdue
    });
  }

  // Budget Alerts
  async sendBudgetAlert(category, currentAmount, threshold, period) {
    try {
      const response = await mockApi.post('/notifications/budget-alert', {
        category,
        currentAmount,
        threshold,
        period,
        message: `Budget alert: ${category} expenses (${currentAmount} UGX) have exceeded the threshold of ${threshold} UGX for ${period}`
      });
      return response.data;
    } catch (error) {
      console.error('Error sending budget alert:', error);
      throw new Error('Failed to send budget alert');
    }
  }

  // Get Notifications
  async getParentNotifications(parentId) {
    try {
      const response = await mockApi.get(`/notifications/parent/${parentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching parent notifications:', error);
      throw new Error('Failed to fetch parent notifications');
    }
  }

  async getBudgetAlerts() {
    try {
      const response = await mockApi.get('/notifications/budget-alerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching budget alerts:', error);
      throw new Error('Failed to fetch budget alerts');
    }
  }

  // Mark as Read
  async markNotificationAsRead(notificationId) {
    try {
      const response = await mockApi.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  // Get Notification History
  async getNotificationHistory(parentId, startDate, endDate) {
    try {
      const response = await mockApi.get(`/notifications/history/${parentId}`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notification history:', error);
      throw new Error('Failed to fetch notification history');
    }
  }

  // Send notification via email
  async sendEmail(parentEmail, subject, message) {
    try {
      const response = await mockApi.post('/notifications/email', {
        to: parentEmail,
        subject,
        message,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      throw error;
    }
  }

  // Send notification via SMS
  async sendSMS(parentPhone, message) {
    try {
      const response = await mockApi.post('/notifications/sms', {
        to: parentPhone,
        message,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
      throw error;
    }
  }

  // Send notification via both email and SMS
  async sendNotification(parent, notification) {
    try {
      const { email, phone } = parent;
      const { type, childName, message } = notification;

      // Format message based on notification type
      const formattedMessage = this.formatNotificationMessage(type, childName, message);

      // Send email if parent has email
      if (email) {
        await this.sendEmail(
          email,
          `DayStarConnect Notification: ${type}`,
          formattedMessage
        );
      }

      // Send SMS if parent has phone
      if (phone) {
        await this.sendSMS(phone, formattedMessage);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

  // Get parent contact information
  async getParentContacts(childId) {
    try {
      const response = await mockApi.get(`/parents/${childId}/contacts`);
      return response.data;
    } catch (error) {
      console.error('Failed to get parent contacts:', error);
      throw error;
    }
  }

  // Helper function to format notification messages
  formatNotificationMessage(type, childName, message) {
    const timestamp = new Date().toLocaleString();
    
    switch (type) {
      case 'check-in':
        return `Dear Parent,\n\n${childName} has been checked in at ${message}.\n\nTime: ${timestamp}\n\nThank you,\nDayStarConnect Team`;
      
      case 'check-out':
        return `Dear Parent,\n\n${childName} has been checked out at ${message}.\n\nTime: ${timestamp}\n\nThank you,\nDayStarConnect Team`;
      
      case 'payment':
        return `Dear Parent,\n\nPayment Reminder: ${message}\n\nChild: ${childName}\n\nTime: ${timestamp}\n\nThank you,\nDayStarConnect Team`;
      
      case 'incident':
        return `Dear Parent,\n\nIncident Report for ${childName}:\n\n${message}\n\nTime: ${timestamp}\n\nPlease contact us if you have any questions.\n\nDayStarConnect Team`;
      
      default:
        return `Dear Parent,\n\n${message}\n\nChild: ${childName}\n\nTime: ${timestamp}\n\nThank you,\nDayStarConnect Team`;
    }
  }
}

export const notificationService = new NotificationService(); 