import { Types } from "mongoose";
import { BookingModel } from "../models/booking.model";
import { RatingModel } from "../models/rating.model";

export class ClientService {
  async getMyClientProfile(userId: string) {
    const _id = new Types.ObjectId(userId);

    const completedBookings = await BookingModel.countDocuments({
      clientId: _id,
      status: "completed",
    });

    const agg = await RatingModel.aggregate([
      {
        $match: {
          rateeRole: "client",
          rateeId: _id,
        },
      },
      {
        $group: {
          _id: null,
          ratingAvg: { $avg: "$stars" },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    const ratingAvg = agg?.[0]?.ratingAvg ?? 0;
    const ratingCount = agg?.[0]?.ratingCount ?? 0;

    return {
      userId,
      ratingAvg,
      ratingCount,
      completedBookings,
    };
  }
}