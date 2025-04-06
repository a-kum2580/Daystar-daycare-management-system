import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ChildCare as ChildCareIcon,
  Schedule as ScheduleIcon,
  EventNote as AttendanceIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Chat as ChatIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', permission: 'view_dashboard' },
  { text: 'Children', icon: <ChildCareIcon />, path: '/children', permission: 'view_children' },
  { text: 'Schedule', icon: <ScheduleIcon />, path: '/schedule', permission: 'view_schedule' },
  { text: 'Attendance', icon: <AttendanceIcon />, path: '/attendance', permission: 'view_attendance' },
  { text: 'Chat', icon: <ChatIcon />, path: '/chat', permission: 'view_chat' },
  { text: 'Reports', icon: <BarChartIcon />, path: '/reports', permission: 'view_reports' },
];

const adminItems = [
  { text: 'Babysitters', icon: <PersonIcon />, path: '/babysitters', permission: 'view_babysitters' },
  { text: 'Parents', icon: <GroupIcon />, path: '/parents', permission: 'view_parents' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings', permission: 'view_settings' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const renderMenuItems = (items) => {
    return items.map((item) => {
      if (!user?.permissions?.includes(item.permission)) return null;
      
      return (
        <ListItem
          button
          key={item.text}
          onClick={() => navigate(item.path)}
          selected={location.pathname === item.path}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              },
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      );
    });
  };

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        backgroundColor: '#1a237e',
        color: 'white',
        position: 'fixed',
        left: 0,
        top: 0,
        paddingTop: '64px', // Height of the AppBar
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Daystar Daycare
        </Typography>
        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)', mb: 2 }} />
      </Box>
      <List>
        {renderMenuItems(menuItems)}
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <>
            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)', my: 2 }} />
            {renderMenuItems(adminItems)}
          </>
        )}
      </List>
    </Box>
  );
};

export default Sidebar; 