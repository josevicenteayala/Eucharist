import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import logger from '../config/logger';

export class AuthController {
  // Register
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, first_name, last_name } = req.body;

      if (!email || !password || !first_name || !last_name) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
      }

      const { user, token } = await AuthService.register({
        email,
        password_hash: password, // Service will hash this
        first_name,
        last_name,
      });

      // Remove sensitive data
      const safeUser = { ...user } as any;
      delete safeUser.password_hash;

      res.status(201).json({
        success: true,
        data: {
          user: safeUser,
          token,
        },
      });
    } catch (error: any) {
      logger.error('Registration error:', error);
      if (error.message === 'User with this email already exists') {
        res.status(409).json({ success: false, message: error.message });
      } else {
        next(error);
      }
    }
  }

  // Login
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
      }

      const { user, token } = await AuthService.login(email, password);

      // Remove sensitive data
      const safeUser = { ...user } as any;
      delete safeUser.password_hash;

      res.status(200).json({
        success: true,
        data: {
          user: safeUser,
          token,
        },
      });
    } catch (error: any) {
      logger.error('Login error:', error);
      if (error.message === 'Invalid email or password') {
        res.status(401).json({ success: false, message: error.message });
      } else {
        next(error);
      }
    }
  }

  // Get Current User (Me)
  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // User is attached to req by auth middleware
      const user = (req as any).user;

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}
