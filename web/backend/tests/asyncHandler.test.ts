import request from 'supertest';
import express, { Application, Request, Response } from 'express';
import { asyncHandler } from '../src/middleware/asyncHandler';
import { errorHandler } from '../src/middleware/errorHandler';
import { NotFoundError } from '../src/middleware/errors';

describe('Async Handler Middleware', () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  it('should catch rejected promises and pass to error handler', async () => {
    app.get(
      '/test-async-error',
      asyncHandler(async () => {
        await Promise.reject(new Error('Async operation failed'));
      })
    );
    app.use(errorHandler);

    const response = await request(app).get('/test-async-error');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.error).toHaveProperty('message', 'Async operation failed');
  });

  it('should catch thrown errors in async handlers', async () => {
    app.get(
      '/test-async-throw',
      asyncHandler(async () => {
        throw new NotFoundError('User');
      })
    );
    app.use(errorHandler);

    const response = await request(app).get('/test-async-throw');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    expect(response.body.error).toHaveProperty('message', 'User not found');
  });

  it('should allow successful async operations to complete', async () => {
    app.get(
      '/test-async-success',
      asyncHandler(async (_req: Request, res: Response) => {
        await Promise.resolve();
        res.json({ success: true, data: 'Success' });
      })
    );
    app.use(errorHandler);

    const response = await request(app).get('/test-async-success');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data', 'Success');
  });

  it('should handle async database operations', async () => {
    const mockDatabaseCall = jest.fn().mockRejectedValue(new Error('Database error'));

    app.get(
      '/test-db-error',
      asyncHandler(async () => {
        await mockDatabaseCall();
      })
    );
    app.use(errorHandler);

    const response = await request(app).get('/test-db-error');

    expect(response.status).toBe(500);
    expect(response.body.error).toHaveProperty('message', 'Database error');
    expect(mockDatabaseCall).toHaveBeenCalled();
  });
});
