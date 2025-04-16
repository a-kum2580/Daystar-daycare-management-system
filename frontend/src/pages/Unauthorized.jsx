import React from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LockOutlined as LockIcon } from '@mui/icons-material';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 4,
            maxWidth: 600,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              bgcolor: 'error.light',
              borderRadius: '50%',
              p: 2,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockIcon sx={{ fontSize: 60, color: 'error.main' }} />
          </Box>

          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Access Denied
          </Typography>

          <Typography variant="h6" color="text.secondary" paragraph>
            You don't have permission to access this page.
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            If you believe this is an error, please contact your administrator.
          </Typography>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/')}
            >
              Go to Home
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Unauthorized; 