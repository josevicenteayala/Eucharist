# API Services

This directory contains API client functions for backend communication.

## Structure

```
services/
├── api.ts              # Base API configuration (axios/fetch)
├── auth.service.ts     # Authentication API calls
├── gospel.service.ts   # Gospel data API calls
├── content.service.ts  # Content management API calls
└── user.service.ts     # User management API calls
```

## Standards

- Use consistent error handling
- Implement request/response interceptors
- Handle authentication tokens
- Type all API responses
- Use React Query for data fetching
