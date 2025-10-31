# Eucharist Web Backend

Node.js + Express + TypeScript REST API backend.

## Structure

- `src/`
  - `controllers/` - Request handlers for routes
  - `models/` - Database models (PostgreSQL + MongoDB)
  - `routes/` - API route definitions
  - `middleware/` - Express middleware (auth, validation, error handling)
  - `services/` - Business logic layer
  - `utils/` - Utility functions
  - `validators/` - Input validation schemas (Zod)
  - `config/` - Configuration files
  - `app.js` - Express application setup
- `tests/` - Backend tests (Jest + Supertest)

## Tech Stack

- Node.js 18+
- Express
- TypeScript
- PostgreSQL (users, auth, relational data)
- MongoDB (content, flexible documents)
- Redis (caching)
- JWT authentication

## Development

```bash
npm install
npm run dev
```

**Note**: This is a planning directory. Implementation code has not been created yet.
