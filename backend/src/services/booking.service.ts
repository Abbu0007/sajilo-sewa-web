import { HttpError } from "../errors/http-error";
import { BookingRepository } from "../repositories/booking.repository";
import { NotificationService } from "./notification.service";

export class BookingService {
  constructor(
    private repo: BookingRepository,
    private notifications: NotificationService
  ) {}

  async createBooking(clientId: string, role: string, payload: any) {
    if (role !== "client") throw new HttpError(403, "Only clients can create bookings");

    const scheduledAt = new Date(payload.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime())) throw new HttpError(400, "Invalid scheduledAt");

    const booking = await this.repo.create({
      clientId,
      providerId: payload.providerId,
      serviceId: payload.serviceId,
      scheduledAt,
      note: payload.note ?? "",
      addressText: payload.addressText ?? "",
      status: "pending",
    });

   
    await this.notifications.create({
      userId: payload.providerId,
      type: "booking_request",
      title: "New booking request",
      message: "A client sent you a booking request.",
      bookingId: booking._id,
      isRead: false,
    });

    return booking;
  }

  async listClientBookings(clientId: string, role: string, status?: string) {
    if (role !== "client") throw new HttpError(403, "Only clients can view their bookings");
    return this.repo.listForClient(clientId, status);
  }

  async listProviderBookings(providerId: string, role: string, status?: string) {
    if (role !== "provider") throw new HttpError(403, "Only providers can view their bookings");
    return this.repo.listForProvider(providerId, status);
  }

  async getBookingDetails(requesterId: string, role: string, bookingId: string) {
    const b: any = await this.repo.findById(bookingId);
    if (!b) throw new HttpError(404, "Booking not found");

    const isClient = role === "client" && String(b.clientId?._id ?? b.clientId) === requesterId;
    const isProvider = role === "provider" && String(b.providerId?._id ?? b.providerId) === requesterId;
    const isAdmin = role === "admin";

    if (!isClient && !isProvider && !isAdmin) throw new HttpError(403, "Not allowed");
    return b;
  }

  async clientCancel(clientId: string, role: string, bookingId: string, reason?: string) {
    if (role !== "client") throw new HttpError(403, "Only clients can cancel bookings");
    const b: any = await this.repo.findById(bookingId);
    if (!b) throw new HttpError(404, "Booking not found");
    if (String(b.clientId?._id ?? b.clientId) !== clientId) throw new HttpError(403, "Not allowed");

    if (["completed"].includes(b.status)) throw new HttpError(400, "Cannot cancel completed booking");

    const updated = await this.repo.updateById(bookingId, {
      status: "cancelled",
      cancellationReason: reason ?? "",
    });

    
    await this.notifications.create({
      userId: String(b.providerId?._id ?? b.providerId),
      type: "booking_status_changed",
      title: "Booking cancelled",
      message: "A booking was cancelled by the client.",
      bookingId: b._id,
      isRead: false,
    });

    return updated;
  }

  async providerAccept(providerId: string, role: string, bookingId: string) {
    if (role !== "provider") throw new HttpError(403, "Only providers can accept bookings");
    const b: any = await this.repo.findById(bookingId);
    if (!b) throw new HttpError(404, "Booking not found");
    if (String(b.providerId?._id ?? b.providerId) !== providerId) throw new HttpError(403, "Not allowed");
    if (b.status !== "pending") throw new HttpError(400, "Only pending bookings can be accepted");

    const updated = await this.repo.updateById(bookingId, { status: "confirmed", rejectionReason: "" });

    // notify client
    await this.notifications.create({
      userId: String(b.clientId?._id ?? b.clientId),
      type: "booking_confirmed",
      title: "Booking accepted",
      message: "Your booking request was accepted by the provider.",
      bookingId: b._id,
      isRead: false,
    });

    return updated;
  }

  async providerReject(providerId: string, role: string, bookingId: string, reason?: string) {
    if (role !== "provider") throw new HttpError(403, "Only providers can reject bookings");
    const b: any = await this.repo.findById(bookingId);
    if (!b) throw new HttpError(404, "Booking not found");
    if (String(b.providerId?._id ?? b.providerId) !== providerId) throw new HttpError(403, "Not allowed");
    if (b.status !== "pending") throw new HttpError(400, "Only pending bookings can be rejected");

    const updated = await this.repo.updateById(bookingId, { status: "rejected", rejectionReason: reason ?? "" });

    await this.notifications.create({
      userId: String(b.clientId?._id ?? b.clientId),
      type: "booking_rejected",
      title: "Booking rejected",
      message: "Your booking request was rejected by the provider.",
      bookingId: b._id,
      isRead: false,
    });

    return updated;
  }

  async providerUpdateStatus(providerId: string, role: string, bookingId: string, status: string, reason?: string) {
    if (role !== "provider") throw new HttpError(403, "Only providers can update status");
    const b: any = await this.repo.findById(bookingId);
    if (!b) throw new HttpError(404, "Booking not found");
    if (String(b.providerId?._id ?? b.providerId) !== providerId) throw new HttpError(403, "Not allowed");

    const allowed = ["in_progress", "completed", "cancelled"];
    if (!allowed.includes(status)) throw new HttpError(400, "Invalid status");

    const patch: any = { status };
    if (status === "cancelled") patch.cancellationReason = reason ?? "";

    const updated = await this.repo.updateById(bookingId, patch);

    // notify client
    await this.notifications.create({
      userId: String(b.clientId?._id ?? b.clientId),
      type: "booking_status_changed",
      title: "Booking updated",
      message: `Your booking status changed to ${status}.`,
      bookingId: b._id,
      isRead: false,
    });

    return updated;
  }

  async adminList(role: string, params: any) {
    if (role !== "admin") throw new HttpError(403, "Admin only");
    return this.repo.adminList(params);
  }

  async adminGet(role: string, bookingId: string) {
    if (role !== "admin") throw new HttpError(403, "Admin only");
    const b = await this.repo.findById(bookingId);
    if (!b) throw new HttpError(404, "Booking not found");
    return b;
  }
}
