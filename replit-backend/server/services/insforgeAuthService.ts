import jwt from 'jsonwebtoken';
import axios from 'axios';
import { config } from '../../insforge.config';

// Insforge API client
const insforgeApi = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'X-Project-ID': config.projectId,
    'X-API-Key': config.apiKey
  }
});

export class InsforgeAuthService {
  /**
   * Sign up a new user with email and password
   */
  async signup(userData: { email: string; password: string; username: string; role?: string }) {
    try {
      const response = await insforgeApi.post('/auth/signup', {
        email: userData.email,
        password: userData.password,
        username: userData.username,
        role: userData.role || config.roles.citizen
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  }

  /**
   * Login with email and password
   */
  async login(credentials: { email: string; password: string }) {
    try {
      const response = await insforgeApi.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  /**
   * Google OAuth login
   */
  async googleLogin(accessToken: string) {
    try {
      const response = await insforgeApi.post('/auth/google', {
        accessToken
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Google login failed');
    }
  }

  /**
   * Send password reset OTP
   */
  async sendPasswordResetOTP(email: string) {
    try {
      const response = await insforgeApi.post('/auth/password-reset/send-otp', {
        email
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send password reset OTP');
    }
  }

  /**
   * Verify password reset OTP
   */
  async verifyPasswordResetOTP(email: string, otp: string) {
    try {
      const response = await insforgeApi.post('/auth/password-reset/verify-otp', {
        email,
        otp
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to verify password reset OTP');
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string, otp: string, newPassword: string) {
    try {
      const response = await insforgeApi.post('/auth/password-reset/reset', {
        email,
        otp,
        newPassword
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string) {
    try {
      // First verify with Insforge
      const response = await insforgeApi.post('/auth/verify-token', {
        token
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token verification failed');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    try {
      const response = await insforgeApi.get(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string) {
    try {
      const response = await insforgeApi.get(`/users/email/${email}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user by email');
    }
  }

  /**
   * Check if user has required role
   */
  async hasRole(token: string, requiredRole: string) {
    try {
      const userData = await this.verifyToken(token);
      return userData.user.role === requiredRole || userData.user.role === config.roles.nationalAdmin;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if user has any of the required roles
   */
  async hasAnyRole(token: string, requiredRoles: string[]) {
    try {
      const userData = await this.verifyToken(token);
      return requiredRoles.includes(userData.user.role) || userData.user.role === config.roles.nationalAdmin;
    } catch (error) {
      return false;
    }
  }
}

export const insforgeAuthService = new InsforgeAuthService();