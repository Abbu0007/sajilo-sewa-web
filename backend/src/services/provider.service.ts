import { HttpError } from "../errors/http-error";
import { ProviderProfileRepository } from "../repositories/provider-profile.repository";
import { UserRepository } from "../repositories/user.repository";
import { BookingModel } from "../models/booking.model";
import { RatingModel } from "../models/rating.model";

export class ProviderService {
  constructor(
    private providerRepo: ProviderProfileRepository,
    private userRepo: UserRepository
  ) {}

  async upsertProfile(userId: string, role: string, payload: any) {
    if (role !== "provider") throw new HttpError(403, "Only providers can update provider profile");
    return this.providerRepo.upsertByUserId(userId, payload);
  }

  private async syncProviderStats(userId: string, profile: any) {
    const completedCount = await BookingModel.countDocuments({
      providerId: userId,
      status: "completed",
    });

    const agg = await RatingModel.aggregate([
      { $match: { rateeId: profile.userId } },
      {
        $group: {
          _id: "$rateeId",
          avg: { $avg: "$stars" },
          count: { $sum: 1 },
        },
      },
    ]);

    const avg = agg.length ? Number(agg[0].avg) : 0;
    const count = agg.length ? Number(agg[0].count) : 0;

    const needsUpdate =
      Number(profile.completedJobs ?? 0) !== completedCount ||
      Number(profile.ratingAvg ?? 0) !== avg ||
      Number(profile.ratingCount ?? 0) !== count;

    if (!needsUpdate) return profile;

    const updated = await this.providerRepo.upsertByUserId(userId, {
      completedJobs: completedCount,
      ratingAvg: avg,
      ratingCount: count,
    });

    return updated;
  }

  async getMyProfile(userId: string, role: string) {
    if (role !== "provider") throw new HttpError(403, "Only providers can access this");

    const profile = await this.providerRepo.findByUserId(userId);
    if (!profile) throw new HttpError(404, "Provider profile not found");

    return this.syncProviderStats(userId, profile);
  }

  async topRated(limit: number) {
    const profiles = await this.providerRepo.topRated(limit);
    const userIds = profiles.map((p: any) => String(p.userId));
    const users = await this.userRepo.findByIds(userIds);
    const byId = new Map(users.map((u: any) => [String(u._id), u]));

    return profiles
      .map((p: any) => {
        const u: any = byId.get(String(p.userId));
        if (!u) return null;

        return {
          _id: String(u._id),
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone,
          avatarUrl: u.avatarUrl ?? "",
          profession: u.profession ?? p.profession ?? "",
          serviceSlug: u.serviceSlug ?? "",
          avgRating: p.ratingAvg ?? 0,
          ratingCount: p.ratingCount ?? 0,
          startingPrice: p.startingPrice ?? 0,
          completedJobs: p.completedJobs ?? 0,
        };
      })
      .filter(Boolean);
  }

  async search(params: { q?: string; profession?: string; availability?: string }) {
    const profiles = await this.providerRepo.search(params);

    const userIds = profiles.map((p: any) => String(p.userId));
    const users = await this.userRepo.findByIds(userIds);

    const byId = new Map(users.map((u: any) => [String(u._id), u]));

    return profiles
      .map((p: any) => {
        const u: any = byId.get(String(p.userId));
        if (!u) return null;

        return {
          _id: String(u._id),
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone,
          avatarUrl: u.avatarUrl ?? "",
          profession: u.profession ?? p.profession ?? "",
          serviceSlug: u.serviceSlug ?? "",
          avgRating: p.ratingAvg ?? 0,
          ratingCount: p.ratingCount ?? 0,
          startingPrice: p.startingPrice ?? 0,
          completedJobs: p.completedJobs ?? 0,
        };
      })
      .filter(Boolean);
  }

  async getProviderPublic(providerUserId: string) {
    const profile = await this.providerRepo.findByUserId(providerUserId);
    if (!profile) throw new HttpError(404, "Provider profile not found");

    const syncedProfile = await this.syncProviderStats(providerUserId, profile);

    const user = await this.userRepo.findById(providerUserId);
    if (!user) throw new HttpError(404, "Provider not found");

    return {
      profile: syncedProfile,
      user,
      avgRating: syncedProfile.ratingAvg ?? 0,
      ratingCount: syncedProfile.ratingCount ?? 0,
    };
  }

  async byService(serviceSlug: string) {
    const users = await this.userRepo.findProvidersByServiceSlug(serviceSlug);
    const userIds = users.map((u: any) => String(u._id));

    const profileMap = await this.providerRepo.findByUserIds(userIds);


    return users.map((u: any) => {
      const p: any = profileMap.get(String(u._id));

      return {
        _id: String(u._id),
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        avatarUrl: u.avatarUrl ?? "",
        profession: u.profession ?? p?.profession ?? "",
        serviceSlug: u.serviceSlug ?? serviceSlug,

  
        avgRating: typeof p?.ratingAvg === "number" ? p.ratingAvg : (u.avgRating ?? u.ratingAvg ?? 0),
        ratingCount: typeof p?.ratingCount === "number" ? p.ratingCount : (u.ratingCount ?? 0),

        startingPrice: typeof p?.startingPrice === "number" ? p.startingPrice : 0,
        completedJobs: typeof p?.completedJobs === "number" ? p.completedJobs : 0,
      };
    });
  }
}