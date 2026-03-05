import request from "supertest";
import { createApp } from "../src/app";
import { UserModel } from "../src/models/user.model";
import { ServiceModel } from "../src/models/service.model";
import { BookingModel } from "../src/models/booking.model";
import { NotificationModel } from "../src/models/notification.model";

describe("E2E: Booking lifecycle (client + provider)", () => {
  jest.setTimeout(120000);
  const app = createApp();

  const uniqueEmail = (prefix: string) =>
    `${prefix}.${Date.now()}.${Math.floor(Math.random() * 100000)}@example.com`;

  const registerWithFallback = async (payload: any) => {
    const attempts: any[] = [
      // attempt 1: as-is
      payload,

      // attempt 2: add confirmPassword if missing
      payload?.password && !payload?.confirmPassword
        ? { ...payload, confirmPassword: payload.password }
        : null,

      // attempt 3: add phone if missing
      !payload?.phone ? { ...payload, phone: "9800000000" } : null,

      // attempt 4: add both phone + confirmPassword
      payload?.password
        ? {
            ...payload,
            phone: payload.phone ?? "9800000000",
            confirmPassword: payload.confirmPassword ?? payload.password,
          }
        : null,
    ].filter(Boolean);

    let last: any = null;

    for (const body of attempts) {
      const res = await request(app).post("/api/auth/register").send(body);
      last = res;
      if ([200, 201].includes(res.status)) return res;
    }

    // helpful debug for you
    // eslint-disable-next-line no-console
    console.log("REGISTER FAILED:", last?.status, last?.body);
    throw new Error(`Register failed with status ${last?.status}`);
  };

  const forceVerifyEmail = async (email: string) => {
    const u: any = await UserModel.findOne({ email }).lean();
    if (!u) return;

    const patch: any = {};

    // handle different field names safely
    if ("isEmailVerified" in u) patch.isEmailVerified = true;
    if ("emailVerified" in u) patch.emailVerified = true;
    if ("emailVerifiedAt" in u) patch.emailVerifiedAt = new Date();
    if ("verifiedAt" in u) patch.verifiedAt = new Date();
    if ("verificationOtp" in u) patch.verificationOtp = null;
    if ("verificationToken" in u) patch.verificationToken = null;

    if (Object.keys(patch).length) {
      await UserModel.updateOne({ email }, { $set: patch });
    }
  };

  const login = async (email: string, password: string) => {
    let res = await request(app).post("/api/auth/login").send({ email, password });

    // if blocked due to verification, verify and retry
    if (res.status === 401 || res.status === 403) {
      await forceVerifyEmail(email);
      res = await request(app).post("/api/auth/login").send({ email, password });
    }

    if (res.status !== 200) {
      // eslint-disable-next-line no-console
      console.log("LOGIN FAILED:", res.status, res.body);
    }

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
    return res.body.token as string;
  };

  it("client creates booking -> provider accepts -> provider sets final price -> client confirms payment", async () => {
    const pass = "Password123!";

    // Seed a Service (createBookingDto requires serviceId)
    const service = await ServiceModel.create({
      name: "Home Cleaning",
      slug: "home-cleaning",
      icon: "home-cleaning.png",
      basePriceFrom: 1000,
      status: "active",
    });

    // Create unique users every run (avoids duplicate email 400)
    const clientEmail = uniqueEmail("e2e.client");
    const providerEmail = uniqueEmail("e2e.provider");

    // Register client
    await registerWithFallback({
      firstName: "E2E",
      lastName: "Client",
      email: clientEmail,
      password: pass,
      role: "client",
      phone: "9800000000",
      confirmPassword: pass,
    });

    // Register provider (include provider fields, because many DTOs require these)
    await registerWithFallback({
      firstName: "E2E",
      lastName: "Provider",
      email: providerEmail,
      password: pass,
      role: "provider",
      phone: "9811111111",
      confirmPassword: pass,
      serviceSlug: "home-cleaning",
      profession: "Cleaner",
    });

    const client: any = await UserModel.findOne({ email: clientEmail }).lean();
    const provider: any = await UserModel.findOne({ email: providerEmail }).lean();
    expect(client?._id).toBeTruthy();
    expect(provider?._id).toBeTruthy();

    // Login
    const clientToken = await login(clientEmail, pass);
    const providerToken = await login(providerEmail, pass);

    // Create booking
    const scheduledAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const created = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({
        providerId: String(provider._id),
        serviceId: String(service._id),
        scheduledAt,
        note: "E2E booking note",
        addressText: "Kathmandu, Nepal",
      });

    if (created.status !== 201) {
      // eslint-disable-next-line no-console
      console.log("CREATE BOOKING FAILED:", created.status, created.body);
    }

    expect(created.status).toBe(201);
    const bookingId = String(created.body?.booking?._id ?? "");
    expect(bookingId.length).toBeGreaterThan(5);

    // Provider accepts
    const accepted = await request(app)
      .patch(`/api/provider/bookings/${bookingId}/accept`)
      .set("Authorization", `Bearer ${providerToken}`);
    expect(accepted.status).toBe(200);

    // Provider -> in_progress
    const inProgress = await request(app)
      .patch(`/api/provider/bookings/${bookingId}/status`)
      .set("Authorization", `Bearer ${providerToken}`)
      .send({ status: "in_progress" });
    expect(inProgress.status).toBe(200);

    // Provider -> awaiting_payment_confirmation (price required)
    const awaiting = await request(app)
      .patch(`/api/provider/bookings/${bookingId}/status`)
      .set("Authorization", `Bearer ${providerToken}`)
      .send({ status: "awaiting_payment_confirmation", price: 1500 });
    expect(awaiting.status).toBe(200);

    // Client confirms payment -> completed
    const confirm = await request(app)
      .patch(`/api/bookings/${bookingId}/confirm-payment`)
      .set("Authorization", `Bearer ${clientToken}`);
    expect(confirm.status).toBe(200);

    // Verify DB state
    const b: any = await BookingModel.findById(bookingId).lean();
    expect(b?.status).toBe("completed");
    expect(b?.paymentStatus).toBe("paid");

    // Verify notifications exist
    const clientNotifs = await NotificationModel.find({ userId: String(client._id) }).lean();
    const providerNotifs = await NotificationModel.find({ userId: String(provider._id) }).lean();
    expect(clientNotifs.length).toBeGreaterThan(0);
    expect(providerNotifs.length).toBeGreaterThan(0);
  });
});