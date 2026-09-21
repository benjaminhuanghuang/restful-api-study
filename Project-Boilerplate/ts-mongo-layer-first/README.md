# ts-mongo-layer-frist

Same API as [`ts-mongo`](../ts-mongo) (Express 5 + TypeScript 7 + MongoDB/Mongoose + Zod + Vitest),
but organized **layer-first** instead of feature-first — for comparing the two structures.
See [`Best Practices/project-structure-layer-first.md`](../../Best%20Practices/project-structure-layer-first.md).

## Layout

```
src/
  config/env.ts
  db/connection.ts
  routes/userRoutes.ts
  controllers/userController.ts
  services/userService.ts
  models/User.ts
  validators/user.validator.ts
  middlewares/          # errorHandler, notFound
  utils/AppError.ts
  app.ts
  server.ts
```

Same resource (`User`) as `ts-mongo`, but its routes/controller/service/model/validator each
live in their own top-level folder instead of one `modules/users/` folder. Notice how many
folders you have to jump between to trace a single field through the request lifecycle —
that's the tradeoff this structure makes.

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
