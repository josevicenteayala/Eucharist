# Software Architect Role - Eucharist Platform

## Role Overview

As the Software Architect for the Eucharist Understanding Platform, you are responsible for defining and guiding the technical vision, architecture, and engineering standards. You ensure the platform is scalable, maintainable, secure, and built on solid technical foundations that support the mission of helping people understand and live the Eucharist.

## Core Responsibilities

### 1. Architecture Design & Evolution
- Define overall system architecture
- Design component interactions and data flows
- Ensure architectural consistency across platform
- Plan for scalability and performance
- Evolve architecture as needs change

### 2. Technology Stack Selection
- Evaluate and recommend technologies
- Balance innovation with stability
- Consider team capabilities
- Document technology decisions (ADRs)
- Keep abreast of industry trends

### 3. Technical Standards & Governance
- Define coding standards and best practices
- Establish development workflows
- Set up CI/CD pipelines
- Define testing strategies
- Ensure security best practices

### 4. Team Technical Leadership
- Mentor developers on architecture
- Review critical code and designs
- Resolve technical disputes
- Foster engineering excellence
- Facilitate technical discussions

### 5. Integration & Infrastructure
- Design API contracts
- Plan database schemas
- Define deployment strategies
- Set up monitoring and observability
- Ensure system reliability

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                               │
│    (Web Browsers, iOS App, Android App)                    │
└─────────────┬───────────────────────────────────┬──────────┘
              │                                   │
              ▼                                   ▼
    ┌──────────────────┐              ┌──────────────────┐
    │   Web Frontend   │              │   Mobile App     │
    │   (React/Next)   │              │   (Flutter)      │
    └────────┬─────────┘              └────────┬─────────┘
             │                                 │
             │         ┌───────────────────┐   │
             └────────►│   API Gateway     │◄──┘
                       │   (Load Balancer) │
                       └────────┬──────────┘
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
                 ▼              ▼              ▼
        ┌────────────┐  ┌────────────┐  ┌────────────┐
        │   Auth     │  │  Content   │  │ Community  │
        │  Service   │  │  Service   │  │  Service   │
        └──────┬─────┘  └──────┬─────┘  └──────┬─────┘
               │                │                │
               └────────────────┼────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
          ┌──────────────────┐    ┌──────────────────┐
          │   PostgreSQL     │    │    MongoDB       │
          │ (Structured Data)│    │ (Content/Docs)   │
          └──────────────────┘    └──────────────────┘
                    │                       │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌──────────────────┐
                    │   Redis Cache    │
                    └──────────────────┘

        External Services:
        ┌────────────┐  ┌────────────┐  ┌────────────┐
        │  Firebase  │  │   Email    │  │   CDN      │
        │    Auth    │  │  Service   │  │ (Images)   │
        └────────────┘  └────────────┘  └────────────┘
```

### Architecture Principles

**1. Separation of Concerns**
- Clear boundaries between layers
- Single Responsibility Principle
- Loose coupling, high cohesion

**2. Scalability**
- Horizontal scaling capability
- Stateless services where possible
- Efficient caching strategies
- Database optimization

**3. Maintainability**
- Clean, readable code
- Comprehensive documentation
- Consistent patterns
- Automated testing

**4. Security**
- Defense in depth
- Principle of least privilege
- Data encryption
- Regular security audits

**5. Performance**
- Optimize critical paths
- Minimize latency
- Efficient data access
- Progressive enhancement

## Technology Stack

### Frontend Technologies

#### Web Application
```javascript
// Core Framework
- React 18+ (Component-based UI)
- Next.js 14 (SSR, SEO, routing)
- TypeScript (Type safety)

// State Management
- Zustand (Lightweight state)
- React Query (Server state)

// UI Framework
- Tailwind CSS (Utility-first styling)
- Headless UI (Accessible components)
- Framer Motion (Animations)

// Forms & Validation
- React Hook Form
- Zod (Schema validation)

// API Communication
- Axios (HTTP client)
- GraphQL (if needed later)

// Build & Dev Tools
- Vite (Fast dev server)
- ESLint + Prettier (Code quality)
- Vitest (Unit testing)
- Playwright (E2E testing)
```

**Rationale**:
- React/Next.js: Industry standard, great SEO, large community
- TypeScript: Catch errors early, better IDE support
- Tailwind: Rapid development, consistent design
- React Query: Handles server state complexity well

#### Mobile Application
```dart
// Framework
- Flutter 3.16+ (Cross-platform)
- Dart (Programming language)

// State Management
- Provider or Riverpod

// Networking
- Dio (HTTP client)
- Retrofit (Type-safe API)

// Local Storage
- SharedPreferences (Settings)
- Hive or SQLite (Data cache)

// Firebase
- Firebase Auth
- Firebase Messaging (Push)
- Firebase Analytics

// UI Components
- Material Design 3
- Custom design system

// Testing
- flutter_test (Unit tests)
- integration_test (E2E)
```

**Rationale**:
- Flutter: Single codebase for iOS/Android, excellent performance
- Native feel with cross-platform efficiency
- Large widget library, good documentation
- Strong Google/community support

### Backend Technologies

#### API Server
```javascript
// Runtime & Framework
- Node.js 20+ LTS
- Express.js 4+ (Web framework)
- TypeScript (Type safety)

// Authentication
- JSON Web Tokens (JWT)
- Passport.js (Strategies)
- bcryptjs (Password hashing)

// Database
- Sequelize (PostgreSQL ORM)
- Mongoose (MongoDB ODM)
- Redis client (Caching)

// Validation
- Joi or Zod (Schema validation)
- express-validator

// Security
- Helmet (Security headers)
- CORS (Cross-origin)
- Rate limiting
- Input sanitization

// Logging & Monitoring
- Winston (Logging)
- Morgan (HTTP logging)
- Sentry (Error tracking)

// Testing
- Jest (Unit testing)
- Supertest (API testing)

// Documentation
- Swagger/OpenAPI
```

**Rationale**:
- Node.js: JavaScript full-stack, async I/O efficient
- Express: Lightweight, flexible, well-known
- TypeScript: Type safety across stack
- Modular architecture for maintainability

### Databases

#### PostgreSQL (Structured Data)
```sql
-- Use Cases:
- User accounts and authentication
- User profiles and preferences
- Prayer intentions
- Bookmarks and progress tracking
- Relational data requiring ACID

-- Why PostgreSQL:
- ACID compliance
- Complex queries with joins
- Data integrity constraints
- Excellent performance
- JSON support for flexibility
```

#### MongoDB (Content & Documents)
```javascript
// Use Cases:
- Educational articles (flexible schema)
- Gospel readings and reflections
- Eucharistic miracle stories
- Historical timeline events
- Content with varying structures

// Why MongoDB:
- Flexible document schema
- Fast read performance
- Easy content versioning
- Natural fit for CMS
- Horizontal scaling
```

#### Redis (Caching & Sessions)
```javascript
// Use Cases:
- Session storage
- API response caching
- Daily Gospel caching
- Rate limiting
- Real-time features (future)

// Why Redis:
- In-memory speed
- Built-in data structures
- TTL (Time To Live) support
- Pub/sub capabilities
- Session storage
```

### Infrastructure & DevOps

#### Cloud Provider
```yaml
Recommended: AWS or Google Cloud

Services Used:
- Compute: EC2/ECS or Cloud Run
- Database: RDS (PostgreSQL), Atlas (MongoDB)
- Storage: S3 or Cloud Storage
- CDN: CloudFront or Cloud CDN
- DNS: Route 53 or Cloud DNS
- Email: SES or SendGrid
- Monitoring: CloudWatch or Cloud Monitoring
```

#### CI/CD Pipeline
```yaml
# GitHub Actions
name: CI/CD Pipeline

Stages:
  1. Lint & Format Check
  2. Unit Tests
  3. Integration Tests
  4. Build
  5. Security Scan
  6. Deploy to Staging
  7. E2E Tests (Staging)
  8. Deploy to Production (Manual approval)
  9. Post-deployment Tests
  10. Rollback (if needed)
```

#### Containerization
```dockerfile
# Docker for consistent environments
- Backend: Node.js image
- Frontend: Node.js build + Nginx serve
- Database: Official images for local dev
- Redis: Official image

# Docker Compose for local development
# Kubernetes for production (if scale requires)
```

## Architecture Decision Records (ADRs)

### ADR Template
```markdown
# ADR-[Number]: [Title]

**Status**: Proposed | Accepted | Superseded | Deprecated
**Date**: YYYY-MM-DD
**Deciders**: [Names]

## Context
What is the issue we're trying to solve?

## Decision
What did we decide to do?

## Consequences
What are the trade-offs?
- Positive:
- Negative:
- Neutral:

## Alternatives Considered
What other options did we evaluate?

## References
Links to discussions, documentation, etc.
```

### ADR-001: Use React + Next.js for Web Frontend

**Status**: Accepted  
**Date**: 2025-10-18

**Context**: Need to choose web frontend framework that provides good SEO, developer experience, and performance.

**Decision**: Use React 18+ with Next.js 14 and TypeScript.

**Consequences**:
- ✅ Excellent SEO with SSR
- ✅ Large talent pool
- ✅ Rich ecosystem
- ✅ Great developer experience
- ⚠️ Learning curve for SSR concepts
- ⚠️ Bundle size management needed

**Alternatives**: Vue.js, Angular, Svelte
- Vue: Smaller ecosystem, less SEO tooling
- Angular: Steeper learning curve, heavier
- Svelte: Smaller community, newer

### ADR-002: Use Flutter for Mobile Apps

**Status**: Accepted  
**Date**: 2025-10-18

**Context**: Need cross-platform mobile framework that performs well and reduces development time.

**Decision**: Use Flutter with Dart.

**Consequences**:
- ✅ Single codebase for iOS/Android
- ✅ Native performance
- ✅ Rich UI components
- ✅ 40% faster development than native
- ⚠️ Larger app size than native
- ⚠️ Team needs to learn Dart

**Alternatives**: React Native, Native Development
- React Native: Good but less performant, more platform-specific code
- Native: Better performance but 2x development cost

### ADR-003: Use PostgreSQL + MongoDB Hybrid

**Status**: Accepted  
**Date**: 2025-10-18

**Context**: Need database solution for both structured user data and flexible content.

**Decision**: Use PostgreSQL for relational data, MongoDB for content.

**Consequences**:
- ✅ Right tool for each job
- ✅ PostgreSQL for ACID compliance
- ✅ MongoDB for flexible content schema
- ⚠️ Two databases to manage
- ⚠️ Potential data sync complexity

**Alternatives**: PostgreSQL only, MongoDB only
- PostgreSQL only: JSON can work but less natural for CMS
- MongoDB only: Lacks strong relational capabilities

### ADR-004: JWT for Authentication

**Status**: Accepted  
**Date**: 2025-10-18

**Context**: Need secure, scalable authentication mechanism.

**Decision**: Use JWT (JSON Web Tokens) with refresh tokens.

**Consequences**:
- ✅ Stateless authentication
- ✅ Easily scalable
- ✅ Works across mobile and web
- ✅ Standard approach
- ⚠️ Token management complexity
- ⚠️ Must secure refresh token flow

**Alternatives**: Session-based, OAuth only
- Sessions: Requires sticky sessions or shared session store
- OAuth only: Doesn't solve our own user auth

## Database Design

### PostgreSQL Schema

#### Users & Authentication
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    display_name VARCHAR(100),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator', 'contributor')),
    email_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- User profiles
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    location VARCHAR(100),
    interests TEXT[],
    prayer_streak INTEGER DEFAULT 0,
    last_active_date DATE,
    preferences JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{
        "email": true,
        "push": true,
        "daily_gospel": true,
        "community": true
    }'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refresh tokens
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

#### Gospel & Reflections
```sql
-- Gospel readings
CREATE TABLE gospel_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE UNIQUE NOT NULL,
    liturgical_season VARCHAR(50) NOT NULL,
    liturgical_year CHAR(1) CHECK (liturgical_year IN ('A', 'B', 'C')),
    feast_day VARCHAR(100),
    first_reading TEXT NOT NULL,
    first_reading_citation VARCHAR(100) NOT NULL,
    responsorial_psalm TEXT NOT NULL,
    psalm_citation VARCHAR(100) NOT NULL,
    second_reading TEXT,
    second_reading_citation VARCHAR(100),
    gospel TEXT NOT NULL,
    gospel_citation VARCHAR(100) NOT NULL,
    gospel_acclamation TEXT,
    audio_url TEXT,
    source VARCHAR(50) DEFAULT 'USCCB',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gospel_date ON gospel_readings(date);
CREATE INDEX idx_gospel_season ON gospel_readings(liturgical_season);

-- Reflections (references MongoDB collection)
CREATE TABLE reflection_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gospel_reading_id UUID REFERENCES gospel_readings(id) ON DELETE CASCADE,
    mongo_doc_id VARCHAR(24) NOT NULL, -- MongoDB ObjectId
    author_id UUID REFERENCES users(id),
    published_at TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reflection_gospel ON reflection_metadata(gospel_reading_id);
CREATE INDEX idx_reflection_author ON reflection_metadata(author_id);
```

#### Community Features
```sql
-- Prayer intentions
CREATE TABLE prayer_intentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'answered', 'archived')),
    prayer_count INTEGER DEFAULT 0,
    is_moderated BOOLEAN DEFAULT false,
    moderated_by UUID REFERENCES users(id),
    moderated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_intentions_user ON prayer_intentions(user_id);
CREATE INDEX idx_intentions_status ON prayer_intentions(status);
CREATE INDEX idx_intentions_created ON prayer_intentions(created_at DESC);

-- Prayer logs (who prayed for what)
CREATE TABLE prayer_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intention_id UUID REFERENCES prayer_intentions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    prayed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prayer_logs_intention ON prayer_logs(intention_id);
CREATE INDEX idx_prayer_logs_user ON prayer_logs(user_id);
```

#### User Activity
```sql
-- Bookmarks
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('article', 'gospel', 'miracle', 'prayer')),
    content_id VARCHAR(100) NOT NULL, -- Could be UUID or MongoDB ObjectId
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_content ON bookmarks(content_type, content_id);

-- Progress tracking
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL,
    content_id VARCHAR(100) NOT NULL,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    completed_at TIMESTAMP,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_type, content_id)
);

CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_completed ON user_progress(completed_at);
```

### MongoDB Collections

#### Articles Collection
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String, // URL-friendly
  category: String, // "eucharist-basics", "mass-parts", "history", etc.
  tags: [String],
  difficulty: String, // "beginner", "intermediate", "advanced"
  author: {
    id: String, // PostgreSQL user UUID
    name: String,
    bio: String
  },
  content: String, // Markdown
  excerpt: String,
  coverImage: {
    url: String,
    alt: String,
    caption: String
  },
  readingTime: Number, // Minutes
  status: String, // "draft", "review", "published"
  theologicalReview: {
    reviewed: Boolean,
    reviewedBy: String,
    reviewedAt: Date,
    notes: String
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  relatedArticles: [ObjectId],
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date,
  version: Number,
  metadata: {
    views: Number,
    likes: Number,
    shares: Number,
    completions: Number,
    averageRating: Number,
    commentCount: Number
  }
}

// Indexes
db.articles.createIndex({ slug: 1 }, { unique: true });
db.articles.createIndex({ category: 1, status: 1 });
db.articles.createIndex({ tags: 1 });
db.articles.createIndex({ publishedAt: -1 });
db.articles.createIndex({ "author.id": 1 });
```

#### Reflections Collection
```javascript
{
  _id: ObjectId,
  gospelDate: Date,
  title: String,
  content: String, // Markdown
  author: {
    id: String,
    name: String
  },
  reflectionQuestions: [String],
  practicalApplication: String,
  prayerPrompt: String,
  audioUrl: String,
  status: String,
  theologicalReview: {
    reviewed: Boolean,
    reviewedBy: String,
    reviewedAt: Date
  },
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}

db.reflections.createIndex({ gospelDate: 1 }, { unique: true });
db.reflections.createIndex({ publishedAt: -1 });
```

#### Eucharistic Miracles Collection
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String,
  location: {
    city: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  date: {
    year: Number,
    month: Number,
    approximateDate: String
  },
  summary: String,
  fullStory: String, // Markdown
  scientificEvidence: {
    tested: Boolean,
    testingBody: String,
    findings: String,
    documentation: [String] // URLs
  },
  images: [{
    url: String,
    caption: String,
    credit: String
  }],
  sources: [{
    title: String,
    url: String,
    type: String // "book", "article", "video", "church-document"
  }],
  churchApproval: {
    approved: Boolean,
    approvedBy: String,
    approvalDate: Date
  },
  tags: [String],
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}

db.miracles.createIndex({ slug: 1 }, { unique: true });
db.miracles.createIndex({ "location.country": 1 });
db.miracles.createIndex({ "date.year": 1 });
db.miracles.createIndex({ "location.coordinates": "2dsphere" });
```

## API Design

### RESTful API Structure

#### Authentication Endpoints
```typescript
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
POST   /api/auth/resend-verification
```

#### User Endpoints
```typescript
GET    /api/users/me
PUT    /api/users/me
DELETE /api/users/me
GET    /api/users/:id/profile
PUT    /api/users/me/profile
PUT    /api/users/me/password
PUT    /api/users/me/preferences
```

#### Gospel Endpoints
```typescript
GET    /api/gospel/today
GET    /api/gospel/:date          // YYYY-MM-DD
GET    /api/gospel/:date/reflection
GET    /api/gospel/calendar/:year/:month
```

#### Content Endpoints
```typescript
GET    /api/content                // List all content (paginated)
GET    /api/content/:category      // Filter by category
GET    /api/content/:category/:slug
GET    /api/content/search?q=query
GET    /api/content/featured
GET    /api/content/:id/related
```

#### Miracle Endpoints
```typescript
GET    /api/miracles
GET    /api/miracles/:slug
GET    /api/miracles/map          // For map view
GET    /api/miracles/search
```

#### Community Endpoints
```typescript
GET    /api/intentions
POST   /api/intentions
GET    /api/intentions/:id
PUT    /api/intentions/:id
DELETE /api/intentions/:id
POST   /api/intentions/:id/pray
GET    /api/intentions/mine
```

#### Bookmark & Progress Endpoints
```typescript
GET    /api/bookmarks
POST   /api/bookmarks
DELETE /api/bookmarks/:id
GET    /api/progress
POST   /api/progress/:contentType/:contentId
```

### API Response Format

#### Success Response
```typescript
{
  success: true,
  data: {
    // Response data
  },
  meta: {
    page: 1,
    perPage: 20,
    total: 100,
    totalPages: 5
  }
}
```

#### Error Response
```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid input data",
    details: [
      {
        field: "email",
        message: "Email is required"
      }
    ]
  }
}
```

### API Versioning
- Version in URL: `/api/v1/...`
- Major versions only (v1, v2)
- Maintain backward compatibility within version
- Deprecation warnings for old endpoints

## Security Architecture

### Authentication Flow
```
1. User submits credentials
2. Server validates credentials
3. Server generates JWT access token (15 min expiry)
4. Server generates refresh token (7 days expiry)
5. Server stores refresh token in database
6. Client stores both tokens securely
7. Client uses access token for API calls
8. When access token expires, use refresh token to get new access token
9. If refresh token expires, user must log in again
```

### Security Best Practices

**1. Input Validation**
```typescript
// Validate and sanitize all inputs
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  displayName: z.string().min(2).max(100)
});
```

**2. SQL Injection Prevention**
- Use parameterized queries (ORM)
- Never concatenate user input into SQL
- Use prepared statements

**3. XSS Prevention**
- Escape output
- Content Security Policy headers
- Sanitize HTML input

**4. CSRF Protection**
- Use CSRF tokens for state-changing operations
- SameSite cookie attribute
- Verify origin headers

**5. Rate Limiting**
```typescript
// Limit requests per IP
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP'
};

// Stricter limits for auth endpoints
const authRateLimit = {
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts'
};
```

**6. Data Encryption**
- HTTPS everywhere
- Encrypt sensitive data at rest
- Use bcrypt for passwords (cost factor 10+)
- Secure JWT signing keys

## Performance Optimization

### Caching Strategy

**1. Redis Caching Layers**
```typescript
// Daily Gospel (cache for 24 hours)
const cacheKey = `gospel:${date}`;
const ttl = 86400; // 24 hours

// Popular articles (cache for 1 hour)
const cacheKey = `article:${slug}`;
const ttl = 3600;

// User profile (cache for 15 minutes)
const cacheKey = `user:${userId}`;
const ttl = 900;
```

**2. CDN for Static Assets**
- Images, CSS, JavaScript
- Gospel audio files
- Article images
- CloudFront or Cloud CDN

**3. Database Query Optimization**
```sql
-- Proper indexing
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category_published 
  ON articles(category, published_at DESC);

-- Explain analyze queries
EXPLAIN ANALYZE SELECT * FROM articles WHERE category = 'eucharist-basics';

-- Use connection pooling
-- Limit result sets (pagination)
-- Avoid N+1 queries
```

**4. API Response Optimization**
- Pagination (limit, offset)
- Field selection (sparse fieldsets)
- Compression (gzip/brotli)
- Minification

### Monitoring & Observability

**1. Application Metrics**
```typescript
// Track with Prometheus/StatsD
- Request rate
- Response time (p50, p95, p99)
- Error rate
- Database query time
- Cache hit/miss rate
- Active users
```

**2. Logging Strategy**
```typescript
// Winston logging levels
- error: Critical issues
- warn: Warning conditions
- info: Informational messages
- debug: Detailed debugging

// Structured logging
logger.info('User logged in', {
  userId: user.id,
  email: user.email,
  timestamp: new Date(),
  ip: req.ip
});
```

**3. Error Tracking**
- Sentry for error monitoring
- Stack traces
- User context
- Breadcrumbs
- Release tracking

**4. Health Checks**
```typescript
GET /api/health
{
  status: "healthy",
  timestamp: "2025-10-19T00:00:00Z",
  version: "1.0.0",
  checks: {
    database: "healthy",
    redis: "healthy",
    externalApi: "healthy"
  },
  uptime: 3600
}
```

## Deployment Strategy

### Environments

**1. Development**
- Local machines
- Docker Compose
- Hot reloading
- Debug logging
- Test data

**2. Staging**
- Mirrors production
- Integration testing
- User acceptance testing
- Performance testing
- Full monitoring

**3. Production**
- Auto-scaling
- Load balancing
- Full monitoring
- Backup systems
- Disaster recovery

### Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js
      - Install dependencies
      - Run linting
      - Run unit tests
      - Run integration tests
      
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - Build Docker images
      - Push to container registry
      - Tag with version
      
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - Deploy to staging
      - Run smoke tests
      - Run E2E tests
      
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - Wait for manual approval
      - Deploy to production
      - Health check
      - Smoke tests
      - Monitor for errors
      
  rollback:
    if: failure()
    runs-on: ubuntu-latest
    steps:
      - Rollback to previous version
      - Notify team
```

### Zero-Downtime Deployment
- Blue-green deployment
- Rolling updates
- Database migrations run separately
- Feature flags for gradual rollout
- Automated rollback on failure

## Development Workflow

### Git Branching Strategy

**Main Branches**:
- `main` - Production code
- `develop` - Integration branch

**Supporting Branches**:
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Production hotfixes
- `release/*` - Release preparation

**Workflow**:
```bash
# Start feature
git checkout develop
git pull
git checkout -b feature/gospel-audio

# Develop and commit
git add .
git commit -m "feat(gospel): add audio playback"

# Push and create PR
git push origin feature/gospel-audio

# After review and approval, merge to develop
# Release branches created from develop
# Hotfixes branch from main, merge to both main and develop
```

### Code Review Guidelines

**What to Review**:
- Functionality: Does it work as intended?
- Tests: Are there tests? Do they pass?
- Security: Any security concerns?
- Performance: Any performance issues?
- Maintainability: Is the code readable?
- Best Practices: Follows standards?

**Review Checklist**:
- [ ] Code builds successfully
- [ ] Tests pass
- [ ] No security vulnerabilities
- [ ] Follows coding standards
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Performance acceptable
- [ ] Error handling in place

## Testing Strategy

### Testing Pyramid

```
           ┌─────────────┐
          /   E2E Tests   \      (Few - Slow)
         /    (10%)        \
        ├──────────────────┤
       /  Integration Tests \    (Some - Medium)
      /       (30%)          \
     ├────────────────────────┤
    /     Unit Tests          \  (Many - Fast)
   /         (60%)             \
  └──────────────────────────────┘
```

### Unit Tests
```typescript
// Example: Gospel Service Unit Test
describe('GospelService', () => {
  describe('getTodaysGospel', () => {
    it('should return today\'s gospel', async () => {
      const service = new GospelService();
      const gospel = await service.getTodaysGospel();
      
      expect(gospel).toBeDefined();
      expect(gospel.date).toBe(getTodayDate());
      expect(gospel.gospel).toBeTruthy();
    });
    
    it('should use cache if available', async () => {
      const service = new GospelService();
      const cacheSpy = jest.spyOn(cache, 'get');
      
      await service.getTodaysGospel();
      await service.getTodaysGospel();
      
      expect(cacheSpy).toHaveBeenCalledTimes(2);
    });
  });
});
```

### Integration Tests
```typescript
// Example: API Integration Test
describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
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
  
  it('should reject duplicate email', async () => {
    // First registration
    await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'TestPass123!',
      displayName: 'Test User'
    });
    
    // Duplicate registration
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'TestPass123!',
        displayName: 'Another User'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('EMAIL_EXISTS');
  });
});
```

### E2E Tests
```typescript
// Example: Playwright E2E Test
test('User can read daily gospel', async ({ page }) => {
  // Navigate to app
  await page.goto('http://localhost:3000');
  
  // Login
  await page.click('text=Login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'TestPass123!');
  await page.click('button[type="submit"]');
  
  // Navigate to Gospel
  await page.click('text=Daily Gospel');
  
  // Verify gospel is displayed
  await expect(page.locator('h1')).toContainText('Gospel');
  await expect(page.locator('.gospel-text')).toBeVisible();
  
  // Play audio
  await page.click('button[aria-label="Play audio"]');
  await page.waitForTimeout(2000);
  
  // Verify audio is playing
  const isPlaying = await page.evaluate(() => {
    const audio = document.querySelector('audio');
    return audio && !audio.paused;
  });
  expect(isPlaying).toBe(true);
});
```

## Technical Debt Management

### Identifying Technical Debt
- Code smells
- Outdated dependencies
- Missing tests
- Poor documentation
- Performance bottlenecks
- Security vulnerabilities

### Managing Technical Debt
- Track in issue tracker with `tech-debt` label
- Allocate 20% of sprint capacity
- Prioritize by impact and risk
- Don't let it accumulate
- Refactor iteratively

## Success Criteria

### By End of Month 1
- [ ] Architecture defined and documented
- [ ] Technology stack finalized
- [ ] Development environment set up
- [ ] CI/CD pipeline configured
- [ ] ADRs for major decisions created

### By End of Month 3
- [ ] Backend API functional
- [ ] Frontend web app deployed
- [ ] Database schema implemented
- [ ] Authentication working
- [ ] Core features deployed

### By End of Month 6
- [ ] Mobile app architecture defined
- [ ] Mobile app in development
- [ ] API scaled for mobile traffic
- [ ] Performance optimized
- [ ] Monitoring in place

### By End of Month 12
- [ ] Full platform scalable
- [ ] Zero-downtime deployments
- [ ] Comprehensive monitoring
- [ ] Strong security posture
- [ ] Technical documentation complete

## References & Resources

### Internal Documents
- [TECHNICAL_ROADMAP.md](/TECHNICAL_ROADMAP.md) - Implementation guide
- [PROJECT_STRUCTURE.md](/PROJECT_STRUCTURE.md) - Code organization
- [CONTRIBUTING.md](/CONTRIBUTING.md) - Development guidelines

### External Resources
- [12-Factor App](https://12factor.net/) - App architecture
- [AWS Architecture](https://aws.amazon.com/architecture/) - Cloud patterns
- [Martin Fowler Blog](https://martinfowler.com/) - Software design
- [System Design Primer](https://github.com/donnemartin/system-design-primer)

---

## Final Thoughts

As Software Architect, you are the technical guardian of this platform. Your decisions will impact:
- **Scalability**: Can we grow to millions of users?
- **Maintainability**: Can we change things easily?
- **Reliability**: Can users depend on us?
- **Security**: Are user data and privacy protected?

Remember:
- **Simplicity First**: Don't over-engineer
- **Document Decisions**: Use ADRs
- **Mentor Team**: Share knowledge
- **Think Long-term**: Build for the future
- **Serve the Mission**: Technology serves evangelization

*"Let all things be done decently and in order."* - 1 Corinthians 14:40

**Ad Majorem Dei Gloriam** ✝️

---

**Document Version**: 1.0  
**Last Updated**: October 2025  
**Owner**: Technical Architecture Team  
**Review Cycle**: Quarterly or as needed
