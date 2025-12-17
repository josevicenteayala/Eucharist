# Cache Middleware

HTTP response caching middleware for Express routes.

## Overview

The cache middleware automatically caches successful GET request responses in Redis and serves them on subsequent requests, reducing database load and improving response times.

## Features

- ✅ Automatic caching of GET requests
- ✅ Configurable TTL (Time To Live)
- ✅ Custom cache key generation
- ✅ Query parameter-aware caching
- ✅ User-specific caching support
- ✅ Only caches successful responses (2xx)
- ✅ Graceful degradation on Redis failures

## Basic Usage

```typescript
import { cacheMiddleware } from '../middleware/cache';

// Cache for 5 minutes (default)
router.get('/api/articles', cacheMiddleware(), getArticles);

// Cache for 1 hour
router.get('/api/gospel/daily', cacheMiddleware({ ttl: 3600 }), getDailyGospel);
```

## Configuration Options

```typescript
interface CacheMiddlewareOptions {
  ttl?: number; // Cache TTL in seconds (default: 300)
  keyPrefix?: string; // Key prefix for namespacing (default: 'api:')
  keyGenerator?: (req: Request) => string; // Custom key generation
}
```

## Advanced Usage

### Custom Key Prefix

Organize cache keys by domain:

```typescript
// Gospel content cached under 'gospel:' prefix
router.get(
  '/api/gospel/:date',
  cacheMiddleware({ ttl: 86400, keyPrefix: 'gospel:' }),
  getGospelByDate
);

// Articles cached under 'articles:' prefix
router.get(
  '/api/articles/:id',
  cacheMiddleware({ ttl: 3600, keyPrefix: 'articles:' }),
  getArticleById
);
```

### User-Specific Caching

Cache different responses for different users:

```typescript
import { cacheMiddleware, generateUserCacheKey } from '../middleware/cache';

router.get(
  '/api/user/preferences',
  authenticateUser, // Adds req.user
  cacheMiddleware({
    ttl: 600,
    keyGenerator: generateUserCacheKey, // Includes user ID in key
  }),
  getUserPreferences
);
```

### Custom Key Generation

Create your own cache key logic:

```typescript
router.get(
  '/api/search',
  cacheMiddleware({
    ttl: 300,
    keyGenerator: (req) => {
      const { query, page = 1, limit = 10 } = req.query;
      return `search:${query}:${page}:${limit}`;
    },
  }),
  searchContent
);
```

## How It Works

1. **Cache Check**: On GET request, middleware checks Redis for cached response
2. **Cache Hit**: If found, returns cached response immediately
3. **Cache Miss**: If not found, continues to route handler
4. **Response Caching**: Intercepts `res.json()` to cache successful responses
5. **TTL Enforcement**: Cached data expires after configured TTL

## Cache Key Generation

Default key format: `{prefix}{url}?{sortedQueryParams}`

Examples:

- `/api/articles` → `api:/api/articles`
- `/api/articles?page=2&limit=10` → `api:/api/articles?limit=10&page=2`
- `/api/users/123` → `api:/api/users/123`

Query parameters are automatically sorted for consistent caching.

## Helper Functions

### generateCacheKey(req)

Generates cache key from request path and query parameters:

```typescript
import { generateCacheKey } from '../middleware/cache';

const key = generateCacheKey(req);
// Example: '/api/articles?limit=10&page=2'
```

### generateUserCacheKey(req)

Generates user-specific cache key:

```typescript
import { generateUserCacheKey } from '../middleware/cache';

const key = generateUserCacheKey(req);
// Example: 'user:abc123:/api/profile?tab=activity'
```

## Cache Invalidation

To invalidate caches when data changes:

```typescript
import { cacheService } from '../services/cache.service';

// Invalidate specific cache entry
await cacheService.del('/api/articles/123', { prefix: 'api:' });

// Invalidate all article caches
await cacheService.delPattern('/api/articles/*', { prefix: 'api:' });

// Invalidate user-specific caches
await cacheService.delPattern(`user:${userId}:*`);
```

## Best Practices

### ✅ DO

- Cache read-heavy endpoints (GET requests)
- Set appropriate TTLs based on data volatility:
  - Static content: 24 hours (86400s)
  - Daily gospel: 12-24 hours
  - User profiles: 10-30 minutes
  - Search results: 5-15 minutes
- Use custom key generators for complex scenarios
- Invalidate caches on data updates

### ❌ DON'T

- Don't cache endpoints that return user-sensitive data without user-specific keys
- Don't cache POST, PUT, DELETE requests (middleware skips these)
- Don't use same cache key for different users' data
- Don't set excessively long TTLs for frequently changing data
- Don't cache error responses (automatically skipped)

## Performance Considerations

- **Redis Latency**: Sub-millisecond for cache hits (vs. 10-100ms+ for database)
- **Memory Usage**: Monitor Redis memory with large response bodies
- **Cache Warming**: Pre-populate frequently accessed data
- **Thundering Herd**: Use cache locking for expensive operations (future enhancement)

## Error Handling

The middleware gracefully handles Redis failures:

```typescript
// If Redis is down or errors occur:
// 1. Logs error
// 2. Continues to route handler (no caching)
// 3. Application remains functional
```

## Monitoring

Track cache performance:

```typescript
// In your route handler
logger.debug('Cache hit rate', {
  endpoint: '/api/articles',
  hits: cacheHits,
  misses: cacheMisses,
});
```

## Testing

Example test for cached endpoint:

```typescript
describe('Cached Article Endpoint', () => {
  it('should cache article responses', async () => {
    // First request - cache miss
    const response1 = await request(app).get('/api/articles/123').expect(200);

    // Second request - cache hit
    const response2 = await request(app).get('/api/articles/123').expect(200);

    // Responses should be identical
    expect(response1.body).toEqual(response2.body);

    // Database should only be queried once
    expect(databaseQueryCount).toBe(1);
  });
});
```

## Related Documentation

- [Cache Service](../services/README.md#cache-service) - Low-level caching utilities
- [Redis Configuration](../config/database/redis.ts) - Redis connection setup
- [Project Guidelines](../../../CLAUDE.md) - Project development guidelines and best practices
