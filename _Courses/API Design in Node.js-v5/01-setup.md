# Setup

run ts code using node 23

```json
"dev": "node --watch src/index.ts",
```

```sh
npm i zod dotenv
```

env.ts

```ts
// Load .env file
if (isDevelopment) {
  dotenv.config();
} else if (isTest) {
  dotenv.config({ path: ".env.test" });
}
```
