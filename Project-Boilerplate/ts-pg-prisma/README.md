# ts-pg-prisma

RESTful API boilerplate: Express 5 + TypeScript 7 + PostgreSQL via Prisma ORM 7
(driver-adapter based client, no Rust query engine).

## Stack

- Express 5 (native async error propagation)
- Prisma ORM 7 with `@prisma/adapter-pg` (`node-postgres` driver adapter)
- Zod 4 for request/params validation
- Vitest 5 + Supertest (integration tests skip automatically if no Postgres is reachable)

## Layout

```
src/
  config/env.ts          # validated environment variables
  db/client.ts             # PrismaClient wired to the pg driver adapter
  generated/prisma/         # generated Prisma Client (gitignored, run db:generate)
  middlewares/             # errorHandler (maps Prisma errors too), notFound
  modules/users/            # routes -> controller -> service -> repository
  app.ts                    # express app (no side effects, importable by tests)
  server.ts                 # bootstrap: listen
prisma/schema.prisma        # models (connection URL lives in prisma.config.ts, not the schema)
prisma.config.ts
docker-compose.yml           # local Postgres for development/tests
```

## Getting started

```bash
cp .env.example .env
docker compose up -d       # starts Postgres on localhost:5432
npm install                 # postinstall runs `prisma generate`
npm run db:migrate          # creates the users table
npm run dev
```

## Scripts

- `npm run dev` — start with hot reload
- `npm run build` / `npm start` — compile and run
- `npm test` — run the test suite (skips DB-backed tests if Postgres isn't reachable)
- `npm run typecheck` — type-check only
- `npm run db:generate` — regenerate the Prisma Client after schema changes
- `npm run db:migrate` — create/apply a migration (dev)
- `npm run db:deploy` — apply existing migrations (CI/prod)
- `npm run db:studio` — open Prisma Studio

## Notes

- Prisma 7 removed the `url` field from the `datasource` block in `schema.prisma`;
  the connection string now lives in `prisma.config.ts` (for the CLI/migrations) and is
  passed to the driver adapter in `src/db/client.ts` (for the running app).
