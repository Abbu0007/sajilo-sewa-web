import { ProviderProfileModel } from "../models/provider-profile.model";

export class ProviderProfileRepository {
  async upsertByUserId(userId: string, data: any) {
    return ProviderProfileModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true }
    ).lean();
  }

  async findByUserId(userId: string) {
    return ProviderProfileModel.findOne({ userId }).lean();
  }

  async topRated(limit: number) {
    return ProviderProfileModel.find()
      .sort({ ratingAvg: -1, ratingCount: -1 })
      .limit(limit)
      .lean();
  }

    async findByUserIds(userIds: string[]) {
    const rows = await ProviderProfileModel.find({
      userId: { $in: userIds },
    }).lean();

    const map = new Map<string, any>();
    for (const r of rows) map.set(String(r.userId), r);
    return map;
  }

  async search(params: { q?: string; profession?: string; availability?: string }) {
    const filter: any = {};
    if (params.profession) filter.profession = params.profession;
    if (params.availability) filter.availability = params.availability;
    if (params.q) {
      filter.$or = [
        { profession: new RegExp(params.q, "i") },
        { bio: new RegExp(params.q, "i") },
      ];
    }
    return ProviderProfileModel.find(filter).sort({ ratingAvg: -1 }).lean();
  }
}