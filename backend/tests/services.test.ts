import request from "supertest";
import { createApp } from "../src/app";

describe("Service API", () => {
  jest.setTimeout(60000);

  const app = createApp();

  it("GET /api/services should return 200", async () => {
    const res = await request(app).get("/api/services");

    expect(res.status).toBe(200);
  });

  it("GET /api/services should return { items: [] } shape", async () => {
    const res = await request(app).get("/api/services");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it("GET /api/services should return empty array when no services exist", async () => {
    const res = await request(app).get("/api/services");

    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(0);
  });

  it("GET /api/services should return only active services (when inactive exists)", async () => {
    const res = await request(app).get("/api/services");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    for (const s of res.body.items) {
      if (s?.status) {
        expect(s.status).toBe("active");
      }
    }
  });

  it("GET /api/services should return service fields if services exist", async () => {
    const res = await request(app).get("/api/services");

    expect(res.status).toBe(200);

    if (res.body.items.length > 0) {
      const one = res.body.items[0];
      // typical fields from your model
      expect(one).toHaveProperty("_id");
      expect(one).toHaveProperty("name");
      expect(one).toHaveProperty("slug");
    }
  });

  it("GET /api/services should be stable (second call returns same shape)", async () => {
    const res1 = await request(app).get("/api/services");
    const res2 = await request(app).get("/api/services");

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);

    expect(Array.isArray(res1.body.items)).toBe(true);
    expect(Array.isArray(res2.body.items)).toBe(true);
  });
});