import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  maxWidth: '400px',
  width: '100%',
  margin: '0 auto',
}));

const FloatingImage = styled('img')({
  animation: `${float} 3s ease-in-out infinite`,
  maxWidth: '150px',
  marginBottom: '20px',
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await login(formData.email, formData.password);
      if (response?.user) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FFE5E5 0%, #FFF0E5 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <FloatingImage
            src="/images/daycare-logo.svg"
            alt="Daystar Daycare Logo"
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: '#FF6B6B',
              fontWeight: 'bold',
              mb: 1,
            }}
          >
            Staff Login
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#666', mb: 3 }}
          >
            Welcome back! Please login to access the dashboard
          </Typography>
        </Box>

        <StyledPaper>
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: '#FF6B6B',
                '&:hover': { bgcolor: '#FF5252' },
                borderRadius: '25px',
                py: 1.5,
                position: 'relative',
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'white',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </StyledPaper>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="text"
            onClick={() => navigate('/')}
            sx={{ color: '#666' }}
            disabled={loading}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Login; 