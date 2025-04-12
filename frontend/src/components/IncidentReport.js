import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { childService } from '../services';

const IncidentReport = () => {
  const [formData, setFormData] = useState({
    childId: '',
    incidentType: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    description: '',
    actionTaken: '',
    reportedBy: '',
    severity: 'low',
    followUpRequired: false,
    followUpNotes: ''
  });

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadChildren = async () => {
      try {
        const childrenList = await childService.getAllChildren();
        setChildren(childrenList);
      } catch (error) {
        console.error('Failed to load children:', error);
      }
    };

    loadChildren();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await childService.reportIncident(formData);
      // Reset form after successful submission
      setFormData({
        childId: '',
        incidentType: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        description: '',
        actionTaken: '',
        reportedBy: '',
        severity: 'low',
        followUpRequired: false,
        followUpNotes: ''
      });
      alert('Incident reported successfully');
    } catch (error) {
      console.error('Failed to report incident:', error);
      alert('Failed to report incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Incident Report</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="childId">Child</Label>
            <Select
              value={formData.childId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, childId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {children.map(child => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.firstName} {child.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="incidentType">Incident Type</Label>
            <Select
              value={formData.incidentType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, incidentType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select incident type" />
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
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="severity">Severity</Label>
            <Select
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
            <Label htmlFor="reportedBy">Reported By</Label>
            <Input
              type="text"
              id="reportedBy"
              name="reportedBy"
              value={formData.reportedBy}
              onChange={handleChange}
              required
            />
          </div>
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
          />
        </div>

        <div>
          <Label htmlFor="actionTaken">Action Taken</Label>
          <Textarea
            id="actionTaken"
            name="actionTaken"
            value={formData.actionTaken}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="followUpRequired"
            name="followUpRequired"
            checked={formData.followUpRequired}
            onChange={handleChange}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <Label htmlFor="followUpRequired">Follow-up Required</Label>
        </div>

        {formData.followUpRequired && (
          <div>
            <Label htmlFor="followUpNotes">Follow-up Notes</Label>
            <Textarea
              id="followUpNotes"
              name="followUpNotes"
              value={formData.followUpNotes}
              onChange={handleChange}
              rows={4}
            />
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default IncidentReport; 