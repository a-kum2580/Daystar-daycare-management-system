import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Tabs, 
  Tab, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  DateRange as DateRangeIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import adminService from '../services/adminService';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  const [reportType, setReportType] = useState('enrollment');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1),
    end: new Date()
  });
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data for charts - Replace with actual API data
  const mockChartData = {
    enrollment: [
      { month: 'Jan', count: 65 },
      { month: 'Feb', count: 72 },
      { month: 'Mar', count: 78 },
      { month: 'Apr', count: 85 },
      { month: 'May', count: 92 },
      { month: 'Jun', count: 88 }
    ],
    attendance: [
      { date: 'Mon', present: 85, absent: 15 },
      { date: 'Tue', present: 90, absent: 10 },
      { date: 'Wed', present: 88, absent: 12 },
      { date: 'Thu', present: 92, absent: 8 },
      { date: 'Fri', present: 87, absent: 13 }
    ],
    financial: [
      { month: 'Jan', income: 12000, expenses: 8000 },
      { month: 'Feb', income: 13500, expenses: 8500 },
      { month: 'Mar', income: 14200, expenses: 9000 },
      { month: 'Apr', income: 15000, expenses: 9200 },
      { month: 'May', income: 15800, expenses: 9500 },
      { month: 'Jun', income: 16500, expenses: 9800 }
    ],
    staff: [
      { name: 'John Doe', performance: 92, attendance: 95, satisfaction: 88 },
      { name: 'Jane Smith', performance: 88, attendance: 98, satisfaction: 92 },
      { name: 'Mike Johnson', performance: 95, attendance: 90, satisfaction: 85 },
      { name: 'Sarah Wilson', performance: 90, attendance: 92, satisfaction: 90 }
    ]
  };

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: () => adminService.generateReport(reportType, {
      startDate: format(dateRange.start, 'yyyy-MM-dd'),
      endDate: format(dateRange.end, 'yyyy-MM-dd')
    }),
    onError: (error) => setError(error.message)
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
    setPage(0);
  };

  const handleDateRangeChange = (field) => (date) => {
    setDateRange({
      ...dateRange,
      [field]: date
    });
  };

  const handleGenerateReport = () => {
    setError(null);
    generateReportMutation.mutate();
  };

  const handleDownloadReport = () => {
    if (generateReportMutation.data) {
      const blob = new Blob([JSON.stringify(generateReportMutation.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const handlePrintReport = () => {
    if (generateReportMutation.data) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>${reportType} Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
            </style>
          </head>
          <body>
            <h1>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h1>
            <p>Generated on: ${format(new Date(), 'PPP')}</p>
            <p>Date Range: ${format(dateRange.start, 'PPP')} - ${format(dateRange.end, 'PPP')}</p>
            <pre>${JSON.stringify(generateReportMutation.data, null, 2)}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleEmailReport = () => {
    if (generateReportMutation.data) {
      alert('Email functionality would be implemented here');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderChart = () => {
    const data = mockChartData[reportType];
    
    switch (reportType) {
      case 'enrollment':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip />
              <Legend />
              <Bar dataKey="count" fill={theme.palette.primary.main} name="Enrollment Count" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'attendance':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip />
              <Legend />
              <Bar dataKey="present" fill={theme.palette.success.main} name="Present" />
              <Bar dataKey="absent" fill={theme.palette.error.main} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'financial':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke={theme.palette.success.main} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke={theme.palette.error.main} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'staff':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip />
              <Legend />
              <Bar dataKey="performance" fill={theme.palette.primary.main} name="Performance" />
              <Bar dataKey="attendance" fill={theme.palette.success.main} name="Attendance" />
              <Bar dataKey="satisfaction" fill={theme.palette.info.main} name="Satisfaction" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const renderDataTable = () => {
    const data = mockChartData[reportType];
    
    switch (reportType) {
      case 'enrollment':
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell align="right">Enrollment Count</TableCell>
                  <TableCell align="right">Growth</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={row.month}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell align="right">{row.count}</TableCell>
                    <TableCell align="right">
                      {index > 0 ? `${((row.count - data[index - 1].count) / data[index - 1].count * 100).toFixed(1)}%` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      
      case 'attendance':
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Day</TableCell>
                  <TableCell align="right">Present</TableCell>
                  <TableCell align="right">Absent</TableCell>
                  <TableCell align="right">Attendance Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.date}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell align="right">{row.present}</TableCell>
                    <TableCell align="right">{row.absent}</TableCell>
                    <TableCell align="right">
                      {((row.present / (row.present + row.absent)) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      
      case 'financial':
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell align="right">Income</TableCell>
                  <TableCell align="right">Expenses</TableCell>
                  <TableCell align="right">Net Profit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell align="right">${row.income.toLocaleString()}</TableCell>
                    <TableCell align="right">${row.expenses.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`$${(row.income - row.expenses).toLocaleString()}`}
                        color={row.income - row.expenses >= 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      
      case 'staff':
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Staff Member</TableCell>
                  <TableCell align="right">Performance</TableCell>
                  <TableCell align="right">Attendance</TableCell>
                  <TableCell align="right">Satisfaction</TableCell>
                  <TableCell align="right">Overall Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${row.performance}%`}
                        color={row.performance >= 90 ? 'success' : row.performance >= 80 ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${row.attendance}%`}
                        color={row.attendance >= 90 ? 'success' : row.attendance >= 80 ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${row.satisfaction}%`}
                        color={row.satisfaction >= 90 ? 'success' : row.satisfaction >= 80 ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${((row.performance + row.attendance + row.satisfaction) / 3).toFixed(1)}%`}
                        color={
                          (row.performance + row.attendance + row.satisfaction) / 3 >= 90
                            ? 'success'
                            : (row.performance + row.attendance + row.satisfaction) / 3 >= 80
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      
      default:
        return null;
    }
  };

  const renderSummaryCards = () => {
    const data = mockChartData[reportType];
    
    switch (reportType) {
      case 'enrollment':
        const totalEnrollment = data.reduce((sum, item) => sum + item.count, 0);
        const avgEnrollment = totalEnrollment / data.length;
        const latestEnrollment = data[data.length - 1].count;
        const enrollmentGrowth = ((latestEnrollment - data[data.length - 2].count) / data[data.length - 2].count * 100).toFixed(1);
        
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Enrollment
                  </Typography>
                  <Typography variant="h4">{totalEnrollment}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Average Enrollment
                  </Typography>
                  <Typography variant="h4">{avgEnrollment.toFixed(1)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Growth Rate
                  </Typography>
                  <Typography variant="h4" color={enrollmentGrowth >= 0 ? 'success.main' : 'error.main'}>
                    {enrollmentGrowth}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      
      case 'attendance':
        const totalPresent = data.reduce((sum, item) => sum + item.present, 0);
        const totalAbsent = data.reduce((sum, item) => sum + item.absent, 0);
        const attendanceRate = ((totalPresent / (totalPresent + totalAbsent)) * 100).toFixed(1);
        
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Present
                  </Typography>
                  <Typography variant="h4">{totalPresent}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Absent
                  </Typography>
                  <Typography variant="h4">{totalAbsent}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Attendance Rate
                  </Typography>
                  <Typography variant="h4" color={attendanceRate >= 90 ? 'success.main' : attendanceRate >= 80 ? 'warning.main' : 'error.main'}>
                    {attendanceRate}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      
      case 'financial':
        const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
        const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
        const netProfit = totalIncome - totalExpenses;
        const profitMargin = ((netProfit / totalIncome) * 100).toFixed(1);
        
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Income
                  </Typography>
                  <Typography variant="h4">${totalIncome.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Expenses
                  </Typography>
                  <Typography variant="h4">${totalExpenses.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Profit Margin
                  </Typography>
                  <Typography variant="h4" color={profitMargin >= 20 ? 'success.main' : profitMargin >= 10 ? 'warning.main' : 'error.main'}>
                    {profitMargin}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      
      case 'staff':
        const avgPerformance = data.reduce((sum, item) => sum + item.performance, 0) / data.length;
        const avgAttendance = data.reduce((sum, item) => sum + item.attendance, 0) / data.length;
        const avgSatisfaction = data.reduce((sum, item) => sum + item.satisfaction, 0) / data.length;
        
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Performance
                  </Typography>
                  <Typography variant="h4">{avgPerformance.toFixed(1)}%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Attendance
                  </Typography>
                  <Typography variant="h4">{avgAttendance.toFixed(1)}%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Satisfaction
                  </Typography>
                  <Typography variant="h4">{avgSatisfaction.toFixed(1)}%</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
        flexDirection={isMobile ? 'column' : 'row'}
        gap={2}
      >
        <Box>
          <Typography variant="h4" color="primary" fontWeight="bold">
            Reports
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Generate and view reports for Daystar Daycare
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={handleDownloadReport}
            disabled={!generateReportMutation.data}
          >
            Download
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />}
            onClick={handlePrintReport}
            disabled={!generateReportMutation.data}
          >
            Print
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<EmailIcon />}
            onClick={handleEmailReport}
            disabled={!generateReportMutation.data}
          >
            Email
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 4, p: 3, borderRadius: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="report-type-label">Report Type</InputLabel>
              <Select
                labelId="report-type-label"
                id="report-type"
                value={reportType}
                label="Report Type"
                onChange={handleReportTypeChange}
              >
                <MenuItem value="enrollment">
                  <Box display="flex" alignItems="center">
                    <PeopleIcon sx={{ mr: 1 }} />
                    <span>Enrollment Report</span>
                  </Box>
                </MenuItem>
                <MenuItem value="attendance">
                  <Box display="flex" alignItems="center">
                    <ScheduleIcon sx={{ mr: 1 }} />
                    <span>Attendance Report</span>
                  </Box>
                </MenuItem>
                <MenuItem value="financial">
                  <Box display="flex" alignItems="center">
                    <MoneyIcon sx={{ mr: 1 }} />
                    <span>Financial Report</span>
                  </Box>
                </MenuItem>
                <MenuItem value="staff">
                  <Box display="flex" alignItems="center">
                    <TrendingUpIcon sx={{ mr: 1 }} />
                    <span>Staff Performance Report</span>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={dateRange.start}
                onChange={handleDateRangeChange('start')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={dateRange.end}
                onChange={handleDateRangeChange('end')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleGenerateReport}
              disabled={generateReportMutation.isLoading}
              startIcon={generateReportMutation.isLoading ? <CircularProgress size={20} color="inherit" /> : <AssessmentIcon />}
              sx={{ 
                borderRadius: 3,
                px: 3,
                py: 1,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                boxShadow: '0 3px 5px 2px rgba(255, 105, 180, .3)',
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
                },
              }}
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {generateReportMutation.isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : generateReportMutation.data ? (
        <Box>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            sx={{ mb: 3 }}
            variant={isMobile ? "fullWidth" : "standard"}
          >
            <Tab icon={<BarChartIcon />} label="Charts" />
            <Tab icon={<AssessmentIcon />} label="Data" />
            <Tab icon={<TimelineIcon />} label="Summary" />
          </Tabs>

          {activeTab === 0 && (
            <Paper sx={{ p: 3, borderRadius: 4, mb: 3 }}>
              {renderChart()}
            </Paper>
          )}

          {activeTab === 1 && (
            <Paper sx={{ p: 3, borderRadius: 4, mb: 3 }}>
              {renderDataTable()}
            </Paper>
          )}

          {activeTab === 2 && (
            <Box sx={{ mb: 3 }}>
              {renderSummaryCards()}
            </Box>
          )}
        </Box>
      ) : (
        <Paper sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No report data available
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Select a report type and date range, then click "Generate Report" to view data.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Reports; 