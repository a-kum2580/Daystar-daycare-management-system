import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
  Tooltip,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  InputAdornment,
  Snackbar,
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Cake as CakeIcon,
  ContactPhone as ContactPhoneIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Dashboard as DashboardIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  People as PeopleIcon,
  ToggleOn as ToggleOnIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import babysitterService from '../services/babysitterService';

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  nin: yup.string().required('National ID is required'),
  dateOfBirth: yup.date().required('Date of birth is required'),
  nextOfKinName: yup.string().required('Next of kin name is required'),
  nextOfKinPhone: yup.string().required('Next of kin phone is required'),
  nextOfKinRelationship: yup.string().required('Next of kin relationship is required'),
  status: yup.string().oneOf(['active', 'inactive', 'on_leave']).required('Status is required'),
});

export default function Babysitters() {
  const [open, setOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedBabysitter, setSelectedBabysitter] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [temporaryPasswords, setTemporaryPasswords] = useState({});
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['babysitters'],
    queryFn: babysitterService.getAllBabysitters,
  });

  // Ensure babysitters is always an array and extract the data property
  const babysitters = Array.isArray(data?.data) ? data.data : [];

  const createMutation = useMutation({
    mutationFn: babysitterService.createBabysitter,
    onSuccess: (response) => {
      queryClient.invalidateQueries(['babysitters']);
      handleClose();
      
      // Store the temporary password if email sending failed
      if (response.temporaryPassword) {
        setTemporaryPasswords(prev => ({
          ...prev,
          [response.data.user.id]: response.temporaryPassword
        }));
        
        setSnackbar({
          open: true,
          message: (
            <>
              <Typography variant="body1" gutterBottom>
                {response.message}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Temporary Password:</strong> {response.temporaryPassword}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                Please save this password securely and provide it to the babysitter.
              </Typography>
            </>
          ),
          severity: 'warning',
          duration: 30000,
        });
      } else {
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'success',
          duration: 6000,
        });
      }
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to create babysitter',
        severity: 'error',
        duration: 6000,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => babysitterService.updateBabysitter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['babysitters']);
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: babysitterService.deleteBabysitter,
    onSuccess: () => {
      queryClient.invalidateQueries(['babysitters']);
    },
  });

  const handleOpen = (babysitter = null) => {
    setSelectedBabysitter(babysitter);
    setOpen(true);
  };

  const handleView = (babysitter) => {
    setSelectedBabysitter(babysitter);
    setViewDialogOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBabysitter(null);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setSelectedBabysitter(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this babysitter?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'on_leave':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filteredBabysitters = babysitters
    .filter(babysitter => filterStatus === 'all' || babysitter.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'age':
          return a.age - b.age;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const stats = {
    total: babysitters.length,
    active: babysitters.filter(b => b.status === 'active').length,
    inactive: babysitters.filter(b => b.status === 'inactive').length,
    onLeave: babysitters.filter(b => b.status === 'on_leave').length,
  };

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nin: '',
    dateOfBirth: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
    nextOfKinRelationship: '',
    status: 'active',
  };

  const handleSubmit = (values, { resetForm }) => {
    if (selectedBabysitter) {
      updateMutation.mutate({ id: selectedBabysitter.id, data: values });
    } else {
      createMutation.mutate(values);
    }
    handleClose();
  };

  const handleResetPassword = async (id) => {
    try {
      const response = await babysitterService.resetBabysitterPassword(id);
      if (response.temporaryPassword) {
        setTemporaryPasswords(prev => ({
          ...prev,
          [id]: response.temporaryPassword
        }));
        setSnackbar({
          open: true,
          message: (
            <>
              <Typography variant="body1" gutterBottom>
                Password reset successful, but email sending failed.
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>New Password:</strong> {response.temporaryPassword}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                Please provide this password to the babysitter securely.
              </Typography>
            </>
          ),
          severity: 'warning',
          duration: 30000
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Password reset successful. New credentials have been sent to the babysitter.',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to reset password',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading babysitters: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Babysitters
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Babysitter
        </Button>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab icon={<DashboardIcon />} label="Dashboard" />
        <Tab icon={<PersonIcon />} label="List View" />
      </Tabs>

      {activeTab === 0 ? (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Babysitters
                </Typography>
                <Typography variant="h4">{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Babysitters
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.active}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  On Leave
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {stats.onLeave}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Inactive
                </Typography>
                <Typography variant="h4" color="error.main">
                  {stats.inactive}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <>
          <Box display="flex" gap={2} mb={3}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="on_leave">On Leave</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="age">Age</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBabysitters.map((babysitter) => (
                  <TableRow key={babysitter.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar>{babysitter.firstName[0]}</Avatar>
                        <Typography>
                          {babysitter.firstName} {babysitter.lastName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{babysitter.email}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {babysitter.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{babysitter.age}</TableCell>
                    <TableCell>
                      <Chip
                        label={babysitter.status.replace('_', ' ')}
                        color={getStatusColor(babysitter.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton onClick={() => handleView(babysitter)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleOpen(babysitter)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reset Password">
                          <IconButton onClick={() => handleResetPassword(babysitter.id)} color="info">
                            <RefreshIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(babysitter.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="babysitter-dialog-title"
        aria-describedby="babysitter-dialog-description"
        disablePortal
        keepMounted={false}
      >
        <DialogTitle 
          id="babysitter-dialog-title"
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <PersonAddIcon />
          {selectedBabysitter ? 'Edit Babysitter' : 'Add New Babysitter'}
        </DialogTitle>
        <DialogContent id="babysitter-dialog-description" sx={{ mt: 2 }}>
          <Formik
            initialValues={selectedBabysitter || initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Grid container spacing={3}>
                  {/* Personal Information Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon fontSize="small" />
                      Personal Information
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="firstName"
                      label="First Name"
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="lastName"
                      label="Last Name"
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="email"
                      label="Email"
                      type="email"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="phone"
                      label="Phone Number"
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="dateOfBirth"
                      label="Date of Birth"
                      type="date"
                      error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                      helperText={touched.dateOfBirth && errors.dateOfBirth}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CakeIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Identification Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" color="primary" sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BadgeIcon fontSize="small" />
                      Identification
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="nin"
                      label="National ID Number"
                      error={touched.nin && Boolean(errors.nin)}
                      helperText={touched.nin && errors.nin}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Next of Kin Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" color="primary" sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon fontSize="small" />
                      Next of Kin Information
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="nextOfKinName"
                      label="Next of Kin Name"
                      error={touched.nextOfKinName && Boolean(errors.nextOfKinName)}
                      helperText={touched.nextOfKinName && errors.nextOfKinName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="nextOfKinPhone"
                      label="Next of Kin Phone"
                      error={touched.nextOfKinPhone && Boolean(errors.nextOfKinPhone)}
                      helperText={touched.nextOfKinPhone && errors.nextOfKinPhone}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="nextOfKinRelationship"
                      label="Relationship"
                      error={touched.nextOfKinRelationship && Boolean(errors.nextOfKinRelationship)}
                      helperText={touched.nextOfKinRelationship && errors.nextOfKinRelationship}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PeopleIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Status Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" color="primary" sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ToggleOnIcon fontSize="small" />
                      Status
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      select
                      name="status"
                      label="Status"
                      error={touched.status && Boolean(errors.status)}
                      helperText={touched.status && errors.status}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ToggleOnIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Field>
                  </Grid>
                </Grid>

                <DialogActions sx={{ mt: 3, px: 2, pb: 2 }}>
                  <Button 
                    onClick={handleClose}
                    startIcon={<CloseIcon />}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Babysitter'}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleViewClose} maxWidth="md" fullWidth>
        <DialogTitle>Babysitter Details</DialogTitle>
        <DialogContent>
          {selectedBabysitter && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ width: 64, height: 64 }}>
                    {selectedBabysitter.firstName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h5">
                      {selectedBabysitter.firstName} {selectedBabysitter.lastName}
                    </Typography>
                    <Chip
                      label={selectedBabysitter.status.replace('_', ' ')}
                      color={getStatusColor(selectedBabysitter.status)}
                      size="small"
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <EmailIcon color="action" />
                  <Typography>{selectedBabysitter.email}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <PhoneIcon color="action" />
                  <Typography>{selectedBabysitter.phone}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <BadgeIcon color="action" />
                  <Typography>NIN: {selectedBabysitter.nin}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CakeIcon color="action" />
                  <Typography>Age: {selectedBabysitter.age}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={1}>
                  <ContactPhoneIcon color="action" />
                  <Typography>Next of Kin: {selectedBabysitter.nextOfKinName}</Typography>
                </Box>
              </Grid>
              
              {/* Update Login Credentials Section in View Dialog */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockIcon fontSize="small" />
                  Login Credentials
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EmailIcon color="action" />
                    <Typography>Login Email: {selectedBabysitter.email}</Typography>
                  </Box>
                  {temporaryPasswords[selectedBabysitter.id] && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <LockIcon color="action" />
                      <Typography>
                        Temporary Password: {temporaryPasswords[selectedBabysitter.id]}
                      </Typography>
                      <Typography variant="caption" color="warning.main" sx={{ ml: 1 }}>
                        (Please provide this to the babysitter securely)
                      </Typography>
                    </Box>
                  )}
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<LockIcon />}
                    onClick={() => handleResetPassword(selectedBabysitter.id)}
                    sx={{ mt: 1 }}
                  >
                    Reset Password
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.duration || 6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          action={
            snackbar.severity === 'warning' && (
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSnackbar}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 