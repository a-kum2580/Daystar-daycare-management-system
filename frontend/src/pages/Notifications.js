import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Bell, Mail, AlertCircle, Clock } from 'lucide-react';
import { notificationService } from '../services/notificationService';

export function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'check-in',
      childName: 'John Doe',
      parentName: 'Jane Doe',
      parentEmail: 'jane.doe@example.com',
      parentPhone: '+256700000000',
      message: 'John has been checked in at 08:00 AM',
      timestamp: '2024-04-15 08:00',
      status: 'sent',
      category: 'status'
    },
    {
      id: 2,
      type: 'payment',
      childName: 'Sarah Smith',
      parentName: 'Mike Smith',
      parentEmail: 'mike.smith@example.com',
      parentPhone: '+256700000001',
      message: 'Payment reminder: Monthly fee due in 3 days',
      timestamp: '2024-04-15 09:30',
      status: 'pending',
      category: 'payment'
    },
    {
      id: 3,
      type: 'incident',
      childName: 'Emma Johnson',
      parentName: 'Robert Johnson',
      parentEmail: 'robert.johnson@example.com',
      parentPhone: '+256700000002',
      message: 'Incident report: Minor fall in playground',
      timestamp: '2024-04-15 10:15',
      status: 'sent',
      category: 'incident'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleSendNotification = async (notification) => {
    try {
      // Get parent contact information
      const parent = {
        email: notification.parentEmail,
        phone: notification.parentPhone
      };

      // Send notification
      await notificationService.sendNotification(parent, {
        type: notification.type,
        childName: notification.childName,
        message: notification.message
      });
      
      // Update notification status
      setNotifications(prev => prev.map(n => 
        n.id === notification.id 
          ? { ...n, status: 'sent' }
          : n
      ));
    } catch (error) {
      console.error('Failed to send notification:', error);
      // Update notification status to failed
      setNotifications(prev => prev.map(n => 
        n.id === notification.id 
          ? { ...n, status: 'failed' }
          : n
      ));
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'check-in':
      case 'check-out':
        return <Clock className="w-5 h-5" />;
      case 'payment':
        return <Mail className="w-5 h-5" />;
      case 'incident':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent':
        return <Badge variant="success">Sent</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === filter);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Notifications & Alerts</h1>
        <div className="flex gap-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'status' ? 'default' : 'outline'}
            onClick={() => setFilter('status')}
          >
            Status Updates
          </Button>
          <Button
            variant={filter === 'payment' ? 'default' : 'outline'}
            onClick={() => setFilter('payment')}
          >
            Payments
          </Button>
          <Button
            variant={filter === 'incident' ? 'default' : 'outline'}
            onClick={() => setFilter('incident')}
          >
            Incidents
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredNotifications.map((notification) => (
          <Card key={notification.id} className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                {getNotificationIcon(notification.type)}
                <CardTitle className="text-lg dark:text-white">
                  {notification.childName} - {notification.parentName}
                </CardTitle>
              </div>
              {getStatusBadge(notification.status)}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-300">{notification.message}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(notification.timestamp).toLocaleString()}
                  </span>
                  {notification.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleSendNotification(notification)}
                    >
                      Send Now
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Notifications; 