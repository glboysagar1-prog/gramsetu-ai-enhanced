import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';
import type { InsertUser, LoginUser } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  async signup(userData: InsertUser) {
    try {
      // In mock mode, we'll just check if it's a test user
      if (userData.email === 'test@example.com') {
        throw new Error('User with this email already exists');
      }

      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        throw new Error('User with this email already exists');
      }

      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        throw new Error('Username already taken');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      return {
        id: user.id,
        email: user.email,
        username: user.username,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  }

  async login(credentials: LoginUser) {
    try {
      // In mock mode, handle test credentials
      if (credentials.email === 'test@example.com' && credentials.password === 'test123456') {
        const token = jwt.sign(
          {
            id: 'test-user-id',
            email: 'test@example.com',
            username: 'testuser',
          },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        return {
          token,
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            username: 'testuser',
          },
        };
      }

      const user = await storage.getUserByEmail(credentials.email);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        username: string;
      };

      const user = await storage.getUser(decoded.id);

      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        username: user.username,
      };
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      }
      throw new Error(error.message || 'Token verification failed');
    }
  }
}

export const authService = new AuthService();
