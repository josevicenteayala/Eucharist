# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Eucharist Understanding Platform** - Catholic education platform helping people understand and live the Eucharist through web and mobile applications.

**Status**: Phase 1 (Foundation/MVP Build) - Active development of web application with backend and frontend implementations.

## Architecture

### Monorepo Structure

```
web/
├── backend/    # Node.js + Express + TypeScript API
└── frontend/   # Next.js 14 + React + TypeScript
```

This is an npm workspaces monorepo. Commands at root level cascade to workspaces.

### Three-Layer Backend Pattern

```
Controllers → Services → Models/Repositories → Database
```

- **Controllers** (`src/controllers/`): Request/response handling, validation
- **Services** (`src/services/`): Business logic
- **Models** (`src/models/`): Database schemas and queries
- **Middleware** (`src/middleware/`): Error handling, async wrappers, validation

### Frontend Architecture

Next.js 14 App Router with:

- **App** (`src/app/`): Next.js pages and routing
- **Components** (`src/components/`): Reusable UI components
- **Services** (`src/services/`): API client layer
- **Store** (`src/store/`): Zustand state management
- **Hooks** (`src/hooks/`): React custom hooks

### Database Strategy

**Multi-database approach** - Never mix concerns:

- **PostgreSQL**: Users, auth, prayer intentions, progress tracking (relational data requiring ACID)
- **MongoDB**: Educational content, reflections, articles (flexible schemas, rich text)
- **Redis**: Caching, session storage (temporary data)

## Development Commands

### Root Level (All Workspaces)

```bash
npm install              # Install all workspace dependencies
npm run lint             # Lint all workspaces
npm run lint:fix         # Fix linting issues in all workspaces
npm run format           # Format all files with Prettier
npm run format:check     # Check formatting without changes
npm test                 # Run tests in all workspaces
```

### Backend (`cd web/backend`)

```bash
npm run dev              # Start development server with nodemon + ts-node
npm run build            # Compile TypeScript to dist/
npm start                # Run production build from dist/
npm test                 # Run Jest tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run lint             # Lint TypeScript files
npm run lint:fix         # Fix linting issues
npm run typecheck        # Run TypeScript type checking without build

# Docker databases (required for development)
docker compose up -d     # Start PostgreSQL, MongoDB, Redis
docker compose down      # Stop all databases
docker compose ps        # Check database status
```

### Frontend (`cd web/frontend`)

```bash
npm run dev              # Start Next.js dev server (port 3000)
npm run build            # Build for production
npm start                # Start production server
npm test                 # Run Jest tests
npm run test:watch       # Run tests in watch mode
npm run lint             # Lint TypeScript/TSX files
npm run lint:fix         # Fix linting issues
```

### Running Tests

```bash
# Single test file
cd web/backend
npm test -- path/to/test.test.ts

# Watch mode for specific test
npm test -- --watch path/to/test.test.ts

# Coverage for specific directory
npm test -- --coverage src/services/

# Frontend tests
cd web/frontend
npm test -- ComponentName.test.tsx
```

## Critical Patterns

### API Response Format

All backend endpoints use standardized responses:

```typescript
// Success
{
  success: true,
  data: { /* payload */ },
  meta?: { page, limit, total }  // for paginated responses
}

// Error
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "User-friendly message",
    details?: []  // Only in development
  }
}
```

### Error Handling

**Backend** - Use `asyncHandler` wrapper for all async routes:

```typescript
import { asyncHandler } from '@/middleware/asyncHandler';

router.get(
  '/endpoint',
  asyncHandler(async (req, res) => {
    // Errors automatically caught and passed to error handler
    const result = await service.doSomething();
    res.json({ success: true, data: result });
  })
);
```

**Frontend** - Consistent error logging and user feedback:

```typescript
try {
  const data = await apiCall();
  return data;
} catch (error) {
  console.error('[ComponentName] Operation failed:', error);
  toast.error('User-friendly error message');
  throw error; // Re-throw if caller needs to handle
}
```

### Database Pattern Enforcement

**Wrong** ❌:

```typescript
// NEVER store user data in MongoDB
await MongoDB.users.create({ email, password });

// NEVER store content in PostgreSQL
await PostgreSQL.query('INSERT INTO articles...');
```

**Right** ✅:

```typescript
// Users, auth, relational data → PostgreSQL
await PostgreSQL.query('INSERT INTO users (email, password_hash)...');

// Content, articles, reflections → MongoDB
await ContentModel.create({ title, content, theologicalReview });

// Temporary data, caching → Redis
await redis.setex(`user:${id}`, 3600, JSON.stringify(data));
```

### Content Requirements

All spiritual/theological content must include review metadata:

```typescript
// MongoDB schema
{
  title: string,
  content: string,  // Markdown format
  category: string,
  theologicalReview: {
    reviewed: boolean,
    reviewedBy: string,
    reviewDate: Date,
    magisteriumRefs: string[]  // e.g., ['CCC 1373-1377']
  },
  language: string
}
```

### TypeScript Path Aliases

**Backend**: No path aliases configured, use relative imports
**Frontend**: `@/*` maps to `src/*`

```typescript
// Frontend imports
import { Component } from '@/components/common/Component';
import { useStore } from '@/store/useStore';

// Backend imports
import { Service } from '../services/Service';
import { Model } from '../models/Model';
```

## Environment Configuration

Both backend and frontend require environment files:

```bash
# Backend
cd web/backend
cp .env.example .env
# Edit .env with database connection strings, JWT secrets, etc.

# Frontend
cd web/frontend
cp .env.example .env.local
# Edit .env.local with API URLs, public keys, etc.
```

See `ENVIRONMENT_SETUP.md` for detailed configuration.

## Testing Standards

- **Minimum 80% coverage** required before PR approval
- **Co-locate tests**: `Component.test.tsx` next to `Component.tsx`
- **Mock external dependencies**: Databases, APIs, third-party services
- **Use descriptive test names**: `it('should return 401 when token is missing')`

Test structure:

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should do something specific', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Git Workflow

### Branch Naming

```bash
feature/EP-123-description    # New features
fix/EP-456-description        # Bug fixes
refactor/description          # Code improvements
docs/description              # Documentation
test/description              # Test additions
```

### Commit Convention

Use Conventional Commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation only
- `refactor:` - Code changes without behavior change
- `test:` - Adding/updating tests
- `chore:` - Build process, dependencies

### Pre-commit Checks

Husky hooks automatically run:

- ESLint with auto-fix on staged `.ts`, `.tsx`, `.js`, `.jsx` files
- Prettier formatting on all staged files

Manual pre-push checklist:

```bash
npm run lint         # Fix linting issues
npm test             # All tests must pass
npm run build        # No build errors
```

## CI/CD Pipeline

GitHub Actions runs on all PRs and pushes to `main`/`develop`:

1. **Format Check** - Prettier validation
2. **Lint** - ESLint across all workspaces
3. **Test** - Jest tests with coverage
4. **Validate Docs** - Markdown link checking

See `.github/workflows/` for pipeline definitions.

## Security Requirements

- **JWT tokens**: 15-min access + 7-day refresh tokens
- **Password hashing**: bcrypt with ≥12 salt rounds
- **Input validation**: Zod schemas for all API inputs
- **HTTP security**: Helmet.js headers, rate limiting
- **Never commit**: `.env` files, secrets, API keys
- **SQL injection prevention**: Use parameterized queries or ORMs only
- **XSS prevention**: Sanitize inputs, escape outputs

## Common Development Tasks

### Adding a New API Endpoint

1. Define route in `web/backend/src/routes/`
2. Create controller in `src/controllers/`
3. Implement service logic in `src/services/`
4. Add model/repository if needed in `src/models/`
5. Add input validation in `src/validators/`
6. Write tests in `tests/` (co-located or mirroring structure)
7. Update API documentation

### Adding a New Frontend Page

1. Create page in `web/frontend/src/app/[route]/page.tsx`
2. Create components in `src/components/`
3. Add API service calls in `src/services/`
4. Add state management if needed in `src/store/`
5. Write tests for components
6. Ensure accessibility (WCAG 2.1 AA)

### Database Schema Changes

**PostgreSQL**:

- Create migration script
- Update models/types
- Test rollback scenario

**MongoDB**:

- Update Mongoose schema
- Handle backward compatibility
- Update validation logic

## Key Documentation References

- **Architecture**: `docs/sdlc/SOFTWARE_ARCHITECT.md` - Complete database schemas, API specs, patterns
- **Project Structure**: `docs/PROJECT_STRUCTURE.md` - Detailed directory organization
- **Roadmap**: `docs/TECHNICAL_ROADMAP.md` - Sprint-by-sprint implementation guide
- **Contributing**: `docs/CONTRIBUTING.md` - Development workflow, code standards
- **Environment Setup**: `ENVIRONMENT_SETUP.md` - Configuration guide
- **Copilot Instructions**: `.github/copilot-instructions.md` - Additional development guidelines

## Project-Specific Considerations

### Theological Accuracy

All religious content requires review by qualified theologians before publication. Never bypass `theologicalReview` metadata or review workflows.

### Accessibility

WCAG 2.1 AA compliance is mandatory:

- Semantic HTML elements
- ARIA labels for screen readers
- Keyboard navigation support
- Color contrast ratios (4.5:1 minimum)
- Focus indicators on interactive elements

### Internationalization

Phase 1: English only
Phase 2+: Spanish, Portuguese

Prepare for i18n:

- Externalize all user-facing strings
- Use `react-i18next` for frontend
- Use `i18next` for backend
- Avoid hardcoded strings in components

## Common Pitfalls to Avoid

❌ Mixing database concerns (user data in MongoDB, content in PostgreSQL)
❌ Skipping theological review metadata for spiritual content
❌ Using `any` type in TypeScript (use proper types or `unknown`)
❌ Hardcoding strings instead of externalizing for i18n
❌ Forgetting to use `asyncHandler` wrapper for async routes
❌ Committing `.env` files or secrets
❌ Skipping accessibility attributes (aria-label, alt text)
❌ Not testing on mobile viewports
❌ Writing tests after code instead of TDD approach
