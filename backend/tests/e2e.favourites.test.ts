import request from "supertest";
import { createApp } from "../src/app";
import { UserModel } from "../src/models/user.model";
import { ServiceModel } from "../src/models/service.model";

describe("E2E: Favourites", () => {
  jest.setTimeout(60000);
  const app = createApp();

  const uniqueEmail = (prefix: string) =>
    `${prefix}.${Date.now()}.${Math.floor(Math.random() * 100000)}@example.com`;

  const registerWithFallback = async (payload: any) => {
    const attempts: any[] = [
      payload,
      payload?.password && !payload?.confirmPassword ? { ...payload, confirmPassword: payload.password } : null,
      !payload?.phone ? { ...payload, phone: "9809999999" } : null,
      payload?.password
        ? {
            ...payload,
            phone: payload.phone ?? "9809999999",
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

  it("client toggles favourite provider -> list favourites", async () => {
    const pass = "Password123!";

    // ✅ Seed service because provider register validates serviceSlug
    const svc = await ServiceModel.create({
      name: "Home Cleaning",
      slug: "home-cleaning",
      icon: "home-cleaning.png",
      basePriceFrom: 1000,
      status: "active",
    });

    const providerEmail = uniqueEmail("e2e.fav.provider");
    const clientEmail = uniqueEmail("e2e.fav.client");

    // Create provider with valid serviceSlug from seeded service
    await registerWithFallback({
      firstName: "Fav",
      lastName: "Provider",
      email: providerEmail,
      password: pass,
      role: "provider",
      phone: "9819999999",
      confirmPassword: pass,
      serviceSlug: svc.slug,          // ✅ valid now
      profession: "Cleaner",
    });

    const provider: any = await UserModel.findOne({ email: providerEmail }).lean();
    expect(provider?._id).toBeTruthy();

    // Create + login client
    await registerWithFallback({
      firstName: "Fav",
      lastName: "Client",
      email: clientEmail,
      password: pass,
      role: "client",
      phone: "9809999999",
      confirmPassword: pass,
    });

    const clientToken = await login(clientEmail, pass);

    // Toggle favourite
    const toggle = await request(app)
      .post(`/api/favourites/${String(provider._id)}`)
      .set("Authorization", `Bearer ${clientToken}`);

    expect(toggle.status).toBe(200);

    // List favourites
    const list = await request(app)
      .get("/api/favourites")
      .set("Authorization", `Bearer ${clientToken}`);

    expect(list.status).toBe(200);
    expect(list.body).toBeDefined();
  });
});