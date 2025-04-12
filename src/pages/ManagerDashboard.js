import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import incidentService from '../services/incidentService';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';

export function ManagerDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchIncidents();
  }, [filter]);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await incidentService.getAllIncidents();
      setIncidents(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (incidentId, newStatus) => {
    try {
      await incidentService.updateIncidentStatus(incidentId, newStatus);
      fetchIncidents(); // Refresh the list
    } catch (err) {
      setError(err.message || 'Failed to update incident status');
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'all') return true;
    return incident.severity === filter;
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Incident Reports</h1>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-48"
          >
            <option value="all">All Incidents</option>
            <option value="low">Low Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="high">High Severity</option>
          </Select>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading incidents...</div>
        ) : (
          <div className="space-y-4">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No incidents found
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Child ID: {incident.childId}</h3>
                      <p className="text-sm text-gray-500">
                        Type: {incident.incidentType}
                      </p>
                      <p className="mt-2">{incident.description}</p>
                      <p className="text-sm mt-2">
                        Action Taken: {incident.actionTaken}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-sm ${
                        incident.severity === 'high' ? 'bg-red-100 text-red-800' :
                        incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {incident.severity}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      onClick={() => handleStatusUpdate(incident.id, 'resolved')}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Mark Resolved
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(incident.id, 'in_progress')}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      In Progress
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 