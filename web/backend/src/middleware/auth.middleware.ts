import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/postgres/User';
import logger from '../config/logger';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Unauthorized - No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = AuthService.verifyToken(token);

    // Optionally check if user still exists in DB (adds security but also latency)
    // For now, let's verify user exists to ensure we have fresh data
    const user = await UserModel.findById(payload.userId);

    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized - User not found' });
      return;
    }

    // Attach user to request
    // Remove password hash before attaching
    const safeUser = { ...user } as any;
    delete safeUser.password_hash;

    (req as any).user = safeUser;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' });
  }
};
