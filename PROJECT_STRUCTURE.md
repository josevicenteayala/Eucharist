# Eucharist Platform - Project Structure

## Repository Organization

This document outlines the recommended project structure for the Eucharist Understanding Platform, including both mobile and web applications.

## Recommended Directory Structure

```
Eucharist/
├── docs/                          # Project documentation
│   ├── DISCOVERY.md              # Discovery phase document
│   ├── api/                      # API documentation
│   ├── architecture/             # Architecture diagrams
│   ├── content-guidelines/       # Content creation guidelines
│   └── user-guides/              # User documentation
│
├── mobile/                        # Mobile application (Flutter)
│   ├── lib/
│   │   ├── main.dart             # Application entry point
│   │   ├── core/                 # Core functionality
│   │   │   ├── config/           # App configuration
│   │   │   ├── constants/        # Constants and enums
│   │   │   ├── theme/            # Theme and styling
│   │   │   └── utils/            # Utility functions
│   │   ├── data/                 # Data layer
│   │   │   ├── models/           # Data models
│   │   │   ├── repositories/     # Repository implementations
│   │   │   └── datasources/      # API and local data sources
│   │   ├── domain/               # Business logic layer
│   │   │   ├── entities/         # Business entities
│   │   │   ├── repositories/     # Repository interfaces
│   │   │   └── usecases/         # Use cases
│   │   ├── presentation/         # UI layer
│   │   │   ├── screens/          # App screens
│   │   │   ├── widgets/          # Reusable widgets
│   │   │   └── providers/        # State management
│   │   └── services/             # External services
│   ├── assets/                   # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── test/                     # Unit and widget tests
│   ├── pubspec.yaml              # Dependencies
│   └── README.md
│
├── web/                          # Web application
│   ├── frontend/                 # React frontend
│   │   ├── public/               # Static files
│   │   ├── src/
│   │   │   ├── components/       # React components
│   │   │   │   ├── common/       # Shared components
│   │   │   │   ├── eucharist/    # Eucharist-specific
│   │   │   │   ├── gospel/       # Gospel reading components
│   │   │   │   └── community/    # Community features
│   │   │   ├── pages/            # Page components
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── services/         # API services
│   │   │   ├── store/            # State management
│   │   │   ├── styles/           # CSS/SCSS files
│   │   │   ├── utils/            # Utility functions
│   │   │   ├── App.jsx           # Root component
│   │   │   └── index.jsx         # Entry point
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── backend/                  # Node.js/Express backend
│       ├── src/
│       │   ├── controllers/      # Route controllers
│       │   ├── models/           # Database models
│       │   ├── routes/           # API routes
│       │   ├── middleware/       # Express middleware
│       │   ├── services/         # Business logic
│       │   ├── utils/            # Utility functions
│       │   ├── validators/       # Input validation
│       │   ├── config/           # Configuration
│       │   └── app.js            # Express app setup
│       ├── tests/                # Backend tests
│       ├── package.json
│       └── README.md
│
├── shared/                       # Shared code/types
│   ├── api-contracts/           # API interface definitions
│   ├── constants/               # Shared constants
│   └── types/                   # TypeScript type definitions
│
├── content/                     # Content management
│   ├── articles/                # Educational articles (Markdown)
│   │   ├── eucharist-basics/
│   │   ├── mass-parts/
│   │   ├── history/
│   │   └── living-eucharist/
│   ├── reflections/             # Daily gospel reflections
│   ├── miracles/                # Eucharistic miracle stories
│   ├── prayers/                 # Prayer texts
│   └── media/                   # Images, videos, audio
│
├── infrastructure/              # Infrastructure as Code
│   ├── docker/                  # Docker configurations
│   │   ├── docker-compose.yml
│   │   ├── Dockerfile.backend
│   │   └── Dockerfile.frontend
│   ├── kubernetes/              # K8s manifests (if needed)
│   └── terraform/               # Cloud infrastructure
│
├── scripts/                     # Build and deployment scripts
│   ├── setup.sh                 # Initial setup script
│   ├── deploy.sh                # Deployment script
│   └── migrate.sh               # Database migration script
│
├── .github/                     # GitHub configurations
│   ├── workflows/               # GitHub Actions
│   │   ├── ci.yml              # Continuous Integration
│   │   ├── cd.yml              # Continuous Deployment
│   │   └── tests.yml           # Test automation
│   └── ISSUE_TEMPLATE/         # Issue templates
│
├── .gitignore                   # Git ignore rules
├── LICENSE                      # Project license
├── README.md                    # Project overview
├── DISCOVERY.md                 # Discovery phase document
├── PROJECT_STRUCTURE.md         # This file
└── CONTRIBUTING.md              # Contribution guidelines

```

## Module Descriptions

### Mobile Application Modules

#### Core Features
1. **Daily Gospel Module**
   - Daily readings display
   - Audio playback
   - Reflection and notes
   - Sharing capabilities

2. **Education Module**
   - Interactive Mass guide
   - Eucharist fundamentals
   - History timeline
   - Video tutorials

3. **Miracles Module**
   - Miracle stories
   - Photo galleries
   - Location maps
   - Scientific documentation

4. **Community Module**
   - Prayer intentions
   - Discussion forums
   - User profiles
   - Parish finder

5. **Personal Module**
   - Progress tracking
   - Journal entries
   - Bookmarks
   - Prayer history

### Web Application Modules

#### Frontend Structure
```
pages/
├── Home                        # Landing page
├── Gospel                      # Daily gospel and reflection
├── Learn/                      # Educational content
│   ├── WhatIsEucharist
│   ├── PartsOfMass
│   ├── History
│   └── LivingEucharist
├── Miracles                    # Eucharistic miracles
├── Community/                  # Community features
│   ├── PrayerIntentions
│   ├── Forums
│   └── Testimonies
├── Resources                   # Additional resources
├── About                       # About the platform
└── Profile                     # User profile and settings
```

#### Backend Structure
```
API Endpoints:
├── /api/auth                   # Authentication
├── /api/users                  # User management
├── /api/gospel                 # Daily gospel
├── /api/content                # Educational content
├── /api/miracles               # Miracle stories
├── /api/community              # Community features
├── /api/parishes               # Parish information
└── /api/admin                  # Admin operations
```

## Technology Stack Details

### Mobile (Flutter)
```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # State Management
  provider: ^6.1.0
  flutter_riverpod: ^2.4.0
  
  # Networking
  dio: ^5.3.3
  retrofit: ^4.0.3
  
  # Local Storage
  shared_preferences: ^2.2.2
  sqflite: ^2.3.0
  hive: ^2.2.3
  
  # UI Components
  google_fonts: ^6.1.0
  cached_network_image: ^3.3.0
  flutter_svg: ^2.0.9
  
  # Audio/Video
  audioplayers: ^5.2.1
  video_player: ^2.8.1
  
  # Maps
  google_maps_flutter: ^2.5.0
  
  # Notifications
  firebase_messaging: ^14.7.3
  flutter_local_notifications: ^16.2.0
  
  # Analytics
  firebase_analytics: ^10.7.0
  
  # Authentication
  firebase_auth: ^4.15.0
  google_sign_in: ^6.1.6
```

### Web Frontend (React)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    
    // State Management
    "zustand": "^4.4.7",
    "react-query": "^3.39.3",
    
    // UI Framework
    "tailwindcss": "^3.3.6",
    "headlessui": "^1.7.17",
    "@heroicons/react": "^2.1.1",
    
    // Forms
    "react-hook-form": "^7.48.2",
    "yup": "^1.3.3",
    
    // HTTP Client
    "axios": "^1.6.2",
    
    // Date/Time
    "date-fns": "^2.30.0",
    "dayjs": "^1.11.10",
    
    // Rich Text
    "react-markdown": "^9.0.1",
    "react-quill": "^2.0.0",
    
    // Media
    "react-player": "^2.13.0",
    
    // Maps
    "react-leaflet": "^4.2.1",
    
    // Analytics
    "react-ga4": "^2.1.0"
  }
}
```

### Backend (Node.js)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    
    // Database
    "mongoose": "^8.0.3",
    "pg": "^8.11.3",
    "sequelize": "^6.35.1",
    
    // Authentication
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    
    // Validation
    "joi": "^17.11.0",
    "express-validator": "^7.0.1",
    
    // File Upload
    "multer": "^1.4.5-lts.1",
    
    // Email
    "nodemailer": "^6.9.7",
    
    // Logging
    "winston": "^3.11.0",
    "morgan": "^1.10.0",
    
    // Caching
    "redis": "^4.6.11",
    
    // Utilities
    "dotenv": "^16.3.1",
    "lodash": "^4.17.21"
  }
}
```

## Development Workflow

### 1. Local Development Setup

#### Prerequisites
- Node.js (v18+)
- Flutter SDK (v3.16+)
- PostgreSQL (v15+)
- MongoDB (v7+)
- Redis (v7+)
- Git

#### Initial Setup
```bash
# Clone repository
git clone https://github.com/josevicenteayala/Eucharist.git
cd Eucharist

# Install backend dependencies
cd web/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install mobile dependencies
cd ../../mobile
flutter pub get

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Seed initial data
npm run seed
```

### 2. Development Commands

#### Backend
```bash
npm run dev          # Start development server
npm run test         # Run tests
npm run lint         # Run linter
npm run migrate      # Run database migrations
```

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run linter
```

#### Mobile
```bash
flutter run          # Run on connected device
flutter test         # Run tests
flutter analyze      # Analyze code
flutter build apk    # Build Android APK
flutter build ios    # Build iOS app
```

## Deployment Strategy

### Environments
1. **Development** - Local development
2. **Staging** - Testing and QA
3. **Production** - Live application

### CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
name: Continuous Integration

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js
      - Install dependencies
      - Run tests
      - Run linter

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js
      - Install dependencies
      - Run tests
      - Run linter
      - Build production

  test-mobile:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Flutter
      - Install dependencies
      - Run tests
      - Run analyzer
```

## Content Management

### Content Structure
All content is stored as Markdown files in the `content/` directory for version control and easy editing.

#### Article Template
```markdown
---
title: "Understanding the Real Presence"
category: "Eucharist Basics"
author: "Fr. John Smith"
date: "2025-10-18"
tags: ["theology", "real-presence", "transubstantiation"]
difficulty: "intermediate"
reading_time: 5
---

# Understanding the Real Presence

## Introduction
[Content here]

## Biblical Foundation
[Content here]

## Theological Development
[Content here]

## Practical Application
[Content here]

## Conclusion
[Content here]

---

### Questions for Reflection
1. Question one?
2. Question two?
3. Question three?

### Further Reading
- Resource 1
- Resource 2
```

### Content Review Process
1. **Draft** - Author creates content
2. **Theological Review** - Expert review for accuracy
3. **Editorial Review** - Style and clarity check
4. **Approval** - Final sign-off
5. **Publication** - Content goes live
6. **Updates** - Periodic review and updates

## Quality Assurance

### Code Quality
- ESLint for JavaScript/TypeScript
- Dart analyzer for Flutter
- Code review required for all PRs
- Minimum 80% test coverage

### Content Quality
- Theological accuracy verification
- Readability score (Flesch-Kincaid)
- SEO optimization
- Accessibility compliance

## Security Considerations

### Authentication & Authorization
- JWT tokens for API authentication
- OAuth 2.0 for social login
- Role-based access control (RBAC)
- Rate limiting on API endpoints

### Data Protection
- HTTPS only
- Database encryption at rest
- Secure password hashing (bcrypt)
- Regular security audits
- GDPR compliance

## Monitoring & Analytics

### Application Monitoring
- Error tracking (Sentry)
- Performance monitoring (New Relic/DataDog)
- Uptime monitoring (Pingdom)
- Log aggregation (ELK Stack)

### User Analytics
- User behavior tracking
- Feature usage metrics
- Conversion funnels
- A/B testing framework

## Documentation Standards

### Code Documentation
- JSDoc for JavaScript
- Dart doc comments for Flutter
- README in each major directory
- API documentation (OpenAPI/Swagger)

### User Documentation
- User guides
- Video tutorials
- FAQ section
- Help center

## Support & Maintenance

### Bug Tracking
- GitHub Issues for public bugs
- Internal tracking for security issues
- Regular triage meetings
- Priority classification

### Version Control
- Semantic versioning (MAJOR.MINOR.PATCH)
- Changelog maintenance
- Release notes
- Migration guides

## Internationalization (i18n)

### Supported Languages (Phase 1)
- English (en-US)
- Spanish (es-ES, es-MX)
- Portuguese (pt-BR)

### Translation Process
- String externalization
- Translation management system
- Native speaker review
- Cultural adaptation

## Accessibility Standards

### Compliance
- WCAG 2.1 Level AA
- Section 508 compliance
- Screen reader testing
- Keyboard navigation

### Testing
- Automated accessibility testing
- Manual testing with assistive technologies
- User testing with disabled users

---

## Next Steps for Project Manager

### Week 1: Project Initialization
- [ ] Review and approve discovery document
- [ ] Assemble core team
- [ ] Set up project management tools
- [ ] Create GitHub repository structure
- [ ] Schedule kickoff meeting

### Week 2: Planning
- [ ] Create detailed sprint plans
- [ ] Define user stories
- [ ] Set up development environments
- [ ] Establish communication channels
- [ ] Begin stakeholder interviews

### Week 3-4: Foundation
- [ ] Initial technical setup
- [ ] Design system creation
- [ ] Content outline completion
- [ ] API contract definition
- [ ] First sprint begins

---

*This document serves as a comprehensive guide for the Project Manager to understand the technical structure and organization of the Eucharist Understanding Platform.*
