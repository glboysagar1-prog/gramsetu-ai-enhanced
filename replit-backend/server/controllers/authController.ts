import type { Request, Response } from 'express';
import { authService } from '../services/authService';
import { insertUserSchema, loginUserSchema } from '@shared/schema';
import { z } from 'zod';

export class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const validatedData = insertUserSchema.parse(req.body);

      const result = await authService.signup(validatedData);

      const loginResult = await authService.login({
        email: validatedData.email,
        password: validatedData.password,
      });

      res.status(201).json({
        message: 'User created successfully',
        token: loginResult.token,
        user: result,
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

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginUserSchema.parse(req.body);

      const result = await authService.login(validatedData);

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
}

export const authController = new AuthController();
