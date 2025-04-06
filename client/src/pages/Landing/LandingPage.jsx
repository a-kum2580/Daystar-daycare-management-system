import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              Welcome to Daystar Daycare
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ 
                mb: 3,
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              Your trusted partner in childcare
            </Typography>
          </Box>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{ 
              mb: 3,
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': {
                  color: 'white',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
              },
            }}
          >
            <Tab label="Login" />
            <Tab label="Create Account" />
          </Tabs>

          {activeTab === 0 ? <LoginForm /> : <RegisterForm />}

          <Typography
            variant="body2"
            align="center"
            sx={{ 
              mt: 3,
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            {activeTab === 0
              ? "Don't have an account? "
              : 'Already have an account? '}
            <Typography
              component="span"
              onClick={() => setActiveTab(activeTab === 0 ? 1 : 0)}
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {activeTab === 0 ? 'Sign up' : 'Sign in'}
            </Typography>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LandingPage; 