import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { ForgotPassword } from '../pages/ForgotPassword';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { BabysitterManagement } from '../pages/BabysitterManagement';
import { Children } from '../pages/Children';
import { Attendance } from '../pages/Attendance';
import { Finance } from '../pages/Finance';
import { Reports } from '../pages/Reports';
import { Settings } from '../pages/Settings';
import { DashboardLayout } from '../components/DashboardLayout';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  // Temporarily bypass authentication for development
  return <DashboardLayout>{children}</DashboardLayout>;
};

// Public Route wrapper component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Route configurations
export const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/babysitters',
    element: (
      <ProtectedRoute>
        <BabysitterManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/children',
    element: (
      <ProtectedRoute>
        <Children />
      </ProtectedRoute>
    ),
  },
  {
    path: '/attendance',
    element: (
      <ProtectedRoute>
        <Attendance />
      </ProtectedRoute>
    ),
  },
  {
    path: '/finance',
    element: (
      <ProtectedRoute>
        <Finance />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]; 