import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

const Events = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: new Date(),
    type: 'activity',
    capacity: 10,
  });
  const queryClient = useQueryClient();

  // Mock data - Replace with actual API calls
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => Promise.resolve([
      {
        id: 1,
        title: 'Story Time',
        description: 'Interactive story reading session',
        date: new Date(),
        time: new Date(),
        type: 'activity',
        capacity: 15,
      },
      // Add more mock events as needed
    ]),
  });

  const handleOpenDialog = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date),
        time: new Date(event.time),
        type: event.type,
        capacity: event.capacity,
      });
    } else {
      setSelectedEvent(null);
      setFormData({
        title: '',
        description: '',
        date: new Date(),
        time: new Date(),
        type: 'activity',
        capacity: 10,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add mutation logic here
    handleCloseDialog();
  };

  const handleDelete = (eventId) => {
    // Add delete mutation logic here
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Events Schedule</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Schedule Event
        </Button>
      </Box>

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" gutterBottom>
                    {event.title}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenDialog(event)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(event.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {format(new Date(event.date), 'PPP')} at {format(new Date(event.time), 'p')}
                </Typography>
                <Typography variant="body2" paragraph>
                  {event.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Type: {event.type}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Capacity: {event.capacity} children
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEvent ? 'Edit Event' : 'Schedule New Event'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
              required
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date"
                    value={formData.date}
                    onChange={(newDate) => setFormData({ ...formData, date: newDate })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="Time"
                    value={formData.time}
                    onChange={(newTime) => setFormData({ ...formData, time: newTime })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
            <FormControl fullWidth margin="normal">
              <InputLabel>Event Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                label="Event Type"
              >
                <MenuItem value="activity">Activity</MenuItem>
                <MenuItem value="class">Class</MenuItem>
                <MenuItem value="field_trip">Field Trip</MenuItem>
                <MenuItem value="special_event">Special Event</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedEvent ? 'Update' : 'Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Events; 