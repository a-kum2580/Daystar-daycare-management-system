import React from 'react';
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
  Grid,
  Chip,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Parents = () => {
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const parents = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '555-0123',
      children: ['Emma Smith', 'Liam Smith'],
      status: 'Active',
      paymentStatus: 'Current'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      email: 'maria@example.com',
      phone: '555-0124',
      children: ['Sophia Garcia'],
      status: 'Active',
      paymentStatus: 'Current'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '555-0125',
      children: ['Ethan Chen', 'Olivia Chen'],
      status: 'Inactive',
      paymentStatus: 'Overdue'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Parents
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button variant="contained" color="primary">
            Add New Parent
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Children</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parents.map((parent) => (
              <TableRow key={parent.id}>
                <TableCell>{parent.name}</TableCell>
                <TableCell>
                  <div>{parent.email}</div>
                  <div>{parent.phone}</div>
                </TableCell>
                <TableCell>{parent.children.join(', ')}</TableCell>
                <TableCell>
                  <Chip
                    label={parent.status}
                    color={parent.status === 'Active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={parent.paymentStatus}
                    color={parent.paymentStatus === 'Current' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                  >
                    Delete
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

export default Parents; 