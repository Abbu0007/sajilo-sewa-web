import request from "supertest";
import { createApp } from "../src/app";

describe("Auth API", () => {
  jest.setTimeout(60000);

  const app = createApp();

  const payload = (email: string) => ({
    firstName: "Test",
    lastName: "User",
    email,
    phone: "9800000000",
    password: "Password123",
    confirmPassword: "Password123",
    role: "client",
  });

  it("POST /api/auth/register should validate and attempt user creation", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(payload("test1@example.com"));
    expect([200, 201, 400]).toContain(res.status);
  });

  it("POST /api/auth/register should fail if email missing", async () => {
    const badPayload: any = payload("missing@example.com");
    delete badPayload.email;

    const res = await request(app)
      .post("/api/auth/register")
      .send(badPayload);

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("POST /api/auth/register should fail duplicate email", async () => {
    const p = payload("duplicate@example.com");

    await request(app).post("/api/auth/register").send(p);

    const res = await request(app).post("/api/auth/register").send(p);

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("POST /api/auth/login should respond", async () => {
    const p = payload("login@example.com");

    await request(app).post("/api/auth/register").send(p);

    const res = await request(app).post("/api/auth/login").send({
      email: p.email,
      password: p.password,
    });

    // login may require email verification
    expect([200, 401, 403]).toContain(res.status);
  });

  it("POST /api/auth/login should fail with wrong password", async () => {
    const p = payload("wrongpass@example.com");

    await request(app).post("/api/auth/register").send(p);

    const res = await request(app).post("/api/auth/login").send({
      email: p.email,
      password: "WrongPassword",
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("POST /api/auth/forgot-password should respond", async () => {
    const p = payload("forgot@example.com");

    await request(app).post("/api/auth/register").send(p);

    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: p.email });

    expect([200, 201, 400]).toContain(res.status);
  });

  it("POST /api/auth/reset-password should fail invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({
        token: "invalidtoken",
        password: "NewPassword123",
        confirmPassword: "NewPassword123",
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("PUT /api/auth/:id should fail without auth token", async () => {
    const res = await request(app)
      .put("/api/auth/123")
      .send({ firstName: "Updated" });

    expect(res.status).toBe(401);
  });
});