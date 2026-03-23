# Test setup

```sh
npm i -D vitest supertest @types/supertest mongodb-memory-server
```

supertest lets tests call your Express endpoints directly (GET /api/users, POST /api/users, etc.) and assert status/body, without manually starting a real HTTP server.

mongodb-memory-server spins up a temporary in-memory MongoDB for tests, so your Mongoose CRUD logic runs against a real database engine (not mocks) and each test run stays isolated/clean.

## tsconfig

```json
{
  "compilerOptions": {
    "types": ["node", "vitest/globals"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["tests", "node_modules", "dist"]
}
```
