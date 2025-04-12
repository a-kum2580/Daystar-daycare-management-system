import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import incidentService from '../services/incidentService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function BabysitterDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [formData, setFormData] = useState({
    childId: '',
    incidentType: '',
    description: '',
    severity: 'low',
    actionTaken: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Check if user is checked in
  useEffect(() => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const currentAttendance = attendance.find(
        record => record.babysitter === user.name && record.date === today
      );
      setIsCheckedIn(!!currentAttendance);
      setCurrentAttendance(currentAttendance);
    }
  }, [user, attendance]);

  const handleCheckIn = () => {
    if (!user) return;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newAttendance = {
      id: Date.now().toString(),
      babysitter: user.name,
      date: today,
      checkIn: time,
      checkOut: '',
      status: 'Present',
    };

    setAttendance(prev => [...prev, newAttendance]);
    setIsCheckedIn(true);
    setCurrentAttendance(newAttendance);
  };

  const handleCheckOut = () => {
    if (!user || !currentAttendance) return;

    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const updatedAttendance = attendance.map(record => {
      if (record.id === currentAttendance.id) {
        return {
          ...record,
          checkOut: time,
          status: 'Completed'
        };
      }
      return record;
    });

    setAttendance(updatedAttendance);
    setCurrentAttendance(null);
    setIsCheckedIn(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await incidentService.submitIncident(formData);
      setSuccess(true);
      setFormData({
        childId: '',
        incidentType: '',
        description: '',
        severity: 'low',
        actionTaken: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to submit incident report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Attendance Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">Today's Status: {isCheckedIn ? 'Checked In' : 'Not Checked In'}</p>
              {currentAttendance && (
                <p className="text-sm text-gray-500">
                  Check-in Time: {currentAttendance.checkIn}
                  {currentAttendance.checkOut && ` | Check-out Time: ${currentAttendance.checkOut}`}
                </p>
              )}
            </div>
            <div className="space-x-4">
              {!isCheckedIn ? (
                <Button onClick={handleCheckIn} className="bg-green-500 hover:bg-green-600">
                  Check In
                </Button>
              ) : (
                <Button onClick={handleCheckOut} className="bg-red-500 hover:bg-red-600">
                  Check Out
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Incident Reporting</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/reports')}
          >
            View Incident Reports
          </Button>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Incident report submitted successfully!
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label htmlFor="childId">Child ID</Label>
            <Input
              id="childId"
              name="childId"
              value={formData.childId}
              onChange={handleChange}
              required
              placeholder="Enter child's ID"
            />
          </div>

          <div>
            <Label htmlFor="incidentType">Incident Type</Label>
            <Select
              name="incidentType"
              value={formData.incidentType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, incidentType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="health">Health Concern</SelectItem>
                <SelectItem value="behavior">Behavioral Issue</SelectItem>
                <SelectItem value="injury">Injury</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the incident in detail..."
            />
          </div>

          <div>
            <Label htmlFor="severity">Severity</Label>
            <Select
              name="severity"
              value={formData.severity}
              onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="actionTaken">Action Taken</Label>
            <Textarea
              id="actionTaken"
              name="actionTaken"
              value={formData.actionTaken}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Describe what actions were taken..."
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </form>
    </div>
  );
} 