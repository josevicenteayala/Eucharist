import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { CreateUserDTO } from '../models/postgres/User';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export class AuthController {
  register = catchAsync(async (req: Request, res: Response) => {
    const data: CreateUserDTO = req.body;
    const { user, token } = await authService.register(data);
    res.status(201).json({ user, token });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.json({ user, token });
  });

  me = catchAsync(async (req: Request, res: Response) => {
    // req.user will be populated by auth middleware
    const user = (req as any).user;
    if (!user) {
      throw new AppError('Unauthorized', 401);
    }
    res.json({ user });
  });
}

export const authController = new AuthController();
