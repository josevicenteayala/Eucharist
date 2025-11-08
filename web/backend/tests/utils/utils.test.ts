/**
 * Tests for Test Utilities
 *
 * These tests validate that the test utilities themselves work correctly
 */

import request from 'supertest';
import express, { Application, Request, Response } from 'express';
import {
  assertSuccessResponse,
  assertErrorResponse,
  assertHasFields,
  assertValidTimestamp,
  createMockUser,
  createMockGospel,
  createMockArray,
  createEnvScope,
  createMockDatabase,
  createMockRedisClient,
  createMockRequest,
  createMockResponse,
  createMockNext,
  createGetRequest,
  createPostRequest,
} from './index';

describe('Test Utilities', () => {
  describe('API Assertions', () => {
    let app: Application;

    beforeEach(() => {
      app = express();
      app.use(express.json());
    });

    describe('assertSuccessResponse', () => {
      it('should pass for valid success response', async () => {
        app.get('/success', (_req: Request, res: Response) => {
          res.json({ success: true, data: { message: 'OK' } });
        });

        const response = await request(app).get('/success');
        expect(() => assertSuccessResponse(response, 200)).not.toThrow();
      });

      it('should fail for invalid success response', async () => {
        app.get('/invalid', (_req: Request, res: Response) => {
          res.json({ invalid: true });
        });

        const response = await request(app).get('/invalid');
        expect(() => assertSuccessResponse(response, 200)).toThrow();
      });
    });

    describe('assertErrorResponse', () => {
      it('should pass for valid error response', async () => {
        app.get('/error', (_req: Request, res: Response) => {
          res.status(404).json({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Not found' },
          });
        });

        const response = await request(app).get('/error');
        expect(() => assertErrorResponse(response, 404, 'NOT_FOUND', 'Not found')).not.toThrow();
      });
    });

    describe('assertHasFields', () => {
      it('should pass when all fields exist', () => {
        const data = { id: '1', name: 'Test', email: 'test@example.com' };
        expect(() => assertHasFields(data, ['id', 'name', 'email'])).not.toThrow();
      });

      it('should fail when field is missing', () => {
        const data = { id: '1', name: 'Test' };
        expect(() => assertHasFields(data, ['id', 'name', 'email'])).toThrow();
      });
    });

    describe('assertValidTimestamp', () => {
      it('should pass for valid timestamp', () => {
        const timestamp = new Date().toISOString();
        expect(() => assertValidTimestamp(timestamp)).not.toThrow();
      });

      it('should fail for invalid timestamp', () => {
        expect(() => assertValidTimestamp('invalid-date')).toThrow();
      });
    });
  });

  describe('Mock Data Factories', () => {
    describe('createMockUser', () => {
      it('should create user with default values', () => {
        const user = createMockUser();
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('displayName');
        expect(user).toHaveProperty('preferences');
      });

      it('should apply overrides', () => {
        const user = createMockUser({ email: 'custom@example.com' });
        expect(user.email).toBe('custom@example.com');
      });
    });

    describe('createMockGospel', () => {
      it('should create gospel with default values', () => {
        const gospel = createMockGospel();
        expect(gospel).toHaveProperty('id');
        expect(gospel).toHaveProperty('date');
        expect(gospel).toHaveProperty('reading');
        expect(gospel).toHaveProperty('text');
      });

      it('should apply overrides', () => {
        const gospel = createMockGospel({ reading: 'John 1:1' });
        expect(gospel.reading).toBe('John 1:1');
      });
    });

    describe('createMockArray', () => {
      it('should create array of specified length', () => {
        const users = createMockArray((i) => createMockUser({ id: `user-${i}` }), 3);
        expect(users).toHaveLength(3);
        expect(users[0].id).toBe('user-0');
        expect(users[1].id).toBe('user-1');
        expect(users[2].id).toBe('user-2');
      });
    });
  });

  describe('Environment Helpers', () => {
    describe('createEnvScope', () => {
      it('should set and restore environment variables', () => {
        const originalValue = process.env.TEST_VAR;
        const env = createEnvScope();

        env.set('TEST_VAR', 'test-value');
        expect(process.env.TEST_VAR).toBe('test-value');

        env.restore();
        expect(process.env.TEST_VAR).toBe(originalValue);
      });

      it('should set multiple variables', () => {
        const env = createEnvScope();

        env.setMultiple({ VAR1: 'value1', VAR2: 'value2' });
        expect(process.env.VAR1).toBe('value1');
        expect(process.env.VAR2).toBe('value2');

        env.restore();
      });

      it('should delete variables when set to undefined', () => {
        const env = createEnvScope();

        env.set('TEMP_VAR', 'temp');
        expect(process.env.TEMP_VAR).toBe('temp');

        env.set('TEMP_VAR', undefined);
        expect(process.env.TEMP_VAR).toBeUndefined();

        env.restore();
      });
    });
  });

  describe('Database Helpers', () => {
    describe('createMockDatabase', () => {
      it('should create mock database with default methods', () => {
        const db = createMockDatabase();
        expect(db.connect).toBeDefined();
        expect(db.disconnect).toBeDefined();
        expect(db.query).toBeDefined();
        expect(db.healthCheck).toBeDefined();
      });

      it('should allow overriding methods', () => {
        const customQuery = jest.fn();
        const db = createMockDatabase({ query: customQuery });
        expect(db.query).toBe(customQuery);
      });
    });

    describe('createMockRedisClient', () => {
      it('should store and retrieve values', async () => {
        const redis = createMockRedisClient();

        await redis.set('test-key', 'test-value');
        const value = await redis.get('test-key');

        expect(value).toBe('test-value');
      });

      it('should delete values', async () => {
        const redis = createMockRedisClient();

        await redis.set('test-key', 'test-value');
        await redis.del('test-key');
        const value = await redis.get('test-key');

        expect(value).toBeNull();
      });

      it('should check if key exists', async () => {
        const redis = createMockRedisClient();

        await redis.set('test-key', 'test-value');
        const exists = await redis.exists('test-key');
        const notExists = await redis.exists('non-existent');

        expect(exists).toBe(1);
        expect(notExists).toBe(0);
      });
    });
  });

  describe('Error Helpers', () => {
    describe('createMockRequest', () => {
      it('should create mock request with defaults', () => {
        const req = createMockRequest();
        expect(req.body).toBeDefined();
        expect(req.params).toBeDefined();
        expect(req.query).toBeDefined();
      });

      it('should apply overrides', () => {
        const req = createMockRequest({ method: 'POST', path: '/test' });
        expect(req.method).toBe('POST');
        expect(req.path).toBe('/test');
      });
    });

    describe('createMockResponse', () => {
      it('should create mock response with chainable methods', () => {
        const res = createMockResponse();
        res.status(200).json({ data: 'test' });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: 'test' });
      });

      it('should update statusCode when status is called', () => {
        const res = createMockResponse();
        res.status(404);
        expect(res.statusCode).toBe(404);
      });
    });

    describe('createMockNext', () => {
      it('should create mock next function', () => {
        const next = createMockNext();
        expect(typeof next).toBe('function');
        next();
        expect(next).toHaveBeenCalled();
      });
    });
  });

  describe('HTTP Helpers', () => {
    let app: Application;

    beforeEach(() => {
      app = express();
      app.use(express.json());
      app.get('/test', (_req: Request, res: Response) => {
        res.json({ success: true });
      });
      app.post('/test', (req: Request, res: Response) => {
        res.json({ success: true, received: req.body });
      });
    });

    describe('createGetRequest', () => {
      it('should create GET request with headers', async () => {
        const response = await createGetRequest(app, '/test');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });

    describe('createPostRequest', () => {
      it('should create POST request with body', async () => {
        const body = { data: 'test' };
        const response = await createPostRequest(app, '/test', body);
        expect(response.status).toBe(200);
        expect(response.body.received).toEqual(body);
      });
    });
  });
});
