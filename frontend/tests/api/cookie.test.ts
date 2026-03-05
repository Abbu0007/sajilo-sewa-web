// tests/api/cookie.test.ts
jest.mock("next/headers", () => ({
  cookies: async () => mockJar,
}));

const mockJar = {
  set: jest.fn(),
  delete: jest.fn(),
  get: jest.fn(),
};

describe("lib/cookie", () => {
  beforeEach(() => {
    jest.resetModules();
    mockJar.set.mockReset();
    mockJar.delete.mockReset();
    mockJar.get.mockReset();
  });

  test("setAuthCookies sets token as httpOnly and user as readable cookie", async () => {
    const { setAuthCookies } = await import("@/lib/cookie");

    await setAuthCookies("TOKEN", { email: "a@b.com", role: "client" });

    // token cookie
    expect(mockJar.set).toHaveBeenCalledWith(
      "ss_token",
      "TOKEN",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );

    // user cookie
    expect(mockJar.set).toHaveBeenCalledWith(
      "ss_user",
      JSON.stringify({ email: "a@b.com", role: "client" }),
      expect.objectContaining({
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );
  });

  test("clearAuthCookies deletes both cookies", async () => {
    const { clearAuthCookies } = await import("@/lib/cookie");

    await clearAuthCookies();

    expect(mockJar.delete).toHaveBeenCalledWith("ss_token");
    expect(mockJar.delete).toHaveBeenCalledWith("ss_user");
  });

  test("getAuthToken returns token value when present", async () => {
    const { getAuthToken } = await import("@/lib/cookie");
    mockJar.get.mockImplementation((k: string) => (k === "ss_token" ? { value: "T1" } : undefined));

    await expect(getAuthToken()).resolves.toBe("T1");
  });

  test("getAuthToken returns empty string when missing", async () => {
    const { getAuthToken } = await import("@/lib/cookie");
    mockJar.get.mockReturnValue(undefined);

    await expect(getAuthToken()).resolves.toBe("");
  });

  test("getAuthUser returns parsed user when valid JSON", async () => {
    const { getAuthUser } = await import("@/lib/cookie");
    mockJar.get.mockImplementation((k: string) =>
      k === "ss_user" ? { value: JSON.stringify({ email: "x@y.com", role: "provider" }) } : undefined
    );

    await expect(getAuthUser()).resolves.toEqual({ email: "x@y.com", role: "provider" });
  });

  test("getAuthUser returns null when missing", async () => {
    const { getAuthUser } = await import("@/lib/cookie");
    mockJar.get.mockReturnValue(undefined);

    await expect(getAuthUser()).resolves.toBeNull();
  });

  test("getAuthUser returns null when invalid JSON", async () => {
    const { getAuthUser } = await import("@/lib/cookie");
    mockJar.get.mockImplementation((k: string) => (k === "ss_user" ? { value: "{bad json" } : undefined));

    await expect(getAuthUser()).resolves.toBeNull();
  });
});