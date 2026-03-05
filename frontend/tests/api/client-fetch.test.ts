// Mock next/headers cookies()
jest.mock("next/headers", () => ({
  cookies: async () => ({
    get: (key: string) => {
      if (key === "ss_token") return { value: "TOKEN123" };
      return undefined;
    },
  }),
}));

import { apiGet, apiPost, apiPatch, apiDelete, apiPostForm } from "@/lib/api/client";

function mockFetchOnce(res: Partial<Response> & { json?: any }) {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: res.ok ?? true,
    json: res.json ?? (async () => ({})),
  });
}

describe("client fetch wrapper", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("apiGet without auth does not set Authorization", async () => {
    mockFetchOnce({ ok: true, json: async () => ({ hello: "world" }) });

    const data = await apiGet<any>("/api/test", false);

    expect(data).toEqual({ hello: "world" });
    const call = (global as any).fetch.mock.calls[0];
    expect(call[0]).toContain("/api/test");
    expect(call[1].headers.Authorization).toBeUndefined();
  });

  test("apiGet with auth sets Authorization", async () => {
    mockFetchOnce({ ok: true, json: async () => ({ ok: 1 }) });

    await apiGet<any>("/api/test", true);

    const opts = (global as any).fetch.mock.calls[0][1];
    expect(opts.headers.Authorization).toBe("Bearer TOKEN123");
  });

  test("apiPost sends JSON body", async () => {
    mockFetchOnce({ ok: true, json: async () => ({ id: 1 }) });

    const out = await apiPost<any>("/api/x", { a: 1 }, false);

    expect(out).toEqual({ id: 1 });
    const opts = (global as any).fetch.mock.calls[0][1];
    expect(opts.method).toBe("POST");
    expect(opts.body).toBe(JSON.stringify({ a: 1 }));
  });

  test("apiPatch works", async () => {
    mockFetchOnce({ ok: true, json: async () => ({ updated: true }) });

    const out = await apiPatch<any>("/api/x", { a: 2 }, true);
    expect(out).toEqual({ updated: true });
  });

  test("apiDelete works", async () => {
    mockFetchOnce({ ok: true, json: async () => ({ deleted: true }) });

    const out = await apiDelete<any>("/api/x", true);
    expect(out).toEqual({ deleted: true });
  });

  test("apiPostForm sends FormData without Content-Type", async () => {
    mockFetchOnce({ ok: true, json: async () => ({ uploaded: true }) });

    const fd = new FormData();
    fd.append("x", "y");

    const out = await apiPostForm<any>("/api/upload", fd, true);
    expect(out).toEqual({ uploaded: true });

    const opts = (global as any).fetch.mock.calls[0][1];
    expect(opts.method).toBe("POST");
    // It should NOT force content-type for multipart
    expect(opts.headers["Content-Type"]).toBeUndefined();
    expect(opts.headers.Authorization).toBe("Bearer TOKEN123");
  });

  test("error message prefers data.message", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Nope" }),
    });

    await expect(apiGet("/api/fail", false)).rejects.toThrow("Nope");
  });

  test("error message falls back to data.error", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Bad" }),
    });

    await expect(apiGet("/api/fail", false)).rejects.toThrow("Bad");
  });

  test("parseJsonSafe fallback when json throws", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error("invalid json");
      },
    });

    await expect(apiGet("/api/fail", false)).rejects.toThrow("Request failed");
  });
});