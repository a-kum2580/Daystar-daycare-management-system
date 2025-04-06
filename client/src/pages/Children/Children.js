import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  TextField,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FormDialog from '../../components/shared/FormDialog';
import authService from '../../services/authService';

// Sample data with babysitter information
const initialChildren = [
  {
    id: 1,
    fullName: 'John Doe',
    age: 5,
    parentName: 'Jane Doe',
    parentPhone: '123-456-7890',
    specialNeeds: 'None',
    duration: 'Full Day',
    babysitter: {
      id: 1,
      name: 'Sarah Johnson',
      phone: '987-654-3210',
      email: 'sarah@daystar.com'
    }
  },
  // Add more sample data as needed
];

const validationSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  age: yup.number().required('Age is required').positive('Age must be positive'),
  parentName: yup.string().required('Parent/Guardian name is required'),
  parentPhone: yup.string().required('Parent/Guardian phone is required'),
  specialNeeds: yup.string().required('Special needs information is required'),
  duration: yup.string().required('Duration of stay is required'),
});

const Children = () => {
  const [children, setChildren] = useState(initialChildren);
  const [open, setOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const user = authService.getCurrentUser();
  const isParent = user?.role === 'parent';
  const canManageChildren = authService.hasPermission('manage_children');

  const formik = useFormik({
    initialValues: {
      fullName: '',
      age: '',
      parentName: '',
      parentPhone: '',
      specialNeeds: '',
      duration: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (selectedChild) {
        // Update existing child
        setChildren(children.map(child =>
          child.id === selectedChild.id ? { ...child, ...values } : child
        ));
      } else {
        // Add new child
        setChildren([...children, {
          id: children.length + 1,
          ...values,
          babysitter: {
            id: 1,
            name: 'Sarah Johnson',
            phone: '987-654-3210',
            email: 'sarah@daystar.com'
          }
        }]);
      }
      handleClose();
    },
  });

  const handleOpen = (child = null) => {
    setSelectedChild(child);
    if (child) {
      formik.setValues(child);
    } else {
      formik.resetForm();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedChild(null);
    formik.resetForm();
  };

  const handleDelete = (id) => {
    setChildren(children.filter(child => child.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Children
        </Typography>
        {canManageChildren && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Child
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Parent/Guardian</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Special Needs</TableCell>
              <TableCell>Duration</TableCell>
              {!isParent && <TableCell>Babysitter</TableCell>}
              {canManageChildren && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {children.map((child) => (
              <TableRow key={child.id}>
                <TableCell>{child.fullName}</TableCell>
                <TableCell>{child.age}</TableCell>
                <TableCell>{child.parentName}</TableCell>
                <TableCell>{child.parentPhone}</TableCell>
                <TableCell>
                  <Chip
                    label={child.specialNeeds}
                    color={child.specialNeeds === 'None' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{child.duration}</TableCell>
                {!isParent && (
                  <TableCell>
                    <Tooltip title={`Contact: ${child.babysitter.phone}`}>
                      <span>{child.babysitter.name}</span>
                    </Tooltip>
                  </TableCell>
                )}
                {canManageChildren && (
                  <TableCell>
                    <IconButton onClick={() => handleOpen(child)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(child.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FormDialog
        open={open}
        onClose={handleClose}
        title={selectedChild ? 'Edit Child' : 'Add Child'}
        onSubmit={formik.handleSubmit}
      >
        <TextField
          fullWidth
          margin="normal"
          id="fullName"
          name="fullName"
          label="Full Name"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          error={formik.touched.fullName && Boolean(formik.errors.fullName)}
          helperText={formik.touched.fullName && formik.errors.fullName}
        />
        <TextField
          fullWidth
          margin="normal"
          id="age"
          name="age"
          label="Age"
          type="number"
          value={formik.values.age}
          onChange={formik.handleChange}
          error={formik.touched.age && Boolean(formik.errors.age)}
          helperText={formik.touched.age && formik.errors.age}
        />
        <TextField
          fullWidth
          margin="normal"
          id="parentName"
          name="parentName"
          label="Parent/Guardian Name"
          value={formik.values.parentName}
          onChange={formik.handleChange}
          error={formik.touched.parentName && Boolean(formik.errors.parentName)}
          helperText={formik.touched.parentName && formik.errors.parentName}
        />
        <TextField
          fullWidth
          margin="normal"
          id="parentPhone"
          name="parentPhone"
          label="Parent/Guardian Phone"
          value={formik.values.parentPhone}
          onChange={formik.handleChange}
          error={formik.touched.parentPhone && Boolean(formik.errors.parentPhone)}
          helperText={formik.touched.parentPhone && formik.errors.parentPhone}
        />
        <TextField
          fullWidth
          margin="normal"
          id="specialNeeds"
          name="specialNeeds"
          label="Special Needs"
          value={formik.values.specialNeeds}
          onChange={formik.handleChange}
          error={formik.touched.specialNeeds && Boolean(formik.errors.specialNeeds)}
          helperText={formik.touched.specialNeeds && formik.errors.specialNeeds}
        />
        <TextField
          fullWidth
          margin="normal"
          id="duration"
          name="duration"
          label="Duration of Stay"
          value={formik.values.duration}
          onChange={formik.handleChange}
          error={formik.touched.duration && Boolean(formik.errors.duration)}
          helperText={formik.touched.duration && formik.errors.duration}
        />
      </FormDialog>
    </Box>
  );
};

export default Children; 