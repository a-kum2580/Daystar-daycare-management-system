import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ChildCare as ChildCareIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';

const drawerWidth = 240;

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const fetchRecentNotifications = async () => {
    try {
      const recentNotifications = await notificationService.getRecentNotifications();
      setNotifications(recentNotifications);
    } catch (error) {
      console.error('Failed to fetch recent notifications:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    fetchRecentNotifications();

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchRecentNotifications();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationSelect = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      fetchUnreadCount();
      fetchRecentNotifications();
      handleClose();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchUnreadCount();
      fetchRecentNotifications();
      handleClose();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    const items = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { text: 'Children', icon: <ChildCareIcon />, path: '/children' },
      { text: 'Babysitters', icon: <PeopleIcon />, path: '/babysitters' },
      { text: 'Payments', icon: <MoneyIcon />, path: '/payments' },
      { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
    ];

    // Add admin-specific menu items
    if (user?.role === 'admin') {
      items.push(
        { text: 'Admin Panel', icon: <AdminIcon />, path: '/admin' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
      );
    }

    return items;
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Daystar Daycare
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={user?.avatar}
          alt={user?.name}
          sx={{ width: 40, height: 40 }}
        >
          {user?.name?.charAt(0) || <AccountCircleIcon />}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" noWrap>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user?.role || 'Staff'}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {getMenuItems().map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider />
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Daystar Daycare Center
          </Typography>
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            PaperProps={{
              style: {
                maxHeight: 400,
                width: 360,
              },
            }}
          >
            <MenuItem onClick={() => handleNavigation('/profile')}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout; 