import { RatingModel } from "../models/rating.model";

export class RatingRepository {
  async create(data: any) {
    const doc = await RatingModel.create(data);
    return doc.toObject();
  }

  async findById(id: string) {
    return RatingModel.findById(id)
      .populate("bookingId")
      .populate("raterId", "firstName lastName email phone avatarUrl role")
      .populate("rateeId", "firstName lastName email phone avatarUrl role")
      .lean();
  }

  async findByBookingAndRater(bookingId: string, raterId: string) {
    return RatingModel.findOne({ bookingId, raterId }).lean();
  }

  async listForUser(userId: string, role?: string) {
    const filter: any = { rateeId: userId };
    if (role) filter.rateeRole = role;

    return RatingModel.find(filter)
      .populate("raterId", "firstName lastName avatarUrl role")
      .populate("bookingId", "serviceId scheduledAt status")
      .sort({ createdAt: -1 })
      .lean();
  }

  async getStatsForUser(userId: string, role?: string) {
    const match: any = { rateeId: userId };
    if (role) match.rateeRole = role;

    const rows = await RatingModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$rateeId",
          avgRating: { $avg: "$stars" },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    const r = rows?.[0];
    return {
      avgRating: r?.avgRating ?? 0,
      ratingCount: r?.ratingCount ?? 0,
    };
  }
}