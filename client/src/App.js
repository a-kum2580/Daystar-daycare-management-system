import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { createCustomTheme } from './styles/theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import store from './store';
import MainLayout from './components/layout/MainLayout';
import LandingPage from './pages/Landing/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';
import Children from './pages/Children/Children';
import Attendance from './pages/Attendance/Attendance';
import Schedule from './pages/Schedule/Schedule';
import Settings from './pages/Settings/Settings';
import Babysitters from './pages/Babysitters/Babysitters';
import Parents from './pages/Parents/Parents';
import Chat from './pages/Chat/Chat';
import Reports from './pages/Reports/Reports';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.some(permission => 
      user?.permissions?.includes(permission)
    );

    if (!hasPermission) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/children"
        element={
          <ProtectedRoute requiredPermissions={['view_children']}>
            <MainLayout>
              <Children />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute requiredPermissions={['view_attendance']}>
            <MainLayout>
              <Attendance />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule"
        element={
          <ProtectedRoute requiredPermissions={['view_schedule']}>
            <MainLayout>
              <Schedule />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute requiredPermissions={['view_settings']}>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/babysitters"
        element={
          <ProtectedRoute requiredPermissions={['view_babysitters']}>
            <MainLayout>
              <Babysitters />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parents"
        element={
          <ProtectedRoute requiredPermissions={['view_parents']}>
            <MainLayout>
              <Parents />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute requiredPermissions={['view_chat']}>
            <MainLayout>
              <Chat />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute requiredPermissions={['view_reports']}>
            <MainLayout>
              <Reports />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => createCustomTheme(darkMode), [darkMode]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
