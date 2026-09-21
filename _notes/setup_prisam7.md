# Setup prisma 7

```sh
npm i @prisma/client @prisma/adapter-pg
npm i -D prisma
npx prisma init --datasource-provider postgresql
```

Breaking change vs prisma 6: `datasource.url` no longer allowed in `schema.prisma`.

Connection string moves to `prisma.config.ts`, and `PrismaClient` requires a driver adapter

## prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
}
```

## /prisma.config.ts

```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DATABASE_URL! },
});
```

## src/db/client.ts

```ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
```

## Commands

```sh
npx prisma generate        # (re)generate client after schema changes
npx prisma migrate dev     # create + apply migration (dev)
npx prisma migrate deploy  # apply migrations (ci/prod)
npx prisma studio
```
