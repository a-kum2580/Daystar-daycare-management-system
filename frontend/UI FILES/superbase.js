import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// In a production environment, these would be environment variables
// NOTE: These are placeholder values. Replace with actual credentials.
const supabaseUrl = 'https://tqoboebrnijyyqxmrzdh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxb2JvZWJybmlqeXlxeG1yemRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk1OTEyMDAsImV4cCI6MTk5NTE2NzIwMH0.KIb4RK0jQGlqVwQtK9-Mu-vlciX9r_I3RA8RusiiUTA';

// Initialize the Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// User role types
export enum UserRole {
  MANAGER = 'manager',
  BABYSITTER = 'babysitter',
}

// Type for user with role
export type UserWithRole = {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

// Authentication helper functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string, userData: Partial<UserWithRole>) => {
  // First create the auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: userData.role,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    },
  });

  if (error || !data.user) {
    return { data, error };
  }

  // Then create the profile with additional user data
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      {
        id: data.user.id,
        email,
        role: userData.role,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
      },
    ]);

  return { data, error: profileError };
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
};

export const updatePassword = async (newPassword: string) => {
  return await supabase.auth.updateUser({
    password: newPassword,
  });
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Get profile data with role information
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return {
    ...user,
    role: profile?.role || user.user_metadata?.role,
    firstName: profile?.first_name || user.user_metadata?.firstName,
    lastName: profile?.last_name || user.user_metadata?.lastName,
    phone: profile?.phone,
  };
};

// Helper to check if user has a specific role
export const hasRole = async (role: UserRole) => {
  const user = await getCurrentUser();
  return user?.role === role;
};
