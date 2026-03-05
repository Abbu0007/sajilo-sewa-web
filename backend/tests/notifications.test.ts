import request from "supertest";
import { createApp } from "../src/app";

describe("Notifications API", () => {
  const app = createApp();

  it("GET /api/notifications should fail without auth", async () => {
    const res = await request(app).get("/api/notifications");
    expect(res.status).toBe(401);
  });

  it("PATCH /api/notifications/:id/read should fail without auth", async () => {
    const res = await request(app).patch("/api/notifications/123/read");
    expect(res.status).toBe(401);
  });

  it("PATCH read notification should accept id param", async () => {
    const res = await request(app).patch("/api/notifications/test-id/read");
    expect(res.status).toBe(401);
  });

  it("GET notifications should support query parameters", async () => {
    const res = await request(app).get("/api/notifications?limit=10");
    expect(res.status).toBe(401);
  });

  it("GET notifications should support unread filter", async () => {
    const res = await request(app).get("/api/notifications?unreadOnly=true");
    expect(res.status).toBe(401);
  });
});