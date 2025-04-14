import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { childService } from '../services/childService';
import { notificationService } from '../services/notificationService';
import { formatDate } from '../utils/formatters';
import { theme } from '../config/theme';

const AttendanceTracking = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadAttendance();
  }, [selectedDate]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await childService.getAttendance(selectedDate);
      setAttendance(data);
    } catch (error) {
      setError('Failed to load attendance data');
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = async (childId, status) => {
    try {
      setLoading(true);
      setError(null);
      await childService.updateAttendance(childId, selectedDate, status);
      await notificationService.notifyChildStatusUpdate(childId, status);
      setAttendance(prev => 
        prev.map(child => 
          child.id === childId 
            ? { ...child, status }
            : child
        )
      );
    } catch (error) {
      setError('Failed to update attendance');
      console.error('Error updating attendance:', error);
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
          Attendance Tracking
        </h2>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-3 py-2"
            style={{
              borderColor: theme.colors.gray[300],
              backgroundColor: theme.colors.gray[50]
            }}
          />
          <Button 
            onClick={loadAttendance} 
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
            Loading attendance data...
          </p>
        </div>
      ) : attendance.length === 0 ? (
        <div className="text-center py-8" style={{ color: theme.colors.gray[500] }}>
          No attendance records for this date
        </div>
      ) : (
        <div className="space-y-4">
          {attendance.map(child => (
            <div
              key={child.id}
              className="flex items-center justify-between p-4 border rounded-lg"
              style={{
                borderColor: theme.colors.gray[200],
                backgroundColor: theme.colors.gray[50]
              }}
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl">👶</span>
                <div>
                  <p className="font-medium" style={{ color: theme.colors.gray[800] }}>
                    {child.name}
                  </p>
                  <p className="text-sm" style={{ color: theme.colors.gray[500] }}>
                    {child.class}
                  </p>
                </div>
              </div>
              <Select
                value={child.status}
                onValueChange={(value) => handleAttendanceChange(child.id, value)}
                style={{
                  borderColor: theme.colors.gray[300],
                  backgroundColor: 'white',
                  '& .SelectTrigger': {
                    backgroundColor: 'white',
                    color: theme.colors.gray[800],
                    border: `1px solid ${theme.colors.gray[300]}`,
                    padding: '0.5rem 1rem',
                    borderRadius: theme.borderRadius.md
                  },
                  '& .SelectContent': {
                    backgroundColor: 'white',
                    border: `1px solid ${theme.colors.gray[300]}`,
                    boxShadow: theme.boxShadow.md,
                    borderRadius: theme.borderRadius.md,
                    marginTop: '0.25rem'
                  },
                  '& .SelectItem': {
                    backgroundColor: 'white',
                    color: theme.colors.gray[800],
                    padding: '0.5rem 1rem',
                    '&:hover': {
                      backgroundColor: theme.colors.gray[100]
                    }
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default AttendanceTracking; 