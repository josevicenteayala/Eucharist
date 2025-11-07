# Services

This directory contains business logic services.

## Purpose

Services encapsulate business logic and data operations, called by controllers.

## Structure

```
services/
├── auth.service.ts          # Authentication logic
├── gospel.service.ts        # Gospel data processing
├── content.service.ts       # Content management
├── community.service.ts     # Community features
└── user.service.ts          # User management
```

## Standards

- Implement business logic here (not in controllers)
- Use dependency injection where appropriate
- Handle data transformations
- Interact with models/repositories
- Throw meaningful errors
- Keep services focused and single-purpose
