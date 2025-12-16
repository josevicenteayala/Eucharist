# Redis Caching Guide

Comprehensive guide for using Redis caching in the Eucharist Platform backend.

## Table of Contents

- [Overview](#overview)
- [Cache Service](#cache-service)
- [Cache Middleware](#cache-middleware)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Cache Invalidation](#cache-invalidation)
- [Performance Tips](#performance-tips)

## Overview

The Eucharist Platform uses Redis for caching to improve performance and reduce database load. We provide two main tools:

1. **Cache Service** - Low-level caching utilities for business logic
2. **Cache Middleware** - Automatic HTTP response caching

## Cache Service

Located at `src/services/cache.service.ts`

### Basic Operations

```typescript
import { cacheService } from '../services/cache.service';

// Set a value (default TTL: 5 minutes)
await cacheService.set('article:123', articleData);

// Get a value
const article = await cacheService.get('article:123');

// Delete a value
await cacheService.del('article:123');

// Check if exists
const exists = await cacheService.exists('article:123');
```

### Cache-Aside Pattern (Recommended)

```typescript
// Automatically fetch from database if not in cache
const article = await cacheService.getOrSet(
  'article:123',
  async () => {
    // This function only runs on cache miss
    return await Article.findById('123');
  },
  { ttl: 3600 } // Cache for 1 hour
);
```

### Custom TTL

```typescript
// Cache for different durations based on data volatility
await cacheService.set('gospel:daily', data, { ttl: 86400 }); // 24 hours
await cacheService.set('user:profile:123', data, { ttl: 600 }); // 10 minutes
await cacheService.set('trending:articles', data, { ttl: 300 }); // 5 minutes
```

### Custom Prefixes

```typescript
// Organize cache keys by domain
await cacheService.set('123', userData, { prefix: 'user:' });
// Key in Redis: eucharist:user:123

await cacheService.set('456', articleData, { prefix: 'article:' });
// Key in Redis: eucharist:article:456
```

### Counter Operations

Perfect for rate limiting:

```typescript
async function checkRateLimit(userId: string): Promise<boolean> {
  const key = `rate:limit:${userId}`;
  const count = await cacheService.increment(key, { ttl: 60 }); // 1-minute window

  if (count > 100) {
    throw new Error('Rate limit exceeded');
  }

  return true;
}
```

## Cache Middleware

Located at `src/middleware/cache.ts`

### Basic Usage

```typescript
import { cacheMiddleware } from '../middleware/cache';

// Cache all GET requests to this endpoint for 5 minutes
router.get('/api/articles', cacheMiddleware({ ttl: 300 }), getArticles);
```

### Custom Configuration

```typescript
// Cache for 1 hour with custom prefix
router.get(
  '/api/gospel/daily',
  cacheMiddleware({ ttl: 3600, keyPrefix: 'gospel:' }),
  getDailyGospel
);
```

### User-Specific Caching

```typescript
import { cacheMiddleware, generateUserCacheKey } from '../middleware/cache';

// Different cache for each user
router.get(
  '/api/user/preferences',
  authenticateUser, // Adds req.user
  cacheMiddleware({ keyGenerator: generateUserCacheKey }),
  getUserPreferences
);
```

### Custom Key Generation

```typescript
router.get(
  '/api/search',
  cacheMiddleware({
    ttl: 300,
    keyGenerator: (req) => {
      const { query, category, page = 1 } = req.query;
      return `search:${category}:${query}:${page}`;
    },
  }),
  searchContent
);
```

## Best Practices

### 1. Choose Appropriate TTLs

```typescript
// Static content - long TTL
cacheService.set('about-page', data, { ttl: 86400 }); // 24 hours

// Semi-static content - medium TTL
cacheService.set('gospel:2025-01-15', data, { ttl: 43200 }); // 12 hours

// User-specific data - short TTL
cacheService.set('user:profile:123', data, { ttl: 600 }); // 10 minutes

// Real-time data - very short TTL
cacheService.set('trending:now', data, { ttl: 60 }); // 1 minute
```

### 2. Use Descriptive Keys

```typescript
// ❌ Bad
await cacheService.set('u123', userData);
await cacheService.set('a456', articleData);

// ✅ Good
await cacheService.set('user:profile:123', userData);
await cacheService.set('article:content:456', articleData);
```

### 3. Organize with Prefixes

```typescript
// Group related data
const USER_PREFIX = 'user:';
const ARTICLE_PREFIX = 'article:';
const GOSPEL_PREFIX = 'gospel:';

await cacheService.set('profile:123', data, { prefix: USER_PREFIX });
await cacheService.set('content:456', data, { prefix: ARTICLE_PREFIX });
await cacheService.set('daily:2025-01-15', data, { prefix: GOSPEL_PREFIX });
```

### 4. Handle Cache Failures Gracefully

The cache service already handles failures gracefully, but always have a fallback:

```typescript
async function getArticle(id: string) {
  try {
    // Try cache first
    return await cacheService.getOrSet(`article:${id}`, async () => await Article.findById(id), {
      ttl: 3600,
    });
  } catch (error) {
    // If everything fails, fetch from database
    return await Article.findById(id);
  }
}
```

## Common Patterns

### Pattern 1: Cache Expensive Queries

```typescript
async function getPopularArticles() {
  return await cacheService.getOrSet(
    'articles:popular',
    async () => {
      // Expensive query with joins and sorting
      return await Article.aggregate([
        { $match: { published: true } },
        { $lookup: { from: 'users', localField: 'authorId', foreignField: '_id', as: 'author' } },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]);
    },
    { ttl: 3600 }
  );
}
```

### Pattern 2: User Session Data

```typescript
async function getUserSession(userId: string) {
  return await cacheService.getOrSet(
    `session:${userId}`,
    async () => {
      const user = await User.findById(userId);
      const preferences = await UserPreferences.findOne({ userId });
      return { user, preferences };
    },
    { ttl: 900 } // 15 minutes
  );
}
```

### Pattern 3: API Response Caching

```typescript
router.get(
  '/api/articles',
  cacheMiddleware({ ttl: 300 }), // 5 minutes
  asyncHandler(async (req, res) => {
    const articles = await Article.find({ published: true });
    res.json({ success: true, data: articles });
  })
);
```

### Pattern 4: Conditional Caching

```typescript
router.get(
  '/api/articles/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { nocache } = req.query;

    if (nocache) {
      // Skip cache
      const article = await Article.findById(id);
      return res.json({ success: true, data: article });
    }

    // Use cache
    const article = await cacheService.getOrSet(
      `article:${id}`,
      async () => await Article.findById(id),
      { ttl: 3600 }
    );

    res.json({ success: true, data: article });
  })
);
```

## Cache Invalidation

### Invalidate Single Item

```typescript
async function updateArticle(id: string, updates: Partial<Article>) {
  // Update database
  const article = await Article.findByIdAndUpdate(id, updates, { new: true });

  // Invalidate cache
  await cacheService.del(`article:${id}`);

  return article;
}
```

### Invalidate Multiple Items by Pattern

```typescript
async function publishArticle(id: string) {
  await Article.findByIdAndUpdate(id, { published: true });

  // Invalidate all article lists
  await cacheService.delPattern('articles:*');
  // Also invalidate this specific article
  await cacheService.del(`article:${id}`);
}
```

### Invalidate on User Actions

```typescript
async function updateUserPreferences(userId: string, preferences: UserPreferences) {
  await UserPreferences.updateOne({ userId }, preferences);

  // Invalidate user-specific caches
  await cacheService.delPattern(`user:${userId}:*`);
}
```

## Performance Tips

### 1. Cache Warming

Pre-populate cache with frequently accessed data:

```typescript
async function warmCache() {
  // Cache today's gospel
  const gospel = await Gospel.findOne({ date: new Date() });
  await cacheService.set('gospel:today', gospel, { ttl: 43200 });

  // Cache popular articles
  const popular = await Article.find().sort({ views: -1 }).limit(10);
  await cacheService.set('articles:popular', popular, { ttl: 3600 });
}

// Run on server startup
warmCache().catch(console.error);
```

### 2. Batch Operations

```typescript
async function getCachedArticles(ids: string[]) {
  const results = await Promise.all(
    ids.map((id) =>
      cacheService.getOrSet(`article:${id}`, async () => await Article.findById(id), { ttl: 3600 })
    )
  );
  return results;
}
```

### 3. Monitor Cache Hit Rates

```typescript
let cacheHits = 0;
let cacheMisses = 0;

async function getWithTracking(key: string) {
  const value = await cacheService.get(key);

  if (value !== null) {
    cacheHits++;
  } else {
    cacheMisses++;
  }

  const hitRate = (cacheHits / (cacheHits + cacheMisses)) * 100;
  logger.info(`Cache hit rate: ${hitRate.toFixed(2)}%`);

  return value;
}
```

### 4. Avoid Caching Large Objects

```typescript
// ❌ Bad - caching huge objects
const allArticles = await Article.find(); // Could be thousands
await cacheService.set('articles:all', allArticles); // Memory intensive

// ✅ Good - cache IDs and fetch on demand
const articleIds = await Article.find().select('_id');
await cacheService.set('articles:ids', articleIds, { ttl: 3600 });
```

## Example: Complete Article Service

```typescript
import { cacheService } from './cache.service';
import Article from '../models/article.model';

class ArticleService {
  private CACHE_PREFIX = 'article:';
  private LIST_CACHE_TTL = 300; // 5 minutes
  private ITEM_CACHE_TTL = 3600; // 1 hour

  async getById(id: string) {
    return await cacheService.getOrSet(`content:${id}`, async () => await Article.findById(id), {
      ttl: this.ITEM_CACHE_TTL,
      prefix: this.CACHE_PREFIX,
    });
  }

  async getPublished() {
    return await cacheService.getOrSet(
      'published:list',
      async () => await Article.find({ published: true }).sort({ createdAt: -1 }),
      { ttl: this.LIST_CACHE_TTL, prefix: this.CACHE_PREFIX }
    );
  }

  async create(data: Partial<Article>) {
    const article = await Article.create(data);

    // Invalidate list caches
    await cacheService.delPattern('published:*', { prefix: this.CACHE_PREFIX });

    return article;
  }

  async update(id: string, updates: Partial<Article>) {
    const article = await Article.findByIdAndUpdate(id, updates, { new: true });

    // Invalidate this article's cache
    await cacheService.del(`content:${id}`, { prefix: this.CACHE_PREFIX });

    // If published status changed, invalidate lists
    if ('published' in updates) {
      await cacheService.delPattern('published:*', { prefix: this.CACHE_PREFIX });
    }

    return article;
  }

  async delete(id: string) {
    await Article.findByIdAndDelete(id);

    // Invalidate caches
    await cacheService.del(`content:${id}`, { prefix: this.CACHE_PREFIX });
    await cacheService.delPattern('published:*', { prefix: this.CACHE_PREFIX });
  }
}

export const articleService = new ArticleService();
```

## Troubleshooting

### Cache Not Working

1. Check Redis connection:

   ```bash
   redis-cli ping
   # Should return: PONG
   ```

2. Verify environment variables in `.env`:

   ```
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

3. Check Redis keys:
   ```bash
   redis-cli
   > KEYS eucharist:*
   ```

### Cache Not Expiring

1. Verify TTL is set:

   ```bash
   redis-cli
   > TTL eucharist:article:123
   # Should return remaining seconds, not -1
   ```

2. Check if TTL was passed to cache operation:
   ```typescript
   await cacheService.set('key', data, { ttl: 300 }); // ✅
   await cacheService.set('key', data); // Uses default (300s)
   ```

### High Memory Usage

1. Monitor Redis memory:

   ```bash
   redis-cli INFO memory
   ```

2. Set maxmemory policy in redis.conf:

   ```
   maxmemory 256mb
   maxmemory-policy allkeys-lru
   ```

3. Review cached object sizes:
   ```typescript
   const data = JSON.stringify(objectToCache);
   console.log(`Cache size: ${Buffer.byteLength(data)} bytes`);
   ```

## Related Documentation

- [Cache Service API](./src/services/README.md#cache-service)
- [Cache Middleware Guide](./src/middleware/README.cache.md)
- [Redis Configuration](./src/config/database/redis.ts)
- [Performance Guidelines](../../CLAUDE.md#performance-guidelines)
