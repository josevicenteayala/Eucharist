# Database Models

This directory contains database models for both PostgreSQL and MongoDB.

## Organization

```
models/
├── postgres/           # PostgreSQL models (users, auth, relational data)
└── mongodb/            # MongoDB models (content, articles, flexible data)
```

## PostgreSQL Schema

The PostgreSQL schema is defined in `src/database/migrations/`. See `src/database/README.md` for details.

**Core tables**:
- `users` - User authentication and account information
- `user_profiles` - Extended user profile and preferences
- `gospel_readings` - Daily liturgical readings
- `reflections` - User reflections on readings

**TypeScript types**: Available in `src/database/schemas/index.ts`

## Guidelines

- **PostgreSQL**: Use for users, authentication, prayer intentions, progress tracking
- **MongoDB**: Use for educational articles, reflections, miracles, content
- Never mix database concerns
- Use appropriate ORM (Sequelize/TypeORM for PostgreSQL, Mongoose for MongoDB)
- Include proper indexes for performance
- Validate data at model level
