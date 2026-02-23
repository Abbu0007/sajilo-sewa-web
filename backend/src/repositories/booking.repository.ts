import { BookingModel } from "../models/booking.model";

export class BookingRepository {
  async create(data: any) {
    const doc = await BookingModel.create(data);
    return doc.toObject();
  }

  async findById(id: string) {
    return BookingModel.findById(id)
      .populate("clientId", "firstName lastName email phone avatarUrl role")
      .populate("providerId", "firstName lastName email phone avatarUrl role")
      .populate("serviceId", "name slug icon basePriceFrom")
      .lean();
  }

  async listForClient(clientId: string, status?: string) {
    const filter: any = { clientId };
    if (status && status !== "all") filter.status = status;
    return BookingModel.find(filter)
      .populate("providerId", "firstName lastName phone avatarUrl")
      .populate("serviceId", "name icon basePriceFrom")
      .sort({ createdAt: -1 })
      .lean();
  }

  async listForProvider(providerId: string, status?: string) {
    const filter: any = { providerId };
    if (status && status !== "all") filter.status = status;
    return BookingModel.find(filter)
      .populate("clientId", "firstName lastName phone avatarUrl")
      .populate("serviceId", "name icon basePriceFrom")
      .sort({ createdAt: -1 })
      .lean();
  }

  async adminList(params: { status?: string; q?: string; dateFrom?: Date; dateTo?: Date; page: number; limit: number }) {
    const filter: any = {};
    if (params.status && params.status !== "all") filter.status = params.status;

    if (params.dateFrom || params.dateTo) {
      filter.scheduledAt = {};
      if (params.dateFrom) filter.scheduledAt.$gte = params.dateFrom;
      if (params.dateTo) filter.scheduledAt.$lte = params.dateTo;
    }

    // Basic text search on note/address 
    if (params.q) {
      filter.$or = [
        { note: new RegExp(params.q, "i") },
        { addressText: new RegExp(params.q, "i") },
      ];
    }

    const skip = (params.page - 1) * params.limit;

    const [items, total] = await Promise.all([
      BookingModel.find(filter)
        .populate("clientId", "firstName lastName email phone")
        .populate("providerId", "firstName lastName email phone")
        .populate("serviceId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(params.limit)
        .lean(),
      BookingModel.countDocuments(filter),
    ]);

    return { items, total, page: params.page, limit: params.limit };
  }

  async updateById(id: string, patch: any) {
    return BookingModel.findByIdAndUpdate(id, { $set: patch }, { new: true })
      .populate("clientId", "firstName lastName email phone avatarUrl role")
      .populate("providerId", "firstName lastName email phone avatarUrl role")
      .populate("serviceId", "name slug icon basePriceFrom")
      .lean();
  }
}
