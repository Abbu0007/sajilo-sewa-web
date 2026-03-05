// tests/api/provider-actions.test.ts
jest.mock("@/lib/cookie", () => ({
  getAuthToken: jest.fn(),
}));

import { getAuthToken } from "@/lib/cookie";

import {
  providerGetMe,
  providerUpdateMe,
  providerUploadAvatar,
  providerGetProfile,
  providerUpdateProfile,
  providerGetBookings,
  providerAcceptBooking,
  providerRejectBooking,
  providerUpdateBookingStatus,
  providerGetNotifications,
  providerMarkNotificationRead,
  providerCreateRating,
  providerGetEarnings,
} from "@/lib/actions/provider-actions";

function mockFetchOnce(payload: any, ok: boolean = true) {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok,
    json: async () => payload,
  });
}

describe("provider-actions", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (getAuthToken as jest.Mock).mockResolvedValue("TOKEN123");
  });

  test("providerGetMe maps id fields correctly", async () => {
    mockFetchOnce({ user: { _id: 1, firstName: "A", lastName: "B", email: "a@b.com", role: "provider" } });

    const me = await providerGetMe();

    expect(me).toMatchObject({ id: "1", firstName: "A", lastName: "B", email: "a@b.com", role: "provider" });
    expect((global as any).fetch).toHaveBeenCalled();
  });

  test("providerUpdateMe sends PATCH with json and returns user", async () => {
    mockFetchOnce({ user: { _id: "u1", firstName: "New", lastName: "Name" } });

    const out = await providerUpdateMe({ firstName: "New", lastName: "Name" });

    expect(out).toMatchObject({ _id: "u1", firstName: "New" });

    const [, init] = (global as any).fetch.mock.calls[0];
    expect(init.method).toBe("PATCH");
    expect(init.headers["Content-Type"]).toBe("application/json");
  });

  test("providerUploadAvatar throws 'Avatar upload failed' when backend gives no msg/error", async () => {
    (getAuthToken as jest.Mock).mockResolvedValue("TOKEN123");

    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    const file = new File(["x"], "a.png", { type: "image/png" });
    await expect(providerUploadAvatar(file)).rejects.toThrow("Avatar upload failed");
  });

  test("providerGetProfile returns null if no profile", async () => {
    mockFetchOnce({ profile: null });
    await expect(providerGetProfile()).resolves.toBeNull();
  });

  test("providerGetBookings maps nested client/service correctly", async () => {
    mockFetchOnce({
      items: [
        {
          _id: 1,
          status: "pending",
          scheduledAt: "2026-01-01",
          clientId: { _id: 2, firstName: "C", lastName: "D", ratingAvg: 4, ratingCount: 1, completedBookings: 3 },
          serviceId: { _id: 3, name: "Plumbing", icon: "p.png", basePriceFrom: 100 },
        },
      ],
    });

    const items = await providerGetBookings("pending");
    expect(items[0]).toMatchObject({
      id: "1",
      status: "pending",
      client: { id: "2", firstName: "C", lastName: "D", ratingAvg: 4, ratingCount: 1, completedBookings: 3 },
      service: { id: "3", name: "Plumbing", basePriceFrom: 100 },
    });
  });

  test("providerAcceptBooking calls PATCH and returns booking", async () => {
    mockFetchOnce({ booking: { _id: "b1" } });
    const out = await providerAcceptBooking("b1");
    expect(out).toEqual({ _id: "b1" });

    const [url, init] = (global as any).fetch.mock.calls[0];
    expect(url).toContain("/api/provider/bookings/b1/accept");
    expect(init.method).toBe("PATCH");
  });

  test("providerRejectBooking sends reason only when trimmed reason exists", async () => {
    mockFetchOnce({ booking: { _id: "b1" } });

    await providerRejectBooking("b1", "  because ");
    const [, init1] = (global as any).fetch.mock.calls[0];
    expect(JSON.parse(init1.body)).toEqual({ reason: "because" });

    mockFetchOnce({ booking: { _id: "b2" } });
    await providerRejectBooking("b2", "   ");
    const [, init2] = (global as any).fetch.mock.calls[0];
    expect(JSON.parse(init2.body)).toEqual({});
  });

  test("providerUpdateBookingStatus throws when awaiting_payment_confirmation and invalid price", async () => {
    await expect(
      providerUpdateBookingStatus("b1", "awaiting_payment_confirmation", { price: 0 })
    ).rejects.toThrow("Final price is required");

    await expect(
      providerUpdateBookingStatus("b1", "awaiting_payment_confirmation", {})
    ).rejects.toThrow("Final price is required");
  });

  test("providerUpdateBookingStatus includes price when valid", async () => {
    mockFetchOnce({ booking: { _id: "b1", price: 200 } });

    const out = await providerUpdateBookingStatus("b1", "awaiting_payment_confirmation", { price: 200 });
    expect(out).toMatchObject({ _id: "b1", price: 200 });

    const [, init] = (global as any).fetch.mock.calls[0];
    const body = JSON.parse(init.body);
    expect(body).toEqual({ status: "awaiting_payment_confirmation", price: 200 });
  });

  test("providerGetNotifications maps defaults", async () => {
    mockFetchOnce({ items: [{ _id: 1 }, { _id: 2, title: "T", isRead: 1, bookingId: 9 }] });

    const items = await providerGetNotifications();
    expect(items[0]).toMatchObject({ id: "1", title: "Notification", isRead: false });
    expect(items[1]).toMatchObject({ id: "2", title: "T", isRead: true, bookingId: "9" });
  });

  test("providerMarkNotificationRead calls PATCH", async () => {
    mockFetchOnce({ ok: true });
    await providerMarkNotificationRead("n1");

    const [url, init] = (global as any).fetch.mock.calls[0];
    expect(url).toContain("/api/notifications/n1/read");
    expect(init.method).toBe("PATCH");
  });

  test("providerCreateRating posts trimmed comment and undefined when empty", async () => {
    mockFetchOnce({ ok: true });
    await providerCreateRating({ bookingId: "b1", stars: 5, comment: "  nice  " });

    const [, init1] = (global as any).fetch.mock.calls[0];
    expect(JSON.parse(init1.body)).toEqual({ bookingId: "b1", stars: 5, comment: "nice" });

    mockFetchOnce({ ok: true });
    await providerCreateRating({ bookingId: "b2", stars: 4, comment: "   " });

    const [, init2] = (global as any).fetch.mock.calls[0];
    expect(JSON.parse(init2.body)).toEqual({ bookingId: "b2", stars: 4, comment: undefined });
  });

  test("providerGetEarnings returns number total fallback to 0", async () => {
    mockFetchOnce({ total: 123 });
    await expect(providerGetEarnings()).resolves.toEqual({ total: 123 });

    mockFetchOnce({ total: "bad" });
    await expect(providerGetEarnings()).resolves.toEqual({ total: 0 });
  });

  test("apiFetch throws message from data.message / data.error", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Nope" }),
    });

    await expect(providerGetMe()).rejects.toThrow("Nope");
  });
});