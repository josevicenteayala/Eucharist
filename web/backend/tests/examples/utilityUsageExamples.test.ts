/**
 * Test Utility Usage Examples
 *
 * This file demonstrates various ways to use the test utilities
 * for different testing scenarios.
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import {
  // API Assertions
  assertSuccessResponse,
  assertErrorResponse,
  assertPaginatedResponse,
  assertHasFields,
  // Mock Data
  createMockUser,
  createMockArticle,
  createMockArray,
  // Environment
  createEnvScope,
  // HTTP Helpers
  createGetRequest,
  createPostRequest,
  createAuthenticatedRequest,
  createCorsRequest,
  createPreflightRequest,
  // Database
  createMockRedisClient,
  createMockDatabase,
  // Error Helpers
  createMockRequest,
  createMockResponse,
  createMockNext,
  assertErrorPassedToNext,
} from '../utils';

describe('Test Utility Usage Examples', () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('Example 1: Testing API Endpoints with Mock Data', () => {
    it('should return paginated list of users', async () => {
      // Create mock users
      const mockUsers = createMockArray(
        (i) => createMockUser({ id: `user-${i}`, email: `user${i}@example.com` }),
        3
      );

      // Setup endpoint
      app.get('/api/users', (_req: Request, res: Response) => {
        res.json({
          success: true,
          data: mockUsers,
          meta: { page: 1, limit: 10, total: 3 },
        });
      });

      // Test with helpers
      const response = await createGetRequest(app, '/api/users');

      // Assert with helpers
      assertPaginatedResponse(response, 200);
      expect(response.body.data).toHaveLength(3);
      assertHasFields(response.body.data[0], ['id', 'email', 'displayName']);
    });

    it('should return single article', async () => {
      const mockArticle = createMockArticle({
        title: 'Understanding the Mass',
        category: 'mass-parts',
      });

      app.get('/api/articles/:id', (_req: Request, res: Response) => {
        res.json({ success: true, data: mockArticle });
      });

      const response = await createGetRequest(app, '/api/articles/123');

      assertSuccessResponse(response, 200);
      expect(response.body.data.title).toBe('Understanding the Mass');
      expect(response.body.data.category).toBe('mass-parts');
    });
  });

  describe('Example 2: Testing with Environment Variables', () => {
    const env = createEnvScope();

    it('should behave differently in production', () => {
      env.set('NODE_ENV', 'production');

      app.get('/api/config', (_req: Request, res: Response) => {
        res.json({
          success: true,
          data: {
            environment: process.env.NODE_ENV,
            debugMode: process.env.NODE_ENV !== 'production',
          },
        });
      });

      return createGetRequest(app, '/api/config').then((response) => {
        assertSuccessResponse(response, 200);
        expect(response.body.data.environment).toBe('production');
        expect(response.body.data.debugMode).toBe(false);
        env.restore();
      });
    });
  });

  describe('Example 3: Testing Authentication', () => {
    it('should accept valid token', async () => {
      app.get('/api/protected', (req: Request, res: Response) => {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          res.json({ success: true, data: { authenticated: true } });
        } else {
          res.status(401).json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Invalid token' },
          });
        }
      });

      const response = await createAuthenticatedRequest(
        app,
        'GET',
        '/api/protected',
        'valid-token-123'
      );

      assertSuccessResponse(response, 200);
      expect(response.body.data.authenticated).toBe(true);
    });

    it('should reject invalid token', async () => {
      app.get('/api/protected', (req: Request, res: Response) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          res.status(401).json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'No token provided' },
          });
        }
      });

      const response = await createGetRequest(app, '/api/protected');

      assertErrorResponse(response, 401, 'UNAUTHORIZED');
    });
  });

  describe('Example 4: Testing CORS', () => {
    it('should handle CORS preflight request', async () => {
      app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        if (req.method === 'OPTIONS') {
          res.sendStatus(204);
        } else {
          next();
        }
      });

      const response = await createPreflightRequest(
        app,
        '/api/users',
        'http://localhost:3001',
        'POST',
        ['Content-Type', 'Authorization']
      );

      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-methods']).toContain('POST');
    });

    it('should handle CORS with origin', async () => {
      app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        next();
      });

      app.get('/api/test', (_req: Request, res: Response) => {
        res.json({ success: true, data: 'OK' });
      });

      const response = await createCorsRequest(app, 'GET', '/api/test', 'http://localhost:3001');

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3001');
    });
  });

  describe('Example 5: Testing Middleware with Mock Request/Response', () => {
    it('should call next() on success', () => {
      const req = createMockRequest({ body: { valid: true } });
      const res = createMockResponse();
      const next = createMockNext();

      // Sample middleware
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validationMiddleware = (req: any, _res: any, next: NextFunction) => {
        if (req.body.valid) {
          next();
        } else {
          next(new Error('Invalid request'));
        }
      };

      validationMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(); // Called without error
    });

    it('should pass error to next() on validation failure', () => {
      const req = createMockRequest({ body: { valid: false } });
      const res = createMockResponse();
      const next = createMockNext();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validationMiddleware = (req: any, _res: any, next: NextFunction) => {
        if (req.body.valid) {
          next();
        } else {
          next(new Error('Invalid request'));
        }
      };

      validationMiddleware(req, res, next);

      assertErrorPassedToNext(next, 'Invalid request');
    });
  });

  describe('Example 6: Testing with Mock Redis', () => {
    it('should cache and retrieve data', async () => {
      const redis = createMockRedisClient();

      // Simulate caching
      await redis.set('user:123', JSON.stringify({ id: '123', name: 'Test' }));

      // Simulate retrieval
      const cached = await redis.get('user:123');
      expect(cached).toBeDefined();

      const user = JSON.parse(cached!);
      expect(user.id).toBe('123');
      expect(user.name).toBe('Test');
    });

    it('should handle cache miss', async () => {
      const redis = createMockRedisClient();
      const cached = await redis.get('nonexistent');
      expect(cached).toBeNull();
    });
  });

  describe('Example 7: Testing with Mock Database', () => {
    it('should query database successfully', async () => {
      const mockDb = createMockDatabase({
        query: jest.fn().mockResolvedValue({
          rows: [{ id: 1, name: 'Test' }],
          rowCount: 1,
        }),
      });

      await mockDb.connect();
      const result = await mockDb.query('SELECT * FROM users WHERE id = $1', [1]);

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].name).toBe('Test');
    });

    it('should handle database errors', async () => {
      const mockDb = createMockDatabase({
        query: jest.fn().mockRejectedValue(new Error('Connection failed')),
      });

      await mockDb.connect();

      await expect(mockDb.query('SELECT * FROM users')).rejects.toThrow('Connection failed');
    });
  });

  describe('Example 8: Testing POST Requests with Body', () => {
    it('should create new resource', async () => {
      app.post('/api/users', (req: Request, res: Response) => {
        const { email, displayName } = req.body;
        const newUser = createMockUser({ email, displayName });
        res.status(201).json({ success: true, data: newUser });
      });

      const response = await createPostRequest(app, '/api/users', {
        email: 'newuser@example.com',
        displayName: 'New User',
      });

      assertSuccessResponse(response, 201);
      expect(response.body.data.email).toBe('newuser@example.com');
      expect(response.body.data.displayName).toBe('New User');
    });
  });
});
