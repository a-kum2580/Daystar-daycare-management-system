import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Babysitters from './pages/Babysitters';
import Children from './pages/Children';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Events from './pages/Events';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create a child-friendly theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B', // Playful red
      light: '#FFE5E5',
      dark: '#FF5252',
    },
    secondary: {
      main: '#4ECDC4', // Teal
      light: '#E0F7F5',
      dark: '#45B7AF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    success: {
      main: '#95E1D3', // Mint green
    },
    warning: {
      main: '#FFD93D', // Sunny yellow
    },
    info: {
      main: '#6C5CE7', // Purple
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route element={<MainLayout />}>
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/babysitters"
                  element={
                    <ProtectedRoute roles={['admin', 'staff']}>
                      <Babysitters />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/children"
                  element={
                    <ProtectedRoute roles={['admin', 'staff', 'parent']}>
                      <Children />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute roles={['admin', 'staff']}>
                      <Payments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'staff']}>
                      <MainLayout>
                        <Reports />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events"
                  element={
                    <ProtectedRoute roles={['admin', 'staff']}>
                      <Events />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Error routes */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 