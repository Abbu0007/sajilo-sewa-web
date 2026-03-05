import request from "supertest";
import { createApp } from "../src/app";

describe("Health API", () => {
  it("GET /health should return ok true", async () => {
    const app = createApp();

    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});