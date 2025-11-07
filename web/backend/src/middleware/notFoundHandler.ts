import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from './errors';

/**
 * 404 Not Found Handler
 *
 * Catches all unmatched routes and returns a standardized 404 error.
 * Should be registered after all other routes but before the error handler.
 */
export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Route'));
};
