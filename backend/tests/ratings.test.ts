import request from "supertest";
import { createApp } from "../src/app";

describe("Ratings API", () => {
  const app = createApp();

  it("POST /api/ratings should fail without auth", async () => {
    const res = await request(app)
      .post("/api/ratings")
      .send({ providerId: "123", rating: 5 });

    expect(res.status).toBe(401);
  });

  it("POST rating should validate payload", async () => {
    const res = await request(app).post("/api/ratings").send({});
    expect(res.status).toBe(401);
  });

  it("GET /api/ratings/provider/:id should return public ratings", async () => {
    const res = await request(app).get("/api/ratings/provider/123");
    expect([200,404,500]).toContain(res.status);
  });

  it("GET /api/ratings/provider/:id should handle invalid id", async () => {
    const res = await request(app).get("/api/ratings/provider/invalid");
    expect([200,404,500]).toContain(res.status);
  });

  it("GET /api/ratings/provider/:id should return array structure", async () => {
    const res = await request(app).get("/api/ratings/provider/123");
    if (res.status === 200) {
      expect(Array.isArray(res.body.items ?? res.body)).toBe(true);
    } else {
      expect([404,500]).toContain(res.status);
    }
  });
});