import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import logger from '../config/logger';
import { ApiError } from './errors';

/**
 * Global Error Handler Middleware
 *
 * Catches all errors thrown in the application and returns a standardized
 * error response format. Integrates with Winston logger for error tracking.
 *
 * Error Response Format:
 * {
 *   success: false,
 *   error: {
 *     code: "ERROR_CODE",
 *     message: "Human-readable message",
 *     details: {...} // Only in development
 *   }
 * }
 */
export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Determine if this is a known ApiError or unknown error
  const isApiError = err instanceof ApiError;

  const statusCode = isApiError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  const code = isApiError ? err.code : 'INTERNAL_ERROR';
  const details = isApiError ? err.details : undefined;

  // Log error using Winston
  logger.error('API Error', {
    statusCode,
    code,
    message,
    stack: err.stack,
    details,
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

  // Include error details in development mode
  if (config.nodeEnv === 'development' && details) {
    errorResponse.error.details = details;
  }

  res.status(statusCode).json(errorResponse);
};
