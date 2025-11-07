import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import logger from '../config/logger';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  // Log error using Winston
  logger.error('API Error', {
    statusCode,
    code,
    message,
    stack: err.stack,
    details: err.details,
  });

  const errorResponse: {
    success: boolean;
    error: {
      code: string;
      message: string;
      details?: unknown;
    };
  } = {
    success: false,
    error: {
      code,
      message,
    },
  };

  if (config.nodeEnv === 'development' && err.details) {
    errorResponse.error.details = err.details;
  }

  res.status(statusCode).json(errorResponse);
};
