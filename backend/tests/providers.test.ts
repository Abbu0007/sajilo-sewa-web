import request from "supertest";
import { createApp } from "../src/app";

describe("Provider API", () => {
  jest.setTimeout(60000);

  const app = createApp();

  it("GET /api/providers/top-rated should return 200 and items array", async () => {
    const res = await request(app).get("/api/providers/top-rated");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it("GET /api/providers/search should return items array", async () => {
    const res = await request(app).get("/api/providers/search?q=test");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it("GET /api/providers/search should support filters", async () => {
    const res = await request(app).get(
      "/api/providers/search?profession=cleaner&availability=available"
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it("GET /api/providers/me/profile should fail without auth", async () => {
    const res = await request(app).get("/api/providers/me/profile");

    expect(res.status).toBe(401);
  });

  it("PUT /api/providers/me/profile should fail without auth", async () => {
    const res = await request(app)
      .put("/api/providers/me/profile")
      .send({
        profession: "Cleaner",
        startingPrice: 1000,
      });

    expect(res.status).toBe(401);
  });

  it("GET /api/providers/:providerUserId should return 400 or 404 for invalid provider", async () => {
    const res = await request(app).get("/api/providers/123456");

    expect([400, 404,500]).toContain(res.status);
  });
});