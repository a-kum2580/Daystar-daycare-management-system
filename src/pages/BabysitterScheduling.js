import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { format } from 'date-fns';

export function BabysitterScheduling() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    babysitterId: '',
    startTime: '',
    endTime: '',
    sessionType: '',
    children: []
  });

  const handleCreateSchedule = () => {
    const schedule = {
      ...newSchedule,
      date: selectedDate,
      id: Date.now(),
      status: 'pending'
    };
    setSchedules([...schedules, schedule]);
    setNewSchedule({
      babysitterId: '',
      startTime: '',
      endTime: '',
      sessionType: '',
      children: []
    });
  };

  const handleAttendanceUpdate = (scheduleId, status) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === scheduleId ? { ...schedule, status } : schedule
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Babysitter Scheduling & Attendance</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schedule Creation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Create New Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              
              <div>
                <Label>Babysitter</Label>
                <Select
                  value={newSchedule.babysitterId}
                  onValueChange={(value) => setNewSchedule({ ...newSchedule, babysitterId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select babysitter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">John Doe</SelectItem>
                    <SelectItem value="2">Jane Smith</SelectItem>
                    <SelectItem value="3">Mike Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Session Type</Label>
                <Select
                  value={newSchedule.sessionType}
                  onValueChange={(value) => setNewSchedule({ ...newSchedule, sessionType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select session type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning Session</SelectItem>
                    <SelectItem value="afternoon">Afternoon Session</SelectItem>
                    <SelectItem value="full-day">Full Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCreateSchedule}>Create Schedule</Button>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedules
                .filter(schedule => format(schedule.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
                .map(schedule => (
                  <div key={schedule.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Babysitter ID: {schedule.babysitterId}</p>
                        <p className="text-sm text-gray-500">
                          {schedule.startTime} - {schedule.endTime}
                        </p>
                      </div>
                      <Select
                        value={schedule.status}
                        onValueChange={(value) => handleAttendanceUpdate(schedule.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Reports */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Schedule Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Weekly Schedule Summary</h3>
              <Button variant="outline">Generate Report</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Babysitter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedules.map(schedule => (
                    <tr key={schedule.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{format(schedule.date, 'MMM dd, yyyy')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">Babysitter {schedule.babysitterId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{schedule.startTime} - {schedule.endTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          schedule.status === 'present' ? 'bg-green-100 text-green-800' :
                          schedule.status === 'absent' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {schedule.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BabysitterScheduling; 