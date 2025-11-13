# Error Handling Middleware

This directory contains comprehensive error handling middleware for the Eucharist Platform API.

## Overview

The error handling system provides:

- **Custom error classes** for different HTTP error types
- **Global error handler** that catches all errors and formats responses
- **Async error wrapper** to catch errors in async route handlers
- **404 handler** for unmatched routes

## Components

### Custom Error Classes (`errors.ts`)

Pre-defined error classes that extend the base `ApiError`:

#### `ApiError`

Base class for all API errors with status code, error code, and optional details.

```typescript
throw new ApiError('Custom message', 400, 'CUSTOM_ERROR', { field: 'value' });
```

#### `ValidationError` - 400 Bad Request

Used for invalid input data or validation failures.

```typescript
throw new ValidationError('Invalid email format', [
  { field: 'email', message: 'Must be a valid email' },
]);
```

#### `UnauthorizedError` - 401 Unauthorized

Used when authentication is required or has failed.

```typescript
throw new UnauthorizedError('Invalid or expired token');
```

#### `ForbiddenError` - 403 Forbidden

Used when user is authenticated but lacks required permissions.

```typescript
throw new ForbiddenError('Insufficient permissions to access this resource');
```

#### `NotFoundError` - 404 Not Found

Used when a requested resource doesn't exist.

```typescript
throw new NotFoundError('User'); // Returns: "User not found"
```

#### `ConflictError` - 409 Conflict

Used when request conflicts with current state (e.g., duplicate resources).

```typescript
throw new ConflictError('Email already registered', { email: 'user@example.com' });
```

#### `InternalServerError` - 500 Internal Server Error

Used for unexpected server errors.

```typescript
throw new InternalServerError('Database connection failed');
```

### Error Handler (`errorHandler.ts`)

Global middleware that catches all errors and returns standardized JSON responses.

**Response Format:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Only included in development mode
  }
}
```

**Usage:** Registered as the last middleware in `app.ts`.

### Async Handler (`asyncHandler.ts`)

Wrapper for async route handlers that automatically catches promise rejections.

**Without asyncHandler:**

```typescript
router.get('/users', async (req, res, next) => {
  try {
    const users = await getUsersFromDatabase();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error); // Must manually catch and forward
  }
});
```

**With asyncHandler:**

```typescript
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const users = await getUsersFromDatabase();
    res.json({ success: true, data: users });
  })
);
// Errors automatically caught and forwarded to error handler
```

### Not Found Handler (`notFoundHandler.ts`)

Middleware that catches all unmatched routes and returns a 404 error.

**Usage:** Registered after all routes but before the error handler in `app.ts`.

## Usage Examples

### Basic Route with Error Handling

```typescript
import { asyncHandler, NotFoundError } from '../middleware';

router.get(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new NotFoundError('User');
    }

    res.json({
      success: true,
      data: user,
    });
  })
);
```

### Validation with Error Details

```typescript
import { asyncHandler, ValidationError } from '../middleware';

router.post(
  '/users',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const errors = [];
    if (!email || !email.includes('@')) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    }
    if (!password || password.length < 8) {
      errors.push({ field: 'password', message: 'Must be at least 8 characters' });
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }

    const user = await User.create({ email, password });
    res.status(201).json({ success: true, data: user });
  })
);
```

### Authentication Middleware

```typescript
import { asyncHandler, UnauthorizedError } from '../middleware';

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new UnauthorizedError('Authentication token required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
});
```

### Conflict Handling (Duplicate Resources)

```typescript
import { asyncHandler, ConflictError } from '../middleware';

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Email already registered', { email });
    }

    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  })
);
```

## Integration in app.ts

```typescript
import { errorHandler, notFoundHandler } from './middleware';

// ... other middleware and routes

// API routes
app.use('/api/v1', routes);

// 404 handler for unmatched routes (must be before error handler)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);
```

## Testing

All middleware components have comprehensive test coverage. Run tests with:

```bash
npm test
```

Test files:

- `tests/errors.test.ts` - Custom error classes
- `tests/errorHandler.test.ts` - Global error handler
- `tests/asyncHandler.test.ts` - Async wrapper utility
- `tests/notFoundHandler.test.ts` - 404 handler

## Best Practices

1. **Always use `asyncHandler`** for async route handlers to avoid unhandled promise rejections
2. **Throw specific error types** (ValidationError, NotFoundError, etc.) instead of generic Error
3. **Include helpful details** in ValidationError to guide users in fixing their requests
4. **Never expose sensitive information** in error details in production
5. **Log all errors** - the error handler automatically logs with Winston
6. **Use meaningful error messages** that help users understand what went wrong

## Error Logging

All errors are automatically logged using Winston with the following information:

- Status code
- Error code
- Message
- Stack trace
- Additional details (if provided)

Logs are written to:

- Console (all environments)
- `logs/error.log` (errors only)
- `logs/combined.log` (all logs)

## Future Enhancements

Potential improvements for future versions:

- Integration with error tracking service (e.g., Sentry)
- Rate limiting error tracking per IP
- Custom error pages for frontend
- Localization of error messages (i18n)
- Automatic retry logic for transient errors
