# A RESTful API Project Following Best Practices

## Tech stack

- Express
- Typescript
- Zod(verify config and input)
- Vitest
- Jwt
- MongoDB, PostgreSQL in Docker
- Config for dev and prod

## Setup

```sh
npm init -y

npm i express cors
npm i -D typescript @types/node @types/express
```

Node.js v24 supports Typescript

## Config

```sh
npm i dotenv
```

## Test

```sh
npm i -D vitest
```

Modify tsconfig.json

```json
"types": ["node", "vitest/globals"]
```

Add vitest.config.ts

Add script

```json
"test": "vitest run",
"test:watch": "vitest",
```
