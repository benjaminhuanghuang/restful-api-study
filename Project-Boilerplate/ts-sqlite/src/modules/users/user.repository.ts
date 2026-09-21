import { db } from "../../db/client.ts";
import type { CreateUserInput, UpdateUserInput } from "./user.schema.ts";

export interface UserRow {
  id: number;
  name: string;
  email: string;
  age: number;
  created_at: string;
  updated_at: string;
}

const listStmt = db.prepare("SELECT * FROM users ORDER BY id DESC");
const getStmt = db.prepare("SELECT * FROM users WHERE id = ?");
const insertStmt = db.prepare("INSERT INTO users (name, email, age) VALUES (?, ?, ?) RETURNING *");
const updateStmt = db.prepare(`
  UPDATE users
  SET name = COALESCE(?, name),
      email = COALESCE(?, email),
      age = COALESCE(?, age),
      updated_at = datetime('now')
  WHERE id = ?
  RETURNING *
`);
const deleteStmt = db.prepare("DELETE FROM users WHERE id = ?");

export const userRepository = {
  list(): UserRow[] {
    return listStmt.all() as unknown as UserRow[];
  },

  getById(id: number): UserRow | undefined {
    return getStmt.get(id) as unknown as UserRow | undefined;
  },

  create(input: CreateUserInput): UserRow {
    return insertStmt.get(input.name, input.email, input.age) as unknown as UserRow;
  },

  update(id: number, input: UpdateUserInput): UserRow | undefined {
    const row = updateStmt.get(input.name ?? null, input.email ?? null, input.age ?? null, id);
    return row as unknown as UserRow | undefined;
  },

  remove(id: number): boolean {
    const result = deleteStmt.run(id);
    return result.changes > 0;
  },
};
