import React from 'react';
import { Navigate } from 'react-router-dom';
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
import { ParentGuide } from '../pages/ParentGuide';
import { Enrollment } from '../pages/Enrollment';
import { Calendar } from '../pages/Calendar';
import { BabysitterPayments } from '../pages/BabysitterPayments';
import { ChildRegistration } from '../pages/ChildRegistration';
import { BabysitterScheduling } from '../pages/BabysitterScheduling';
import { DashboardLayout } from '../components/DashboardLayout';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  // Temporarily bypass authentication for development
  return <DashboardLayout>{children}</DashboardLayout>;
};

// Route configurations
export const routes = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/register', element: <Register /> },
  { path: '/register-child', element: <ChildRegistration /> },
  { path: '/parent-guide', element: <ParentGuide /> },
  { path: '/enrollment', element: <Enrollment /> },
  { path: '/calendar', element: <Calendar /> },
  { path: '/dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
  { path: '/babysitters', element: <ProtectedRoute><BabysitterManagement /></ProtectedRoute> },
  { path: '/babysitter-payments', element: <ProtectedRoute><BabysitterPayments /></ProtectedRoute> },
  { path: '/babysitter-scheduling', element: <ProtectedRoute><BabysitterScheduling /></ProtectedRoute> },
  { path: '/children', element: <ProtectedRoute><Children /></ProtectedRoute> },
  { path: '/attendance', element: <ProtectedRoute><Attendance /></ProtectedRoute> },
  { path: '/finance', element: <ProtectedRoute><Finance /></ProtectedRoute> },
  { path: '/reports', element: <ProtectedRoute><Reports /></ProtectedRoute> },
  { path: '/settings', element: <ProtectedRoute><Settings /></ProtectedRoute> },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]; 