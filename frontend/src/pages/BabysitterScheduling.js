import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { format } from 'date-fns';
import { Textarea } from '../components/ui/textarea';
import babysitterService from '../services/babysitterService';
import { theme } from '../config/theme';
import { Calendar as CalendarIcon, Clock, User, FileText, CheckCircle, XCircle } from 'lucide-react';
import CalendarComponent from '../components/ui/calendar';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { debounce } from 'lodash';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

// Create a client
const queryClient = new QueryClient();

// Constants for pagination and data fetching
const PAGE_SIZE = 10;
const SCHEDULE_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const STALE_TIME = 1 * 60 * 1000; // 1 minute

// Add payment calculation constants
const PAYMENT_RATES = {
  HALF_DAY: 2000,
  FULL_DAY: 5000
};

// Add function to calculate payment
const calculatePayment = (startTime, endTime, childrenCount) => {
  if (!startTime || !endTime || !childrenCount) return 0;
  
  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);
  const duration = endHour - startHour;
  
  // Consider sessions longer than 6 hours as full day
  const isFullDay = duration >= 6;
  const ratePerChild = isFullDay ? PAYMENT_RATES.FULL_DAY : PAYMENT_RATES.HALF_DAY;
  
  return ratePerChild * childrenCount;
};

export function BabysitterScheduling() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [babysitters, setBabysitters] = useState([
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Mike Johnson' }
  ]);
  const [newSchedule, setNewSchedule] = useState({
    babysitterId: '',
    startTime: '',
    endTime: '',
    sessionType: '',
    children: []
  });

  const [formData, setFormData] = useState({
    babysitterId: '',
    sessionType: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);

  // Virtualization refs
  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: schedules.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  // Fetch babysitters with search and pagination
  const { data: babysittersData, isLoading: isLoadingBabysitters } = useQuery({
    queryKey: ['babysitters', searchTerm],
    queryFn: async () => {
      const response = await babysitterService.getBabysitters({
        search: searchTerm,
        page: 1,
        limit: 50
      });
      return response.data;
    },
    staleTime: STALE_TIME,
    cacheTime: SCHEDULE_CACHE_TIME,
  });

  // Fetch schedules with infinite scroll
  const {
    data: schedulesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingSchedules
  } = useQuery({
    queryKey: ['schedules', selectedDate],
    queryFn: async () => {
      const response = await babysitterService.getSchedules({
        date: format(selectedDate, 'yyyy-MM-dd'),
        page: 1,
        limit: PAGE_SIZE
      });
      return response.data;
    },
    staleTime: STALE_TIME,
    cacheTime: SCHEDULE_CACHE_TIME,
  });

  // Optimize search with debounce
  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  // Memoize filtered schedules
  const filteredSchedules = useMemo(() => {
    if (!schedulesData?.pages) return [];
    return schedulesData.pages.flat();
  }, [schedulesData]);

  // Optimize report generation
  const generateReportMutation = useMutation({
    mutationFn: async () => {
      const response = await babysitterService.generateReport({
        startDate: format(selectedDate, 'yyyy-MM-dd'),
        endDate: format(selectedDate, 'yyyy-MM-dd')
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Handle successful report generation
      const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `weekly_schedule_report_${format(selectedDate, 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Error generating report:', error);
    }
  });

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    
    const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const sessionTypes = [
    'regular',
    'overnight',
    'emergency',
    'special_event'
  ];

  // Memoize the handleChange function
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [validationErrors]);

  // Memoize the handleDateSelect function
  const handleDateSelect = useCallback((date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      date: formattedDate
    }));
    setShowCalendar(false);
    if (validationErrors.date) {
      setValidationErrors(prev => ({
        ...prev,
        date: null
      }));
    }
  }, [validationErrors]);

  // Memoize the handleAttendanceUpdate function
  const handleAttendanceUpdate = useCallback((scheduleId, status) => {
    setSchedules(prevSchedules => 
      prevSchedules.map(schedule => 
        schedule.id === scheduleId ? { ...schedule, status } : schedule
      )
    );
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setValidationErrors({});

    // Validate required fields
    const errors = {};
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.babysitterId) errors.babysitterId = 'Babysitter is required';
    if (!formData.startTime) errors.startTime = 'Start time is required';
    if (!formData.endTime) errors.endTime = 'End time is required';
    if (!formData.sessionType) errors.sessionType = 'Session type is required';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const scheduleData = {
        ...formData,
        status: 'pending',
        children: []
      };

      const response = await babysitterService.createSchedule(scheduleData);
      
      if (response && response.data) {
        setSuccess('Schedule created successfully');
        
        // Reset form
        setFormData({
          babysitterId: '',
          sessionType: '',
          date: '',
          startTime: '',
          endTime: '',
          notes: ''
        });

        // Invalidate and refetch schedules
        queryClient.invalidateQueries(['schedules']);
      } else {
        throw new Error('Failed to create schedule');
      }
    } catch (err) {
      setError(err.message || 'Failed to create schedule');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts - replace with actual data from your API
  const attendanceData = useMemo(() => {
    return [
      { name: 'Present', value: schedules.filter(s => s.status === 'present').length },
      { name: 'Absent', value: schedules.filter(s => s.status === 'absent').length },
      { name: 'Pending', value: schedules.filter(s => s.status === 'pending').length }
    ];
  }, [schedules]);

  const weeklyAttendanceData = useMemo(() => {
    return [
      { day: 'Mon', present: 5, absent: 2 },
      { day: 'Tue', present: 6, absent: 1 },
      { day: 'Wed', present: 4, absent: 3 },
      { day: 'Thu', present: 7, absent: 0 },
      { day: 'Fri', present: 5, absent: 2 },
      { day: 'Sat', present: 3, absent: 4 },
      { day: 'Sun', present: 2, absent: 5 }
    ];
  }, []);

  const sessionTypeData = useMemo(() => {
    return [
      { name: 'Regular', value: schedules.filter(s => s.sessionType === 'regular').length },
      { name: 'Overnight', value: schedules.filter(s => s.sessionType === 'overnight').length },
      { name: 'Emergency', value: schedules.filter(s => s.sessionType === 'emergency').length },
      { name: 'Special Event', value: schedules.filter(s => s.sessionType === 'special_event').length }
    ];
  }, [schedules]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: theme.colors.primary[700] }}>
          Babysitter Scheduling & Attendance
        </h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={generateReportMutation.mutate}
            disabled={loading}
            className="flex items-center space-x-2 transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: theme.colors.primary[500],
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: theme.borderRadius.md,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            <FileText size={20} />
            <span>{loading ? 'Generating...' : 'Generate Report'}</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="schedule" className="flex items-center space-x-2 transition-all duration-200 hover:bg-gray-100">
            <CalendarIcon size={20} />
            <span>Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center space-x-2 transition-all duration-200 hover:bg-gray-100">
            <CheckCircle size={20} />
            <span>Attendance</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2 transition-all duration-200 hover:bg-gray-100">
            <FileText size={20} />
            <span>Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card className="transition-all duration-200 hover:shadow-lg">
          <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon size={24} />
                <span>Create New Schedule</span>
              </CardTitle>
          </CardHeader>
          <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                    <Label htmlFor="date" className="flex items-center space-x-2">
                      <CalendarIcon size={20} />
                      <span>Date</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        id="date"
                        name="date"
                        value={formData.date}
                        readOnly
                        onClick={() => setShowCalendar(!showCalendar)}
                        placeholder="Select date"
                        className="w-full pr-10"
                        style={{
                          borderColor: theme.colors.gray[300],
                          backgroundColor: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: theme.borderRadius.md,
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      />
                      <div 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowCalendar(!showCalendar)}
                        style={{ color: theme.colors.gray[500] }}
                      >
                        <CalendarIcon size={20} />
                      </div>
                      {showCalendar && (
                        <div className="absolute z-10 mt-2">
                          <CalendarComponent onDateSelect={handleDateSelect} />
                        </div>
                      )}
                    </div>
              </div>
              
              <div>
                    <Label htmlFor="babysitterId" className="flex items-center space-x-2">
                      <User size={20} />
                      <span>Babysitter</span>
                    </Label>
                <Select
                      value={formData.babysitterId}
                      onValueChange={(value) => handleChange({ target: { name: 'babysitterId', value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select babysitter" />
                  </SelectTrigger>
                  <SelectContent>
                        {babysittersData?.map(babysitter => (
                          <SelectItem key={babysitter.id} value={babysitter.id}>
                            {babysitter.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
                    {validationErrors.babysitterId && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.babysitterId}</p>
                    )}
              </div>

                <div>
                    <Label htmlFor="startTime" className="flex items-center space-x-2">
                      <Clock size={20} />
                      <span>Start Time</span>
                    </Label>
                  <Input
                    type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                  />
                </div>

                <div>
                    <Label htmlFor="endTime" className="flex items-center space-x-2">
                      <Clock size={20} />
                      <span>End Time</span>
                    </Label>
                  <Input
                    type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                    />
              </div>

              <div>
                    <Label htmlFor="sessionType" className="flex items-center space-x-2">
                      <FileText size={20} />
                      <span>Session Type</span>
                    </Label>
                <Select
                      value={formData.sessionType}
                      onValueChange={(value) => handleChange({ target: { name: 'sessionType', value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select session type" />
                  </SelectTrigger>
                  <SelectContent>
                        {sessionTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
                  </div>
              </div>

                <div>
                  <Label htmlFor="notes" className="flex items-center space-x-2">
                    <FileText size={20} />
                    <span>Notes</span>
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Add any additional notes here..."
                  />
            </div>

                <Button
                  type="submit"
                  className="w-full transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: theme.colors.primary[500],
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: theme.borderRadius.md,
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  Create Schedule
                </Button>
              </form>
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="transition-all duration-200 hover:shadow-lg">
          <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle size={24} />
                <span>Today's Attendance</span>
              </CardTitle>
          </CardHeader>
          <CardContent>
              <div 
                ref={parentRef}
                className="h-[400px] overflow-auto"
                onScroll={handleScroll}
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const schedule = filteredSchedules[virtualRow.index];
                    return (
                      <div
                        key={schedule.id}
                        ref={rowVirtualizer.measureElement}
                        data-index={virtualRow.index}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <div className="border rounded-lg p-4 transition-all duration-200 hover:bg-gray-50 hover:shadow-md">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="font-medium">Babysitter {schedule.babysitterId}</p>
                        <p className="text-sm text-gray-500">
                                {format(new Date(schedule.date), 'MMM dd, yyyy')} • {schedule.startTime} - {schedule.endTime}
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
                                <SelectItem value="present" className="flex items-center">
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                  Present
                                </SelectItem>
                                <SelectItem value="absent" className="flex items-center">
                                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                  Absent
                                </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {isFetchingNextPage && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="transition-all duration-200 hover:shadow-lg">
        <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText size={24} />
                <span>Weekly Schedule Summary</span>
              </CardTitle>
        </CardHeader>
        <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Attendance Overview Chart */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={attendanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {attendanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Weekly Attendance Trend */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Weekly Attendance Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={weeklyAttendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="present" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="absent" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Session Type Distribution */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Session Type Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sessionTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Daily Schedule Overview */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Daily Schedule Overview</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyAttendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="present" stroke="#8884d8" />
                      <Line type="monotone" dataKey="absent" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
            </div>

              {/* Existing table view */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Babysitter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Children</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSchedules.map(schedule => (
                      <tr 
                        key={schedule.id} 
                        className="transition-all duration-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">{format(new Date(schedule.date), 'MMM dd, yyyy')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">Babysitter {schedule.babysitterId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{schedule.startTime} - {schedule.endTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{schedule.children?.length || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {calculatePayment(schedule.startTime, schedule.endTime, schedule.children?.length || 0).toLocaleString()} K
                      </td>
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
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BabysitterScheduling; 