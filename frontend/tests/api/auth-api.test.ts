jest.mock("@/lib/api/axios", () => ({
  http: { post: jest.fn() },
}));

import { http } from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { loginApi, registerApi } from "@/lib/api/auth";

describe("auth API (axios)", () => {
  test("loginApi posts to login endpoint and returns data", async () => {
    (http.post as jest.Mock).mockResolvedValueOnce({ data: { token: "t", user: { id: 1 } } });

    const payload = { email: "a@b.com", password: "123456" };
    const data = await loginApi(payload);

    expect(http.post).toHaveBeenCalledWith(ENDPOINTS.login, payload);
    expect(data).toEqual({ token: "t", user: { id: 1 } });
  });

  test("registerApi posts to register endpoint and returns data", async () => {
    (http.post as jest.Mock).mockResolvedValueOnce({ data: { token: "t2", user: { id: 2 } } });

    const payload = {
      firstName: "A",
      lastName: "B",
      email: "a@b.com",
      phone: "9800000000",
      role: "client" as const,
      password: "123456",
    };

    const data = await registerApi(payload);

    expect(http.post).toHaveBeenCalledWith(ENDPOINTS.register, payload);
    expect(data).toEqual({ token: "t2", user: { id: 2 } });
  });
});