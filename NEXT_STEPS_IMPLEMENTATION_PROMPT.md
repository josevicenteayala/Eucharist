# Next Steps Implementation Prompt

## For: Building the Eucharist Understanding Platform

**Document Version**: 1.0  
**Created**: November 2, 2025  
**Status**: Ready for Implementation  
**Target Phase**: Phase 1 - Foundation (MVP)

---

## 🎯 Mission Brief

You are tasked with implementing the **Eucharist Understanding Platform**, a Catholic education platform helping people understand and live the Eucharist through accessible technology. This is a **documentation-only repository** - **NO CODE HAS BEEN WRITTEN YET**. Your job is to transform comprehensive planning into working software.

---

## 📋 Current Status

### What's Complete ✅

- ✅ **Discovery Phase**: Complete requirements, user research, and planning
- ✅ **Architecture Design**: Full system architecture, database schemas, API design
- ✅ **Technical Roadmap**: Sprint-by-sprint implementation plan (12 months)
- ✅ **Documentation**: 40+ markdown files with ~40,000 words of guidance
- ✅ **SDLC Processes**: Role definitions, coordination plans, review processes
- ✅ **Product Backlog**: User stories, epics, acceptance criteria

### What's Missing ❌

- ❌ **NO implementation code exists** (backend, frontend, mobile)
- ❌ **NO databases set up** (PostgreSQL, MongoDB, Redis)
- ❌ **NO development environment** configured
- ❌ **NO CI/CD pipelines** implemented
- ❌ **NO content written** (articles, reflections, prayers)

---

## 🚀 Your Primary Mission

**START BUILDING SPRINT 1 OF PHASE 1 (WEEKS 1-2): PROJECT SETUP & CORE INFRASTRUCTURE**

You will set up the foundational technical infrastructure for the platform according to the detailed specifications in the existing documentation.

---

## 📖 Essential Documentation to Read FIRST

**CRITICAL - Read these in order before coding:**

1. **[.github/copilot-instructions.md](.github/copilot-instructions.md)** (5 min)
   - Platform-specific guidelines for coding
   - Architecture patterns and conventions
   - Common mistakes to avoid

2. **[TECHNICAL_ROADMAP.md](docs/TECHNICAL_ROADMAP.md)** - Sprint 1 Section (15 min)
   - Lines 46-175: Sprint 1 detailed tasks
   - Backend setup checklist
   - Frontend setup checklist
   - Database schema (lines 115-167)

3. **[docs/sdlc/SOFTWARE_ARCHITECT.md](docs/sdlc/SOFTWARE_ARCHITECT.md)** (20 min)
   - Lines 44-300: System architecture
   - Lines 400-800: Database schemas (PostgreSQL & MongoDB)
   - Lines 800-950: API design patterns
   - Lines 1000-1100: Security architecture

4. **[PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)** (10 min)
   - Lines 1-200: Directory structure and organization
   - Module organization patterns

5. **[docs/architecture/coordination/implementation-checklist.md](docs/architecture/coordination/implementation-checklist.md)** (10 min)
   - Sprint 1 implementation checklist (lines 46-175)

**Total reading time: ~60 minutes - DO NOT SKIP THIS**

---

## 🔨 Sprint 1 Implementation Tasks

### Phase: Project Setup & Core Infrastructure (Weeks 1-2)

You must implement **ALL** of the following tasks according to specifications:

---

### 1. Backend Setup (Node.js + Express + TypeScript)

**Directory**: `/web/backend/`

#### Required Tasks:

```bash
✅ Initialize Node.js project with TypeScript
✅ Set up Express server
✅ Configure environment variables (.env.example template)
✅ Set up logging with Winston
✅ Configure CORS and security headers (Helmet.js)
✅ Set up database connections (PostgreSQL + MongoDB + Redis)
✅ Create base error handling middleware
✅ Configure ESLint and Prettier
✅ Create health check endpoint: GET /api/health
✅ Set up project structure following PROJECT_STRUCTURE.md
```

#### Technical Requirements:

- **TypeScript**: Use strict mode, all types defined
- **Express**: Version 4.x with async/await patterns
- **Port**: 3000 for development
- **Environment**: Development, staging, production configs
- **Error Handling**: Centralized error middleware
- **Logging**: Structured logging with Winston (JSON format)

#### Key Files to Create:

```
web/backend/
├── src/
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Server entry point
│   ├── config/
│   │   ├── database.ts     # DB connection configs
│   │   └── environment.ts  # Environment variables
│   ├── middleware/
│   │   ├── errorHandler.ts # Error handling
│   │   └── logger.ts       # Logging middleware
│   ├── routes/
│   │   └── index.ts        # Route aggregator
│   └── utils/
│       └── logger.ts       # Winston logger setup
├── package.json
├── tsconfig.json
├── .env.example
├── .eslintrc.json
└── .prettierrc
```

#### Code Example (from TECHNICAL_ROADMAP.md lines 69-94):

See `TECHNICAL_ROADMAP.md` for complete implementation patterns.

---

### 2. Frontend Setup (React + TypeScript + Vite/Next.js)

**Directory**: `/web/frontend/`

#### Required Tasks:

```bash
✅ Create React app with TypeScript (use Vite or Next.js 14)
✅ Set up React Router (or Next.js App Router)
✅ Configure Tailwind CSS
✅ Set up Axios for API calls
✅ Create base layout components
✅ Configure environment variables
✅ Set up ESLint and Prettier
✅ Configure build pipeline
✅ Create design system foundations
```

#### Technical Requirements:

- **React**: Version 18+ with TypeScript
- **Styling**: Tailwind CSS v3+
- **State Management**: Zustand or React Query (see ADRs)
- **Port**: 5173 (Vite) or 3001 (Next.js)
- **API Client**: Axios with interceptors
- **Routing**: React Router v6 or Next.js App Router

#### Key Files to Create:

```
web/frontend/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   └── ui/
│   ├── pages/
│   ├── services/
│   │   └── api.ts          # Axios setup
│   ├── hooks/
│   ├── styles/
│   │   └── index.css       # Tailwind imports
│   └── utils/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts (or next.config.js)
└── .env.example
```

---

### 3. Database Setup

#### PostgreSQL Schema (Primary Database)

**Purpose**: User data, authentication, prayer intentions, progress tracking

Create the following tables (exact schema in `TECHNICAL_ROADMAP.md` lines 115-167):

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  display_name VARCHAR(100),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles table
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  bio TEXT,
  location VARCHAR(100),
  interests TEXT[],
  prayer_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  preferences JSONB
);

-- Gospel readings table
CREATE TABLE gospel_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  liturgical_season VARCHAR(50),
  first_reading TEXT,
  first_reading_citation VARCHAR(100),
  psalm TEXT,
  psalm_citation VARCHAR(100),
  second_reading TEXT,
  second_reading_citation VARCHAR(100),
  gospel TEXT NOT NULL,
  gospel_citation VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reflections table
CREATE TABLE reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gospel_reading_id UUID REFERENCES gospel_readings(id),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**See `docs/sdlc/SOFTWARE_ARCHITECT.md` lines 400-600 for complete schema with indexes**

#### MongoDB Collections (Content Database)

**Purpose**: Educational articles, flexible content, multilingual support

Key collections to create:

1. **articles** - Educational content
2. **miracles** - Eucharistic miracle stories
3. **prayers** - Prayer texts and resources

**See `docs/sdlc/SOFTWARE_ARCHITECT.md` lines 600-700 for complete schemas**

#### Redis Setup

**Purpose**: Session storage, caching, rate limiting

- Session TTL: 7 days
- Cache TTL: Varies by content type (1 hour to 24 hours)

---

### 4. Development Environment & Tooling

#### Docker Compose Setup

Create `docker-compose.yml` for local development:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: eucharist_dev
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongodb:
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: dev_user
      MONGO_INITDB_ROOT_PASSWORD: dev_password
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  mongo_data:
  redis_data:
```

#### Environment Files

Create `.env.example` files for both backend and frontend with all required variables.

**Backend Example**:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://dev_user:dev_password@localhost:5432/eucharist_dev
MONGODB_URI=mongodb://dev_user:dev_password@localhost:27017/eucharist_content
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

---

### 5. CI/CD Pipeline (GitHub Actions)

**File**: `.github/workflows/ci.yml`

Based on **ADR-005** (docs/architecture/adr/ADR-005-cicd-github-actions.md):

```yaml
name: CI Pipeline

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run ESLint
        run: npm run lint
      - name: Run Prettier
        run: npm run format:check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
```

---

### 6. Code Quality Standards

#### ESLint Configuration

Use TypeScript ESLint with recommended rules:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": "warn"
  }
}
```

#### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

---

## 🧪 Testing Requirements

### Minimum Standards (ADR-005):

- **Unit test coverage**: 80% minimum
- **Co-locate tests**: `*.test.ts` next to `*.ts` files
- **Framework**: Jest for backend, Jest + React Testing Library for frontend

### Sprint 1 Testing Tasks:

```bash
✅ Set up Jest configuration
✅ Create test utilities and helpers
✅ Write tests for health check endpoint
✅ Write tests for error handling middleware
✅ Create sample component tests (if components exist)
✅ Configure coverage reporting
```

---

## 🔒 Security Checklist

**CRITICAL - Must implement from Day 1:**

- ✅ **Environment Variables**: Never commit `.env` files
- ✅ **Helmet.js**: HTTP security headers
- ✅ **CORS**: Properly configured origins
- ✅ **Rate Limiting**: Express-rate-limit on all endpoints
- ✅ **Input Validation**: Zod or Joi for all API inputs
- ✅ **Password Hashing**: bcrypt with ≥12 salt rounds
- ✅ **SQL Injection**: Use parameterized queries (pg/Sequelize)
- ✅ **XSS Protection**: Sanitize all user inputs
- ✅ **Dependencies**: Run `npm audit` in CI/CD

**Reference**: `docs/sdlc/SOFTWARE_ARCHITECT.md` lines 1000-1100

---

## 📚 Sprint 1 Acceptance Criteria

Before considering Sprint 1 complete, verify:

### Backend Checklist:

- [ ] Express server runs without errors on `http://localhost:3000`
- [ ] Health check endpoint responds: `GET /api/health` returns 200 OK
- [ ] PostgreSQL connection established and verified
- [ ] MongoDB connection established and verified
- [ ] Redis connection established and verified
- [ ] Error handling catches and formats errors correctly
- [ ] Logging outputs structured JSON logs
- [ ] ESLint passes with no errors
- [ ] Prettier formatting is consistent
- [ ] Environment variables loaded from `.env`
- [ ] All database tables created with correct schema
- [ ] Database indexes created (see schema)

### Frontend Checklist:

- [ ] React app loads in browser on `http://localhost:5173` or `3001`
- [ ] Basic layout renders (Header, Footer, main content area)
- [ ] Tailwind CSS styles apply correctly
- [ ] API client configured and can call backend health endpoint
- [ ] Routing works (at least home page)
- [ ] ESLint passes with no errors
- [ ] Prettier formatting is consistent
- [ ] Environment variables loaded
- [ ] Build process completes successfully (`npm run build`)

### Infrastructure Checklist:

- [ ] Docker Compose brings up all services
- [ ] Can connect to all databases from backend
- [ ] CI/CD pipeline runs successfully on GitHub
- [ ] Linting job passes
- [ ] Testing job passes (even if just sample tests)
- [ ] Build job completes

### Documentation Checklist:

- [ ] README.md updated with setup instructions
- [ ] Developer onboarding guide created
- [ ] API endpoint documentation started
- [ ] Architecture diagrams up to date

---

## ⚠️ Critical Guidelines

### DO:

✅ Follow the **THREE-LAYER PATTERN**: Presentation → Service → Repository  
✅ Use **TypeScript strict mode** everywhere  
✅ Follow **naming conventions** in PROJECT_STRUCTURE.md  
✅ Implement **comprehensive error handling**  
✅ Write **tests as you code** (TDD encouraged)  
✅ Use **async/await** patterns (no callbacks)  
✅ Follow **RESTful API conventions**  
✅ Commit frequently with **Conventional Commits** (`feat:`, `fix:`, `docs:`)  
✅ Reference **ADRs** for architectural decisions

### DON'T:

❌ Mix database concerns (users in PostgreSQL, content in MongoDB)  
❌ Store secrets in code or commit `.env` files  
❌ Skip security measures (even in development)  
❌ Use `any` type in TypeScript  
❌ Create implementation code without reading docs first  
❌ Skip writing tests  
❌ Make architectural changes without creating ADR  
❌ Use Firebase for backend database (only for mobile auth in Phase 2)

---

## 📊 Definition of Done (Sprint 1)

Sprint 1 is **DONE** when:

1. ✅ All backend setup tasks completed and verified
2. ✅ All frontend setup tasks completed and verified
3. ✅ All three databases running and accessible
4. ✅ Docker Compose environment working
5. ✅ CI/CD pipeline green on GitHub Actions
6. ✅ Code quality tools (ESLint, Prettier) configured and passing
7. ✅ Basic tests written and passing (health check minimum)
8. ✅ Documentation updated (README, setup guide)
9. ✅ Can run full stack locally with one command
10. ✅ Team can onboard and run locally following docs

---

## 🎯 After Sprint 1: What's Next?

Once Sprint 1 is complete, you'll move to **Sprint 2: Authentication & User Management (Weeks 3-4)**

Preview of Sprint 2 tasks:

- Implement user registration endpoint
- Implement login with JWT
- Password reset flow
- Email verification
- User profile endpoints
- Protected routes middleware

**See TECHNICAL_ROADMAP.md lines 176-275 for Sprint 2 details**

---

## 🆘 Help & Resources

### If You Get Stuck:

1. **Search documentation** using your IDE (`Ctrl+Shift+F`)
2. **Check examples** in TECHNICAL_ROADMAP.md
3. **Review patterns** in SOFTWARE_ARCHITECT.md
4. **Reference ADRs** for why decisions were made
5. **Create GitHub Issue** if you find gaps in documentation

### Key Documentation Map:

| Need                  | Document              | Lines          |
| --------------------- | --------------------- | -------------- |
| Architecture patterns | SOFTWARE_ARCHITECT.md | 44-300         |
| Database schemas      | SOFTWARE_ARCHITECT.md | 400-800        |
| API design            | SOFTWARE_ARCHITECT.md | 800-950        |
| Sprint 1 tasks        | TECHNICAL_ROADMAP.md  | 46-175         |
| Sprint 2 tasks        | TECHNICAL_ROADMAP.md  | 176-275        |
| Code examples         | TECHNICAL_ROADMAP.md  | 69-94, 199-245 |
| Directory structure   | PROJECT_STRUCTURE.md  | 1-200          |
| Security requirements | SOFTWARE_ARCHITECT.md | 1000-1100      |
| CI/CD specs           | ADR-005               | Full document  |

---

## 🙏 Remember the Mission

You're not just building software - you're creating a platform to help people encounter Christ more deeply in the Eucharist. Every line of code serves this sacred mission.

**"The Eucharist is the source and summit of the Christian life."** - Second Vatican Council, Lumen Gentium

Write clean, maintainable, secure code that will serve this mission for years to come.

---

## ✅ Your Immediate Action Plan

**RIGHT NOW - Do this in order:**

1. **Read this entire document** (you're here - good!)
2. **Read .github/copilot-instructions.md** (5 min)
3. **Read TECHNICAL_ROADMAP.md Sprint 1 section** (15 min)
4. **Skim SOFTWARE_ARCHITECT.md** for architecture understanding (20 min)
5. **Clone the repository** (if not already done)
6. **Create feature branch**: `git checkout -b feature/sprint-1-setup`
7. **Start with backend setup** following task list above
8. **Set up Docker Compose** for databases
9. **Create frontend** following task list above
10. **Set up CI/CD** pipeline
11. **Verify all acceptance criteria** are met
12. **Update documentation** with actual setup steps
13. **Commit and push** with proper commit messages
14. **Create Pull Request** referencing this prompt
15. **Celebrate** - Sprint 1 is a huge milestone! 🎉

---

**Document End**

**Questions?** Review documentation or create GitHub Issue  
**Ready to build?** Start with backend setup - God bless your work! ✝️

---

**Version**: 1.0  
**Last Updated**: November 2, 2025  
**Next Review**: After Sprint 1 completion  
**Maintained By**: Software Architect
