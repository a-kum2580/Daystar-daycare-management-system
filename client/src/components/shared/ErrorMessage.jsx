import React from 'react';
import { Alert, Box } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

const ErrorMessage = ({ message, onClose }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Alert
        severity="error"
        onClose={onClose}
        icon={<ErrorIcon />}
      >
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorMessage; 