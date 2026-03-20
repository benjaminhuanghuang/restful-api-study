# Database & Environment Setup

src/loaders/db.ts

```ts
const connect =
  process.env.NODE_ENV === "production" ? connectDB : connectDBTest;
```
