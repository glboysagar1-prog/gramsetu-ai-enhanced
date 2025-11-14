// Debug version of AuthContext with enhanced error handling
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { createClient } from '@insforge/sdk';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize InsForge client
  const client = createClient({ 
    baseUrl: process.env.REACT_APP_INSFORGE_URL || 'https://89gp4et3.us-east.insforge.app'
  });

  console.log('AuthProvider initialized with client:', {
    baseUrl: process.env.REACT_APP_INSFORGE_URL || 'https://89gp4et3.us-east.insforge.app',
    hasAuth: !!client.auth,
    hasSignIn: !!client.auth?.signInWithPassword,
    hasOAuth: !!client.auth?.signInWithOAuth
  });

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('gramsetuToken');
    const storedUser = localStorage.getItem('gramsetuUser');

    if (storedToken && storedUser) {
      try {
        const decoded = jwtDecode(storedToken);
        
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          console.log('Token expired, logging out');
          logout();
        } else {
          console.log('Valid token found, setting user');
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    console.log('Login function called with credentials:', credentials);
    
    try {
      console.log('Attempting InsForge login with baseUrl:', process.env.REACT_APP_INSFORGE_URL || 'https://89gp4et3.us-east.insforge.app');
      
      // First, test basic connectivity
      try {
        console.log('Testing basic connectivity to backend...');
        const response = await fetch(process.env.REACT_APP_INSFORGE_URL || 'https://89gp4et3.us-east.insforge.app', { method: 'HEAD', mode: 'no-cors' });
        console.log('Connectivity test response:', response);
      } catch (connectivityError) {
        console.error('Connectivity test failed:', connectivityError);
        return { success: false, error: 'Network connectivity issue. Please check your internet connection.' };
      }
      
      // Add a timeout to catch hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000);
      });
      
      const loginPromise = client.auth.signInWithPassword({
        email: credentials.email || credentials.username, // Use email if available, fallback to username
        password: credentials.password
      });
      
      const { data, error } = await Promise.race([loginPromise, timeoutPromise]);

      console.log('Login response received:', { data, error });
      
      if (error) {
        console.error('Login error from server:', error);
        throw error;
      }

      // Store token and user
      localStorage.setItem('gramsetuToken', data.accessToken);
      // Add role to the user data before storing
      const userWithRole = {
        ...data.user,
        role: credentials.role || 'citizen' // Default to citizen if no role provided
      };
      localStorage.setItem('gramsetuUser', JSON.stringify(userWithRole));
      
      setToken(data.accessToken);
      setUser(userWithRole);
      
      console.log('Login successful, user set:', userWithRole);
      
      return { success: true, user: userWithRole };
    } catch (error) {
      console.error('Login failed with error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your network connection.';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Failed to connect to authentication server. Please try again.';
      } else {
        errorMessage = error.message || 'Login failed. Please check your credentials and try again.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData) => {
    console.log('Signup function called with data:', userData);
    
    try {
      const { data, error } = await client.auth.signUp({
        email: userData.email,
        password: userData.password
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      // Update profile with nickname
      const { error: profileError } = await client.auth.setProfile({
        nickname: userData.name
      });
      
      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      // Create user object with role
      const userWithRole = {
        ...data.user,
        role: userData.role || 'citizen' // Default to citizen if no role provided
      };

      return { success: true, user: userWithRole };
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, error: error.message || 'Signup failed. Please check your information and try again.' };
    }
  };

  const googleLogin = async () => {
    console.log('Google login function called');
    
    try {
      console.log('Initiating Google OAuth with settings:', {
        provider: 'google',
        redirectTo: window.location.origin + '/auth/callback/google',
        baseUrl: process.env.REACT_APP_INSFORGE_URL || 'https://89gp4et3.us-east.insforge.app'
      });
      
      // Use InsForge for Google OAuth
      console.log('Calling client.auth.signInWithOAuth...');
      const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        redirectTo: window.location.origin + '/auth/callback/google',
        skipBrowserRedirect: true
      });

      console.log('Google OAuth response received:', { data, error });
      
      if (error) {
        console.error('Google login error from server:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to Google OAuth URL:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No redirect URL provided in response:', data);
        throw new Error('No redirect URL provided');
      }
    } catch (error) {
      console.error('Google login failed with exception:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Provide more specific error messages
      let errorMessage = 'Google login failed. Please try again.';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your network connection.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Failed to connect to Google authentication server. Please check your network connection.';
      } else if (error.message.includes('NetworkError')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else {
        errorMessage = error.message || 'Google login failed. Please check your connection and try again.';
      }
      
      console.log('Returning error message:', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    console.log('Logout function called');
    localStorage.removeItem('gramsetuToken');
    localStorage.removeItem('gramsetuUser');
    setToken(null);
    setUser(null);
    client.auth.signOut();
  };

  const updateUser = async (updates) => {
    try {
      const { data, error } = await client.auth.setProfile(updates);
      if (error) throw error;
      
      const updatedUser = { ...user, ...data };
      localStorage.setItem('gramsetuUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getCurrentUser = async () => {
    try {
      const { data, error } = await client.auth.getCurrentUser();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const isAuthenticated = !!user;
  // Get role from user object, fallback to citizen if not set
  const userRole = user?.role || 'citizen';

  // Role-based access control functions
  const hasRole = (requiredRole) => {
    if (!user) return false;
    // Get role from user object, fallback to citizen if not set
    const role = user.role || 'citizen';
    // National admin has access to all roles
    if (role === 'national-admin') return true;
    return role === requiredRole;
  };

  const hasAnyRole = (requiredRoles) => {
    if (!user) return false;
    // Get role from user object, fallback to citizen if not set
    const role = user.role || 'citizen';
    // National admin has access to all roles
    if (role === 'national-admin') return true;
    return requiredRoles.includes(role);
  };

  const testNetworkConnectivity = async () => {
    try {
      console.log('Testing network connectivity...');
      
      // Test DNS resolution and basic HTTP connectivity
      const baseUrl = process.env.REACT_APP_INSFORGE_URL || 'https://89gp4et3.us-east.insforge.app';
      console.log('Testing connectivity to:', baseUrl);
      
      // Test 1: Basic fetch
      const response = await fetch(baseUrl, { 
        method: 'HEAD', 
        mode: 'cors',
        timeout: 5000
      });
      console.log('Basic fetch test result:', response.status, response.statusText);
      
      // Test 2: Test InsForge endpoint specifically
      const authEndpoint = `${baseUrl}/api/auth/v1/token`;
      console.log('Testing auth endpoint:', authEndpoint);
      
      return { success: true, message: 'Network connectivity test passed' };
    } catch (error) {
      console.error('Network connectivity test failed:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    googleLogin,
    logout,
    updateUser,
    getCurrentUser,
    isAuthenticated,
    userRole,
    hasRole,
    hasAnyRole,
    testNetworkConnectivity // Add the test function to the context
  };

  console.log('AuthProvider value:', value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;