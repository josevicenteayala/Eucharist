/**
 * API Response Types
 * 
 * Standard response format for all API endpoints.
 * Based on project conventions defined in repository instructions.
 */

/**
 * Standard success response wrapper
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: unknown;
  };
}

/**
 * Standard error response wrapper
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  code: string;
  details?: unknown;
  statusCode?: number;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode?: number,
    details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Type guard to check if response is successful
 */
export function isApiSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if response is an error
 */
export function isApiErrorResponse(
  response: ApiResponse
): response is ApiErrorResponse {
  return response.success === false;
}
