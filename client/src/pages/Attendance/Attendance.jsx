import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Attendance = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data - replace with actual API calls
  const attendanceData = [
    { id: 1, childName: 'John Doe', checkIn: '08:00', checkOut: '16:00', status: 'Present' },
    { id: 2, childName: 'Jane Smith', checkIn: '08:30', checkOut: '15:30', status: 'Present' },
    { id: 3, childName: 'Mike Johnson', checkIn: '-', checkOut: '-', status: 'Absent' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Attendance
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="Select Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Button variant="contained" color="primary" sx={{ mt: 1 }}>
            Export Attendance
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Child Name</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.childName}</TableCell>
                <TableCell>{row.checkIn}</TableCell>
                <TableCell>{row.checkOut}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    color={row.status === 'Present' ? 'error' : 'success'}
                  >
                    {row.status === 'Present' ? 'Mark Absent' : 'Mark Present'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Attendance; 