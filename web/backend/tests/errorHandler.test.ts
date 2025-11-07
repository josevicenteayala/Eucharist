import request from 'supertest';
import express, { Application } from 'express';
import { errorHandler } from '../src/middleware/errorHandler';
import { ApiError } from '../src/middleware/errors';

describe('Error Handler Middleware', () => {
  let app: Application;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

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

  it('should not include error details when not in development mode', async () => {
    process.env.NODE_ENV = 'production';

    app.get('/test-error', () => {
      const error = new ApiError('Test error', 400, 'TEST_ERROR', { sensitive: 'data' });
      throw error;
    });
    app.use(errorHandler);

    const response = await request(app).get('/test-error');

    expect(response.status).toBe(400);
    expect(response.body.error).not.toHaveProperty('details');
  });
});
