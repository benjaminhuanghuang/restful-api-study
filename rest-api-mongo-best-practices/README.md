# A RESTful API Project Following Best Practices

## Tech stack

- Express
- Typescript
- Zod(verify config and input)
- Vitest
- Jwt
- MongoDB
- Config for dev and prod

## Setup

```sh
npm init -y

npm i express cors
npm i -D typescript @types/node @types/express tsx
```

Node.js v24 supports Typescript

## Config

```sh
npm i dotenv
```

### env validation

## Test

```sh
npm i -D vitest supertest @types/supertest mongodb-memory-server
```

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
