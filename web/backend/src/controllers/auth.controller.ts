import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { sanitizeUser } from '../utils/sanitizeUser';

export class AuthController {
  // Register
  static register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password, first_name, last_name } = req.body;

    const { user, token } = await AuthService.register({
      email,
      password_hash: password, // Service will hash this
      first_name,
      last_name,
    });

    // Remove sensitive data
    const safeUser = sanitizeUser(user);

    res.status(201).json({
      success: true,
      data: {
        user: safeUser,
        token,
      },
    });
  });

  // Login
  static login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const { user, token } = await AuthService.login(email, password);

    // Remove sensitive data
    const safeUser = sanitizeUser(user);

    res.status(200).json({
      success: true,
      data: {
        user: safeUser,
        token,
      },
    });
  });

  // Get Current User (Me)
  static getMe = catchAsync(async (req: Request, res: Response): Promise<void> => {
    // User is attached to req by auth middleware (already sanitized)
    const user = req.user;

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  });
}
