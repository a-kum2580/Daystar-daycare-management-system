import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

export function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, check their role and redirect accordingly
  if (user) {
    if (user.role === 'manager' && window.location.pathname === '/babysitter-dashboard') {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === 'babysitter' && window.location.pathname === '/dashboard') {
      return <Navigate to="/babysitter-dashboard" replace />;
    }
  }

  // If we get here, either:
  // 1. The user is authenticated and on the correct route for their role
  // 2. The user is authenticated but not on a role-specific route
  return children;
} 