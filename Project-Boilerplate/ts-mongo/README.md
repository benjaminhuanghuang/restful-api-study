# ts-mongo

RESTful API boilerplate: Express 5 + TypeScript 7 + MongoDB (Mongoose) + Zod + Vitest.

## Stack

- Express 5 (native async error propagation)
- Mongoose 9
- Zod 4 for request validation
- Vitest 5 + Supertest + mongodb-memory-server for tests (no real DB needed to run tests)

## Layout

```
src/
  config/env.ts        # validated environment variables
  db/connection.ts      # mongoose connection
  middlewares/          # errorHandler, notFound
  modules/users/         # routes -> controller -> service -> model (per module)
  app.ts                 # express app (no side effects, importable by tests)
  server.ts              # bootstrap: connect DB + listen
```

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

## Scripts

- `npm run dev` — start with hot reload
- `npm run build` / `npm start` — compile and run
- `npm test` — run the test suite (spins up an in-memory MongoDB)
- `npm run typecheck` — type-check only
