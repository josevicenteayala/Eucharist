# Services

This directory contains business logic services.

## Purpose

Services encapsulate business logic and data operations, called by controllers.

## Structure

```
services/
├── auth.service.ts          # Authentication logic
├── gospel.service.ts        # Gospel data processing
├── content.service.ts       # Content management
├── community.service.ts     # Community features
├── user.service.ts          # User management
└── cache.service.ts         # Redis caching utilities
```

## Standards

- Implement business logic here (not in controllers)
- Use dependency injection where appropriate
- Handle data transformations
- Interact with models/repositories
- Throw meaningful errors
- Keep services focused and single-purpose

## Cache Service

The `cache.service.ts` provides a high-level abstraction over Redis for caching operations.

### Usage Examples

#### Basic Caching

```typescript
import { cacheService } from '../services/cache.service';

// Set a value with default TTL (5 minutes)
await cacheService.set('user:123', userData);

// Get a cached value
const user = await cacheService.get<User>('user:123');

// Delete a cached value
await cacheService.del('user:123');
```

#### Cache with Custom TTL

```typescript
// Cache for 1 hour (3600 seconds)
await cacheService.set('article:456', articleData, { ttl: 3600 });

// Cache for 1 day
await cacheService.set('gospel:daily', gospelData, { ttl: 86400 });
```

#### Cache-Aside Pattern

```typescript
// Get from cache or fetch from database
const article = await cacheService.getOrSet(
  'article:456',
  async () => {
    // This function only runs on cache miss
    return await Article.findById('456');
  },
  { ttl: 3600 }
);
```

#### Pattern-Based Deletion

```typescript
// Delete all user-related cache keys
await cacheService.delPattern('user:*');

// Clear all article caches
await cacheService.delPattern('article:*');
```

#### Using Custom Prefixes

```typescript
// Use custom prefix for namespacing
await cacheService.set('123', userData, { prefix: 'user:' });
const user = await cacheService.get('123', { prefix: 'user:' });
```

#### Counter Operations

```typescript
// Increment a counter (useful for rate limiting)
const requestCount = await cacheService.increment('rate:limit:user:123', {
  ttl: 60, // 1 minute window
});

if (requestCount > 100) {
  throw new Error('Rate limit exceeded');
}
```

### Best Practices

1. **Use descriptive keys**: `user:123:profile` instead of `u123p`
2. **Set appropriate TTLs**: Match cache duration to data volatility
3. **Handle cache misses**: Always have a fallback to fetch fresh data
4. **Use prefixes**: Organize cache keys by domain (`user:`, `article:`, etc.)
5. **Pattern deletion**: Clear related caches when data changes
6. **Error resilience**: Cache failures should not break the application

### Cache Middleware

For automatic HTTP response caching, use the cache middleware:

```typescript
import { cacheMiddleware } from '../middleware/cache';

// Cache GET requests for 5 minutes
router.get('/api/articles', cacheMiddleware({ ttl: 300 }), getArticles);

// Cache with custom prefix
router.get(
  '/api/gospel/daily',
  cacheMiddleware({ ttl: 3600, keyPrefix: 'gospel:' }),
  getDailyGospel
);

// User-specific caching
import { generateUserCacheKey } from '../middleware/cache';

router.get(
  '/api/user/profile',
  cacheMiddleware({
    ttl: 600,
    keyGenerator: generateUserCacheKey,
  }),
  getUserProfile
);
```
