import { CorsOptions } from 'cors';
import { config } from './env';

/**
 * CORS Configuration for Eucharist Platform API
 *
 * Configures Cross-Origin Resource Sharing to allow secure access
 * from approved frontend origins while protecting against unauthorized access.
 */

/**
 * Parse allowed origins from environment variable
 * Supports single origin or comma-separated list of origins
 */
const getAllowedOrigins = (): string | string[] => {
  const corsOrigin = config.cors.origin;

  // If contains comma, split into array
  if (corsOrigin.includes(',')) {
    return corsOrigin.split(',').map((origin) => origin.trim());
  }

  return corsOrigin;
};

/**
 * CORS configuration options
 */
export const corsOptions: CorsOptions = {
  // Origin validation
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();

    // Allow requests with no origin (like mobile apps, curl requests, or same-origin requests)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (typeof allowedOrigins === 'string') {
      if (origin === allowedOrigins) {
        return callback(null, true);
      }
    } else {
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    }

    // Reject unauthorized origins
    callback(new Error('Not allowed by CORS'));
  },

  // Allow credentials (cookies, authorization headers, TLS client certificates)
  credentials: true,

  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  // Allowed headers in requests
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],

  // Headers exposed to the browser
  exposedHeaders: ['Content-Length', 'Content-Type', 'X-Request-Id'],

  // Cache preflight request results (in seconds)
  maxAge: 86400, // 24 hours

  // Pass the CORS preflight response to the next handler
  preflightContinue: false,

  // Success status code for preflight requests
  optionsSuccessStatus: 204,
};

/**
 * Development-only permissive CORS for testing
 * WARNING: Never use in production
 */
export const corsOptionsDevPermissive: CorsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'Content-Type', 'X-Request-Id'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
