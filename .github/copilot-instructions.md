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

## Security Checklist

- JWT tokens with 15-min access + 7-day refresh rotation
- bcrypt password hashing (≥12 salt rounds)
- Helmet.js for HTTP headers, express-rate-limit for throttling
- Zod validation for all API inputs
- Never commit `.env` files
- Firebase Auth for mobile only (not backend database)

Details: `docs/sdlc/SOFTWARE_ARCHITECT.md` lines 1000-1100

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

## Quick Command Reference (Future)

```bash
# These commands don't exist yet—project has no implementation code
# Backend: npm run dev | test | lint | build
# Frontend: npm run dev | test | build  
# Mobile: flutter run | test | build apk
```

---

**Last Updated**: October 29, 2025  
**Questions?** Check `CONTRIBUTING.md` or `DOCUMENTATION_INDEX.md`
