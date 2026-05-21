# Prisma Migrations

This directory stores migration history files created by Prisma Migrate.

## Current Status

**No migrations have been run yet.** This directory is a placeholder.

## Commands

```bash
# Create a new migration (after schema changes)
npx prisma migrate dev --name <description>

# Apply migrations in production
npx prisma migrate deploy

# Development schema sync (no migration file)
npx prisma db push

# Reset and re-migrate
npx prisma migrate reset
```

## Required Setup

Before running migrations, ensure PostgreSQL has the pgvector extension:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## Notes

- The `Embedding.vector` field uses `Unsupported("vector(1536)")` which requires special Prisma handling
- Use `prisma db push` for development until migration files are generated
- After first `migrate dev`, this directory will contain SQL migration files
