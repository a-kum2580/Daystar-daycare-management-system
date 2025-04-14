import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';


export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user));
      // Invalidate and refetch user data
      queryClient.invalidateQueries(['user']);
      // Navigate to dashboard
      navigate('/dashboard');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      // Navigate to login
      navigate('/login');
    },
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      return authService.getProfile();
    },
    enabled: !!localStorage.getItem('token'),
  });

  return {
    user,
    isLoadingUser,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isLoading,
    isLoggingOut: logoutMutation.isLoading,
    loginError: loginMutation.error,
  };
}; 