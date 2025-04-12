import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';

export function Attendance() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('schedules');
  const [selectedBabysitter, setSelectedBabysitter] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [attendance, setAttendance] = useState([]);

  // Sample data - replace with actual data from your backend
  const babysitters = [
    { id: '1', name: 'Sarah Johnson' },
    { id: '2', name: 'Michael Brown' },
    { id: '3', name: 'Emily Davis' },
  ];

  const sessions = [
    { id: 'morning', name: 'Morning (8:00 AM - 12:00 PM)' },
    { id: 'afternoon', name: 'Afternoon (1:00 PM - 5:00 PM)' },
    { id: 'full-day', name: 'Full Day (8:00 AM - 5:00 PM)' },
  ];

  const schedules = [
    {
      id: '1',
      babysitter: 'Sarah Johnson',
      date: '2024-04-15',
      session: 'Morning',
      status: 'Scheduled',
    },
    {
      id: '2',
      babysitter: 'Michael Brown',
      date: '2024-04-15',
      session: 'Afternoon',
      status: 'Completed',
    },
  ];

  // Check if user is checked in
  useEffect(() => {
    if (user && user.role === 'babysitter') {
      const today = new Date().toISOString().split('T')[0];
      const currentAttendance = attendance.find(
        record => record.babysitter === user.name && record.date === today
      );
      setIsCheckedIn(!!currentAttendance);
      setCurrentAttendance(currentAttendance);
    }
  }, [user, attendance]);

  const handleCreateSchedule = () => {
    // Implement schedule creation logic
    console.log('Creating schedule:', {
      babysitter: selectedBabysitter,
      date: selectedDate,
      session: selectedSession,
    });
  };

  const handleCheckIn = () => {
    if (!user || user.role !== 'babysitter') return;

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
    if (!user || user.role !== 'babysitter' || !currentAttendance) return;

    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setAttendance(prev => prev.map(record => {
      if (record.id === currentAttendance.id) {
        return {
          ...record,
          checkOut: time,
        };
      }
      return record;
    }));

    setIsCheckedIn(false);
    setCurrentAttendance(null);
  };

  const generateScheduleReport = () => {
    setIsGenerating(true);
    try {
      // Create CSV content
      const headers = ['Babysitter', 'Date', 'Session', 'Status'];
      const rows = schedules.map(schedule => [
        schedule.babysitter,
        schedule.date,
        schedule.session,
        schedule.status
      ]);
      
      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `schedule-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating schedule report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAttendanceReport = () => {
    setIsGenerating(true);
    try {
      // Create CSV content
      const headers = ['Babysitter', 'Date', 'Check-in', 'Check-out', 'Status'];
      const rows = attendance.map(record => [
        record.babysitter,
        record.date,
        record.checkIn,
        record.checkOut,
        record.status
      ]);
      
      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating attendance report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendance Management</h1>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => setActiveTab('schedules')}>
            Schedules
          </Button>
          <Button variant="outline" onClick={() => setActiveTab('attendance')}>
            Attendance
          </Button>
          <Button variant="outline" onClick={() => setActiveTab('reports')}>
            Reports
          </Button>
        </div>
      </div>

      {user?.role === 'babysitter' && (
        <Card>
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
      )}

      {activeTab === 'schedules' && (
        <Card>
          <CardHeader>
            <CardTitle>Babysitter Schedules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label>Babysitter</Label>
                <Select value={selectedBabysitter} onValueChange={setSelectedBabysitter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select babysitter" />
                  </SelectTrigger>
                  <SelectContent>
                    {babysitters.map((babysitter) => (
                      <SelectItem key={babysitter.id} value={babysitter.id}>
                        {babysitter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Session</Label>
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map((session) => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleCreateSchedule} className="mb-6">
              Create Schedule
            </Button>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Babysitter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>{schedule.babysitter}</TableCell>
                    <TableCell>{schedule.date}</TableCell>
                    <TableCell>{schedule.session}</TableCell>
                    <TableCell>{schedule.status}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'attendance' && (
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Babysitter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.babysitter}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>{record.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'reports' && (
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={reportStartDate}
                    onChange={(e) => setReportStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={reportEndDate}
                    onChange={(e) => setReportEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={generateScheduleReport} 
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Schedule Report'}
                </Button>
                <Button 
                  onClick={generateAttendanceReport} 
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Attendance Report'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Attendance; 