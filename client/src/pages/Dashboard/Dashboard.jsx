import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Admin Dashboard
                </Typography>
                <Typography>
                  Welcome to the admin dashboard. You have access to all features.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Typography>
                  • Manage Users
                  <br />
                  • View Reports
                  <br />
                  • System Settings
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        );
      case 'parent':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Parent Dashboard
                </Typography>
                <Typography>
                  Welcome to the parent dashboard. You can view your children's information and babysitter details.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Typography>
                  • View Children
                  <br />
                  • Check Babysitters
                  <br />
                  • View Schedule
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        );
      case 'babysitter':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Babysitter Dashboard
                </Typography>
                <Typography>
                  Welcome to the babysitter dashboard. You can view children's information and your schedule.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Typography>
                  • View Children
                  <br />
                  • Check Schedule
                  <br />
                  • Update Attendance
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        );
      default:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome
            </Typography>
            <Typography>
              Please select a role to view the appropriate dashboard.
            </Typography>
          </Paper>
        );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {getDashboardContent()}
    </Box>
  );
};

export default Dashboard; 