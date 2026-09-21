# Project Boilerplate

Four self-contained RESTful API boilerplates, same stack skeleton (Express 5 +
TypeScript 7 + Zod 4 + Vitest 5, Controller → Service → Repository/Model layering,
centralized error handling, `/api/v1` prefix), differing only in persistence:

| Folder | Persistence | Notes |
| --- | --- | --- |
| [ts-mongo](./ts-mongo) | MongoDB (Mongoose) | Tests run against `mongodb-memory-server`, no external DB needed |
| [ts-sqlite](./ts-sqlite) | SQLite (`node:sqlite`, no ORM) | Zero extra dependencies, Node >= 24, tests use an in-memory DB |
| [ts-pg-drizzle](./ts-pg-drizzle) | PostgreSQL (Drizzle ORM) | `docker-compose.yml` for local Postgres; integration tests skip if unreachable |
| [ts-pg-prisma](./ts-pg-prisma) | PostgreSQL (Prisma ORM 7, driver adapter) | `docker-compose.yml` for local Postgres; integration tests skip if unreachable |
| [ts-mongo-layer-frist](./ts-mongo-layer-frist) | MongoDB (Mongoose) | Same API as `ts-mongo`, but folders organized layer-first instead of feature-first — study comparison, see [project-structure-layer-first.md](../Best%20Practices/project-structure-layer-first.md) |
| [ts-sqlite-layer-first](./ts-sqlite-layer-first) | SQLite (`node:sqlite`, no ORM) | Same API as `ts-sqlite`, layer-first structure — study comparison |

Each project is independent — `cd` into one, `cp .env.example .env`, `npm install`, `npm run dev`.
See each folder's own README for specifics.
