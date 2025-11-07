# State Management

This directory contains global state management using Zustand.

## Structure

```
store/
├── auth.store.ts       # Authentication state
├── ui.store.ts         # UI state (theme, modals, etc.)
├── user.store.ts       # User profile state
└── index.ts            # Store exports
```

## Standards

- Use Zustand for global state
- Keep state minimal and normalized
- Implement persist middleware for authentication
- Use React Query for server state
- Document store structure and actions
