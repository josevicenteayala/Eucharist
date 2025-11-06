# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the Eucharist Understanding Platform. ADRs document significant architectural decisions made during the development of the platform, including the context, decision, consequences, and alternatives considered.

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences. ADRs help teams:
- Understand why decisions were made
- Onboard new team members faster
- Avoid revisiting old decisions
- Learn from past choices
- Maintain architectural consistency

## ADR Index

### Core Technology Stack

| ADR | Title | Status | Date | Description |
|-----|-------|--------|------|-------------|
| [ADR-001](./ADR-001-react-nextjs-web-frontend.md) | Use React + Next.js for Web Frontend | Accepted | 2025-10-18 | Decision to use React 18+ with Next.js 14 and TypeScript for the web application |
| [ADR-002](./ADR-002-flutter-mobile-apps.md) | Use Flutter for Mobile Apps | Accepted | 2025-10-18 | Decision to use Flutter 3.16+ with Dart for cross-platform mobile development |
| [ADR-003](./ADR-003-postgresql-mongodb-hybrid.md) | Use PostgreSQL + MongoDB Hybrid | Accepted | 2025-10-18 | Decision to use PostgreSQL for structured data and MongoDB for content |
| [ADR-004](./ADR-004-jwt-authentication.md) | JWT for Authentication | Accepted | 2025-10-18 | Decision to use JSON Web Tokens with dual-token approach for authentication |
| [ADR-005](./ADR-005-cicd-github-actions.md) | CI/CD with GitHub Actions | Accepted | 2025-10-19 | Decision to use GitHub Actions as primary CI/CD platform |
| [ADR-006](./ADR-006-sprint-1-tech-stack.md) | Sprint 1 Technology Stack | Accepted | 2025-11-06 | Specific library and tool selections for Sprint 1 implementation (Express, Vite, Zod, Winston, etc.) |

## Technology Stack Overview

### Frontend
- **Web**: React 18+ with Next.js 14, TypeScript, Tailwind CSS
- **Mobile**: Flutter 3.16+ with Dart

### Backend
- **Runtime**: Node.js 20+ LTS
- **Framework**: Express.js 4+ with TypeScript
- **Authentication**: JWT (JSON Web Tokens)

### Databases
- **PostgreSQL**: User data, authentication, relational data
- **MongoDB**: Content, articles, reflections
- **Redis**: Caching, sessions

### Infrastructure
- **CI/CD**: GitHub Actions
- **Hosting**: AWS/Google Cloud (planned)
- **Version Control**: Git + GitHub

## ADR Template

When creating a new ADR, use the following structure:

```markdown
# ADR-XXX: [Title]

**Status**: Proposed | Accepted | Superseded | Deprecated  
**Date**: YYYY-MM-DD  
**Deciders**: [Names/Roles]

## Context
What is the issue we're trying to solve?
What are the constraints?
What are the requirements?

## Decision
What did we decide to do?
Include technical details and specifications.

## Consequences

### Positive
✅ List the benefits

### Negative
⚠️ List the drawbacks and trade-offs

### Neutral
➖ List neutral impacts

## Alternatives Considered
What other options did we evaluate?
Why were they not chosen?

## Implementation Plan
How will this be implemented?
What are the phases?

## Success Criteria
How do we know this decision was successful?

## References
Links to documentation, discussions, etc.

## Revision History
Track changes to this ADR over time
```

## ADR Lifecycle

ADRs go through the following statuses:

- **Proposed**: Under consideration and discussion
- **Accepted**: Decision has been made and approved
- **Superseded**: Replaced by a newer decision (link to new ADR)
- **Deprecated**: No longer applicable but kept for historical context

## When to Create an ADR

Create an ADR for decisions that:
- Have significant impact on the system architecture
- Affect multiple components or teams
- Involve trade-offs between alternatives
- Will be difficult to change later
- Need to be understood by future team members
- Involve significant risk or cost
- Set precedents for future decisions

### Examples of ADR-worthy Decisions
- Choice of programming language or framework
- Database selection
- Authentication mechanism
- Deployment strategy
- API design patterns
- Security approaches
- Third-party service integrations

### Not ADR-worthy
- Minor implementation details
- Temporary workarounds
- Personal coding preferences
- Decisions easily reversible
- Team process decisions (use other docs)

## How to Contribute

1. **Propose**: Create a new ADR with status "Proposed"
2. **Discuss**: Share with team for feedback
3. **Decide**: Team makes decision (in meeting or async)
4. **Document**: Update ADR with final decision
5. **Accept**: Change status to "Accepted"
6. **Communicate**: Announce decision to team

## Review Schedule

Each ADR includes a "Next Review" date. Reviews ensure:
- Decision still makes sense
- No new alternatives have emerged
- Implementation went as planned
- Consequences match expectations

Typical review periods:
- **Technology choices**: 6 months
- **Infrastructure decisions**: 3 months
- **Process decisions**: 1 year

## Related Documentation

- [Software Architect Role](../../sdlc/SOFTWARE_ARCHITECT.md) - Detailed architecture guide
- [Technical Roadmap](../../../TECHNICAL_ROADMAP.md) - Implementation timeline
- [Project Structure](../../../PROJECT_STRUCTURE.md) - Code organization
- [Contributing Guide](../../../CONTRIBUTING.md) - How to contribute

## Questions?

If you have questions about:
- **Existing ADRs**: Comment on the specific ADR file or discuss in team meetings
- **New ADRs**: Reach out to the Software Architect
- **Process**: See [Architecture Coordination Guide](../coordination/architecture-coordination.md)

## History

- **2025-10-18**: Created ADR-001 through ADR-004 (core technology stack)
- **2025-10-19**: Created ADR-005 (CI/CD pipeline)
- **2025-11-06**: Added this README for navigation
- **2025-11-06**: Created ADR-006 (Sprint 1 technology stack)

---

**Maintainer**: Software Architect  
**Last Updated**: 2025-11-06
