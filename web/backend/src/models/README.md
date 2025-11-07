# Database Models

This directory contains database models for both PostgreSQL and MongoDB.

## Organization

```
models/
├── postgres/           # PostgreSQL models (users, auth, relational data)
└── mongodb/            # MongoDB models (content, articles, flexible data)
```

## Guidelines

- **PostgreSQL**: Use for users, authentication, prayer intentions, progress tracking
- **MongoDB**: Use for educational articles, reflections, miracles, content
- Never mix database concerns
- Use appropriate ORM (Sequelize/TypeORM for PostgreSQL, Mongoose for MongoDB)
- Include proper indexes for performance
- Validate data at model level
