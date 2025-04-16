import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert
} from '@mui/material';
import { 
  People as PeopleIcon, 
  ChildCare as ChildCareIcon, 
  Payment as PaymentIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import adminService from '../services/adminService';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Fetch dashboard data
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => adminService.getDashboardStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const StatCard = ({ title, value, icon, color, isLoading }) => (
    <Card 
      sx={{ 
        height: '100%',
        borderRadius: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              backgroundColor: `${color}15`, 
              borderRadius: '50%', 
              p: 1.5,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        {isLoading ? (
          <Skeleton variant="text" width="60%" height={40} />
        ) : (
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: color }}>
            {value || 0}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading dashboard data: {error.message}
        </Alert>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  // Safely access dashboard data with default values
  const stats = {
    totalBabysitters: dashboardData?.data?.users?.totalBabysitters || 0,
    totalChildren: dashboardData?.data?.children?.total || 0,
    totalParents: dashboardData?.data?.users?.totalParents || 0,
    totalPayments: 0, // This will be calculated from payment stats
    recentActivities: [], // This will be populated from notifications
    paymentStats: {
      total: 0,
      pending: 0,
      completed: 0
    }
  };

  // Add attendance stats
  const attendanceStats = {
    present: dashboardData?.data?.attendance?.present || 0,
    absent: dashboardData?.data?.attendance?.absent || 0,
    late: dashboardData?.data?.attendance?.late || 0,
    unrecorded: dashboardData?.data?.attendance?.unrecorded || 0
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.main }}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Babysitters" 
            value={stats.totalBabysitters} 
            icon={<PeopleIcon sx={{ color: theme.palette.primary.main }} />} 
            color={theme.palette.primary.main}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Children" 
            value={stats.totalChildren} 
            icon={<ChildCareIcon sx={{ color: theme.palette.success.main }} />} 
            color={theme.palette.success.main}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Parents" 
            value={stats.totalParents} 
            icon={<PeopleIcon sx={{ color: theme.palette.info.main }} />} 
            color={theme.palette.info.main}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Present Today" 
            value={attendanceStats.present} 
            icon={<PeopleIcon sx={{ color: theme.palette.warning.main }} />} 
            color={theme.palette.warning.main}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>

      {/* Attendance Statistics */}
      <Paper sx={{ p: 3, borderRadius: 4, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <ChildCareIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          Today's Attendance
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: theme.palette.success.light }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Present
                </Typography>
                <Typography variant="h5" color="success.dark">
                  {attendanceStats.present}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: theme.palette.error.light }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Absent
                </Typography>
                <Typography variant="h5" color="error.dark">
                  {attendanceStats.absent}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: theme.palette.warning.light }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Late
                </Typography>
                <Typography variant="h5" color="warning.dark">
                  {attendanceStats.late}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: theme.palette.info.light }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Unrecorded
                </Typography>
                <Typography variant="h5" color="info.dark">
                  {attendanceStats.unrecorded}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Children Statistics */}
      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <ChildCareIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          Children Statistics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ bgcolor: theme.palette.success.light }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  With Babysitters
                </Typography>
                <Typography variant="h5" color="success.dark">
                  {dashboardData?.data?.children?.withBabysitters || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ bgcolor: theme.palette.warning.light }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Without Babysitters
                </Typography>
                <Typography variant="h5" color="warning.dark">
                  {dashboardData?.data?.children?.withoutBabysitters || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard; 