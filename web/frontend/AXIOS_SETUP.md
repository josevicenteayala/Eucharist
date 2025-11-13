# Axios Setup Guide

This document explains how Axios is configured for API calls in the Eucharist Platform frontend.

## Overview

The Axios HTTP client is fully configured with:

- TypeScript type safety
- Request/response interceptors
- Automatic authentication token handling
- Structured error handling
- Standard API response format

## Configuration Files

### Core Files

- **`src/services/api.ts`** - Main Axios configuration with interceptors and helper functions
- **`src/types/api.ts`** - TypeScript types for API responses and errors
- **`src/services/gospelService.ts`** - Example service implementation
- **`src/services/index.ts`** - Central export point for all services

## Quick Start

### 1. Making API Calls

Use the provided helper functions for type-safe API calls:

```typescript
import { get, post, put, patch, del } from '@/services/api';

// GET request
const response = await get<User>('/users/me');
console.log(response.data); // Type: User

// POST request
const newUser = await post<User, CreateUserDto>('/users', {
  email: 'user@example.com',
  name: 'John Doe',
});

// PUT request
const updated = await put<User>('/users/123', { name: 'Jane Doe' });

// PATCH request
const patched = await patch<User>('/users/123', { email: 'new@example.com' });

// DELETE request
const deleted = await del<void>('/users/123');
```

### 2. Error Handling

All errors are transformed into `ApiError` objects with structured information:

```typescript
import { ApiError } from '@/types/api';

try {
  const response = await get<Gospel>('/gospel/today');
  // Process response.data
} catch (error) {
  if (error instanceof ApiError) {
    console.error('Error Code:', error.code);
    console.error('Message:', error.message);
    console.error('Status:', error.statusCode);
    console.error('Details:', error.details);

    // Handle specific error codes
    switch (error.code) {
      case 'NOT_FOUND':
        // Handle not found
        break;
      case 'VALIDATION_ERROR':
        // Handle validation error
        break;
      case 'NETWORK_ERROR':
        // Handle network error
        break;
      default:
      // Handle other errors
    }
  }
}
```

### 3. Creating Service Modules

Organize API calls into domain-specific service modules:

```typescript
// src/services/userService.ts
import { get, post, put, del } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
}

export async function getCurrentUser() {
  return get<User>('/users/me');
}

export async function updateUser(id: string, data: Partial<User>) {
  return put<User>(`/users/${id}`, data);
}

export async function deleteUser(id: string) {
  return del<void>(`/users/${id}`);
}
```

### 4. Using with React Query

Combine with React Query for caching and state management:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { getTodaysGospel } from '@/services/gospelService';
import { ApiError } from '@/types/api';

function GospelComponent() {
  // Fetch data
  const { data, isLoading, error } = useQuery({
    queryKey: ['gospel', 'today'],
    queryFn: async () => {
      const response = await getTodaysGospel();
      return response.data;
    },
  });

  // Mutation example
  const mutation = useMutation({
    mutationFn: (bookmarkId: string) =>
      post('/bookmarks', { gospelId: bookmarkId }),
    onSuccess: () => {
      // Handle success
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        // Handle error
      }
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.liturgicalDay}</div>;
}
```

## API Response Format

All API endpoints follow this standard format:

### Success Response

```typescript
{
  success: true,
  data: {
    // Your actual data
  },
  meta?: {
    page?: number,
    limit?: number,
    total?: number
  }
}
```

### Error Response

```typescript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human-readable error message",
    details?: {
      // Optional additional error details
    }
  }
}
```

## Authentication

Authentication is handled automatically:

1. **Token Storage**: JWT tokens are stored in `localStorage` with key `authToken`
2. **Auto-Include**: Tokens are automatically added to all requests via interceptor
3. **401 Handling**: Unauthorized responses clear the token and redirect to login
4. **SSR Safe**: LocalStorage access is wrapped in browser checks for Next.js SSR

```typescript
// Login example
const loginResponse = await post<{ token: string }>('/auth/login', {
  email: 'user@example.com',
  password: 'password123',
});

// Store token (handled by your auth logic)
localStorage.setItem('authToken', loginResponse.data.token);

// All subsequent requests will include the token automatically
```

## Request/Response Interceptors

### Request Interceptor

Automatically adds:

- Authorization header with Bearer token
- Development logging

### Response Interceptor

Handles:

- 401 errors (clears token, redirects to login)
- Error transformation to `ApiError`
- Development logging

## Environment Configuration

Set the API base URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Default: `http://localhost:3000/api` if not set

## TypeScript Types

### ApiSuccessResponse<T>

```typescript
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: unknown;
  };
}
```

### ApiErrorResponse

```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

### ApiError Class

```typescript
class ApiError extends Error {
  code: string;
  details?: unknown;
  statusCode?: number;

  constructor(message: string, code: string, statusCode?: number, details?: unknown);
}
```

## Best Practices

1. **Always use generic types** for type-safe responses:

   ```typescript
   const response = await get<User>('/users/me');
   // response.data is typed as User
   ```

2. **Handle errors properly**:

   ```typescript
   try {
     const data = await getResource();
   } catch (error) {
     if (error instanceof ApiError) {
       // Handle API errors
     }
   }
   ```

3. **Create service modules** for each domain:
   - `authService.ts` - Authentication
   - `gospelService.ts` - Gospel readings
   - `userService.ts` - User management
   - `contentService.ts` - Content management

4. **Document service functions** with JSDoc:

   ```typescript
   /**
    * Get today's gospel reading
    *
    * @returns Promise with today's gospel reading data
    * @throws ApiError if request fails
    */
   export async function getTodaysGospel() {
     return get<GospelReading>('/gospel/today');
   }
   ```

5. **Use React Query** for data fetching to get:
   - Automatic caching
   - Loading states
   - Error handling
   - Refetch strategies

## Testing

When testing components that use API calls:

```typescript
import { apiClient } from '@/services/api';
import MockAdapter from 'axios-mock-adapter';

describe('MyComponent', () => {
  const mock = new MockAdapter(apiClient);

  afterEach(() => {
    mock.reset();
  });

  it('fetches data successfully', async () => {
    mock.onGet('/gospel/today').reply(200, {
      success: true,
      data: {
        /* mock data */
      },
    });

    // Test your component
  });

  it('handles errors', async () => {
    mock.onGet('/gospel/today').reply(500, {
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error',
      },
    });

    // Test error handling
  });
});
```

## Common Error Codes

- `NETWORK_ERROR` - Network connectivity issue
- `REQUEST_ERROR` - Request configuration error
- `VALIDATION_ERROR` - Input validation failed
- `NOT_FOUND` - Resource not found (404)
- `UNAUTHORIZED` - Authentication required (401)
- `FORBIDDEN` - Insufficient permissions (403)
- `SERVER_ERROR` - Internal server error (500)

## Troubleshooting

### Issue: "localStorage is not defined"

This occurs during SSR. The interceptor already handles this by checking for browser environment:

```typescript
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('authToken');
}
```

### Issue: CORS errors

Ensure backend has proper CORS configuration for the frontend URL.

### Issue: 401 redirect loop

Check that the login page path is excluded from 401 redirect:

```typescript
if (!window.location.pathname.includes('/login')) {
  window.location.href = '/login';
}
```

## Further Reading

- [Axios Documentation](https://axios-http.com/docs/intro)
- [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)
- Project: `web/frontend/src/services/README.md`
