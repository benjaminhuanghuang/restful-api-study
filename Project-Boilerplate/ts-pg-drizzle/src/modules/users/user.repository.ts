import { eq } from "drizzle-orm";
import { db } from "../../db/client.ts";
import { users } from "../../db/schema.ts";
import type { CreateUserInput, UpdateUserInput } from "./user.schema.ts";

export const userRepository = {
  list() {
    return db.select().from(users).orderBy(users.id);
  },

  async getById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  async create(input: CreateUserInput) {
    const [user] = await db.insert(users).values(input).returning();
    return user!;
  },

  async update(id: number, input: UpdateUserInput) {
    const [user] = await db
      .update(users)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  },

  async remove(id: number) {
    const result = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
    return result.length > 0;
  },
};
