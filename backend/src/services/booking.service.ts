import { HttpError } from "../errors/http-error";
import { BookingRepository } from "../repositories/booking.repository";
import { ProviderProfileRepository } from "../repositories/provider-profile.repository";
import { NotificationService } from "./notification.service";
import { UserRepository } from "../repositories/user.repository";
import { Types } from "mongoose";
import { BookingModel } from "../models/booking.model";
import { RatingModel } from "../models/rating.model";
import { NotificationModel } from "../models/notification.model";

export class BookingService {
  constructor(
    private repo: BookingRepository,
    private notifications: NotificationService,
    private providerProfiles: ProviderProfileRepository,
    private users: UserRepository
  ) {}

  private async getFullName(userId: string): Promise<string | null> {
    try {
      const u: any = await this.users.findById(userId);
      if (!u) return null;
      const first = String(u.firstName ?? "").trim();
      const last = String(u.lastName ?? "").trim();
      const full = `${first} ${last}`.trim();
      return full.length ? full : null;
    } catch {
      return null;
    }
  }

  private toObjectIds(ids: string[]) {
    const out: Types.ObjectId[] = [];
    for (const id of ids) {
      try {
        out.push(new Types.ObjectId(id));
      } catch {
        // ignore invalid
      }
    }
    return out;
  }

  private async getClientStatsMap(clientIds: string[]) {
    const oids = this.toObjectIds(clientIds);
    if (oids.length === 0) return new Map<string, { ratingAvg: number; ratingCount: number; completedBookings: number }>();

    const [completedAgg, ratingAgg] = await Promise.all([
      BookingModel.aggregate([
        { $match: { clientId: { $in: oids }, status: "completed" } },
        { $group: { _id: "$clientId", completedBookings: { $sum: 1 } } },
      ]),
      RatingModel.aggregate([
        { $match: { rateeRole: "client", rateeId: { $in: oids } } },
        { $group: { _id: "$rateeId", ratingAvg: { $avg: "$stars" }, ratingCount: { $sum: 1 } } },
      ]),
    ]);

    const completedById = new Map<string, number>(
      (completedAgg ?? []).map((x: any) => [String(x._id), Number(x.completedBookings ?? 0)])
    );

    const ratingById = new Map<string, { ratingAvg: number; ratingCount: number }>(
      (ratingAgg ?? []).map((x: any) => [
        String(x._id),
        { ratingAvg: Number(x.ratingAvg ?? 0), ratingCount: Number(x.ratingCount ?? 0) },
      ])
    );

    const out = new Map<string, { ratingAvg: number; ratingCount: number; completedBookings: number }>();

    for (const oid of oids) {
      const id = String(oid);
      const r = ratingById.get(id) ?? { ratingAvg: 0, ratingCount: 0 };
      const completedBookings = completedById.get(id) ?? 0;

      out.set(id, {
        ratingAvg: r.ratingAvg,
        ratingCount: r.ratingCount,
        completedBookings,
      });
    }

    return out;
  }

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
      paymentStatus: "unpaid",
      price: 0,
    });

    const clientName = (await this.getFullName(clientId)) ?? "A client";

    await this.notifications.create({
      userId: payload.providerId,
      type: "booking_request",
      title: "New booking request",
      message: `${clientName} sent you a booking request.`,
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

    const items: any[] = (await this.repo.listForProvider(providerId, status)) as any[];
    if (!Array.isArray(items) || items.length === 0) return items;


    const clientIds = items
      .map((b: any) => String(b?.clientId?._id ?? b?.clientId ?? ""))
      .filter(Boolean);

    const uniqueClientIds = Array.from(new Set(clientIds));
    const statsMap = await this.getClientStatsMap(uniqueClientIds);


    return items.map((b: any) => {
      const c = b?.clientId;
      if (!c) return b;

      const cid = String(c?._id ?? c);
      const stats = statsMap.get(cid) ?? { ratingAvg: 0, ratingCount: 0, completedBookings: 0 };

      return {
        ...b,
        clientId: {
          ...c,
          ratingAvg: stats.ratingAvg,
          ratingCount: stats.ratingCount,
          completedBookings: stats.completedBookings,
        },
      };
    });
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

    const clientName = (await this.getFullName(clientId)) ?? "A client";

    await this.notifications.create({
      userId: String(b.providerId?._id ?? b.providerId),
      type: "booking_status_changed",
      title: "Booking cancelled",
      message: `${clientName} cancelled a booking.`,
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

    const providerName = (await this.getFullName(providerId)) ?? "The provider";

    await this.notifications.create({
      userId: String(b.clientId?._id ?? b.clientId),
      type: "booking_confirmed",
      title: "Booking accepted",
      message: `${providerName} accepted your booking request.`,
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

    const updated = await this.repo.updateById(bookingId, {
      status: "rejected",
      rejectionReason: reason ?? "",
    });

    const providerName = (await this.getFullName(providerId)) ?? "The provider";

    await this.notifications.create({
      userId: String(b.clientId?._id ?? b.clientId),
      type: "booking_rejected",
      title: "Booking rejected",
      message: `${providerName} rejected your booking request.`,
      bookingId: b._id,
      isRead: false,
    });

    return updated;
  }

  async providerUpdateStatus(
    providerId: string,
    role: string,
    bookingId: string,
    status: string,
    reason?: string,
    price?: number
  ) {
    if (role !== "provider") throw new HttpError(403, "Only providers can update status");

    const b: any = await this.repo.findById(bookingId);
    if (!b) throw new HttpError(404, "Booking not found");
    if (String(b.providerId?._id ?? b.providerId) !== providerId) throw new HttpError(403, "Not allowed");

    const allowed = ["in_progress", "awaiting_payment_confirmation", "cancelled"];
    if (!allowed.includes(status)) throw new HttpError(400, "Invalid status");

    const patch: any = { status };

    if (status === "awaiting_payment_confirmation") {
      if (!price || price <= 0) throw new HttpError(400, "Final price is required");
      patch.price = price;
      patch.paymentStatus = "unpaid";
    }

    if (status === "cancelled") {
      patch.cancellationReason = reason ?? "";
    }

    const updated = await this.repo.updateById(bookingId, patch);

    const providerName = (await this.getFullName(providerId)) ?? "The provider";
    const clientId = String(b.clientId?._id ?? b.clientId);

    const msg =
      status === "awaiting_payment_confirmation"
        ? `${providerName} set the final price. Please confirm payment to complete the booking.`
        : `${providerName} updated your booking status to ${status}.`;

    await this.notifications.create({
      userId: clientId,
      type: "booking_status_changed",
      title: "Booking updated",
      message: msg,
      bookingId: b._id,
      isRead: false,
      meta: status === "awaiting_payment_confirmation" ? { price: price ?? 0 } : undefined,
    });

    return updated;
  }

  async providerGetEarnings(providerId: string, role: string) {
    if (role !== "provider") throw new HttpError(403, "Provider only");
    const total = await this.repo.sumProviderEarnings(providerId);
    return { total };
  }

  async confirmPayment(clientId: string, role: string, bookingId: string) {
    if (role !== "client") throw new HttpError(403, "Only clients can confirm payment");

    const b: any = await this.repo.findById(bookingId);
    if (!b) throw new HttpError(404, "Booking not found");

    if (String(b.clientId?._id ?? b.clientId) !== clientId) {
      throw new HttpError(403, "Not allowed");
    }

    if (b.status !== "awaiting_payment_confirmation") {
      throw new HttpError(400, "Not awaiting confirmation");
    }

    const updated: any = await this.repo.updateById(bookingId, {
      status: "completed",
      paymentStatus: "paid",
    });

    const providerUserId = String(
      updated?.providerId?._id ?? updated?.providerId ?? b.providerId?._id ?? b.providerId
    );
    const clientUserId = String(
      updated?.clientId?._id ?? updated?.clientId ?? b.clientId?._id ?? b.clientId
    );

    const providerName = (await this.getFullName(providerUserId)) ?? "your provider";
    const clientName = (await this.getFullName(clientUserId)) ?? "your client";

    try {
      await this.notifications.create({
        userId: providerUserId,
        type: "booking_status_changed",
        title: "Payment confirmed",
        message: `${clientName} confirmed payment. Booking is completed.`,
        bookingId: updated?._id ?? bookingId,
        isRead: false,
        meta: {
          paymentStatus: "paid",
          price: Number(updated?.price ?? 0),
        },
      });
    } catch (e) {
      console.error("Payment notification failed:", e);
    }

    try {
      const completedCount = await this.repo.countForProvider(providerUserId, "completed");
      await this.providerProfiles.upsertByUserId(providerUserId, { completedJobs: completedCount });
    } catch (e) {
      console.error("Provider completedJobs update failed:", e);
    }

    try {
      await this.notifications.create({
        userId: clientUserId,
        type: "rating_request",
        title: "Rate your provider",
        message: `The service is completed. Please rate ${providerName} (1 to 5 stars).`,
        bookingId: updated?._id ?? bookingId,
        isRead: false,
        meta: { rateeRole: "provider", rateeId: providerUserId },
      });

      await this.notifications.create({
        userId: providerUserId,
        type: "rating_request",
        title: "Rate your client",
        message: `The service is completed. Please rate ${clientName} (1 to 5 stars).`,
        bookingId: updated?._id ?? bookingId,
        isRead: false,
        meta: { rateeRole: "client", rateeId: clientUserId },
      });
    } catch (e) {
      console.error("Rating notifications failed:", e);
    }

    return updated;
  }
    // =========================
  // ADMIN HELPERS
  // =========================
  private async getProviderStatsMap(providerIds: string[]) {
    const oids = this.toObjectIds(providerIds);
    if (oids.length === 0)
      return new Map<
        string,
        { ratingAvg: number; ratingCount: number; completedBookings: number }
      >();

    const [completedAgg, ratingAgg] = await Promise.all([
      BookingModel.aggregate([
        { $match: { providerId: { $in: oids }, status: "completed" } },
        { $group: { _id: "$providerId", completedBookings: { $sum: 1 } } },
      ]),
      RatingModel.aggregate([
        { $match: { rateeRole: "provider", rateeId: { $in: oids } } },
        {
          $group: {
            _id: "$rateeId",
            ratingAvg: { $avg: "$stars" },
            ratingCount: { $sum: 1 },
          },
        },
      ]),
    ]);

    const completedById = new Map<string, number>(
      (completedAgg ?? []).map((x: any) => [String(x._id), Number(x.completedBookings ?? 0)])
    );

    const ratingById = new Map<string, { ratingAvg: number; ratingCount: number }>(
      (ratingAgg ?? []).map((x: any) => [
        String(x._id),
        { ratingAvg: Number(x.ratingAvg ?? 0), ratingCount: Number(x.ratingCount ?? 0) },
      ])
    );

    const out = new Map<
      string,
      { ratingAvg: number; ratingCount: number; completedBookings: number }
    >();

    for (const oid of oids) {
      const id = String(oid);
      const r = ratingById.get(id) ?? { ratingAvg: 0, ratingCount: 0 };
      const completedBookings = completedById.get(id) ?? 0;

      out.set(id, { ratingAvg: r.ratingAvg, ratingCount: r.ratingCount, completedBookings });
    }

    return out;
  }

  private adminMapBooking(b: any, clientStats: any, providerStats: any) {
    const client = b?.clientId ? { ...b.clientId } : null;
    const provider = b?.providerId ? { ...b.providerId } : null;
    const service = b?.serviceId ? { ...b.serviceId } : null;

    const clientId = client?._id ? String(client._id) : "";
    const providerId = provider?._id ? String(provider._id) : "";

    const cStats = clientId ? clientStats.get(clientId) : null;
    const pStats = providerId ? providerStats.get(providerId) : null;

    const out = {
      id: String(b?._id ?? ""),
      status: String(b?.status ?? ""),
      scheduledAt: b?.scheduledAt ?? null,
      note: b?.note ?? "",
      addressText: b?.addressText ?? "",
      price: Number(b?.price ?? 0),
      paymentStatus: String(b?.paymentStatus ?? "unpaid"),

      service: service
        ? {
            id: String(service._id ?? ""),
            name: service.name ?? "Service",
            slug: service.slug ?? service.serviceSlug ?? undefined,
            imageUrl: service.imageUrl ?? service.iconUrl ?? undefined,
          }
        : null,

      client: client
        ? {
            id: String(client._id ?? ""),
            firstName: client.firstName ?? "",
            lastName: client.lastName ?? "",
            email: client.email ?? "",
            phone: client.phone ?? "",
            avatarUrl: client.avatarUrl ?? "",
            ratingAvg: Number(cStats?.ratingAvg ?? 0),
            ratingCount: Number(cStats?.ratingCount ?? 0),
            completedBookings: Number(cStats?.completedBookings ?? 0),
          }
        : null,

      provider: provider
        ? {
            id: String(provider._id ?? ""),
            firstName: provider.firstName ?? "",
            lastName: provider.lastName ?? "",
            email: provider.email ?? "",
            phone: provider.phone ?? "",
            avatarUrl: provider.avatarUrl ?? "",
            profession: provider.profession ?? "",
            serviceSlug: provider.serviceSlug ?? "",
            ratingAvg: Number(pStats?.ratingAvg ?? 0),
            ratingCount: Number(pStats?.ratingCount ?? 0),
            completedBookings: Number(pStats?.completedBookings ?? 0),
          }
        : null,
    };

    return out;
  }

  async adminList(
    role: string,
    opts: {
      status?: string;
      q?: string;
      dateFrom?: Date;
      dateTo?: Date;
      page?: number;
      limit?: number;
    }
  ) {
    if (role !== "admin") throw new HttpError(403, "Admin only");

    const status = String(opts.status ?? "all").toLowerCase();
    const q = String(opts.q ?? "").trim().toLowerCase();

    const page = Number.isFinite(opts.page as any) && (opts.page as any) > 0 ? (opts.page as any) : 1;
    const limit =
      Number.isFinite(opts.limit as any) && (opts.limit as any) > 0 ? (opts.limit as any) : 20;

    const filter: any = {};
    if (status && status !== "all") filter.status = status;

    if (opts.dateFrom || opts.dateTo) {
      filter.scheduledAt = {};
      if (opts.dateFrom) filter.scheduledAt.$gte = opts.dateFrom;
      if (opts.dateTo) filter.scheduledAt.$lte = opts.dateTo;
    }


    const raw: any[] = await BookingModel.find(filter)
      .populate("clientId", "firstName lastName email phone avatarUrl role")
      .populate("providerId", "firstName lastName email phone avatarUrl role profession serviceSlug")
      .populate("serviceId", "name slug imageUrl iconUrl")
      .sort({ createdAt: -1 })
      .lean();


    const searched = !q
      ? raw
      : raw.filter((b) => {
          const c = b?.clientId ?? {};
          const p = b?.providerId ?? {};
          const s = b?.serviceId ?? {};
          const text = [
            `${c.firstName ?? ""} ${c.lastName ?? ""}`,
            c.email ?? "",
            c.phone ?? "",
            `${p.firstName ?? ""} ${p.lastName ?? ""}`,
            p.email ?? "",
            p.phone ?? "",
            s.name ?? "",
            b.status ?? "",
            b.addressText ?? "",
          ]
            .join(" ")
            .toLowerCase();
          return text.includes(q);
        });


    const total = searched.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const slice = searched.slice(start, end);

    const clientIds = Array.from(
      new Set(slice.map((b) => String(b?.clientId?._id ?? "")).filter(Boolean))
    );
    const providerIds = Array.from(
      new Set(slice.map((b) => String(b?.providerId?._id ?? "")).filter(Boolean))
    );

    const [clientStats, providerStats] = await Promise.all([
      this.getClientStatsMap(clientIds),
      this.getProviderStatsMap(providerIds),
    ]);

    const items = slice.map((b) => this.adminMapBooking(b, clientStats, providerStats));

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async adminGet(role: string, bookingId: string) {
    if (role !== "admin") throw new HttpError(403, "Admin only");

    const b: any = await BookingModel.findById(bookingId)
      .populate("clientId", "firstName lastName email phone avatarUrl role")
      .populate("providerId", "firstName lastName email phone avatarUrl role profession serviceSlug")
      .populate("serviceId", "name slug imageUrl iconUrl")
      .lean();

    if (!b) throw new HttpError(404, "Booking not found");

    const clientId = String(b?.clientId?._id ?? "");
    const providerId = String(b?.providerId?._id ?? "");

    const [clientStats, providerStats] = await Promise.all([
      this.getClientStatsMap(clientId ? [clientId] : []),
      this.getProviderStatsMap(providerId ? [providerId] : []),
    ]);

    return this.adminMapBooking(b, clientStats, providerStats);
  }

    async adminCancel(role: string, bookingId: string, reason?: string) {
    if (role !== "admin") throw new HttpError(403, "Admin only");

    const b: any = await this.repo.findById(bookingId);
    if (!b) throw new HttpError(404, "Booking not found");

    if (String(b.status) === "completed") {
      throw new HttpError(400, "Cannot cancel completed booking");
    }

    const updated = await this.repo.updateById(bookingId, {
      status: "cancelled",
      cancellationReason: reason ?? "Cancelled by admin",
    });

    const clientId = String(b.clientId?._id ?? b.clientId ?? "");
    const providerId = String(b.providerId?._id ?? b.providerId ?? "");

    const message = reason?.trim()
      ? `Admin cancelled this booking. Reason: ${reason.trim()}`
      : "Admin cancelled this booking.";

    if (clientId) {
      await this.notifications.create({
        userId: clientId,
        type: "booking_status_changed",
        title: "Booking cancelled",
        message,
        bookingId: b._id,
        isRead: false,
        meta: { by: "admin" },
      });
    }

    if (providerId) {
      await this.notifications.create({
        userId: providerId,
        type: "booking_status_changed",
        title: "Booking cancelled",
        message,
        bookingId: b._id,
        isRead: false,
        meta: { by: "admin" },
      });
    }

    return updated;
  }

  async adminDelete(role: string, bookingId: string) {
    if (role !== "admin") throw new HttpError(403, "Admin only");

    const b: any = await this.repo.findById(bookingId);
    if (!b) throw new HttpError(404, "Booking not found");

    await BookingModel.deleteOne({ _id: bookingId });

    await NotificationModel.deleteMany({ bookingId });

    await RatingModel.deleteMany({ bookingId });

    return { ok: true, deletedId: bookingId };
  }
}