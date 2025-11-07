# Controllers

This directory contains route controllers for the Express backend.

## Purpose

Controllers handle HTTP requests and responses, delegating business logic to services.

## Structure

```
controllers/
├── auth.controller.ts       # Authentication endpoints
├── gospel.controller.ts     # Daily gospel endpoints
├── content.controller.ts    # Educational content
├── community.controller.ts  # Community features
└── user.controller.ts       # User profile management
```

## Standards

- Keep controllers thin - delegate to services
- Use proper HTTP status codes
- Validate input using validators
- Handle errors consistently
- Return standardized response format
