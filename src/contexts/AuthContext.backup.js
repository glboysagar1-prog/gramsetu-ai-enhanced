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

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('gramsetuToken');
    const storedUser = localStorage.getItem('gramsetuUser');

    if (storedToken && storedUser) {
      try {
        const decoded = jwtDecode(storedToken);
        
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
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
    try {
      console.log('Attempting login with credentials:', {
        email: credentials.username,
        baseUrl: process.env.REACT_APP_INSFORGE_URL || 'https://89gp4et3.us-east.insforge.app'
      });
      
      // Use InsForge for login
      const { data, error } = await client.auth.signInWithPassword({
        email: credentials.username,
        password: credentials.password
      });

      console.log('Login response:', { data, error });
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      // Store token and user
      localStorage.setItem('gramsetuToken', data.accessToken);
      localStorage.setItem('gramsetuUser', JSON.stringify(data.user));
      
      setToken(data.accessToken);
      setUser(data.user);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Login failed. Please check your credentials and try again.' };
    }
  };

  const signup = async (userData) => {
    try {
      // Use InsForge for signup
      const { data, error } = await client.auth.signUp({
        email: userData.email,
        password: userData.password
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      // Update profile with additional information
      const { error: profileError } = await client.auth.setProfile({
        nickname: userData.name,
        role: userData.role
      });
      
      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, error: error.message || 'Signup failed. Please check your information and try again.' };
    }
  };

  const googleLogin = async () => {
    try {
      console.log('Initiating Google OAuth with settings:', {
        provider: 'google',
        redirectTo: window.location.origin + '/auth/callback/google',
        baseUrl: process.env.REACT_APP_INSFORGE_URL || 'https://89gp4et3.us-east.insforge.app'
      });
      
      // Use InsForge for Google OAuth
      const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        redirectTo: window.location.origin + '/auth/callback/google',
        skipBrowserRedirect: true
      });

      console.log('Google OAuth response:', { data, error });
      
      if (error) {
        console.error('Google login error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to Google OAuth URL:', data.url);
        window.location.href = data.url;
      } else {
        throw new Error('No redirect URL provided');
      }
    } catch (error) {
      console.error('Google login failed:', error);
      return { success: false, error: error.message || 'Google login failed. Please try again.' };
    }
  };

  const logout = () => {
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
  const userRole = user?.role;

  // Role-based access control functions
  const hasRole = (requiredRole) => {
    if (!user) return false;
    // National admin has access to all roles
    if (user.role === 'national-admin') return true;
    return user.role === requiredRole;
  };

  const hasAnyRole = (requiredRoles) => {
    if (!user) return false;
    // National admin has access to all roles
    if (user.role === 'national-admin') return true;
    return requiredRoles.includes(user.role);
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
    hasAnyRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;