import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import notFoundIllustration from '../assets/404-illustration.svg';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const FloatingImage = styled('img')({
  animation: `${float} 3s ease-in-out infinite`,
  maxWidth: '300px',
  marginBottom: '20px',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
});

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FFE5E5 0%, #FFF0E5 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <FloatingImage
            src={notFoundIllustration}
            alt="404 Illustration"
          />
          <Typography
            variant="h1"
            sx={{
              color: '#FF6B6B',
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '4rem', md: '6rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            404
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: '#4A4A4A',
              mb: 3,
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 600,
            }}
          >
            Oops! Page Not Found
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              mb: 4,
              fontSize: { xs: '1rem', md: '1.2rem' },
              maxWidth: '80%',
              mx: 'auto',
            }}
          >
            The page you're looking for seems to have wandered off to play somewhere else!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              bgcolor: '#FF6B6B',
              borderRadius: '25px',
              px: 4,
              py: 1.5,
              boxShadow: '0 4px 6px rgba(255,107,107,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#FF5252',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 8px rgba(255,107,107,0.3)',
              },
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound; 