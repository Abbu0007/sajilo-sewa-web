// tests/api/client-actions.test.ts
jest.mock("@/lib/api/client", () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiPatch: jest.fn(),
  apiPostForm: jest.fn(),
}));

import { apiGet, apiPatch, apiPost, apiPostForm } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

import {
  getServices,
  getProvidersByService,
  getTopRatedProviders,
  getMyBookings,
  createBooking,
  confirmBookingPayment,
  cancelMyBooking,
  getFavourites,
  toggleFavourite,
  getNotifications,
  markNotificationRead,
  createRating,
  getMe,
  updateMe,
  uploadMyAvatar,
  getClientProfile,
} from "@/lib/actions/client-actions";

describe("client-actions", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("getServices calls apiGet with services endpoint (no auth)", async () => {
    (apiGet as jest.Mock).mockResolvedValueOnce({ items: [] });
    await getServices();
    expect(apiGet).toHaveBeenCalledWith(ENDPOINTS.services, false);
  });

  test("getProvidersByService normalizes rating fields from multiple shapes", async () => {
    (apiGet as jest.Mock).mockResolvedValueOnce({
      items: [
        { _id: 1, firstName: "A", lastName: "B", avgRating: 4.2, ratingCount: 10, startingPrice: 200, completedJobs: 7 },
        { _id: 2, firstName: "C", lastName: "D", profile: { ratingAvg: 3.5, ratingCount: 5, startingPrice: 100, completedJobs: 2 } },
        { _id: 3, firstName: "E", lastName: "F", providerProfile: { ratingAvg: 4.8, ratingCount: 8, startingPrice: 300, completedJobs: 9 } },
        { _id: 4, firstName: "G", lastName: "H" }, // defaults
      ],
    });

    const res = await getProvidersByService("plumbing");
    expect(apiGet).toHaveBeenCalledWith(ENDPOINTS.providersByService("plumbing"), false);

    expect(res.items[0]).toMatchObject({ _id: "1", ratingAvg: 4.2, ratingCount: 10, startingPrice: 200, completedJobs: 7 });
    expect(res.items[1]).toMatchObject({ _id: "2", ratingAvg: 3.5, ratingCount: 5, startingPrice: 100, completedJobs: 2 });
    expect(res.items[2]).toMatchObject({ _id: "3", ratingAvg: 4.8, ratingCount: 8, startingPrice: 300, completedJobs: 9 });
    expect(res.items[3]).toMatchObject({ _id: "4", ratingAvg: 0, ratingCount: 0, startingPrice: 0, completedJobs: 0 });
  });

  test("getTopRatedProviders uses default limit 8 and normalizes providers", async () => {
    (apiGet as jest.Mock).mockResolvedValueOnce({ items: [{ _id: "x", firstName: "A", lastName: "B", ratingAvg: 4.1 }] });
    const res = await getTopRatedProviders();
    expect(apiGet).toHaveBeenCalledWith(ENDPOINTS.topRatedProviders(8), false);
    expect(res.items[0]).toMatchObject({ _id: "x", ratingAvg: 4.1 });
  });

  test("getMyBookings uses auth true with status", async () => {
    (apiGet as jest.Mock).mockResolvedValueOnce({ items: [] });
    await getMyBookings("pending");
    expect(apiGet).toHaveBeenCalledWith(ENDPOINTS.myBookings("pending"), true);
  });

  test("createBooking posts with auth true", async () => {
    (apiPost as jest.Mock).mockResolvedValueOnce({ booking: { _id: "b1" } });
    const payload = { providerId: "p1", serviceId: "s1", scheduledAt: "2026-01-01T00:00:00Z", note: "hi", addressText: "ktm" };
    await createBooking(payload);
    expect(apiPost).toHaveBeenCalledWith(ENDPOINTS.createBooking, payload, true);
  });

  test("confirmBookingPayment patches correct url", async () => {
    (apiPatch as jest.Mock).mockResolvedValueOnce({ booking: { _id: "b1" } });
    await confirmBookingPayment("b1");
    expect(apiPatch).toHaveBeenCalledWith("/api/bookings/b1/confirm-payment", {}, true);
  });

  test("cancelMyBooking sends reason only if trimmed reason exists", async () => {
    (apiPatch as jest.Mock).mockResolvedValue({ booking: { _id: "b1" } });

    await cancelMyBooking("b1", "  because  ");
    expect(apiPatch).toHaveBeenCalledWith("/api/bookings/b1/cancel", { reason: "because" }, true);

    await cancelMyBooking("b2", "   ");
    expect(apiPatch).toHaveBeenCalledWith("/api/bookings/b2/cancel", {}, true);
  });

  test("getFavourites maps normalizeProvider", async () => {
    (apiGet as jest.Mock).mockResolvedValueOnce({ items: [{ _id: 1, firstName: "A", lastName: "B", ratingAvg: 4 }] });
    const res = await getFavourites();
    expect(apiGet).toHaveBeenCalledWith(ENDPOINTS.favourites, true);
    expect(res.items[0]).toMatchObject({ _id: "1", ratingAvg: 4 });
  });

  test("toggleFavourite posts to favouriteToggle endpoint", async () => {
    (apiPost as jest.Mock).mockResolvedValueOnce({ ok: true, isFavourite: true });
    await toggleFavourite("prov1");
    expect(apiPost).toHaveBeenCalledWith(ENDPOINTS.favouriteToggle("prov1"), {}, true);
  });

  test("getNotifications maps defaults and stringifies ids", async () => {
    (apiGet as jest.Mock).mockResolvedValueOnce({
      items: [
        { _id: 10, title: null, message: "m", isRead: 0, type: "booking", bookingId: 5, meta: { x: 1 } },
        { _id: "11" }, // defaults
      ],
    });

    const res = await getNotifications();
    expect(apiGet).toHaveBeenCalledWith(ENDPOINTS.notifications, true);

    expect(res.items[0]).toMatchObject({
      _id: "10",
      title: "Notification",
      message: "m",
      isRead: false,
      type: "booking",
      bookingId: "5",
      meta: { x: 1 },
    });

    expect(res.items[1]).toMatchObject({
      _id: "11",
      title: "Notification",
      message: "",
      isRead: false,
      type: "",
      bookingId: null,
      meta: null,
    });
  });

  test("markNotificationRead patches endpoint", async () => {
    (apiPatch as jest.Mock).mockResolvedValueOnce({ ok: true });
    await markNotificationRead("n1");
    expect(apiPatch).toHaveBeenCalledWith(ENDPOINTS.notificationRead("n1"), {}, true);
  });

  test("createRating trims comment and sends undefined when empty", async () => {
    (apiPost as jest.Mock).mockResolvedValueOnce({ ok: true });

    await createRating({ bookingId: "b1", stars: 5, comment: "  nice  " });
    expect(apiPost).toHaveBeenCalledWith(
      ENDPOINTS.ratings,
      { bookingId: "b1", stars: 5, comment: "nice" },
      true
    );

    await createRating({ bookingId: "b2", stars: 4, comment: "   " });
    expect(apiPost).toHaveBeenCalledWith(
      ENDPOINTS.ratings,
      { bookingId: "b2", stars: 4, comment: undefined },
      true
    );
  });

  test("getMe + updateMe call correct endpoints", async () => {
    (apiGet as jest.Mock).mockResolvedValueOnce({ id: 1 });
    (apiPatch as jest.Mock).mockResolvedValueOnce({ ok: true });

    await getMe();
    expect(apiGet).toHaveBeenCalledWith(ENDPOINTS.me, true);

    await updateMe({ firstName: "A" });
    expect(apiPatch).toHaveBeenCalledWith(ENDPOINTS.updateMe, { firstName: "A" }, true);
  });

  test("uploadMyAvatar uses FormData and apiPostForm", async () => {
    (apiPostForm as jest.Mock).mockResolvedValueOnce({ ok: true, user: {} });

    const file = new File(["x"], "a.png", { type: "image/png" });
    await uploadMyAvatar(file);

    const [url, fd, auth] = (apiPostForm as jest.Mock).mock.calls[0];
    expect(url).toBe("/api/users/me/avatar");
    expect(auth).toBe(true);
    expect(fd).toBeInstanceOf(FormData);
  });

  test("getClientProfile calls correct endpoint", async () => {
    (apiGet as jest.Mock).mockResolvedValueOnce({ profile: { userId: "u1", ratingAvg: 0, ratingCount: 0, completedBookings: 0 } });
    await getClientProfile();
    expect(apiGet).toHaveBeenCalledWith(ENDPOINTS.clientMeProfile, true);
  });
});