# API Specification Template

## Overview

This template defines the standard format for documenting API endpoints in the Eucharist Understanding Platform. All API endpoints should be documented using this format to ensure consistency and clarity.

## General API Guidelines

### Base URL
- **Development**: `http://localhost:3000/api`
- **Staging**: `https://staging-api.eucharist.app/api`
- **Production**: `https://api.eucharist.app/api`

### Versioning
- APIs are versioned in the URL: `/api/v1/...`
- Current version: `v1`
- Breaking changes require a new version

### Authentication
- Most endpoints require authentication via JWT token
- Token sent in `Authorization` header: `Bearer <token>`
- Public endpoints are explicitly marked

### Rate Limiting
- **Authenticated**: 100 requests per 15 minutes
- **Unauthenticated**: 20 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes

### Content Type
- Request: `application/json`
- Response: `application/json`

### Standard Response Format

#### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Standard Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | VALIDATION_ERROR | Invalid input data |
| 401 | UNAUTHORIZED | Not authenticated |
| 403 | FORBIDDEN | Authenticated but not authorized |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource already exists |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

## Endpoint Documentation Template

---

### Endpoint Name

Brief description of what this endpoint does.

#### HTTP Method and Path
```
METHOD /api/v1/resource/:id
```

#### Authentication
- [ ] Required
- [ ] Optional
- [ ] Public

#### Authorization
- Roles required: `user`, `admin`, `moderator`
- Resource ownership: Must own the resource or be admin

#### Request

##### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Resource identifier |

##### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| perPage | integer | No | 20 | Items per page (max 100) |
| sort | string | No | created_at | Sort field |
| order | string | No | desc | Sort order (asc/desc) |

##### Request Headers
| Header | Value | Required | Description |
|--------|-------|----------|-------------|
| Authorization | Bearer \<token\> | Yes | JWT authentication token |
| Content-Type | application/json | Yes | Request body format |

##### Request Body
```typescript
{
  field1: string;        // Description
  field2: number;        // Description
  field3?: boolean;      // Optional field description
  nested: {
    subfield: string;
  }
}
```

**Example Request**
```bash
curl -X POST https://api.eucharist.app/api/v1/resource \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "field1": "value1",
    "field2": 42,
    "nested": {
      "subfield": "value"
    }
  }'
```

#### Response

##### Success Response (200/201)
```typescript
{
  success: true;
  data: {
    id: string;
    field1: string;
    field2: number;
    createdAt: string;    // ISO 8601 date
    updatedAt: string;
  };
}
```

**Example Response**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "field1": "value1",
    "field2": 42,
    "createdAt": "2025-10-19T10:30:00Z",
    "updatedAt": "2025-10-19T10:30:00Z"
  }
}
```

##### Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "field1",
        "message": "field1 is required"
      }
    ]
  }
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

#### Validation Rules

| Field | Rules | Error Message |
|-------|-------|---------------|
| field1 | required, min: 3, max: 100 | Field1 must be between 3 and 100 characters |
| field2 | required, integer, min: 1 | Field2 must be a positive integer |

#### Rate Limiting
- Standard rate limit applies (100 req/15 min for authenticated users)
- OR custom rate limit for this endpoint

#### Notes
- Any additional information
- Known limitations
- Related endpoints
- Deprecation warnings

---

## Complete Example: User Registration

### Register New User

Creates a new user account.

#### HTTP Method and Path
```
POST /api/v1/auth/register
```

#### Authentication
- [ ] Required
- [ ] Optional
- [x] Public

#### Request

##### Request Headers
| Header | Value | Required | Description |
|--------|-------|----------|-------------|
| Content-Type | application/json | Yes | Request body format |

##### Request Body
```typescript
{
  email: string;         // User's email address
  password: string;      // User's password (min 8 characters)
  displayName: string;   // User's display name
}
```

**Example Request**
```bash
curl -X POST https://api.eucharist.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "displayName": "John Doe"
  }'
```

#### Response

##### Success Response (201 Created)
```typescript
{
  success: true;
  data: {
    user: {
      id: string;
      email: string;
      displayName: string;
      role: string;
      emailVerified: boolean;
      createdAt: string;
    };
    token: string;        // JWT access token
    refreshToken: string; // Refresh token
  };
}
```

**Example Response**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "displayName": "John Doe",
      "role": "user",
      "emailVerified": false,
      "createdAt": "2025-10-19T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

##### Error Responses

**400 Bad Request - Validation Error**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

**409 Conflict - Email Already Exists**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "An account with this email already exists"
  }
}
```

**429 Too Many Requests**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many registration attempts. Please try again in 15 minutes."
  }
}
```

#### Validation Rules

| Field | Rules | Error Message |
|-------|-------|---------------|
| email | required, email format, max: 255 | Must be a valid email address |
| password | required, min: 8, max: 100, must contain: lowercase, uppercase, number | Password must be 8-100 characters with at least one lowercase, one uppercase, and one number |
| displayName | required, min: 2, max: 100 | Display name must be 2-100 characters |

#### Rate Limiting
- 5 requests per 15 minutes per IP address
- Stricter rate limit due to potential abuse

#### Notes
- Password is hashed using bcrypt (cost factor 10)
- Verification email is sent after registration
- User must verify email before accessing protected features
- JWT token expires in 15 minutes
- Refresh token expires in 7 days

---

## API Documentation Tools

### Swagger/OpenAPI

We use OpenAPI 3.0 specification for API documentation.

**Example OpenAPI Definition**:
```yaml
openapi: 3.0.0
info:
  title: Eucharist Understanding Platform API
  version: 1.0.0
  description: API for the Eucharist Understanding Platform

servers:
  - url: https://api.eucharist.app/api/v1
    description: Production server
  - url: https://staging-api.eucharist.app/api/v1
    description: Staging server

paths:
  /auth/register:
    post:
      summary: Register new user
      tags:
        - Authentication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
                - displayName
              properties:
                email:
                  type: string
                  format: email
                  example: user@example.com
                password:
                  type: string
                  format: password
                  minLength: 8
                  example: SecurePassword123!
                displayName:
                  type: string
                  minLength: 2
                  maxLength: 100
                  example: John Doe
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RegisterResponse'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '409':
          description: Email already exists
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  schemas:
    RegisterResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        data:
          type: object
          properties:
            user:
              $ref: '#/components/schemas/User'
            token:
              type: string
              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
            refreshToken:
              type: string
              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        displayName:
          type: string
        role:
          type: string
          enum: [user, admin, moderator]
        emailVerified:
          type: boolean
        createdAt:
          type: string
          format: date-time
    
    Error:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string
            details:
              type: array
              items:
                type: object
                properties:
                  field:
                    type: string
                  message:
                    type: string
```

### Generating Documentation

```typescript
// src/docs/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Eucharist Understanding Platform API',
      version: '1.0.0',
      description: 'API documentation'
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000/api/v1'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts']
};

export const specs = swaggerJsdoc(options);
```

```typescript
// src/app.ts
import swaggerUi from 'swagger-ui-express';
import { specs } from './docs/swagger';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

### JSDoc Comments for Auto-Documentation

```typescript
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - displayName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               displayName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', authController.register);
```

## Testing APIs

### Postman Collection

Create and maintain a Postman collection with:
- All endpoints
- Example requests
- Test scripts
- Environment variables

### API Tests

```typescript
// tests/api/auth.test.ts
describe('POST /api/v1/auth/register', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'TestPass123!',
        displayName: 'Test User'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe('test@example.com');
    expect(response.body.data.token).toBeDefined();
  });

  it('should reject invalid email', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'invalid-email',
        password: 'TestPass123!',
        displayName: 'Test User'
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
```

## Maintenance

### Documentation Updates
- Update API docs when endpoints change
- Version documentation with API versions
- Keep examples current
- Test all example requests

### Deprecation Process
1. Mark endpoint as deprecated in docs
2. Add deprecation header to response
3. Communicate to API consumers
4. Provide migration guide
5. Remove after grace period (minimum 6 months)

**Deprecation Header**:
```
Deprecation: true
Sunset: 2026-04-19T00:00:00Z
Link: <https://docs.eucharist.app/migration-guide>; rel="deprecation"
```

---

**Document Version**: 1.0  
**Last Updated**: October 2025  
**Owner**: Software Architect  
**Review**: When API changes or quarterly
