# ts-sqlite

RESTful API boilerplate: Express 5 + TypeScript 7 + SQLite via Node's built-in `node:sqlite`
(no ORM, no native-module install). Requires Node >= 24.

## Stack

- Express 5 (native async error propagation)
- `node:sqlite` (`DatabaseSync`) with hand-written prepared statements
- Zod 4 for request/params validation
- Vitest 5 + Supertest, tests run against an in-memory database

## Layout

```
src/
  config/env.ts        # validated environment variables
  db/client.ts           # DatabaseSync instance + schema bootstrap
  middlewares/          # errorHandler, notFound
  modules/users/         # routes -> controller -> service -> repository
  app.ts                 # express app (no side effects, importable by tests)
  server.ts              # bootstrap: open DB + listen
```

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

By default the database file is written to `./data/app.db` (auto-created). Set
`SQLITE_FILE=:memory:` for an ephemeral database.

## Scripts

- `npm run dev` — start with hot reload
- `npm run build` / `npm start` — compile and run
- `npm test` — run the test suite (uses an in-memory DB)
- `npm run typecheck` — type-check only
