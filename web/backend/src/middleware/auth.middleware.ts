import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { UserModel } from '../models/postgres/User';
import logger from '../config/logger';

interface JwtPayload {
  id: string;
  email: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      logger.error('Auth middleware error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
