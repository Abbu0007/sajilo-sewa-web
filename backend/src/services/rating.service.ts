import { HttpError } from "../errors/http-error";
import { RatingRepository } from "../repositories/rating.repository";
import { BookingRepository } from "../repositories/booking.repository";
import { UserRepository } from "../repositories/user.repository";
import { ProviderProfileRepository } from "../repositories/provider-profile.repository";

export class RatingService {
  constructor(
    private ratings: RatingRepository,
    private bookings: BookingRepository,
    private users: UserRepository,
    private providerProfiles: ProviderProfileRepository 
  ) {}

  async createRating(userId: string, role: string, payload: any) {
    if (!["client", "provider"].includes(role)) {
      throw new HttpError(403, "Only client or provider can rate");
    }

    const booking: any = await this.bookings.findById(payload.bookingId);
    if (!booking) throw new HttpError(404, "Booking not found");

    if (booking.status !== "completed") {
      throw new HttpError(400, "Booking must be completed before rating");
    }

    const isClient =
      role === "client" &&
      String(booking.clientId?._id ?? booking.clientId) === userId;

    const isProvider =
      role === "provider" &&
      String(booking.providerId?._id ?? booking.providerId) === userId;

    if (!isClient && !isProvider) {
      throw new HttpError(403, "You are not part of this booking");
    }

    const existing = await this.ratings.findByBookingAndRater(
      payload.bookingId,
      userId
    );
    if (existing) {
      throw new HttpError(400, "You already rated this booking");
    }

    const rateeId = isClient
      ? String(booking.providerId?._id ?? booking.providerId)
      : String(booking.clientId?._id ?? booking.clientId);

    const rateeRole = isClient ? "provider" : "client";

    const rating = await this.ratings.create({
      bookingId: payload.bookingId,
      raterId: userId,
      rateeId,
      raterRole: role,
      rateeRole,
      stars: payload.stars,
      comment: payload.comment ?? "",
    });

    const stats = await this.ratings.getStatsForUser(rateeId, rateeRole);

    if (rateeRole === "provider") {
      await this.providerProfiles.upsertByUserId(rateeId, {
        ratingAvg: stats.avgRating,
        ratingCount: stats.ratingCount,
      });
    } else {
      await this.users.updateRatingStats(rateeId, {
        avgRating: stats.avgRating,
        ratingCount: stats.ratingCount,
      });
    }

    return rating;
  }

  async listMyRatings(userId: string, role: string) {
    return this.ratings.listForUser(userId, role);
  }
}