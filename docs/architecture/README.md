# Architecture Documentation

This directory contains architectural documentation for the Eucharist Understanding Platform.

## Directory Structure

```
architecture/
├── adr/              # Architecture Decision Records
├── coordination/     # Cross-role coordination documents
├── diagrams/         # Architecture diagrams
└── README.md         # This file
```

## Architecture Decision Records (ADRs)

ADRs document significant architectural decisions. Each ADR follows the template defined in SOFTWARE_ARCHITECT.md.

### Active ADRs

- [ADR-001: React + Next.js for Web Frontend](adr/ADR-001-react-nextjs-frontend.md)
- [ADR-002: Flutter for Mobile Apps](adr/ADR-002-flutter-mobile.md)
- [ADR-003: PostgreSQL + MongoDB Hybrid](adr/ADR-003-database-hybrid.md)
- [ADR-004: JWT for Authentication](adr/ADR-004-jwt-authentication.md)
- [ADR-005: CI/CD with GitHub Actions](adr/ADR-005-cicd-github-actions.md)

## Coordination Documents

Documents for coordinating architectural decisions with other roles:

- [Architecture Coordination Plan](coordination/architecture-coordination.md) - Process for working with PM and PO
- [Technical Review Process](coordination/technical-review-process.md) - Code and design review standards
- [Sprint Technical Planning](coordination/sprint-technical-planning.md) - Technical planning for sprints

## Key Architecture Documents

Reference the main SOFTWARE_ARCHITECT.md document in `docs/sdlc/SOFTWARE_ARCHITECT.md` for:
- System architecture
- Technology stack details
- Database design
- API design
- Security architecture
- Performance optimization
- Deployment strategy

## Quick Links

- [Software Architect Role](../sdlc/SOFTWARE_ARCHITECT.md)
- [Technical Roadmap](/TECHNICAL_ROADMAP.md)
- [Project Structure](/PROJECT_STRUCTURE.md)
- [Contributing Guidelines](/CONTRIBUTING.md)

## Contact

For architecture questions or to propose new ADRs:
- Create an issue with label `architecture`
- Reach out to the Software Architect
- Start a discussion in GitHub Discussions

---

**Last Updated**: October 2025
**Owner**: Software Architect Team
