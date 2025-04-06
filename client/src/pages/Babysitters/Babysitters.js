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
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Babysitters = () => {
  const [babysitters] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@daystar.com',
      phone: '(555) 123-4567',
      status: 'Active',
      experience: '5 years',
      certifications: ['First Aid', 'CPR'],
    },
    {
      id: 2,
      name: 'Michael Brown',
      email: 'michael.b@daystar.com',
      phone: '(555) 234-5678',
      status: 'Active',
      experience: '3 years',
      certifications: ['First Aid', 'Child Development'],
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.d@daystar.com',
      phone: '(555) 345-6789',
      status: 'On Leave',
      experience: '4 years',
      certifications: ['CPR', 'Early Childhood Education'],
    },
  ]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Babysitters</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Babysitter
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
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
                <TableCell>{babysitter.email}</TableCell>
                <TableCell>{babysitter.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={babysitter.status}
                    color={babysitter.status === 'Active' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{babysitter.experience}</TableCell>
                <TableCell>
                  {babysitter.certifications.map((cert) => (
                    <Chip
                      key={cert}
                      label={cert}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
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

export default Babysitters; 