import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Permission groups for better organization
const permissionGroups = {
  dashboard: ['view_dashboard'],
  children: ['view_children', 'manage_children', 'view_own_children'],
  babysitters: ['view_babysitters', 'manage_babysitters'],
  financial: ['view_financial', 'manage_financial', 'make_payments'],
  reports: ['view_reports', 'generate_reports'],
  settings: ['view_settings', 'manage_settings'],
  attendance: ['view_attendance', 'update_attendance'],
  schedule: ['view_schedule', 'manage_schedule']
};

// Role hierarchy and permissions
const roleHierarchy = {
  admin: {
    name: 'System Administrator',
    inherits: [],
    permissions: [
      // Dashboard
      'view_dashboard',
      
      // Children
      'view_children',
      'manage_children',
      'view_own_children',
      
      // Babysitters
      'view_babysitters',
      'manage_babysitters',
      
      // Financial
      'view_financial',
      'manage_financial',
      'make_payments',
      
      // Reports
      'view_reports',
      'generate_reports',
      
      // Settings
      'view_settings',
      'manage_settings',
      
      // Attendance
      'view_attendance',
      'update_attendance',
      
      // Schedule
      'view_schedule',
      'manage_schedule',
      
      // System
      'manage_users',
      'manage_roles',
      'view_all_users',
      'view_parents',
      'view_babysitters_list'
    ]
  },
  manager: {
    name: 'Daycare Manager',
    inherits: ['babysitter'],
    permissions: [
      ...permissionGroups.dashboard,
      ...permissionGroups.children,
      ...permissionGroups.babysitters,
      ...permissionGroups.financial,
      ...permissionGroups.reports,
      ...permissionGroups.settings,
      ...permissionGroups.attendance,
      ...permissionGroups.schedule,
      'view_parents',
      'view_babysitters_list'
    ]
  },
  babysitter: {
    name: 'Babysitter',
    inherits: [],
    permissions: [
      ...permissionGroups.dashboard,
      'view_children',
      'view_schedule',
      'view_attendance',
      'update_attendance',
      'view_parents'
    ]
  },
  parent: {
    name: 'Parent',
    inherits: [],
    permissions: [
      ...permissionGroups.dashboard,
      'view_own_children',
      'view_children_babysitters',
      'view_schedule',
      'view_attendance',
      'make_payments'
    ]
  }
};

// Mock user data with proper role-based permissions
const mockUsers = [
  {
    id: 1,
    email: 'admin@daystar.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    permissions: [
      'view_dashboard',
      'view_children',
      'manage_children',
      'view_financials',
      'manage_financials',
      'view_reports',
      'view_settings',
      'view_attendance',
      'manage_attendance',
      'view_schedule',
      'manage_schedule',
      'view_babysitters',
      'manage_babysitters',
      'view_parents',
      'manage_parents'
    ]
  },
  {
    id: 2,
    email: 'manager@daystar.com',
    password: 'manager123',
    name: 'Manager User',
    role: 'manager',
    permissions: [
      'view_dashboard',
      'view_children',
      'manage_children',
      'view_financials',
      'manage_financials',
      'view_reports',
      'view_settings',
      'view_attendance',
      'manage_attendance',
      'view_schedule',
      'manage_schedule',
      'view_babysitters',
      'manage_babysitters',
      'view_parents',
      'manage_parents'
    ]
  },
  {
    id: 3,
    email: 'parent@daystar.com',
    password: 'parent123',
    name: 'Parent User',
    role: 'parent',
    permissions: [
      'view_dashboard',
      'view_children',
      'view_attendance',
      'view_schedule',
      'view_babysitters',
      'view_chat'
    ]
  },
  {
    id: 4,
    email: 'babysitter@daystar.com',
    password: 'babysitter123',
    name: 'Babysitter User',
    role: 'babysitter',
    permissions: [
      'view_dashboard',
      'view_children',
      'view_attendance',
      'view_schedule',
      'view_parents',
      'view_chat'
    ]
  }
];

// Cache for user permissions
const permissionCache = new Map();

// Get all permissions for a role (including inherited permissions)
const getAllPermissionsForRole = (role) => {
  if (permissionCache.has(role)) {
    return permissionCache.get(role);
  }

  const roleConfig = roleHierarchy[role];
  if (!roleConfig) return [];

  let permissions = new Set(roleConfig.permissions);

  // Add inherited permissions
  roleConfig.inherits.forEach(inheritedRole => {
    const inheritedPermissions = getAllPermissionsForRole(inheritedRole);
    inheritedPermissions.forEach(permission => permissions.add(permission));
  });

  const result = Array.from(permissions);
  permissionCache.set(role, result);
  return result;
};

// Mock login function
export const login = async (email, password) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Attempting login with:', { email, password });
    
    const user = mockUsers.find(
      user => user.email === email && user.password === password
    );

    if (!user) {
      console.log('Login failed: User not found');
      throw new Error('Invalid email or password');
    }

    // Remove password from user object before storing
    const { password: _, ...userWithoutPassword } = user;
    
    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    console.log('Login successful:', userWithoutPassword);
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Mock logout function
export const logout = () => {
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getCurrentUser();
};

// Check if user has specific permissions
export const hasPermission = (permission) => {
  const user = getCurrentUser();
  return user?.permissions?.includes(permission) || false;
};

// Check if user has all required permissions
export const hasAllPermissions = (permissions) => {
  const user = getCurrentUser();
  return permissions.every(permission => 
    user?.permissions?.includes(permission)
  );
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

// Get available roles
export const getAvailableRoles = () => {
  return Object.keys(roleHierarchy).map(role => ({
    value: role,
    label: roleHierarchy[role].name
  }));
};

// Get permissions for a specific role
export const getRolePermissions = (role) => {
  return getAllPermissionsForRole(role);
};

// Export all functions
export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  hasPermission,
  hasAllPermissions,
  getUserRole,
  getAvailableRoles,
  getRolePermissions
}; 