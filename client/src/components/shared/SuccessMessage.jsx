import React from 'react';
import { Alert, Box } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const SuccessMessage = ({ message, onClose }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Alert
        severity="success"
        onClose={onClose}
        icon={<CheckCircleIcon />}
      >
        {message}
      </Alert>
    </Box>
  );
};

export default SuccessMessage; 