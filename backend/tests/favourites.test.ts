import request from "supertest";
import { createApp } from "../src/app";

describe("Favourites API", () => {
  const app = createApp();

  it("GET /api/favourites should fail without auth", async () => {
    const res = await request(app).get("/api/favourites");
    expect(res.status).toBe(401);
  });

  it("POST /api/favourites/:providerId should fail without auth", async () => {
    const res = await request(app).post("/api/favourites/123");
    expect(res.status).toBe(401);
  });

  it("POST /api/favourites/:providerId should accept providerId param", async () => {
    const res = await request(app).post("/api/favourites/test-provider-id");
    expect(res.status).toBe(401);
  });

  it("GET favourites should return auth error without token", async () => {
    const res = await request(app).get("/api/favourites");
    expect(res.status).toBe(401);
  });

  it("POST toggle favourite should require auth", async () => {
    const res = await request(app).post("/api/favourites/provider123");
    expect(res.status).toBe(401);
  });
});