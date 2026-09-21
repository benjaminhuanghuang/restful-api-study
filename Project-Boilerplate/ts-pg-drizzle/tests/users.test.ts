import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.ts";
import { db, pool } from "../src/db/client.ts";
import { users } from "../src/db/schema.ts";

// Requires a running Postgres reachable at DATABASE_URL (see docker-compose.yml)
// with migrations applied (`npm run db:push`). Skips gracefully otherwise.

const dbAvailable = await pool
  .query("select 1")
  .then(() => true)
  .catch(() => false);

describe.skipIf(!dbAvailable)("User API", () => {
  beforeEach(async () => {
    await db.delete(users);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("creates and lists a user", async () => {
    const created = await request(app).post("/api/v1/users").send({
      name: "Alice",
      email: "alice@example.com",
      age: 28,
    });

    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ name: "Alice", email: "alice@example.com" });

    const list = await request(app).get("/api/v1/users");
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
  });

  it("rejects invalid payloads", async () => {
    const res = await request(app).post("/api/v1/users").send({ name: "Bad" });
    expect(res.status).toBe(400);
  });

  it("returns 404 for unknown user", async () => {
    const res = await request(app).get("/api/v1/users/999999");
    expect(res.status).toBe(404);
  });

  it("updates and deletes a user", async () => {
    const created = await request(app).post("/api/v1/users").send({
      name: "Bob",
      email: "bob@example.com",
      age: 30,
    });
    const id = created.body.id;

    const updated = await request(app).patch(`/api/v1/users/${id}`).send({ age: 31 });
    expect(updated.status).toBe(200);
    expect(updated.body.age).toBe(31);

    const deleted = await request(app).delete(`/api/v1/users/${id}`);
    expect(deleted.status).toBe(204);
  });
});
