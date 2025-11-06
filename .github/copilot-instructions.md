# GitHub Copilot Instructions - Eucharist Platform

## Project Status: Documentation-Only (No Implementation Code Yet)

**Mission**: Catholic education platform helping people understand and live the Eucharist  
**Current Phase**: Planning complete, awaiting implementation (Phase 1 Foundation/MVP)  
**Critical**: This repository contains **only documentation**—no source code exists yet. Confirm with user before generating implementation code.

## Architecture at a Glance

### Three-Layer Pattern
```
Presentation → Service → Repository → Database
```

**Planned Structure** (not yet created):
- `mobile/` - Flutter app with clean architecture (`/data`, `/domain`, `/presentation`)
- `web/frontend/` - Next.js with `/components`, `/pages`, `/hooks`, `/services`
- `web/backend/` - Express with `/controllers`, `/services`, `/models`, `/routes`
- `content/` - Markdown files with theological review metadata

See `PROJECT_STRUCTURE.md` for complete layout.

### Tech Stack Decisions

**Backend**: Node.js + Express + TypeScript + JWT auth  
**Frontend**: Next.js 14 + TypeScript + Zustand + React Query + Tailwind  
**Mobile**: Flutter + Provider/Riverpod + Firebase Auth (future phase)  
**Databases**: PostgreSQL (users/relational) + MongoDB (content/flexible) + Redis (cache)  
**CI/CD**: GitHub Actions with lint → test → security → build → deploy

**Key architectural principle**: Never mix database concerns—user data in PostgreSQL, content in MongoDB.

## Database Patterns

### PostgreSQL Schema Pattern
```sql
-- Users, auth, prayer intentions, progress tracking
-- Foreign keys, ACID transactions required
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  -- ...
);
```

### MongoDB Document Pattern
```javascript
// Educational articles, reflections, miracles
// Rich text, metadata, multilingual support
{
  _id: ObjectId,
  title: String,
  content: String, // Markdown
  theologicalReview: {
    reviewed: Boolean,
    reviewedBy: String,
    magisteriumRefs: [String]
  }
}
```

Full schemas: `docs/sdlc/SOFTWARE_ARCHITECT.md` lines 400-800

## API Conventions

**Standard response format**:
```typescript
// Success
{ success: true, data: {...}, meta: { page, limit, total } }

// Error
{ success: false, error: { code: "ERROR_CODE", message: "...", details: [] } }
```

**Endpoint structure** (all under `/api/v1/`):
- `/auth/*` - Login, register, token refresh
- `/gospel/*` - Daily readings and reflections
- `/content/*` - Educational articles and resources
- `/community/*` - Prayer intentions, forums
- `/users/*` - Profile, preferences, progress

See `docs/sdlc/SOFTWARE_ARCHITECT.md` lines 800-950 for complete API specs.

## Content Requirements

All spiritual/educational content must include:
```markdown
---
title: "Understanding the Real Presence"
category: "eucharist-basics"
reviewedBy: "Fr. John Doe"
reviewDate: "2025-10-15"
magisteriumRefs: ["CCC 1373-1377"]
language: "en"
---
```

Guidelines: `CONTRIBUTING.md` lines 50-150

## Testing & Quality Standards

**Minimum requirements** (ADR-005):
- Unit tests: Jest (backend), Jest + React Testing Library (frontend)
- Integration tests: Supertest for APIs
- E2E tests: Playwright/Cypress for critical flows
- Coverage: 80% minimum before PR approval
- Co-locate tests: `*.test.ts` next to `*.ts`

**CI pipeline checks**: ESLint, Prettier, TypeScript compilation, security audit, tests

**Test-Driven Development**:
- Write tests BEFORE implementing features when possible
- Test file naming: `ComponentName.test.ts` or `ComponentName.spec.ts`
- Mock external dependencies (APIs, databases) in unit tests
- Use `beforeEach`/`afterEach` for test setup/cleanup
- Run tests in watch mode during development: `npm test -- --watch`

## Error Handling & Logging

**Standard error handling pattern**:
```typescript
// Backend API
try {
  const result = await someOperation();
  return res.json({ success: true, data: result });
} catch (error) {
  logger.error('Operation failed', { error, context: {...} });
  return res.status(500).json({
    success: false,
    error: {
      code: 'OPERATION_FAILED',
      message: 'A user-friendly message',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    }
  });
}

// Frontend
try {
  const data = await apiCall();
  return data;
} catch (error) {
  console.error('[ComponentName] Operation failed:', error);
  toast.error('Something went wrong. Please try again.');
  throw error; // Re-throw if caller needs to handle
}
```

**Logging levels**:
- `error` - Failures, exceptions (always logged)
- `warn` - Unexpected but handled situations
- `info` - Important business events (login, content publish)
- `debug` - Detailed troubleshooting info (dev/staging only)

**Never log**:
- Passwords or tokens
- Personal identifiable information (PII)
- Complete error stack traces in production

## Security Checklist

- JWT tokens with 15-min access + 7-day refresh rotation
- bcrypt password hashing (≥12 salt rounds)
- Helmet.js for HTTP headers, express-rate-limit for throttling
- Zod validation for all API inputs
- Never commit `.env` files
- Firebase Auth for mobile only (not backend database)
- SQL injection prevention: Use parameterized queries/ORMs only
- XSS prevention: Sanitize user inputs, escape outputs
- CSRF protection: Use CSRF tokens for state-changing operations
- Dependency scanning: Run `npm audit` before adding/updating packages

**Pre-commit security checks**:
```bash
# Check for secrets in code
git diff --cached | grep -i "password\|secret\|api_key"
# Run security audit
npm audit --audit-level=moderate
```

Details: `docs/sdlc/SOFTWARE_ARCHITECT.md` lines 1000-1100

## Code Review Standards

**Before requesting review**:
- [ ] Code follows project style guide (run linter)
- [ ] All tests pass locally
- [ ] No console.log/debug statements in production code
- [ ] Comments explain "why", not "what"
- [ ] Complex logic has unit tests
- [ ] API changes documented in comments/API docs
- [ ] Breaking changes clearly noted in PR description

**Reviewer focus areas**:
1. Security vulnerabilities
2. Performance bottlenecks
3. Theological accuracy (for content features)
4. User experience implications
5. Test coverage of new code
6. Adherence to architecture patterns

**Review response time**: 24-48 hours for code, 1-2 weeks for theological content

## Performance Guidelines

**Backend**:
- Database queries: Use indexes, avoid N+1 queries, paginate large results
- Caching: Cache expensive operations in Redis (TTL: 5-60 min)
- API rate limiting: 100 req/min per user for reads, 20 req/min for writes
- Response time target: < 200ms for cached, < 1s for database queries

**Frontend**:
- Code splitting: Lazy load routes and heavy components
- Image optimization: WebP format, lazy loading, responsive images
- Bundle size: Keep initial bundle < 200KB gzipped
- Lighthouse score target: Performance > 90, Accessibility > 95

**Mobile**:
- Initial load: < 3 seconds on 3G connection
- Offline-first: Cache critical content locally
- Battery efficiency: Minimize background tasks
- APK size: < 25MB for initial download

## Accessibility (WCAG 2.1 AA)

**Required standards**:
- Semantic HTML: Use `<button>`, `<nav>`, `<main>`, `<article>` appropriately
- Keyboard navigation: All interactive elements accessible via Tab/Enter/Space
- Screen readers: Add `aria-label` for icon buttons, `alt` text for images
- Color contrast: Minimum 4.5:1 for text, 3:1 for large text
- Focus indicators: Visible focus outline on all interactive elements
- Text scaling: Support up to 200% zoom without horizontal scrolling

**Testing**:
```bash
# Run axe accessibility tests
npm run test:a11y
# Manual keyboard navigation check
# Manual screen reader check (NVDA/JAWS/VoiceOver)
```

## Internationalization (i18n)

**String externalization**:
```typescript
// Backend (i18next)
import i18n from '@/config/i18n';
const message = i18n.t('errors.notFound', { resource: 'Gospel' });

// Frontend (react-i18next)
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
<h1>{t('gospel.title')}</h1>

// Never hardcode strings
const title = "Daily Gospel"; // ❌ Bad
const title = t('gospel.daily'); // ✅ Good
```

**Supported languages** (Phase 1: English, Phase 2+: Spanish, Portuguese):
- Store translations in `/locales/{lang}/translation.json`
- Use ICU MessageFormat for plurals: `{count, plural, one {# reflection} other {# reflections}}`
- Date/time formatting: Use `Intl.DateTimeFormat` with user's locale
- Right-to-left (RTL) support: Defer to Phase 3 (Arabic)

## Development Workflow

**Branches**:
- `main` = production | `develop` = integration | `feature/*` = new work | `fix/*` = bug fixes

**Commits**: Use Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`)

**PR process**:
1. Branch from `develop`
2. Implement with tests
3. Lint + test locally
4. PR with user story reference
5. CI passes + code review
6. Merge to `develop`

## Key Documentation Map

**When implementing features**:
1. `TECHNICAL_ROADMAP.md` - Sprint-by-sprint tasks with code examples
2. `docs/sdlc/SOFTWARE_ARCHITECT.md` - Architecture patterns, schemas, API specs
3. `PROJECT_STRUCTURE.md` - Directory conventions and module organization

**For context**:
- `EXECUTIVE_SUMMARY.md` - Business goals and user personas
- `docs/product-backlog/epics/*.md` - User stories and acceptance criteria
- `DOCUMENTATION_INDEX.md` - Complete navigation guide

## Common Mistakes to Avoid

❌ Creating implementation code without user confirmation (this is a planning repo)  
❌ Storing user data in MongoDB or content in PostgreSQL (wrong database)  
❌ Skipping theological review metadata for spiritual content  
❌ Using Firebase for backend database (only for mobile auth)  
❌ Making architectural decisions without creating ADR in `docs/architecture/adr/`  
❌ Committing `.env` files or secrets to version control  
❌ Hardcoding strings instead of using i18n  
❌ Skipping error handling in async functions  
❌ Writing tests after code instead of TDD approach  
❌ Forgetting to add accessibility attributes (aria-label, alt text)  
❌ Not testing on mobile viewports/devices  
❌ Using `any` type in TypeScript (use proper types or `unknown`)

## Git Workflow

**Branch naming**:
```bash
feature/EP-123-daily-gospel-audio    # New features (EP = Eucharist Platform ticket)
fix/EP-456-login-redirect-bug        # Bug fixes
refactor/cleanup-auth-service        # Code improvements
docs/update-api-documentation        # Documentation only
test/add-gospel-service-tests        # Test additions
```

**Commit frequently**:
- Commit after each logical unit of work (not end of day)
- Each commit should leave code in working state
- Use `git rebase -i` to clean up commits before PR

**Pre-push checklist**:
```bash
npm run lint          # Fix linting issues
npm test              # All tests pass
npm run build         # No build errors
git diff --check      # No whitespace errors
```

## Quick Command Reference (Future)

```bash
# These commands don't exist yet—project has no implementation code
# Backend: npm run dev | test | lint | build
# Frontend: npm run dev | test | build  
# Mobile: flutter run | test | build apk
```

---

**Last Updated**: November 6, 2025  
**Questions?** Check `CONTRIBUTING.md` or `DOCUMENTATION_INDEX.md`
