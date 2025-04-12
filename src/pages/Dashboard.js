import React, { useState, useEffect } from "react";
import { formatCurrency } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import incidentService from '../services/incidentService';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';

// Sample data - would be replaced with real data from API/database
const sampleData = {
  childrenPresent: 18,
  totalChildren: 25,
  activeBabysitters: 4,
  totalBabysitters: 6,
  todayIncome: 850000,
  weeklyIncome: 4250000,
  pendingPayments: 1250000,
  recentIncidents: 2,
  notifications: [
    { id: 1, type: "info", message: "New child enrollment request from Sarah Johnson", time: "1h ago" },
    { id: 2, type: "warning", message: "Babysitter Michael Smith requested time off next week", time: "2h ago" },
    { id: 3, type: "alert", message: "Incident report filed for minor injury", time: "Yesterday" },
    { id: 4, type: "info", message: "Monthly financial report is ready for review", time: "Yesterday" },
  ],
};

export function Dashboard() {
  const navigate = useNavigate();
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

  const handleQuickAction = (action) => {
    switch (action) {
      case 'addChild':
        navigate('/enroll-child');
        break;
      case 'registerBabysitter':
        navigate('/babysitter-registration');
        break;
      case 'generateReport':
        navigate('/reports');
        break;
      case 'recordExpense':
        navigate('/finance');
        break;
      default:
        break;
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'all') return true;
    return incident.severity === filter;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <QuickStatCard 
          title="Children Present" 
          value={`${sampleData.childrenPresent}/${sampleData.totalChildren}`}
          description="Current attendance"
          icon={<ChildrenIcon />}
          trend="up"
          color="blue"
        />
        <QuickStatCard 
          title="Active Babysitters" 
          value={`${sampleData.activeBabysitters}/${sampleData.totalBabysitters}`}
          description="On duty today"
          icon={<BabysittersIcon />}
          trend="steady"
          color="green"
        />
        <QuickStatCard 
          title="Today's Income" 
          value={formatCurrency(sampleData.todayIncome)}
          description="Daily revenue"
          icon={<IncomeIcon />}
          trend="up"
          color="yellow"
        />
        <QuickStatCard 
          title="Pending Payments" 
          value={formatCurrency(sampleData.pendingPayments)}
          description="Awaiting processing"
          icon={<PaymentIcon />}
          trend="down"
          color="red"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Notifications and Incidents */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Notifications</h2>
            <div className="space-y-4">
              {sampleData.notifications.map((notification) => (
                <div key={notification.id} className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div className="mr-3 mt-1">
                    {notification.type === "info" && <InfoIcon />}
                    {notification.type === "warning" && <WarningIcon />}
                    {notification.type === "alert" && <AlertIcon />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Reports Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Incident Reports</h2>
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
                      className="bg-white p-4 rounded-lg border border-gray-200"
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
        </div>

        {/* Right Column - Quick Actions */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => handleQuickAction('addChild')}
                className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <AddChildIcon />
                <span className="ml-3">Add New Child</span>
              </button>
              <button
                onClick={() => handleQuickAction('registerBabysitter')}
                className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <AddBabysitterIcon />
                <span className="ml-3">Register Babysitter</span>
              </button>
              <button
                onClick={() => handleQuickAction('generateReport')}
                className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <ReportIcon />
                <span className="ml-3">Generate Report</span>
              </button>
              <button
                onClick={() => handleQuickAction('recordExpense')}
                className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <ExpenseIcon />
                <span className="ml-3">Record Expense</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function QuickStatCard({ title, value, description, icon, trend, color }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
  };

  const trendIcons = {
    up: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
      </svg>
    ),
    down: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path>
      </svg>
    ),
    steady: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path>
      </svg>
    ),
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"}`}>
          {trendIcons[trend]}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mt-4">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
}

function ChildrenIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
    </svg>
  );
}

function BabysittersIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
    </svg>
  );
}

function IncomeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  );
}

function AddChildIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
    </svg>
  );
}

function AddBabysitterIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
  );
}

function ExpenseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
    </svg>
  );
}

export default Dashboard; 