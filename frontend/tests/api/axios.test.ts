import axios from "axios";

describe("axios http instance", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("defaults baseURL when env not set", async () => {
    delete process.env.NEXT_PUBLIC_API_BASE;
    const mod = await import("@/lib/api/axios");
    expect(mod.http.defaults.baseURL).toBe("http://localhost:5000");
    expect(mod.http.defaults.withCredentials).toBe(true);
  });

  test("uses env baseURL when set", async () => {
    process.env.NEXT_PUBLIC_API_BASE = "http://example.com";
    const mod = await import("@/lib/api/axios");
    expect(mod.http.defaults.baseURL).toBe("http://example.com");
  });

  test("interceptor message priority: response.data.message", async () => {
    const mod = await import("@/lib/api/axios");

    const handlers: any = (mod.http.interceptors.response as any).handlers;
    const rejected = handlers[0].rejected;

    await expect(
      rejected({ response: { data: { message: "Boom" } } })
    ).rejects.toThrow("Boom");
  });

  test("interceptor message priority: response.data.error", async () => {
    const mod = await import("@/lib/api/axios");
    const handlers: any = (mod.http.interceptors.response as any).handlers;
    const rejected = handlers[0].rejected;

    await expect(
      rejected({ response: { data: { error: "Bad" } } })
    ).rejects.toThrow("Bad");
  });

  test("interceptor fallback: error.message", async () => {
    const mod = await import("@/lib/api/axios");
    const handlers: any = (mod.http.interceptors.response as any).handlers;
    const rejected = handlers[0].rejected;

    await expect(rejected({ message: "Network" })).rejects.toThrow("Network");
  });

  test("interceptor fallback: Request failed", async () => {
    const mod = await import("@/lib/api/axios");
    const handlers: any = (mod.http.interceptors.response as any).handlers;
    const rejected = handlers[0].rejected;

    await expect(rejected({})).rejects.toThrow("Request failed");
  });
});