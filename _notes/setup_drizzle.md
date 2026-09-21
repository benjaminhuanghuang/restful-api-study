# Setup drizzle

```sh
npm i drizzle-orm pg
npm i -D drizzle-kit @types/pg
```

## src/db/schema.ts

```ts
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  age: integer("age").notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

## src/db/client.ts

```ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.ts";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
```

## drizzle.config.ts (project root)

```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

## Commands

```sh
npx drizzle-kit generate  # diff schema.ts -> SQL migration file under ./drizzle
npx drizzle-kit migrate   # apply generated migrations
npx drizzle-kit push      # push schema straight to db, skip migration files (good for local dev)
npx drizzle-kit studio
```

## Querying

```ts
import { eq } from "drizzle-orm";
import { db } from "./db/client.ts";
import { users } from "./db/schema.ts";

await db.select().from(users);
await db.select().from(users).where(eq(users.id, 1));
await db.insert(users).values({ email: "a@b.com", age: 20 }).returning();
await db.update(users).set({ age: 21 }).where(eq(users.id, 1)).returning();
await db.delete(users).where(eq(users.id, 1));
```
