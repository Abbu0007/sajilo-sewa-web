import request from "supertest";
import { createApp } from "../src/app";

describe("Provider Booking API", () => {
  jest.setTimeout(60000);

  const app = createApp();

  it("GET /api/provider/bookings/mine should fail without auth", async () => {
    const res = await request(app).get("/api/provider/bookings/mine");
    expect(res.status).toBe(401);
  });

  it("GET /api/provider/bookings/mine should accept status query", async () => {
    const res = await request(app).get("/api/provider/bookings/mine?status=pending");
    expect(res.status).toBe(401);
  });

  it("GET /api/provider/bookings/earnings should fail without auth", async () => {
    const res = await request(app).get("/api/provider/bookings/earnings");
    expect(res.status).toBe(401);
  });

  it("PATCH /api/provider/bookings/:id/accept should fail without auth", async () => {
    const res = await request(app).patch("/api/provider/bookings/123/accept");
    expect(res.status).toBe(401);
  });

  it("PATCH /api/provider/bookings/:id/reject should fail without auth", async () => {
    const res = await request(app)
      .patch("/api/provider/bookings/123/reject")
      .send({ reason: "not available" });

    expect(res.status).toBe(401);
  });

  it("PATCH /api/provider/bookings/:id/status should fail without auth", async () => {
    const res = await request(app)
      .patch("/api/provider/bookings/123/status")
      .send({ status: "in_progress" });

    expect(res.status).toBe(401);
  });

  it("PATCH reject should require reason payload", async () => {
    const res = await request(app)
      .patch("/api/provider/bookings/123/reject")
      .send({});

    expect(res.status).toBe(401);
  });

  it("PATCH update status should require payload", async () => {
    const res = await request(app)
      .patch("/api/provider/bookings/123/status")
      .send({});

    expect(res.status).toBe(401);
  });

  it("PATCH update status should accept price field", async () => {
    const res = await request(app)
      .patch("/api/provider/bookings/123/status")
      .send({ status: "completed", price: 1000 });

    expect(res.status).toBe(401);
  });

  it("PATCH update status should accept reason field", async () => {
    const res = await request(app)
      .patch("/api/provider/bookings/123/status")
      .send({ status: "cancelled", reason: "client unavailable" });

    expect(res.status).toBe(401);
  });

});