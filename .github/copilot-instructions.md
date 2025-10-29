# GitHub Copilot Instructions - Eucharist Platform

## Project Overview

**Mission**: Catholic education platform helping people understand and live the Eucharist  
**Status**: Discovery phase complete, Phase 1 (Foundation/MVP) starting  
**Stack**: React/Next.js + Node.js/Express backend, Flutter mobile (future), PostgreSQL + MongoDB  
**Stage**: Planning and documentation phase - no implementation code exists yet

## Critical Context for AI Agents

### 1. Documentation-First Architecture

This repository is **currently documentation-only**. All implementation guidance exists in planning documents:

- **Architecture decisions**: See `docs/sdlc/SOFTWARE_ARCHITECT.md` (1,400+ lines) and `docs/architecture/adr/`
- **Implementation roadmap**: `TECHNICAL_ROADMAP.md` has sprint-by-sprint technical tasks with code examples
- **Project structure**: `PROJECT_STRUCTURE.md` defines the planned directory layout (not yet created)
- **Role responsibilities**: `docs/sdlc/` contains PM, Product Owner, and Architect handbooks

**When generating code**: Reference the architectural patterns and examples in `TECHNICAL_ROADMAP.md` sections matching the feature being built.

### 2. Three-Layer Architecture Pattern

```
Presentation Layer (React/Flutter)
    ↓
Business Logic Layer (Services)
    ↓
Data Layer (Repositories → Database)
```

**Mobile (Flutter)**: Uses clean architecture with `/data`, `/domain`, `/presentation` layers  
**Web Frontend**: Component-based with `/components`, `/pages`, `/hooks`, `/services`  
**Backend**: Controller → Service → Repository pattern with `/controllers`, `/services`, `/models`

See `PROJECT_STRUCTURE.md` lines 1-100 for complete directory conventions.

### 3. Tech Stack Specifics

**Backend** (Node.js/TypeScript):
- Express with TypeScript
- JWT authentication (not Firebase Auth for backend)
- PostgreSQL for structured data (users, prayers, progress)
- MongoDB for content (articles, reflections, educational material)
- Redis for caching and sessions

**Frontend** (React):
- Next.js 14 with TypeScript
- Zustand (state management), React Query (server state)
- Tailwind CSS + Headless UI
- React Hook Form + Zod validation

**Mobile** (Flutter - future phase):
- Provider/Riverpod for state
- Clean architecture pattern
- See `docs/sdlc/SOFTWARE_ARCHITECT.md` lines 200-250 for Flutter specifics

### 4. Database Schema Conventions

**PostgreSQL** (relational data):
- Users, authentication, prayer intentions, user progress
- Foreign key relationships, ACID transactions
- Schema examples in `docs/sdlc/SOFTWARE_ARCHITECT.md` lines 400-600

**MongoDB** (flexible content):
- Educational articles, daily reflections, Eucharistic miracles
- Rich text with metadata, multilingual support
- Document structure examples in `docs/sdlc/SOFTWARE_ARCHITECT.md` lines 600-800

**Never mix concerns**: User data → PostgreSQL, Content → MongoDB

### 5. Content Management Requirements

All educational/spiritual content must:
- Be stored in Markdown format in `content/` directory initially
- Include theological review metadata (`reviewedBy`, `reviewDate`, `magisteriumRefs`)
- Support multilingual content (English primary, Spanish/Portuguese future)
- Follow content guidelines in `CONTRIBUTING.md` lines 50-150

**Example content structure**:
```markdown
---
title: "Understanding the Real Presence"
category: "eucharist-basics"
reviewedBy: "Fr. John Doe"
reviewDate: "2025-10-15"
magisteriumRefs: ["CCC 1373-1377"]
---
```

### 6. API Design Patterns

**RESTful conventions** (from `TECHNICAL_ROADMAP.md`):
- `/api/auth/*` - Authentication endpoints
- `/api/gospel/*` - Daily Gospel and reflections
- `/api/education/*` - Educational content
- `/api/community/*` - Community features
- `/api/users/*` - User profile and progress

**Response format**:
```typescript
{
  success: boolean;
  data?: any;
  error?: { message: string; code: string };
  meta?: { page, limit, total };
}
```

See `docs/sdlc/SOFTWARE_ARCHITECT.md` lines 800-900 for complete API specifications.

### 7. Testing Strategy

**Required coverage** (per ADR-005):
- Unit tests: Jest for backend, Jest/React Testing Library for frontend
- Integration tests: Supertest for API endpoints
- E2E tests: Playwright/Cypress for critical user flows
- Minimum 80% code coverage before PR approval

**Test file location**: Co-locate with source (`*.test.ts` next to `*.ts`)

### 8. CI/CD Pipeline

**GitHub Actions** (see `docs/architecture/adr/ADR-005-cicd-github-actions.md`):
- Lint → Test → Security scan → Build → Deploy
- Runs on push to `main`/`develop` and all PRs
- Separate pipelines for web, backend, and mobile
- Staging deploys from `develop`, production from `main`

**Pre-commit requirements**: ESLint, Prettier, TypeScript compilation, tests pass

### 9. Security Requirements

**Authentication**: JWT tokens with refresh token rotation  
**Password storage**: bcrypt with salt rounds ≥ 12  
**API security**: Helmet.js, CORS configuration, rate limiting (express-rate-limit)  
**Data validation**: Zod schemas for all API inputs  
**Environment secrets**: Never commit `.env` files

See `docs/sdlc/SOFTWARE_ARCHITECT.md` lines 1000-1100 for security architecture.

### 10. Development Workflow

**Branch strategy**:
- `main` - production-ready code
- `develop` - integration branch
- `feature/*` - new features
- `fix/*` - bug fixes

**Commit messages**: Follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`)

**PR process**:
1. Create feature branch from `develop`
2. Implement with tests
3. Run linters and tests locally
4. Submit PR with description referencing user story
5. Pass CI checks + code review
6. Merge to `develop`

See `CONTRIBUTING.md` for complete contribution guidelines.

## Key Reference Documents

**Start here for any task**:
- Architecture guidance: `docs/sdlc/SOFTWARE_ARCHITECT.md`
- Implementation details: `TECHNICAL_ROADMAP.md`
- Project structure: `PROJECT_STRUCTURE.md`
- API specifications: `docs/architecture/api-specification-template.md`

**Role-specific context**:
- PM workflows: `docs/sdlc/PROJECT_MANAGER.md`
- Product requirements: `docs/sdlc/PRODUCT_OWNER.md`
- User stories: `docs/product-backlog/epics/*.md`

**Documentation index**: `DOCUMENTATION_INDEX.md` provides comprehensive navigation

## Common Pitfalls to Avoid

1. **Don't create code yet**: This is a planning/discovery repo. Confirm with user before implementing.
2. **Don't ignore theological requirements**: All content needs review metadata.
3. **Don't mix database concerns**: PostgreSQL for users/data, MongoDB for content.
4. **Don't skip ADRs**: Major decisions require Architecture Decision Records in `docs/architecture/adr/`.
5. **Don't use Firebase for everything**: Only for authentication, not for database or hosting.

## Quick Command Reference

**Not yet implemented** - The following will be available once code exists:

```bash
# Backend (future)
npm run dev              # Start dev server
npm run test            # Run tests
npm run lint            # Lint code
npm run build           # Build for production

# Frontend (future)
npm run dev             # Start Next.js dev
npm run test           # Run tests
npm run build          # Production build

# Mobile (future)
flutter run            # Run on device/emulator
flutter test          # Run tests
flutter build apk     # Android build
```

---

**Last Updated**: October 28, 2025  
**For questions**: See `CONTRIBUTING.md` or open a GitHub Discussion
