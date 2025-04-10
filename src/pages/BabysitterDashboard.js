import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import incidentService from '../services/incidentService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';

export function BabysitterDashboard() {
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
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Incident Reporting</h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
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
    </DashboardLayout>
  );
} 