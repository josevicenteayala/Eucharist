# Eucharist Understanding Platform

> Helping people understand, appreciate, and live the Eucharist through accessible technology

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Discovery%20Phase-yellow.svg)]()
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](docs/CONTRIBUTING.md)
[![CI](https://github.com/josevicenteayala/Eucharist/actions/workflows/ci.yml/badge.svg)](https://github.com/josevicenteayala/Eucharist/actions/workflows/ci.yml)
[![Backend CI](https://github.com/josevicenteayala/Eucharist/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/josevicenteayala/Eucharist/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/josevicenteayala/Eucharist/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/josevicenteayala/Eucharist/actions/workflows/frontend-ci.yml)
[![codecov](https://codecov.io/gh/josevicenteayala/Eucharist/branch/main/graph/badge.svg)](https://codecov.io/gh/josevicenteayala/Eucharist)

## 🙏 Mission

To create an engaging, educational, and spiritually enriching platform that helps Catholics and seekers deepen their understanding of the Eucharist—the source and summit of Christian life—through modern mobile and web applications.

## ✨ Vision

A world where everyone has access to beautiful, accurate, and practical resources for understanding and living the Eucharist in their daily lives.

## 📱 Platform Overview

The Eucharist Understanding Platform will consist of:

- **Mobile Application** (iOS & Android) - Using Flutter for cross-platform development
- **Web Application** - Using React for the frontend and Node.js for the backend
- **Content Management System** - For easy content creation and updates

## 🎯 Key Features

### 1. Daily Gospel & Reflection

- Daily Scripture readings from the liturgical calendar
- Practical reflections connecting the Gospel to everyday life
- Audio versions for listening on the go
- Journal feature for personal notes

### 2. Eucharist Education

- **What is the Eucharist?** - Theological foundations and Real Presence
- **Parts of the Mass** - Interactive guide through the liturgy
- **Living the Eucharist** - Practical guidance for spiritual growth
- **Eucharistic Miracles** - Historical and scientific documentation
- **History Timeline** - Development of Eucharistic worship through the ages

### 3. Community Features

- Prayer intention sharing
- Discussion forums
- Parish and adoration chapel finder
- Testimony sharing

### 4. Personal Spiritual Growth

- Progress tracking
- Spiritual journal
- Bookmarks and favorites
- Prayer history

## 📚 Documentation

### Core Documents

- ⭐ **[Next Steps Implementation Prompt](NEXT_STEPS_IMPLEMENTATION_PROMPT.md)** - **NEW!** Complete guide for starting Sprint 1
- **[Environment Setup Guide](ENVIRONMENT_SETUP.md)** - Configure environment variables for development
- **[Discovery Phase Document](DISCOVERY.md)** - Comprehensive project vision, goals, and planning
- **[Executive Summary](EXECUTIVE_SUMMARY.md)** - High-level overview for stakeholders
- **[Quick Start for PM](QUICK_START_PM.md)** - Project Manager's first 4 weeks
- **[Technical Roadmap](docs/TECHNICAL_ROADMAP.md)** - Sprint-by-sprint implementation guide
- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Technical architecture and organization
- **[Contributing Guide](docs/CONTRIBUTING.md)** - How to contribute to the project

### SDLC Role Documentation

- **[SDLC Index](docs/sdlc/INDEX.md)** - Overview of all role documents
- **[Project Manager](docs/sdlc/PROJECT_MANAGER.md)** - PM responsibilities and workflows
- **[Product Owner](docs/sdlc/PRODUCT_OWNER.md)** - Product management and backlog
- **[Software Architect](docs/sdlc/SOFTWARE_ARCHITECT.md)** - Technical architecture and standards

### Other Resources

- **[Documentation Index](DOCUMENTATION_INDEX.md)** - Complete guide to all documentation
- **[License](LICENSE)** - Project license details

## 🚀 Current Status

**Phase:** Phase 1 – Foundation (MVP Build)

Discovery is complete and we are focused on executing the foundation phase:

- MVP web application development
- Core content creation (first 30 reflections/articles)
- Early community feature prototypes
- Phase 1 launch readiness and feedback loops

## 🛠️ Technology Stack

### Mobile

- **Framework:** Flutter
- **State Management:** Provider/Riverpod
- **Local Storage:** Hive/SQLite
- **Authentication:** Firebase Auth

### Web

- **Frontend:** React 18+ with TypeScript
- **Backend:** Node.js with Express
- **Database:** PostgreSQL (relational) + MongoDB (content)
- **Cache:** Redis
- **Authentication:** JWT + OAuth 2.0

### DevOps

- **Version Control:** Git & GitHub
- **CI/CD:** GitHub Actions
- **Hosting:** TBD (AWS, Google Cloud, or Azure)
- **Containerization:** Docker

## 🏗️ Project Structure

```
Eucharist/
├── docs/              # Documentation
├── mobile/            # Flutter mobile app
├── web/
│   ├── frontend/     # React web app
│   └── backend/      # Node.js API
├── content/          # Educational content (Markdown)
├── infrastructure/   # IaC and deployment configs
└── scripts/          # Automation scripts
```

_See [PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed structure._

## 🔧 Development Setup

### Prerequisites

- **Option 1: Docker** (Recommended)
  - Docker Desktop or Docker Engine + Docker Compose
  - [Installation Guide](DOCKER.md)
  
- **Option 2: Native**
  - Node.js 18+ and npm 9+
  - PostgreSQL, MongoDB, and Redis

### Quick Start with Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/josevicenteayala/Eucharist.git
   cd Eucharist
   ```

2. **Start all services**

   ```bash
   docker compose up -d
   ```

3. **Access the applications**

   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - API Health: http://localhost:3000/api/v1/health

See the [Docker Guide](DOCKER.md) for complete documentation.

### Native Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/josevicenteayala/Eucharist.git
   cd Eucharist
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up databases**

   Install and start PostgreSQL, MongoDB, and Redis.
   See [Database Setup Guide](web/backend/DATABASE_SETUP.md) for detailed instructions.

4. **Configure environment variables**

   ```bash
   # Backend
   cd web/backend
   cp .env.example .env
   # Edit .env with your configuration

   # Frontend
   cd web/frontend
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

   See [Environment Setup Guide](ENVIRONMENT_SETUP.md) for detailed configuration instructions.

5. **Linting and Formatting**

   ```bash
   # Check code formatting
   npm run format:check

   # Format all files
   npm run format

   # Lint code
   npm run lint

   # Fix linting issues
   npm run lint:fix
   ```

6. **Git Hooks**

   Pre-commit hooks are automatically installed via Husky. They will:
   - Run ESLint and fix issues on staged `.js`, `.jsx`, `.ts`, `.tsx` files
   - Format all staged files with Prettier

7. **Working with Backend**

   ```bash
   cd web/backend
   npm install
   npm run dev      # Start development server
   npm test         # Run tests
   npm run build    # Build for production
   ```

See individual workspace README files for detailed setup instructions.

## 👥 Target Audience

- **Young Adults** returning to faith or exploring Catholicism
- **RCIA Candidates** preparing to enter the Church
- **Parents** wanting to teach children about the Eucharist
- **Lifelong Learners** seeking deeper theological understanding
- **Anyone** wanting to grow closer to Christ in the Eucharist

## 🤝 Contributing

We welcome contributions from:

- **Developers** (mobile, web, backend)
- **Designers** (UI/UX, graphics)
- **Content Creators** (writers, theologians)
- **Translators** (Spanish, Portuguese, etc.)
- **Testers** (QA, user testing)

Please read our [Contributing Guide](docs/CONTRIBUTING.md) to get started.

### How to Contribute

1. Read the [Discovery Document](DISCOVERY.md) to understand the project
2. Check [Issues](https://github.com/josevicenteayala/Eucharist/issues) for tasks
3. Review the [Contributing Guide](docs/CONTRIBUTING.md)
4. Fork the repository and make your changes
5. Submit a Pull Request

## 📋 Roadmap

### Phase 1: Foundation (Months 1-3)

- ✅ Discovery and planning
- [ ] MVP development
- [ ] Core content creation
- [ ] Web application launch

### Phase 2: Enhancement (Months 4-6)

- [ ] Mobile app development
- [ ] Additional features
- [ ] Community features
- [ ] Content expansion

### Phase 3: Growth (Months 7-9)

- [ ] Mobile app public release
- [ ] Multi-language support
- [ ] Marketing and outreach
- [ ] Community building

### Phase 4: Maturity (Months 10-12)

- [ ] Advanced features
- [ ] Video content library
- [ ] Personalization
- [ ] Scale and optimize

_See [DISCOVERY.md](DISCOVERY.md) for detailed roadmap._

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Core Values

- **Faith-Centered:** Rooted in authentic Catholic teaching
- **Accessible:** Available to all, regardless of technical ability or resources
- **Beautiful:** Reflecting the beauty of the Eucharist through design
- **Community-Driven:** Built with and for the faithful
- **Open Source:** Transparent and collaborative development

## 📞 Contact

- **Repository:** [github.com/josevicenteayala/Eucharist](https://github.com/josevicenteayala/Eucharist)
- **Issues:** [GitHub Issues](https://github.com/josevicenteayala/Eucharist/issues)

## 🙏 Acknowledgments

This project is made possible by:

- The Catholic Church's rich tradition and teaching
- Open source community
- Contributors and supporters
- Everyone seeking to deepen their relationship with Christ in the Eucharist

---

<div align="center">

**"The Eucharist is the source and summit of the Christian life."**  
_— Second Vatican Council, Lumen Gentium_

_Ad Majorem Dei Gloriam_ ✝️

[Get Started](DISCOVERY.md) • [Contribute](docs/CONTRIBUTING.md) • [Documentation](docs/)

</div>
