import request from "supertest";
import { createApp } from "../src/app";
import { UserModel } from "../src/models/user.model";
import { NotificationModel } from "../src/models/notification.model";

describe("E2E: Notifications", () => {
  jest.setTimeout(60000);
  const app = createApp();

  const uniqueEmail = (prefix: string) =>
    `${prefix}.${Date.now()}.${Math.floor(Math.random() * 100000)}@example.com`;

  const registerWithFallback = async (payload: any) => {
    const attempts: any[] = [
      payload,
      payload?.password && !payload?.confirmPassword ? { ...payload, confirmPassword: payload.password } : null,
      !payload?.phone ? { ...payload, phone: "9800000001" } : null,
      payload?.password
        ? { ...payload, phone: payload.phone ?? "9800000001", confirmPassword: payload.confirmPassword ?? payload.password }
        : null,
    ].filter(Boolean);

    let last: any = null;

    for (const body of attempts) {
      const res = await request(app).post("/api/auth/register").send(body);
      last = res;
      if ([200, 201].includes(res.status)) return res;
    }

    console.log("REGISTER FAILED:", last?.status, last?.body);
    throw new Error(`Register failed with status ${last?.status}`);
  };

  const forceVerifyEmail = async (email: string) => {
    const u: any = await UserModel.findOne({ email }).lean();
    if (!u) return;

    const patch: any = {};
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
    if (res.status === 401 || res.status === 403) {
      await forceVerifyEmail(email);
      res = await request(app).post("/api/auth/login").send({ email, password });
    }
    expect(res.status).toBe(200);
    return res.body.token as string;
  };

  it("list notifications -> mark one as read", async () => {
    const email = uniqueEmail("e2e.notifs");
    const pass = "Password123!";

    await registerWithFallback({
      firstName: "E2E",
      lastName: "Notif",
      email,
      password: pass,
      role: "client",
      phone: "9800000001",
      confirmPassword: pass,
    });

    const token = await login(email, pass);

    const user: any = await UserModel.findOne({ email }).lean();
    expect(user?._id).toBeTruthy();

    const seeded = await NotificationModel.create({
      userId: String(user._id),
      type: "booking_request",
      title: "Test",
      message: "Test notification",
      isRead: false,
    });

    const list = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${token}`);

    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.items)).toBe(true);

    const mark = await request(app)
      .patch(`/api/notifications/${String(seeded._id)}/read`)
      .set("Authorization", `Bearer ${token}`);

    expect(mark.status).toBe(200);
    expect(mark.body).toHaveProperty("ok", true);

    const updated: any = await NotificationModel.findById(String(seeded._id)).lean();
    expect(updated?.isRead).toBe(true);
  });
});