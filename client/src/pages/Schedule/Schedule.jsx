import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Schedule = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data - replace with actual API calls
  const scheduleData = [
    {
      id: 1,
      title: 'Morning Session',
      time: '08:00 - 12:00',
      children: ['John Doe', 'Jane Smith'],
      babysitter: 'Sarah Johnson',
    },
    {
      id: 2,
      title: 'Afternoon Session',
      time: '12:00 - 16:00',
      children: ['Mike Johnson', 'Emma Wilson'],
      babysitter: 'David Brown',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Schedule
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="Select Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          {scheduleData.map((session) => (
            <Card key={session.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {session.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Time: {session.time}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Babysitter: {session.babysitter}
                </Typography>
                <Typography variant="body2">
                  Children: {session.children.join(', ')}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary">
            Add New Session
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Schedule; 