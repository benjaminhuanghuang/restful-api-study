# ts-sqlite-layer-first

Same API as [`ts-sqlite`](../ts-sqlite) (Express 5 + TypeScript 7 + `node:sqlite`, no ORM),
but organized **layer-first** instead of feature-first — for comparing the two structures.
See [`Best Practices/project-structure-layer-first.md`](../../Best%20Practices/project-structure-layer-first.md).

## Layout

```
src/
  config/env.ts
  db/client.ts
  routes/userRoutes.ts
  controllers/userController.ts
  services/userService.ts
  repositories/userRepository.ts
  validators/user.validator.ts
  middlewares/          # errorHandler, notFound
  utils/AppError.ts
  app.ts
  server.ts
```

Same resource (`User`) as `ts-sqlite`, but its route/controller/service/repository/validator
each live in their own top-level folder instead of one `modules/users/` folder.

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
