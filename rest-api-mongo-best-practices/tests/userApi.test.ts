import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import app from "../src/app";
import User from "../src/models/User";

describe("User API", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("returns all users", async () => {
    await User.create({
      name: "Alice Johnson",
      email: "alice@example.com",
      age: 28,
    });

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      name: "Alice Johnson",
      email: "alice@example.com",
      age: 28,
    });
  });

  it("creates a user", async () => {
    const response = await request(app).post("/api/users").send({
      name: "Bob Smith",
      email: "bob@example.com",
      age: 32,
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: "Bob Smith",
      email: "bob@example.com",
      age: 32,
    });

    const savedUser = await User.findOne({ email: "bob@example.com" }).lean();
    expect(savedUser).not.toBeNull();
  });

  it("returns one user by id", async () => {
    const user = await User.create({
      name: "Carol Lee",
      email: "carol@example.com",
      age: 25,
    });

    const response = await request(app).get(`/api/users/${user.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      _id: user.id,
      name: "Carol Lee",
      email: "carol@example.com",
      age: 25,
    });
  });

  it("updates a user", async () => {
    const user = await User.create({
      name: "David Kim",
      email: "david@example.com",
      age: 29,
    });

    const response = await request(app).put(`/api/users/${user.id}`).send({
      name: "David Park",
      email: "david.park@example.com",
      age: 30,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      _id: user.id,
      name: "David Park",
      email: "david.park@example.com",
      age: 30,
    });
  });

  it("deletes a user", async () => {
    const user = await User.create({
      name: "Eva Chen",
      email: "eva@example.com",
      age: 31,
    });

    const response = await request(app).delete(`/api/users/${user.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "User deleted" });

    const deletedUser = await User.findById(user.id).lean();
    expect(deletedUser).toBeNull();
  });
});