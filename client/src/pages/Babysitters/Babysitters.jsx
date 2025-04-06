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
  Grid,
  Chip
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Babysitters = () => {
  const { user } = useAuth();
  const [babysitters] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '555-123-4567',
      status: 'Active',
      experience: '5 years',
      certifications: ['CPR', 'First Aid']
    },
    {
      id: 2,
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '555-987-6543',
      status: 'Active',
      experience: '3 years',
      certifications: ['CPR', 'First Aid', 'Child Development']
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '555-456-7890',
      status: 'On Leave',
      experience: '4 years',
      certifications: ['CPR', 'First Aid']
    }
  ]);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h4" component="h1">
            Babysitters
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary">
            Add New Babysitter
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Certifications</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {babysitters.map((babysitter) => (
              <TableRow key={babysitter.id}>
                <TableCell>{babysitter.name}</TableCell>
                <TableCell>
                  <div>{babysitter.email}</div>
                  <div>{babysitter.phone}</div>
                </TableCell>
                <TableCell>
                  <Chip
                    label={babysitter.status}
                    color={babysitter.status === 'Active' ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell>{babysitter.experience}</TableCell>
                <TableCell>
                  {babysitter.certifications.join(', ')}
                </TableCell>
                <TableCell>
                  <Button size="small" sx={{ mr: 1 }}>Edit</Button>
                  <Button size="small" color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Babysitters; 