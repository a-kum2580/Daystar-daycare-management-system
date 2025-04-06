import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();

  const renderAdminSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="User Management" secondary="Manage user accounts and roles" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Role Permissions" secondary="Configure role-based access control" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="System Configuration" secondary="Configure daycare settings" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Password Policy" secondary="Configure password requirements" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Session Management" secondary="Manage user sessions" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Audit Logs" secondary="View system activity logs" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderParentSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Profile Information" secondary="Update your contact details" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Notification Preferences" secondary="Manage email notifications" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Payment Methods" secondary="Manage payment options" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderBabysitterSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Work Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Availability" secondary="Set your working hours" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Skills & Certifications" secondary="Update your qualifications" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Emergency Contacts" secondary="Manage emergency contact information" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const getSettingsContent = () => {
    switch (user?.role) {
      case 'admin':
        return renderAdminSettings();
      case 'parent':
        return renderParentSettings();
      case 'babysitter':
        return renderBabysitterSettings();
      default:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              No settings available for your role
            </Typography>
          </Paper>
        );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      {getSettingsContent()}
    </Box>
  );
};

export default Settings; 