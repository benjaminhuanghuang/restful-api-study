import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.ts";
import { UserModel } from "../src/modules/users/user.model.ts";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User API", () => {
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
    const res = await request(app).get("/api/v1/users/64b64b64b64b64b64b64b64b");
    expect(res.status).toBe(404);
  });

  it("updates and deletes a user", async () => {
    const created = await request(app).post("/api/v1/users").send({
      name: "Bob",
      email: "bob@example.com",
      age: 30,
    });
    const id = created.body._id;

    const updated = await request(app).patch(`/api/v1/users/${id}`).send({ age: 31 });
    expect(updated.status).toBe(200);
    expect(updated.body.age).toBe(31);

    const deleted = await request(app).delete(`/api/v1/users/${id}`);
    expect(deleted.status).toBe(204);
  });
});
