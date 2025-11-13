# Architecture Documentation

This directory contains architectural documentation for the Eucharist Understanding Platform.

## Directory Structure

```
architecture/
├── adr/              # Architecture Decision Records
├── coordination/     # Cross-role coordination documents
├── diagrams/         # Architecture diagrams (in progress)
└── README.md         # This file
```

## Architecture Decision Records (ADRs)

ADRs document significant architectural decisions. See the [ADR README](adr/README.md) for more information about the ADR process.

### Active ADRs

- [ADR-001: React + Next.js for Web Frontend](adr/ADR-001-react-nextjs-web-frontend.md)
- [ADR-002: Flutter for Mobile Apps](adr/ADR-002-flutter-mobile-apps.md)
- [ADR-003: PostgreSQL + MongoDB Hybrid Database](adr/ADR-003-postgresql-mongodb-hybrid.md)
- [ADR-004: JWT for Authentication](adr/ADR-004-jwt-authentication.md)
- [ADR-005: CI/CD with GitHub Actions](adr/ADR-005-cicd-github-actions.md)

For detailed technology stack rationale and additional context, also see [docs/sdlc/SOFTWARE_ARCHITECT.md](../sdlc/SOFTWARE_ARCHITECT.md).

## Coordination Documents

Documents for coordinating architectural decisions with other roles:

- [Architecture Coordination Plan](coordination/architecture-coordination.md) - Process for working with PM and PO
- [Technical Review Process](coordination/technical-review-process.md) - Code and design review standards
- [Sprint Technical Planning](coordination/sprint-technical-planning.md) - Technical planning for sprints

## Key Architecture Documents

System architecture visuals are currently being prepared. Until the diagrams folder is populated, reference the architecture narratives in [`docs/sdlc/SOFTWARE_ARCHITECT.md`](../sdlc/SOFTWARE_ARCHITECT.md) for:

- System architecture
- Technology stack details
- Database design
- API design
- Security architecture
- Performance optimization
- Deployment strategy

## Quick Links

- [Software Architect Role](../sdlc/SOFTWARE_ARCHITECT.md)
- [Technical Roadmap](../TECHNICAL_ROADMAP.md)
- [Project Structure](../PROJECT_STRUCTURE.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

## Contact

For architecture questions or to propose new ADRs:

- Create an issue with label `architecture`
- Reach out to the Software Architect
- Start a discussion in GitHub Discussions

---

**Last Updated**: November 2025  
**Owner**: Software Architect Team
