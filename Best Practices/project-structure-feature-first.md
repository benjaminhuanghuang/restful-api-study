# Project structure - Feature first

group by resource (module), not by layer.

```text
src/
  config/env.ts          # validated env vars (zod)
  db/                     # connection/client (mongo/prisma/drizzle/sqlite)
  middlewares/
    errorHandler.ts        # error -> HTTP response
    notFound.ts
  modules/
    users/
      user.routes.ts        # Router: verb+path -> controller
      user.controller.ts     # parse req, call service, shape res
      user.service.ts         # business logic, throws AppError
      user.repository.ts       # only layer touching the DB
      user.schema.ts            # zod validation
  utils/AppError.ts
  app.ts                    # express app, no side effects
  server.ts                 # connect DB + listen (entrypoint)
tests/
  <resource>.test.ts        # supertest against app.ts
```

## Split app.ts vs server.ts

`app.ts` builds the app only (importable by tests, no port/DB opened on import).
`server.ts` is the only file with side effects — connects DB, `app.listen()` — and the actual entrypoint.

## Layers

- routers = wiring only, maps verb+path to a controller method, no logic.
- controller = HTTP only, no DB.
- service = business rules, throws `AppError`.
- repository/model = only place touching the DB. Skip the service layer for trivial CRUD; add it once there's real logic to test/reuse.

## Errors

one `errorHandler` at the end of `app.ts` maps `ZodError`→400, `AppError`→its status, else→500. Express 5 auto-forwards thrown/rejected errors, so no try/catch per controller.
