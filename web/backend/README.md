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
│   │   └── env.ts       # Environment variables
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
- PostgreSQL (for relational data - future)
- MongoDB (for content - future)
- Redis (for caching - future)

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

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

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
Returns server health status and uptime.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-11-06T12:00:00.000Z",
    "uptime": 123.456,
    "environment": "development"
  }
}
```

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

## Database Integration (Future)

### PostgreSQL
For relational data:
- User accounts and authentication
- Prayer intentions
- Progress tracking
- User relationships

### MongoDB
For flexible content:
- Educational articles
- Gospel reflections
- Eucharistic miracles
- Media metadata

### Redis
For caching:
- Session data
- Frequently accessed content
- API response caching

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
- [ ] Set up database connections (PostgreSQL, MongoDB, Redis)
- [ ] Implement authentication endpoints
- [ ] Add input validation with Zod
- [ ] Set up logging with Winston
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
