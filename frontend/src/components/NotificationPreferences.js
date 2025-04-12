import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { notificationService } from '../services/notificationService';
import { theme } from '../config/theme';

const NotificationPreferences = ({ parentId }) => {
  const [preferences, setPreferences] = useState({
    inApp: true,
    email: true,
    sms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadPreferences();
  }, [parentId]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getParentPreferences(parentId);
      setPreferences(data);
    } catch (error) {
      setError('Failed to load notification preferences');
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (channel) => {
    try {
      setLoading(true);
      setError(null);
      const newPreferences = { ...preferences, [channel]: !preferences[channel] };
      await notificationService.updateParentPreferences(parentId, newPreferences);
      setPreferences(newPreferences);
      setSuccess('Preferences updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to update preferences');
      console.error('Error updating preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      setError(null);
      const defaultPreferences = {
        inApp: true,
        email: true,
        sms: false
      };
      await notificationService.updateParentPreferences(parentId, defaultPreferences);
      setPreferences(defaultPreferences);
      setSuccess('Preferences reset to default');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to reset preferences');
      console.error('Error resetting preferences:', error);
    } finally {
      setLoading(false);
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
          Notification Preferences
        </h2>
        <Button 
          onClick={handleReset}
          variant="outline"
          style={{
            borderColor: theme.colors.primary[300],
            color: theme.colors.primary[600],
            '&:hover': {
              backgroundColor: theme.colors.primary[50]
            }
          }}
        >
          Reset to Default
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: theme.colors.primary[500] }}
          ></div>
          <p className="mt-4" style={{ color: theme.colors.gray[600] }}>
            Loading preferences...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg" style={{
            borderColor: theme.colors.gray[200],
            backgroundColor: theme.colors.gray[50]
          }}>
            <div className="flex items-center space-x-4">
              <span className="text-2xl">📱</span>
              <div>
                <Label style={{ color: theme.colors.gray[800] }}>In-App Notifications</Label>
                <p className="text-sm" style={{ color: theme.colors.gray[500] }}>
                  Receive notifications within the application
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.inApp}
              onCheckedChange={() => handleToggle('inApp')}
              style={{
                backgroundColor: preferences.inApp ? theme.colors.primary[500] : theme.colors.gray[300]
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg" style={{
            borderColor: theme.colors.gray[200],
            backgroundColor: theme.colors.gray[50]
          }}>
            <div className="flex items-center space-x-4">
              <span className="text-2xl">📧</span>
              <div>
                <Label style={{ color: theme.colors.gray[800] }}>Email Notifications</Label>
                <p className="text-sm" style={{ color: theme.colors.gray[500] }}>
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.email}
              onCheckedChange={() => handleToggle('email')}
              style={{
                backgroundColor: preferences.email ? theme.colors.primary[500] : theme.colors.gray[300]
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg" style={{
            borderColor: theme.colors.gray[200],
            backgroundColor: theme.colors.gray[50]
          }}>
            <div className="flex items-center space-x-4">
              <span className="text-2xl">📱</span>
              <div>
                <Label style={{ color: theme.colors.gray[800] }}>SMS Notifications</Label>
                <p className="text-sm" style={{ color: theme.colors.gray[500] }}>
                  Receive notifications via text message
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.sms}
              onCheckedChange={() => handleToggle('sms')}
              style={{
                backgroundColor: preferences.sms ? theme.colors.primary[500] : theme.colors.gray[300]
              }}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default NotificationPreferences; 