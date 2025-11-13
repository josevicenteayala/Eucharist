# API Services

This directory contains API client functions for backend communication.

## Structure

```
services/
├── api.ts              # Base Axios configuration with interceptors
├── gospelService.ts    # Gospel data API calls (example)
├── index.ts            # Central exports for all services
└── README.md           # This file
```

## Axios Configuration

The `api.ts` file provides a fully configured Axios instance with:

- **Base URL**: Configured from `NEXT_PUBLIC_API_URL` environment variable
- **Request Interceptors**: Automatically adds JWT authentication tokens
- **Response Interceptors**: Handles errors and 401 redirects
- **Type Safety**: Full TypeScript support with generic helpers
- **Error Handling**: Transforms errors into structured `ApiError` objects
- **Logging**: Development mode logging for debugging

## Usage

### Basic GET Request

```typescript
import { get } from '@/services/api';

const response = await get<User>('/users/me');
console.log(response.data); // Typed as User
```

### POST Request with Body

```typescript
import { post } from '@/services/api';

const response = await post<User, CreateUserDto>('/users', {
  email: 'user@example.com',
  name: 'John',
});
```

### Error Handling

```typescript
import { ApiError } from '@/types/api';

try {
  const response = await get<Gospel>('/gospel/today');
  // Handle success
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Error ${error.code}: ${error.message}`);
    // Access error.statusCode, error.details
  }
}
```

### Creating Service Modules

See `gospelService.ts` for an example of how to create service modules:

```typescript
import { get, post } from './api';

export interface Resource {
  id: string;
  name: string;
}

export async function getResource(id: string) {
  return get<Resource>(`/resources/${id}`);
}

export async function createResource(data: Omit<Resource, 'id'>) {
  return post<Resource>('/resources', data);
}
```

## API Response Format

All API responses follow a standard format:

**Success Response:**

```typescript
{
  success: true,
  data: T,           // Your data type
  meta?: {           // Optional metadata
    page?: number,
    limit?: number,
    total?: number
  }
}
```

**Error Response:**

```typescript
{
  success: false,
  error: {
    code: string,    // e.g., "NOT_FOUND", "VALIDATION_ERROR"
    message: string, // Human-readable error message
    details?: any    // Optional additional details
  }
}
```

## Standards

- ✅ Use TypeScript generics for type-safe API calls
- ✅ All responses follow the standard format above
- ✅ Handle errors using try/catch with `ApiError`
- ✅ Authentication tokens are automatically included
- ✅ Use React Query for data fetching and caching
- ✅ Keep service files focused on single domains (gospel, auth, users, etc.)
- ✅ Document all service functions with JSDoc comments

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```
