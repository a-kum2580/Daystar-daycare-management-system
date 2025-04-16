import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Event as EventIcon
} from '@mui/icons-material';
import adminService from '../services/adminService';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [settings, setSettings] = useState({});
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [error, setError] = useState(null);

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminService.getDashboardStats
  });

  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: adminService.getAllUsers
  });

  // Fetch system settings
  const { data: systemSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: adminService.getSystemSettings
  });

  // Fetch audit logs
  const { data: auditLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => adminService.getAuditLogs()
  });

  // Mutations
  const updateUserRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setSelectedUser(null);
    },
    onError: (error) => setError(error.message)
  });

  const updateSettingsMutation = useMutation({
    mutationFn: adminService.updateSystemSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(['systemSettings']);
      setError(null);
    },
    onError: (error) => setError(error.message)
  });

  const generateReportMutation = useMutation({
    mutationFn: () => adminService.generateReport(reportType, dateRange),
    onSuccess: (data) => {
      // Handle report download or display
      console.log('Report generated:', data);
    },
    onError: (error) => setError(error.message)
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUserRoleUpdate = (userId, newRole) => {
    updateUserRoleMutation.mutate({ userId, role: newRole });
  };

  const handleSettingsUpdate = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleReportGeneration = () => {
    generateReportMutation.mutate();
  };

  if (statsLoading || usersLoading || settingsLoading || logsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button
          variant="contained"
          startIcon={<EventIcon />}
          onClick={() => navigate('/events')}
          sx={{ mr: 2 }}
        >
          Schedule Event
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab icon={<PeopleIcon />} label="Users" />
        <Tab icon={<SettingsIcon />} label="Settings" />
        <Tab icon={<AssessmentIcon />} label="Reports" />
        <Tab icon={<HistoryIcon />} label="Audit Logs" />
      </Tabs>

      {/* Dashboard Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">{stats?.totalUsers || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Children
              </Typography>
              <Typography variant="h4">{stats?.activeChildren || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Babysitters
              </Typography>
              <Typography variant="h4">{stats?.totalBabysitters || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Today's Attendance
              </Typography>
              <Typography variant="h4">{stats?.todayAttendance || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Tab */}
      {activeTab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <FormControl size="small">
                      <Select
                        value={user.role}
                        onChange={(e) => handleUserRoleUpdate(user._id, e.target.value)}
                      >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="staff">Staff</MenuItem>
                        <MenuItem value="parent">Parent</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Settings Tab */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Daycare Name"
                  value={settings.daycareName || ''}
                  onChange={(e) => setSettings({ ...settings, daycareName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  value={settings.contactEmail || ''}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={settings.contactPhone || ''}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSettingsUpdate}
                  disabled={updateSettingsMutation.isLoading}
                >
                  Save Settings
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Reports Tab */}
      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <MenuItem value="attendance">Attendance Report</MenuItem>
                    <MenuItem value="financial">Financial Report</MenuItem>
                    <MenuItem value="children">Children Report</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReportGeneration}
                  disabled={generateReportMutation.isLoading}
                >
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 3 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditLogs?.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Admin; 