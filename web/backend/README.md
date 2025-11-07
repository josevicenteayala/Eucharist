# Eucharist Web Backend

Node.js + Express + TypeScript REST API backend for the Eucharist Understanding Platform.

## Overview

This backend service provides RESTful APIs for the Eucharist Platform web and mobile applications, handling authentication, content management, community features, and data persistence.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Databases**: 
  - PostgreSQL (users, auth, relational data)
  - MongoDB (content, flexible documents)
  - Redis (caching)
- **Authentication**: JWT
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint + Prettier

## Project Structure

```
web/backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database/    # Database connections
│   │   │   ├── index.ts       # Database exports & lifecycle
│   │   │   ├── postgres.ts    # PostgreSQL connection
│   │   │   ├── mongodb.ts     # MongoDB connection
│   │   │   └── redis.ts       # Redis connection
│   │   ├── cors.ts      # CORS configuration
│   │   ├── env.ts       # Environment variables
│   │   ├── helmet.ts    # Security headers
│   │   └── logger.ts    # Winston logger
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   │   └── errorHandler.ts
│   ├── models/          # Database models
│   ├── routes/          # API route definitions
│   │   ├── index.ts
│   │   └── health.routes.ts
│   ├── services/        # Business logic layer
│   ├── utils/           # Utility functions
│   ├── validators/      # Input validation schemas
│   ├── app.ts           # Express app setup
│   └── index.ts         # Server entry point
├── tests/               # Test files
│   ├── database.*.test.ts  # Database tests
│   └── health.test.ts
├── .env.example         # Environment variables template
├── jest.config.js       # Jest configuration
├── nodemon.json         # Nodemon configuration
├── tsconfig.json        # TypeScript configuration
├── .eslintrc.json       # ESLint configuration
├── .prettierrc          # Prettier configuration
└── package.json         # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL (for relational data)
- MongoDB (for content)
- Redis (for caching)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up databases:

**PostgreSQL**:
```bash
# Install PostgreSQL (if not installed)
# Create a database
createdb eucharist_db
```

**MongoDB**:
```bash
# Install MongoDB (if not installed)
# MongoDB will auto-create the database on first connection
```

**Redis**:
```bash
# Install Redis (if not installed)
# Start Redis server
redis-server
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000` and connect to all databases.

## Available Scripts

### Development
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
```

### Testing
```bash
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run typecheck    # Check TypeScript types
```

## API Endpoints

### Health Check
```
GET /api/v1/health
```
Returns server health status, uptime, and database connection status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-11-06T12:00:00.000Z",
    "uptime": 123.456,
    "environment": "development",
    "databases": {
      "postgres": { "status": "healthy" },
      "mongodb": { "status": "healthy" },
      "redis": { "status": "healthy" }
    }
  }
}
```

**Database Status Values**:
- `healthy` - Database is connected and responsive
- `unhealthy` - Database is connected but not responding correctly
- `disconnected` - Database is not connected

**Overall Health Status**:
- `healthy` - All databases are healthy
- `degraded` - One or more databases are unhealthy or disconnected

### Root
```
GET /
```
Returns API information.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Eucharist Platform API",
    "version": "v1",
    "documentation": "/api/docs"
  }
}
```

## API Response Format

All API endpoints follow a standard response format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

## Environment Variables

See `.env.example` for all available environment variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `API_VERSION` - API version prefix (default: v1)
- Database configurations (PostgreSQL, MongoDB, Redis)
- JWT configuration
- CORS settings
- Logging level

## Testing

The project uses Jest and Supertest for testing. Tests are located in the `tests/` directory and co-located `*.test.ts` files.

Run tests:
```bash
npm test
```

Run with coverage (minimum 80% required):
```bash
npm run test:coverage
```

## Logging

The project uses Winston for logging with environment-specific configurations:

**Development Mode**: Colorized, human-readable format
```typescript
import logger from './config/logger';

logger.info('Server starting', { port: 3000 });
logger.debug('Debug info', { userId: '123' });
logger.warn('Warning message', { metric: 'high' });
logger.error('Error occurred', { error: err.message, stack: err.stack });
```

**Production Mode**: Structured JSON format with file transports
- `logs/error.log` - Error-level logs only
- `logs/combined.log` - All logs

**Log Levels** (set via `LOG_LEVEL` env var):
- `error` - Error messages only
- `warn` - Warnings and errors
- `info` - Informational messages (default)
- `debug` - Detailed debug information

HTTP requests are automatically logged via Morgan integration.

## Code Quality Standards

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier with consistent style
- **Test Coverage**: Minimum 80%
- **No console.log**: Use proper logging (warning enforced)

## Architecture Patterns

This backend follows a three-layer architecture:

1. **Presentation Layer** (Routes/Controllers) - Handle HTTP requests/responses
2. **Service Layer** (Services) - Business logic
3. **Repository Layer** (Models) - Data access

## Security

- Helmet.js for security headers
- CORS configuration
- JWT authentication (future implementation)
- Input validation with Zod (future implementation)
- Rate limiting (future implementation)

## Database Integration

### PostgreSQL
For relational data:
- User accounts and authentication
- Prayer intentions
- Progress tracking
- User relationships

**Connection Details**:
- Configured via `POSTGRES_*` environment variables
- Connection pooling with 10 max connections
- Automatic reconnection on failure
- Query method for simple queries
- Client method for transactions

**Usage Example**:
```typescript
import { postgresDb } from './config/database';

// Simple query
const result = await postgresDb.query('SELECT * FROM users WHERE id = $1', [userId]);

// Transaction
const client = await postgresDb.getClient();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO users ...');
  await client.query('INSERT INTO profiles ...');
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

### MongoDB
For flexible content:
- Educational articles
- Gospel reflections
- Eucharistic miracles
- Media metadata

**Connection Details**:
- Configured via `MONGODB_URI` environment variable
- Using Mongoose ODM
- Connection pooling (2-10 connections)
- Automatic reconnection with event handlers

**Usage Example**:
```typescript
import { mongoDb } from './config/database';

// Get mongoose instance
const mongoose = mongoDb.getConnection();

// Define schema and model
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String
});
const Article = mongoose.model('Article', articleSchema);

// Use model
const article = await Article.findOne({ title: 'Example' });
```

### Redis
For caching:
- Session data
- Frequently accessed content
- API response caching
- Rate limiting data

**Connection Details**:
- Configured via `REDIS_*` environment variables
- Using ioredis client
- Automatic retry with exponential backoff
- Helper methods for common operations

**Usage Example**:
```typescript
import { redisDb } from './config/database';

// Set value with TTL
await redisDb.set('user:123', JSON.stringify(userData), 3600);

// Get value
const data = await redisDb.get('user:123');

// Delete value
await redisDb.del('user:123');

// Advanced operations with client
const client = redisDb.getClient();
await client.setex('key', 60, 'value');
```

### Database Lifecycle

Databases are automatically connected on server startup and disconnected on graceful shutdown (SIGTERM/SIGINT).

**Manual Connection Management**:
```typescript
import { connectDatabases, disconnectDatabases } from './config/database';

// Connect all databases
await connectDatabases();

// Disconnect all databases
await disconnectDatabases();

// Check health
import { checkDatabasesHealth } from './config/database';
const health = await checkDatabasesHealth();
```

## Deployment

Build for production:
```bash
npm run build
```

Start production server:
```bash
NODE_ENV=production npm start
```

## CI/CD

GitHub Actions pipelines are configured for:
- Linting and formatting checks
- Type checking
- Unit and integration tests
- Security audits
- Build verification

See `.github/workflows/` for pipeline configurations.

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Ensure all tests pass
4. Run linting and formatting
5. Update documentation as needed

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for more details.

## License

See [LICENSE](../../LICENSE) file in the repository root.

## Next Steps

### Phase 1 - Foundation
- [x] Set up database connections (PostgreSQL, MongoDB, Redis)
- [ ] Implement authentication endpoints
- [ ] Add input validation with Zod
- [x] Set up logging with Winston
- [ ] Add API documentation with Swagger

### Phase 2 - Core Features
- [ ] Gospel reading endpoints
- [ ] Content management endpoints
- [ ] User management endpoints
- [ ] Prayer intentions endpoints

### Phase 3 - Advanced Features
- [ ] Real-time features with Socket.IO
- [ ] File upload and media management
- [ ] Email notifications
- [ ] Analytics and reporting

## Support

For issues and questions, please refer to the main repository documentation or create an issue on GitHub.
