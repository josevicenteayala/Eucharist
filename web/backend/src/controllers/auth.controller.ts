import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { CreateUserDTO } from '../models/postgres/User';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateUserDTO = req.body;
      const { user, token } = await authService.register(data);
      res.status(201).json({ user, token });
    } catch (error) {
      if (error instanceof Error && error.message === 'User already exists') {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      res.json({ user, token });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    // req.user will be populated by auth middleware
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    res.json({ user });
  }
}

export const authController = new AuthController();
