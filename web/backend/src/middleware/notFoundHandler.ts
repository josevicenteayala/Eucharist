import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * 404 Not Found Handler
 *
 * Catches all unmatched routes and returns a standardized 404 error.
 * Should be registered after all other routes but before the error handler.
 */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};
