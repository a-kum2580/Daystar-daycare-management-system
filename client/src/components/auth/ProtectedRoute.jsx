import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Alert } from '@mui/material';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Check if user has required permissions
  const hasRequiredPermissions = requiredPermissions.every(permission =>
    user?.permissions?.includes(permission)
  );

  if (!hasRequiredPermissions) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You don't have permission to access this page.
        </Alert>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute; 