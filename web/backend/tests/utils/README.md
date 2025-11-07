# Test Utilities and Helpers

This directory contains reusable test utilities and helper functions to simplify and standardize testing across the backend application.

## Overview

The test utilities are organized into the following categories:

- **API Assertions**: Common assertions for API response validation
- **Mock Data Factories**: Consistent test data generation
- **Environment Helpers**: Environment variable management for tests
- **HTTP Helpers**: Simplified HTTP request creation
- **Database Helpers**: Database mocking and testing utilities
- **Error Helpers**: Error handling and testing utilities

## Installation

Import utilities from the main export:

```typescript
import {
  assertSuccessResponse,
  createMockUser,
  createEnvScope,
  createGetRequest,
} from './utils';
```

Or import from specific modules:

```typescript
import { assertSuccessResponse } from './utils/apiAssertions';
import { createMockUser } from './utils/mockData';
```

## API Assertions

### `assertSuccessResponse(response, expectedStatus?)`

Assert that a response follows the standard success format.

```typescript
const response = await request(app).get('/api/v1/users');
assertSuccessResponse(response, 200);
// Checks: status, success: true, has data property
```

### `assertErrorResponse(response, expectedStatus, expectedCode?, expectedMessage?)`

Assert that a response follows the standard error format.

```typescript
const response = await request(app).get('/api/v1/invalid');
assertErrorResponse(response, 404, 'NOT_FOUND', 'Resource not found');
```

### `assertPaginatedResponse(response, expectedStatus?)`

Assert paginated response format with meta information.

```typescript
const response = await request(app).get('/api/v1/articles?page=1&limit=10');
assertPaginatedResponse(response, 200);
// Checks: success, data (array), meta (page, limit, total)
```

### `assertCorsHeaders(response, origin)`

Assert CORS headers are present and valid.

```typescript
assertCorsHeaders(response, 'http://localhost:3001');
```

### `assertSecurityHeaders(response)`

Assert security headers are present.

```typescript
assertSecurityHeaders(response);
```

### `assertValidTimestamp(timestamp)`

Assert a timestamp is valid.

```typescript
assertValidTimestamp(response.body.data.createdAt);
```

### `assertHasFields(data, fields)`

Assert an object has required fields.

```typescript
assertHasFields(response.body.data, ['id', 'email', 'displayName']);
```

## Mock Data Factories

### `createMockUser(overrides?)`

Generate a mock user object.

```typescript
const user = createMockUser();
const adminUser = createMockUser({ displayName: 'Admin', role: 'admin' });
```

### `createMockGospel(overrides?)`

Generate a mock gospel reading.

```typescript
const gospel = createMockGospel({ date: '2025-12-25' });
```

### `createMockArticle(overrides?)`

Generate a mock article.

```typescript
const article = createMockArticle({
  category: 'mass-parts',
  tags: ['liturgy', 'mass'],
});
```

### `createMockPrayerIntention(overrides?)`

Generate a mock prayer intention.

```typescript
const intention = createMockPrayerIntention({
  text: 'For peace in the world',
  isPublic: true,
});
```

### `createMockError(message?, code?, statusCode?)`

Generate a mock error object.

```typescript
const error = createMockError('Validation failed', 'VALIDATION_ERROR', 400);
```

### `createMockArray(factory, count)`

Generate an array of mock items.

```typescript
const users = createMockArray((i) => createMockUser({ id: `user-${i}` }), 5);
```

## Environment Helpers

### `createEnvScope()`

Create a scoped environment manager.

```typescript
describe('My test suite', () => {
  const env = createEnvScope();

  beforeEach(() => {
    env.set('NODE_ENV', 'test');
    env.set('DATABASE_URL', 'test-db-url');
  });

  afterEach(() => {
    env.restore();
  });

  it('should use test environment', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});
```

### `withEnv(vars, testFn)`

Temporarily set environment variables for a test.

```typescript
it(
  'should work in production',
  withEnv({ NODE_ENV: 'production' }, () => {
    expect(process.env.NODE_ENV).toBe('production');
  })
);
```

### `setupEnvForTests(vars)`

Setup environment variables for a suite with automatic cleanup.

```typescript
describe('Production tests', () => {
  setupEnvForTests({ NODE_ENV: 'production', LOG_LEVEL: 'error' });

  it('should use production config', () => {
    // Environment is automatically set and restored
  });
});
```

## HTTP Request Helpers

### `createGetRequest(app, path)`

Create a GET request with standard headers.

```typescript
const response = await createGetRequest(app, '/api/v1/users');
```

### `createPostRequest(app, path, body)`

Create a POST request with JSON body.

```typescript
const response = await createPostRequest(app, '/api/v1/users', {
  email: 'test@example.com',
});
```

### `createAuthenticatedRequest(app, method, path, token, body?)`

Create an authenticated request with Bearer token.

```typescript
const response = await createAuthenticatedRequest(
  app,
  'GET',
  '/api/v1/profile',
  'jwt-token-here'
);
```

### `createCorsRequest(app, method, path, origin)`

Create a request with CORS headers.

```typescript
const response = await createCorsRequest(
  app,
  'GET',
  '/api/v1/health',
  'http://localhost:3001'
);
```

### `createPreflightRequest(app, path, origin, method, headers?)`

Create an OPTIONS preflight request.

```typescript
const response = await createPreflightRequest(
  app,
  '/api/v1/users',
  'http://localhost:3001',
  'POST',
  ['Content-Type', 'Authorization']
);
```

### `testMultipleMethods(app, path, methods, expectedStatus)`

Test multiple HTTP methods on the same endpoint.

```typescript
await testMultipleMethods(app, '/api/v1/invalid', ['GET', 'POST', 'PUT'], 404);
```

## Database Helpers

### `createMockDatabase(overrides?)`

Create a mock database connection.

```typescript
const mockDb = createMockDatabase({
  isConnected: true,
  query: jest.fn().mockResolvedValue({ rows: [{ id: 1 }] }),
});
```

### `createMockPostgresPool()`

Create a mock PostgreSQL pool.

```typescript
const mockPool = createMockPostgresPool();
mockPool.query.mockResolvedValue({ rows: [{ id: 1 }], rowCount: 1 });
```

### `createMockRedisClient()`

Create a mock Redis client with in-memory storage.

```typescript
const mockRedis = createMockRedisClient();
await mockRedis.set('key', 'value');
const value = await mockRedis.get('key');
```

### `createMockMongoConnection()`

Create a mock MongoDB connection.

```typescript
const mockMongo = createMockMongoConnection();
```

### `setupTestDatabase()`

Setup database with automatic cleanup.

```typescript
describe('Database tests', () => {
  const dbHelper = setupTestDatabase();

  beforeEach(async () => {
    await db.connect();
    dbHelper.addCleanup(async () => await db.disconnect());
  });

  // Tests run here, cleanup happens automatically
});
```

### `createMockQueryResult(data, rowCount?)`

Create a mock database query result.

```typescript
const result = createMockQueryResult([{ id: 1, name: 'Test' }]);
```

### `createMockDatabaseError(message?, code?)`

Create a mock database error.

```typescript
const error = createMockDatabaseError('Connection failed', 'ECONNREFUSED');
```

## Error Testing Helpers

### `createMockRequest(overrides?)`

Create a mock Express request object.

```typescript
const req = createMockRequest({
  body: { email: 'test@example.com' },
  params: { id: '123' },
});
```

### `createMockResponse()`

Create a mock Express response object.

```typescript
const res = createMockResponse();
res.status(200).json({ success: true });
expect(res.status).toHaveBeenCalledWith(200);
```

### `createMockNext()`

Create a mock Express next function.

```typescript
const next = createMockNext();
middleware(req, res, next);
expect(next).toHaveBeenCalled();
```

### `assertErrorPassedToNext(next, expectedError?)`

Assert an error was passed to next().

```typescript
assertErrorPassedToNext(next, 'Expected error message');
```

### `testAsyncError(asyncFn, expectedError)`

Test async error handling.

```typescript
await testAsyncError(
  async () => {
    throw new Error('Test error');
  },
  'Test error'
);
```

### `suppressConsoleLogs()`

Suppress console output during tests.

```typescript
describe('Tests with expected errors', () => {
  suppressConsoleLogs();

  it('should handle errors', () => {
    // Console.error won't clutter test output
  });
});
```

### `captureConsoleOutput()`

Capture console output for assertions.

```typescript
const { logs, errors, warns } = captureConsoleOutput();

it('should log message', () => {
  console.log('Test message');
  expect(logs).toContain('Test message');
});
```

## Best Practices

1. **Import from index**: Use the main export for cleaner imports
2. **Use factories**: Prefer mock data factories over manual object creation
3. **Cleanup environment**: Always use env helpers to prevent test pollution
4. **Assert responses**: Use assertion helpers for consistent validation
5. **Mock databases**: Use database mocks for unit tests, real connections for integration tests
6. **Handle errors**: Use error helpers for consistent error testing

## Examples

### Complete Test Example

```typescript
import {
  assertSuccessResponse,
  assertHasFields,
  createMockUser,
  createGetRequest,
  createEnvScope,
} from './utils';

describe('User API', () => {
  const env = createEnvScope();

  beforeEach(() => {
    env.set('NODE_ENV', 'test');
  });

  afterEach(() => {
    env.restore();
  });

  it('should return user data', async () => {
    const mockUser = createMockUser({ id: '123' });

    const response = await createGetRequest(app, '/api/v1/users/123');

    assertSuccessResponse(response, 200);
    assertHasFields(response.body.data, ['id', 'email', 'displayName']);
    expect(response.body.data.id).toBe('123');
  });
});
```

## Contributing

When adding new utilities:

1. Place them in the appropriate category file
2. Export them from `index.ts`
3. Add JSDoc comments
4. Update this README with examples
5. Write tests for the utility (see `utils.test.ts`)

## License

See project LICENSE file.
