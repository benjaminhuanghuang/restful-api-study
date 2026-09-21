# ts-pg-drizzle

RESTful API boilerplate: Express 5 + TypeScript 7 + PostgreSQL via Drizzle ORM.

## Stack

- Express 5 (native async error propagation)
- Drizzle ORM + `pg` (node-postgres) driver, Drizzle Kit for migrations
- Zod 4 for request/params validation
- Vitest 5 + Supertest (integration tests skip automatically if no Postgres is reachable)

## Layout

```
src/
  config/env.ts        # validated environment variables
  db/schema.ts           # drizzle table definitions
  db/client.ts            # pg Pool + drizzle instance
  middlewares/           # errorHandler, notFound
  modules/users/          # routes -> controller -> service -> repository
  app.ts                  # express app (no side effects, importable by tests)
  server.ts               # bootstrap: listen
drizzle/                  # generated SQL migrations
drizzle.config.ts
docker-compose.yml         # local Postgres for development/tests
```

## Getting started

```bash
cp .env.example .env
docker compose up -d      # starts Postgres on localhost:5432
npm install
npm run db:push           # sync schema to the database (or db:generate + db:migrate)
npm run dev
```

## Scripts

- `npm run dev` — start with hot reload
- `npm run build` / `npm start` — compile and run
- `npm test` — run the test suite (skips DB-backed tests if Postgres isn't reachable)
- `npm run typecheck` — type-check only
- `npm run db:generate` — generate SQL migrations from `src/db/schema.ts`
- `npm run db:migrate` — apply generated migrations
- `npm run db:push` — push schema directly (good for local dev)
- `npm run db:studio` — open Drizzle Studio
