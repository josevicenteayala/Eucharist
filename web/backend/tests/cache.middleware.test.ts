import request from 'supertest';
import express, { Request, Response } from 'express';
import { cacheMiddleware, generateCacheKey, generateUserCacheKey } from '../src/middleware/cache';
import { redisDb } from '../src/config/database/redis';
import { cacheService } from '../src/services/cache.service';

const hasRedis = process.env.REDIS_HOST;

describe('Cache Middleware', () => {
  if (!hasRedis) {
    it.skip('Cache middleware tests require Redis configuration', () => {});
    return;
  }

  let app: express.Application;

  beforeAll(async () => {
    await redisDb.connect();
  });

  afterAll(async () => {
    await redisDb.disconnect();
  });

  beforeEach(() => {
    app = express();
  });

  afterEach(async () => {
    // Clean up test cache keys
    const client = redisDb.getClient();
    const keys = await client.keys('api:*');
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => redisDb.del(key)));
    }
  });

  describe('GET request caching', () => {
    it('should cache successful GET responses', async () => {
      let requestCount = 0;

      app.get('/api/test', cacheMiddleware({ ttl: 60 }), (_req: Request, res: Response) => {
        requestCount++;
        res.json({ success: true, data: { message: 'Hello', count: requestCount } });
      });

      // First request - cache miss
      const response1 = await request(app).get('/api/test').expect(200);
      expect(response1.body.data.count).toBe(1);
      expect(requestCount).toBe(1);

      // Second request - cache hit
      const response2 = await request(app).get('/api/test').expect(200);
      expect(response2.body.data.count).toBe(1); // Same as first
      expect(requestCount).toBe(1); // Handler not called again
    });

    it('should cache responses with different query parameters separately', async () => {
      let requestCount = 0;

      app.get('/api/search', cacheMiddleware({ ttl: 60 }), (req: Request, res: Response) => {
        requestCount++;
        res.json({ success: true, data: { query: req.query.q, count: requestCount } });
      });

      // Request 1 with query param
      const response1 = await request(app).get('/api/search?q=test1').expect(200);
      expect(response1.body.data.count).toBe(1);

      // Request 2 with different query param (should not use cache)
      const response2 = await request(app).get('/api/search?q=test2').expect(200);
      expect(response2.body.data.count).toBe(2);

      // Request 3 with same query as first (should use cache)
      const response3 = await request(app).get('/api/search?q=test1').expect(200);
      expect(response3.body.data.count).toBe(1); // Same as response1

      expect(requestCount).toBe(2); // Only 2 actual requests processed
    });

    it('should respect TTL and expire cached responses', async () => {
      let requestCount = 0;

      app.get('/api/expire', cacheMiddleware({ ttl: 1 }), (_req: Request, res: Response) => {
        requestCount++;
        res.json({ success: true, data: { count: requestCount } });
      });

      // First request
      const response1 = await request(app).get('/api/expire').expect(200);
      expect(response1.body.data.count).toBe(1);

      // Wait for cache to expire
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Second request after expiry
      const response2 = await request(app).get('/api/expire').expect(200);
      expect(response2.body.data.count).toBe(2);
      expect(requestCount).toBe(2);
    }, 5000);

    it('should use custom key prefix', async () => {
      let requestCount = 0;

      app.get(
        '/api/custom',
        cacheMiddleware({ ttl: 60, keyPrefix: 'custom:' }),
        (_req: Request, res: Response) => {
          requestCount++;
          res.json({ success: true, data: { count: requestCount } });
        }
      );

      await request(app).get('/api/custom').expect(200);

      // Verify key exists with custom prefix
      const exists = await cacheService.exists('/api/custom', { prefix: 'custom:' });
      expect(exists).toBe(true);

      // Verify key does NOT exist with default prefix
      const notExists = await cacheService.exists('/api/custom', { prefix: 'api:' });
      expect(notExists).toBe(false);
    });

    it('should use custom key generator', async () => {
      let requestCount = 0;

      const customKeyGenerator = (req: Request) => {
        return `custom-${req.path}`;
      };

      app.get(
        '/api/keygen',
        cacheMiddleware({ ttl: 60, keyGenerator: customKeyGenerator }),
        (_req: Request, res: Response) => {
          requestCount++;
          res.json({ success: true, data: { count: requestCount } });
        }
      );

      await request(app).get('/api/keygen').expect(200);

      // Verify custom key was used
      const exists = await cacheService.exists('custom-/api/keygen', { prefix: 'api:' });
      expect(exists).toBe(true);
    });
    it('should cache response headers', async () => {
      let requestCount = 0;

      app.get('/api/headers', cacheMiddleware({ ttl: 60 }), (_req: Request, res: Response) => {
        requestCount++;
        res.set('X-Custom-Header', 'custom-value');
        res.json({ success: true, data: { count: requestCount } });
      });

      // First request
      const response1 = await request(app).get('/api/headers').expect(200);
      expect(response1.headers['x-custom-header']).toBe('custom-value');

      // Second request (cached)
      const response2 = await request(app).get('/api/headers').expect(200);
      expect(response2.headers['x-custom-header']).toBe('custom-value');
      expect(requestCount).toBe(1);
    });
  });

  describe('Non-GET request handling', () => {
    it('should not cache POST requests', async () => {
      let requestCount = 0;

      app.post('/api/test', cacheMiddleware({ ttl: 60 }), (_req: Request, res: Response) => {
        requestCount++;
        res.json({ success: true, data: { count: requestCount } });
      });

      // First POST request
      const response1 = await request(app).post('/api/test').expect(200);
      expect(response1.body.data.count).toBe(1);

      // Second POST request (should not use cache)
      const response2 = await request(app).post('/api/test').expect(200);
      expect(response2.body.data.count).toBe(2);

      expect(requestCount).toBe(2);
    });

    it('should not cache PUT requests', async () => {
      let requestCount = 0;

      app.put('/api/test', cacheMiddleware({ ttl: 60 }), (_req: Request, res: Response) => {
        requestCount++;
        res.json({ success: true, data: { count: requestCount } });
      });

      await request(app).put('/api/test').expect(200);
      await request(app).put('/api/test').expect(200);

      expect(requestCount).toBe(2);
    });

    it('should not cache DELETE requests', async () => {
      let requestCount = 0;

      app.delete('/api/test', cacheMiddleware({ ttl: 60 }), (_req: Request, res: Response) => {
        requestCount++;
        res.json({ success: true, data: { count: requestCount } });
      });

      await request(app).delete('/api/test').expect(200);
      await request(app).delete('/api/test').expect(200);

      expect(requestCount).toBe(2);
    });
  });

  describe('Error response handling', () => {
    it('should not cache 4xx error responses', async () => {
      let requestCount = 0;

      app.get('/api/error', cacheMiddleware({ ttl: 60 }), (_req: Request, res: Response) => {
        requestCount++;
        res.status(404).json({ success: false, error: { message: 'Not found' } });
      });

      await request(app).get('/api/error').expect(404);
      await request(app).get('/api/error').expect(404);

      expect(requestCount).toBe(2); // Both requests processed (not cached)
    });

    it('should not cache 5xx error responses', async () => {
      let requestCount = 0;

      app.get('/api/servererror', cacheMiddleware({ ttl: 60 }), (_req: Request, res: Response) => {
        requestCount++;
        res.status(500).json({ success: false, error: { message: 'Server error' } });
      });

      await request(app).get('/api/servererror').expect(500);
      await request(app).get('/api/servererror').expect(500);

      expect(requestCount).toBe(2); // Both requests processed (not cached)
    });
  });

  describe('Helper functions', () => {
    describe('generateCacheKey()', () => {
      it('should generate key from path only', () => {
        const req = { path: '/api/test', query: {} } as Request;
        const key = generateCacheKey(req);
        expect(key).toBe('/api/test');
      });

      it('should generate key with sorted query parameters', () => {
        const req = {
          path: '/api/search',
          query: { page: '2', limit: '10', sort: 'name' },
        } as unknown as Request;

        const key = generateCacheKey(req);
        expect(key).toContain('limit=10');
        expect(key).toContain('page=2');
        expect(key).toContain('sort=name');
      });

      it('should sort query parameters consistently', () => {
        const req1 = {
          path: '/api/search',
          query: { z: '1', a: '2', m: '3' },
        } as unknown as Request;

        const req2 = {
          path: '/api/search',
          query: { a: '2', m: '3', z: '1' },
        } as unknown as Request;

        expect(generateCacheKey(req1)).toBe(generateCacheKey(req2));
      });
    });

    describe('generateUserCacheKey()', () => {
      it('should generate user-specific key', () => {
        const req = {
          path: '/api/profile',
          query: {},
          user: { id: 'user-123' },
        } as unknown as Request;

        const key = generateUserCacheKey(req);
        expect(key).toContain('user:user-123:');
        expect(key).toContain('/api/profile');
      });

      it('should handle anonymous users', () => {
        const req = {
          path: '/api/public',
          query: {},
        } as unknown as Request;

        const key = generateUserCacheKey(req);
        expect(key).toContain('user:anonymous:');
      });
    });
  });

  describe('Error handling', () => {
    it('should continue without caching on Redis errors', async () => {
      let requestCount = 0;

      app.get('/api/resilient', cacheMiddleware({ ttl: 60 }), (_req: Request, res: Response) => {
        requestCount++;
        res.json({ success: true, data: { count: requestCount } });
      });

      // Disconnect Redis to simulate error
      await redisDb.disconnect();

      // Requests should still work (just without caching)
      await request(app).get('/api/resilient').expect(200);
      await request(app).get('/api/resilient').expect(200);

      expect(requestCount).toBe(2); // Both requests processed

      // Reconnect for other tests
      await redisDb.connect();
    });
  });
});
