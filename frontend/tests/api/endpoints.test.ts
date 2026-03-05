import { ENDPOINTS } from "@/lib/api/endpoints";

describe("ENDPOINTS", () => {
  test("auth endpoints", () => {
    expect(ENDPOINTS.login).toBe("/api/auth/login");
    expect(ENDPOINTS.register).toBe("/api/auth/register");
  });

  test("admin user by id", () => {
    expect(ENDPOINTS.adminUserById("123")).toBe("/api/admin/users/123");
  });

  test("providers by service", () => {
    expect(ENDPOINTS.providersByService("plumbing")).toBe("/api/providers/by-service/plumbing");
  });

  test("top rated default", () => {
    expect(ENDPOINTS.topRatedProviders()).toBe("/api/providers/top-rated?limit=8");
  });

  test("top rated custom", () => {
    expect(ENDPOINTS.topRatedProviders(12)).toBe("/api/providers/top-rated?limit=12");
  });

  test("myBookings default", () => {
    expect(ENDPOINTS.myBookings()).toBe("/api/bookings/mine?status=all");
  });

  test("myBookings custom", () => {
    expect(ENDPOINTS.myBookings("pending")).toBe("/api/bookings/mine?status=pending");
  });

  test("favouriteToggle", () => {
    expect(ENDPOINTS.favouriteToggle("p1")).toBe("/api/favourites/p1");
  });

  test("notificationRead", () => {
    expect(ENDPOINTS.notificationRead("n1")).toBe("/api/notifications/n1/read");
  });

  test("providerPublic", () => {
    expect(ENDPOINTS.providerPublic("u1")).toBe("/api/providers/u1");
  });
});