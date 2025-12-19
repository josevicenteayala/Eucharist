import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/postgres/User';
import logger from '../config/logger';
import { AppError } from '../utils/AppError';
import { sanitizeUser } from '../utils/sanitizeUser';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized - No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const payload = AuthService.verifyToken(token);

    // Always verify the user still exists in the DB for security (e.g., deleted/banned accounts)
    // If this becomes a performance bottleneck, optimize via caching (e.g., Redis) rather than skipping this check
    const user = await UserModel.findById(payload.userId);

    if (!user) {
      throw new AppError('Unauthorized - User not found', 401);
    }

    // Attach sanitized user to request
    req.user = sanitizeUser(user);

    next();
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      const err = error as Error;
      logger.error('Authentication error', {
        message: err.message,
        name: err.name,
      });
    } else {
      logger.error('Authentication error:', error);
    }

    // Pass AppError to error handler, or create one if it's not already
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Unauthorized - Invalid token', 401));
    }
  }
};
