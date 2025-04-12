import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/PublicLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../components/DashboardLayout';

// Public Pages
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ForgotPassword } from '../pages/ForgotPassword';
import { ParentGuide } from '../pages/ParentGuide';
import { Enrollment } from '../pages/Enrollment';
import { ChildEnrollment } from '../pages/ChildEnrollment';
import { Calendar } from '../pages/Calendar';

// Protected Pages
import { Dashboard } from '../pages/Dashboard';
import { BabysitterDashboard } from '../pages/BabysitterDashboard';
import { BabysitterManagement } from '../pages/BabysitterManagement';
import { ExpenseReport } from '../pages/ExpenseReport';
import { Settings } from '../pages/Settings';
import { ChildrenManagement } from '../pages/ChildrenManagement';
import { Attendance } from '../pages/Attendance';
import { Finance } from '../pages/Finance';
import { Reports } from '../pages/Reports';
import { Notifications } from '../pages/Notifications';

// Public Route wrapper
const PublicRoute = ({ children }) => {
  console.log('PublicRoute rendering with children:', children);
  return <PublicLayout>{children}</PublicLayout>;
};

// Protected Route wrapper
const ProtectedRouteWrapper = ({ children }) => {
  return <ProtectedRoute><DashboardLayout>{children}</DashboardLayout></ProtectedRoute>;
};

export function AppRoutes() {
  console.log('AppRoutes rendering');
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/parent-guide" element={<PublicRoute><ParentGuide /></PublicRoute>} />
      <Route path="/enrollment" element={<PublicRoute><Enrollment /></PublicRoute>} />
      <Route 
        path="/enroll-child" 
        element={
          <PublicRoute>
            <ChildEnrollment />
          </PublicRoute>
        } 
      />
      <Route path="/calendar" element={<PublicRoute><Calendar /></PublicRoute>} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRouteWrapper><Dashboard /></ProtectedRouteWrapper>} />
      <Route path="/babysitter-dashboard" element={<ProtectedRouteWrapper><BabysitterDashboard /></ProtectedRouteWrapper>} />
      <Route path="/babysitters" element={<ProtectedRouteWrapper><BabysitterManagement /></ProtectedRouteWrapper>} />
      <Route path="/children" element={<ProtectedRouteWrapper><ChildrenManagement /></ProtectedRouteWrapper>} />
      <Route path="/attendance" element={<ProtectedRouteWrapper><Attendance /></ProtectedRouteWrapper>} />
      <Route path="/finance" element={<ProtectedRouteWrapper><Finance /></ProtectedRouteWrapper>} />
      <Route path="/reports" element={<ProtectedRouteWrapper><Reports /></ProtectedRouteWrapper>} />
      <Route path="/settings" element={<ProtectedRouteWrapper><Settings /></ProtectedRouteWrapper>} />
      <Route path="/notifications" element={<ProtectedRouteWrapper><Notifications /></ProtectedRouteWrapper>} />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 