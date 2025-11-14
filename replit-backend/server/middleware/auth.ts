import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header. Please provide a Bearer token.',
      });
    }

    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token not provided',
      });
    }

    const user = await authService.verifyToken(token);

    req.user = user;
    next();
  } catch (error: any) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: error.message || 'Invalid or expired token',
    });
  }
};
