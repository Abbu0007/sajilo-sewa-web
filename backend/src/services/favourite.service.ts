import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repository";
import { FavouriteRepository } from "../repositories/favourite.repository";
import { ProviderProfileModel } from "../models/provider-profile.model";
import { UserModel } from "../models/user.model";

export class FavouriteService {
  constructor(private favRepo: FavouriteRepository, private userRepo: UserRepository) {}

  async listMine(clientId: string) {
  const favs = await this.favRepo.findByClient(clientId);

  const providerIds = favs.map((f: any) => String(f.providerId)).filter(Boolean);
  if (providerIds.length === 0) return { items: [] };

  const providers = await UserModel.find({
    _id: { $in: providerIds },
    role: "provider",
  })
    .select("_id firstName lastName email phone avatarUrl profession serviceSlug")
    .lean();

  const providerMap = new Map<string, any>();
  for (const p of providers as any[]) {
    providerMap.set(String(p._id), p);
  }

  const profiles = await ProviderProfileModel.find({
    userId: { $in: providerIds },
  })
    .select("userId ratingAvg ratingCount startingPrice completedJobs")
    .lean();

  const profileMap = new Map<string, any>();
  for (const prof of profiles as any[]) {
    profileMap.set(String(prof.userId), prof);
  }

  const items = providerIds
    .map((id) => {
      const user = providerMap.get(id);
      if (!user) return null;

      const profile = profileMap.get(id);

      return {
        ...user,
        providerProfile: profile
          ? {
              ratingAvg: profile.ratingAvg ?? 0,
              ratingCount: profile.ratingCount ?? 0,
              startingPrice: profile.startingPrice ?? 0,
              completedJobs: profile.completedJobs ?? 0,
            }
          : undefined,
      };
    })
    .filter(Boolean);

  return { items };
}

  async toggle(clientId: string, providerId: string) {
    const provider = await this.userRepo.findById(providerId);
    if (!provider) throw new HttpError(404, "Provider not found");
    if ((provider as any).role !== "provider")
      throw new HttpError(400, "Target user is not a provider");

    const exists = await this.favRepo.exists(clientId, providerId);
    if (exists) {
      await this.favRepo.remove(clientId, providerId);
      return { ok: true, isFavourite: false };
    }

    await this.favRepo.add(clientId, providerId);
    return { ok: true, isFavourite: true };
  }
}