# Test

## Setup

```sh
npm i -D vitest supertest @types/supertest mongodb-memory-server
```

supertest lets tests call your Express endpoints directly (GET /api/users, POST /api/users, etc.) and assert status/body, without manually starting a real HTTP server.

mongodb-memory-server spins up a temporary in-memory MongoDB for tests, so your Mongoose CRUD logic runs against a real database engine (not mocks) and each test run stays isolated/clean.

## Folder structure

Keep production code in src/ only.

Put broader tests in a separate top-level tests/ folder (integration/e2e).

Optionally keep small unit tests co-located next to files in src/ (e.g., \*.test.ts) if your team likes proximity.

Modify tsconfig.json

```json
"compilerOptions": {
    "types": ["node", "vitest/globals"]
},
"include": ["src/**/*.ts"],
"exclude": ["tests", "node_modules", "dist"]
```

Add vitest.config.ts

Add script

```json
"test": "vitest run",
"test:watch": "vitest",
```
