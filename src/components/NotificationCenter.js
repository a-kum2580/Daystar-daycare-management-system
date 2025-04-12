import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { notificationService } from '../services/notificationService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { theme } from '../config/theme';

const NotificationCenter = ({ userType, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadNotifications();
  }, [userType, userId, dateRange]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (userType === 'parent') {
        data = await notificationService.getNotificationHistory(
          userId,
          dateRange.startDate,
          dateRange.endDate
        );
      } else {
        data = await notificationService.getBudgetAlerts();
      }

      setNotifications(data);
    } catch (error) {
      setError('Failed to load notifications');
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'STATUS_UPDATE':
        return '👶';
      case 'PAYMENT_REMINDER':
        return '💰';
      case 'PAYMENT_OVERDUE':
        return '⚠️';
      case 'BUDGET_ALERT':
        return '📊';
      default:
        return '📢';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'inApp':
        return '📱';
      case 'email':
        return '📧';
      case 'sms':
        return '📱';
      default:
        return '';
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'STATUS_UPDATE':
        return {
          borderColor: theme.colors.primary[200],
          backgroundColor: theme.colors.primary[50]
        };
      case 'PAYMENT_REMINDER':
        return {
          borderColor: theme.colors.warning[200],
          backgroundColor: theme.colors.warning[50]
        };
      case 'PAYMENT_OVERDUE':
        return {
          borderColor: theme.colors.error[200],
          backgroundColor: theme.colors.error[50]
        };
      case 'BUDGET_ALERT':
        return {
          borderColor: theme.colors.secondary[200],
          backgroundColor: theme.colors.secondary[50]
        };
      default:
        return {
          borderColor: theme.colors.gray[200],
          backgroundColor: theme.colors.gray[50]
        };
    }
  };

  return (
    <Card className="p-6" style={{ 
      backgroundColor: theme.colors.gray[50],
      boxShadow: theme.boxShadow.lg
    }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold" style={{ 
          color: theme.colors.primary[700],
          fontFamily: theme.typography.fontFamily.sans.join(',')
        }}>
          Notifications
        </h2>
        <div className="flex items-center space-x-4">
          {userType === 'parent' && (
            <>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="border rounded px-3 py-2"
                style={{
                  borderColor: theme.colors.gray[300],
                  backgroundColor: theme.colors.gray[50]
                }}
              />
              <span style={{ color: theme.colors.gray[600] }}>to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="border rounded px-3 py-2"
                style={{
                  borderColor: theme.colors.gray[300],
                  backgroundColor: theme.colors.gray[50]
                }}
              />
            </>
          )}
          <Button 
            onClick={loadNotifications} 
            disabled={loading}
            style={{
              backgroundColor: theme.colors.primary[500],
              color: 'white',
              '&:hover': {
                backgroundColor: theme.colors.primary[600]
              }
            }}
          >
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: theme.colors.primary[500] }}
          ></div>
          <p className="mt-4" style={{ color: theme.colors.gray[600] }}>
            Loading notifications...
          </p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8" style={{ color: theme.colors.gray[500] }}>
          No notifications
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => {
            const style = getNotificationStyle(notification.type);
            return (
              <div
                key={notification.id}
                className="border rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                style={{
                  ...style,
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div>
                      <p className="font-medium" style={{ color: theme.colors.gray[800] }}>
                        {notification.message}
                      </p>
                      {notification.data && (
                        <div className="mt-2 text-sm" style={{ color: theme.colors.gray[600] }}>
                          {notification.type === 'PAYMENT_REMINDER' && (
                            <>
                              <p>Amount: {formatCurrency(notification.data.amount)}</p>
                              <p>Due Date: {formatDate(notification.data.dueDate)}</p>
                            </>
                          )}
                          {notification.type === 'BUDGET_ALERT' && (
                            <>
                              <p>Category: {notification.data.category}</p>
                              <p>Current Amount: {formatCurrency(notification.data.currentAmount)}</p>
                              <p>Threshold: {formatCurrency(notification.data.threshold)}</p>
                            </>
                          )}
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        {notification.channels?.map(channel => (
                          <span 
                            key={channel} 
                            className="text-sm" 
                            title={channel}
                            style={{ color: theme.colors.gray[500] }}
                          >
                            {getChannelIcon(channel)}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs mt-2" style={{ color: theme.colors.gray[400] }}>
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      style={{
                        borderColor: theme.colors.primary[300],
                        color: theme.colors.primary[600],
                        '&:hover': {
                          backgroundColor: theme.colors.primary[50]
                        }
                      }}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default NotificationCenter; 