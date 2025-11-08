import request from 'supertest';
import express, { Application } from 'express';
import { errorHandler } from '../src/middleware/errorHandler';
import {
  ApiError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} from '../src/middleware/errors';
import logger from '../src/config/logger';

// Mock the logger module
jest.mock('../src/config/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('Error Handler Middleware', () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  describe('Basic Error Handling', () => {
    it('should handle errors with custom status code and message', async () => {
      app.get('/test-error', () => {
        const error = new ApiError('Custom error message', 400, 'CUSTOM_ERROR');
        throw error;
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-error');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'CUSTOM_ERROR');
      expect(response.body.error).toHaveProperty('message', 'Custom error message');
    });

    it('should default to 500 status code for unspecified errors', async () => {
      app.get('/test-error', () => {
        throw new Error('Unexpected error');
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-error');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'INTERNAL_ERROR');
    });

    it('should handle errors without a message', async () => {
      app.get('/test-error', () => {
        const error = new Error();
        throw error;
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-error');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('message');
    });

    it('should return proper JSON structure for all errors', async () => {
      app.get('/test-error', () => {
        throw new ApiError('Test', 400, 'TEST');
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-error');

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: expect.any(String),
          message: expect.any(String),
        },
      });
    });
  });

  describe('Environment-Specific Behavior', () => {
    it('should not include error details in production mode', async () => {
      // Note: Since config.nodeEnv is evaluated at module load time,
      // this test verifies that when NODE_ENV !== 'development', details are excluded.
      // In tests, NODE_ENV is typically 'test' which is not 'development'
      app.get('/test-error', () => {
        const error = new ApiError('Test error', 400, 'TEST_ERROR', { sensitive: 'data' });
        throw error;
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-error');

      expect(response.status).toBe(400);
      // Details should not be included when not in development mode
      expect(response.body.error).not.toHaveProperty('details');
    });

    it('should only include details when both in development AND details exist', async () => {
      // This test documents the behavior: details are ONLY included when:
      // 1. config.nodeEnv === 'development'
      // 2. details are truthy
      app.get('/test-error', () => {
        const error = new ApiError('Dev error', 400, 'DEV_ERROR', { debugInfo: 'test data' });
        throw error;
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-error');

      expect(response.status).toBe(400);
      // In test environment (NODE_ENV=test), details should not be included
      expect(response.body.error).not.toHaveProperty('details');
    });

    it('should not leak sensitive information outside development', async () => {
      app.get('/test-error', () => {
        const error = new ApiError('Prod error', 500, 'PROD_ERROR', {
          internalDebugInfo: 'should not leak',
          databasePassword: 'secret123',
        });
        throw error;
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-error');

      expect(response.body.error).not.toHaveProperty('details');
      expect(response.body.error).not.toHaveProperty('internalDebugInfo');
      expect(response.body.error).not.toHaveProperty('databasePassword');
    });
  });

  describe('Specific Error Classes', () => {
    it('should handle ValidationError (400)', async () => {
      app.get('/test-validation', () => {
        throw new ValidationError('Invalid input', [{ field: 'email', message: 'Required' }]);
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-validation');

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.message).toBe('Invalid input');
    });

    it('should handle UnauthorizedError (401)', async () => {
      app.get('/test-unauthorized', () => {
        throw new UnauthorizedError('Token expired');
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-unauthorized');

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
      expect(response.body.error.message).toBe('Token expired');
    });

    it('should handle ForbiddenError (403)', async () => {
      app.get('/test-forbidden', () => {
        throw new ForbiddenError('Insufficient permissions');
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-forbidden');

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('FORBIDDEN');
      expect(response.body.error.message).toBe('Insufficient permissions');
    });

    it('should handle NotFoundError (404)', async () => {
      app.get('/test-notfound', () => {
        throw new NotFoundError('User');
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-notfound');

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
      expect(response.body.error.message).toBe('User not found');
    });

    it('should handle ConflictError (409)', async () => {
      app.get('/test-conflict', () => {
        throw new ConflictError('Email already exists', { email: 'test@example.com' });
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-conflict');

      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe('CONFLICT');
      expect(response.body.error.message).toBe('Email already exists');
    });

    it('should handle InternalServerError (500)', async () => {
      app.get('/test-internal', () => {
        throw new InternalServerError('Database connection failed');
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-internal');

      expect(response.status).toBe(500);
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
      expect(response.body.error.message).toBe('Database connection failed');
    });
  });

  describe('Logger Integration', () => {
    it('should log errors using winston logger', async () => {
      app.get('/test-error', () => {
        throw new ApiError('Logged error', 500, 'LOGGED_ERROR');
      });
      app.use(errorHandler);

      await request(app).get('/test-error');

      expect(logger.error).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(
        'API Error',
        expect.objectContaining({
          statusCode: 500,
          code: 'LOGGED_ERROR',
          message: 'Logged error',
        })
      );
    });

    it('should log error stack trace', async () => {
      app.get('/test-error', () => {
        throw new ApiError('Test error', 400, 'TEST');
      });
      app.use(errorHandler);

      await request(app).get('/test-error');

      const logCall = (logger.error as jest.Mock).mock.calls[0][1];
      expect(logCall).toHaveProperty('stack');
      expect(logCall.stack).toBeDefined();
    });

    it('should log error details when present', async () => {
      const details = { field: 'email', reason: 'invalid format' };
      app.get('/test-error', () => {
        throw new ApiError('Error with details', 400, 'TEST', details);
      });
      app.use(errorHandler);

      await request(app).get('/test-error');

      const logCall = (logger.error as jest.Mock).mock.calls[0][1];
      expect(logCall.details).toEqual(details);
    });

    it('should log non-ApiError exceptions', async () => {
      app.get('/test-error', () => {
        throw new Error('Generic error');
      });
      app.use(errorHandler);

      await request(app).get('/test-error');

      expect(logger.error).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(
        'API Error',
        expect.objectContaining({
          statusCode: 500,
          code: 'INTERNAL_ERROR',
          message: 'Generic error',
        })
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle ApiError with undefined details', async () => {
      app.get('/test-error', () => {
        throw new ApiError('Error without details', 400, 'NO_DETAILS', undefined);
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-error');

      expect(response.status).toBe(400);
      expect(response.body.error).not.toHaveProperty('details');
    });

    it('should handle errors with empty message', async () => {
      app.get('/test-error', () => {
        throw new ApiError('', 400, 'EMPTY_MSG');
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-error');

      expect(response.status).toBe(400);
      // Empty message defaults to 'Internal Server Error' per implementation
      expect(response.body.error.message).toBe('Internal Server Error');
    });

    it('should handle errors with complex details objects', async () => {
      // Documents behavior: complex details are logged but not exposed in response
      // unless config.nodeEnv === 'development'
      const complexDetails = {
        validationErrors: [
          { field: 'email', message: 'Invalid' },
          { field: 'password', message: 'Too short' },
        ],
        metadata: { timestamp: Date.now(), userId: 123 },
      };

      app.get('/test-error', () => {
        throw new ApiError('Complex error', 400, 'COMPLEX', complexDetails);
      });
      app.use(errorHandler);

      const response = await request(app).get('/test-error');

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Complex error');
      // Verify details are logged even if not exposed in response
      const logCall = (logger.error as jest.Mock).mock.calls[0][1];
      expect(logCall.details).toEqual(complexDetails);
    });

    it('should maintain error response format consistency', async () => {
      const testCases = [
        new ValidationError(),
        new UnauthorizedError(),
        new ForbiddenError(),
        new NotFoundError(),
        new ConflictError(),
        new InternalServerError(),
      ];

      for (let i = 0; i < testCases.length; i++) {
        const error = testCases[i];
        const testApp = express();
        testApp.use(express.json());
        testApp.get('/test', () => {
          throw error;
        });
        testApp.use(errorHandler);

        const response = await request(testApp).get('/test');

        expect(response.body).toMatchObject({
          success: false,
          error: {
            code: expect.any(String),
            message: expect.any(String),
          },
        });
        expect(response.body.success).toBe(false);
      }
    });
  });
});
