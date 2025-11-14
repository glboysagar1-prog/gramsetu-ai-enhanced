import type { Request, Response } from 'express';
import { insforgeAuthService } from '../services/insforgeAuthService';
import { insertUserSchema, loginUserSchema } from '@shared/schema';
import { z } from 'zod';

export class InsforgeAuthController {
  /**
   * Sign up a new user
   */
  async signup(req: Request, res: Response) {
    try {
      const validatedData = insertUserSchema.parse(req.body);

      const result = await insforgeAuthService.signup({
        email: validatedData.email,
        username: validatedData.username,
        password: validatedData.password,
        role: req.body.role // Optional role
      });

      res.status(201).json({
        message: 'User created successfully',
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }

      const message = error.message || 'Signup failed';
      
      if (message.includes('already') || message.includes('duplicate')) {
        return res.status(409).json({ error: message });
      }

      res.status(500).json({ error: message });
    }
  }

  /**
   * Login with email and password
   */
  async login(req: Request, res: Response) {
    try {
      const validatedData = loginUserSchema.parse(req.body);

      const result = await insforgeAuthService.login({
        email: validatedData.email,
        password: validatedData.password,
      });

      res.json({
        message: 'Login successful',
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }

      const message = error.message || 'Login failed';

      if (message.includes('Invalid') || message.includes('credentials')) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      res.status(500).json({ error: message });
    }
  }

  /**
   * Google OAuth login
   */
  async googleLogin(req: Request, res: Response) {
    try {
      const { accessToken } = req.body;

      if (!accessToken) {
        return res.status(400).json({ error: 'Access token is required' });
      }

      const result = await insforgeAuthService.googleLogin(accessToken);

      res.json({
        message: 'Google login successful',
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      const message = error.message || 'Google login failed';
      res.status(500).json({ error: message });
    }
  }

  /**
   * Send password reset OTP
   */
  async sendPasswordResetOTP(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const result = await insforgeAuthService.sendPasswordResetOTP(email);

      res.json({
        message: 'Password reset OTP sent to your email',
        ...result
      });
    } catch (error: any) {
      const message = error.message || 'Failed to send password reset OTP';
      res.status(500).json({ error: message });
    }
  }

  /**
   * Verify password reset OTP
   */
  async verifyPasswordResetOTP(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
      }

      const result = await insforgeAuthService.verifyPasswordResetOTP(email, otp);

      res.json({
        message: 'OTP verified successfully',
        ...result
      });
    } catch (error: any) {
      const message = error.message || 'Failed to verify OTP';
      res.status(500).json({ error: message });
    }
  }

  /**
   * Reset password
   */
  async resetPassword(req: Request, res: Response) {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: 'Email, OTP, and new password are required' });
      }

      // Validate password strength
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const result = await insforgeAuthService.resetPassword(email, otp, newPassword);

      res.json({
        message: 'Password reset successfully',
        ...result
      });
    } catch (error: any) {
      const message = error.message || 'Failed to reset password';
      res.status(500).json({ error: message });
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(req: Request, res: Response) {
    try {
      // Assuming the token is attached to the request by middleware
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userData = await insforgeAuthService.verifyToken(token);

      res.json({
        user: userData.user
      });
    } catch (error: any) {
      const message = error.message || 'Failed to get user profile';
      res.status(500).json({ error: message });
    }
  }
}

export const insforgeAuthController = new InsforgeAuthController();