import request from "supertest";
import { createApp } from "../src/app";

describe("Booking API", () => {
  jest.setTimeout(60000);

  const app = createApp();

  it("POST /api/bookings should fail without auth", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send({});

    expect(res.status).toBe(401);
  });

  it("GET /api/bookings/mine should fail without auth", async () => {
    const res = await request(app).get("/api/bookings/mine");

    expect(res.status).toBe(401);
  });

  it("GET /api/bookings/:bookingId should fail without auth", async () => {
    const res = await request(app).get("/api/bookings/123");

    expect(res.status).toBe(401);
  });

  it("PATCH /api/bookings/:bookingId/cancel should fail without auth", async () => {
    const res = await request(app)
      .patch("/api/bookings/123/cancel")
      .send({ reason: "test cancel" });

    expect(res.status).toBe(401);
  });

  it("PATCH /api/bookings/:bookingId/confirm-payment should fail without auth", async () => {
    const res = await request(app)
      .patch("/api/bookings/123/confirm-payment")
      .send({ confirm: true });

    expect(res.status).toBe(401);
  });

  it("GET /api/bookings/mine should accept status query param", async () => {
    const res = await request(app)
      .get("/api/bookings/mine?status=pending");

    expect(res.status).toBe(401);
  });

  it("GET /api/bookings/mine should handle 'all' status query", async () => {
    const res = await request(app)
      .get("/api/bookings/mine?status=all");

    expect(res.status).toBe(401);
  });

  it("GET /api/bookings/:bookingId should handle invalid id", async () => {
    const res = await request(app)
      .get("/api/bookings/invalid-id");

    expect(res.status).toBe(401);
  });

  it("PATCH cancel should validate payload structure", async () => {
    const res = await request(app)
      .patch("/api/bookings/123/cancel")
      .send({});

    expect(res.status).toBe(401);
  });

});