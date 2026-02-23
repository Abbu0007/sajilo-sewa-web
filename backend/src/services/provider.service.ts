import { HttpError } from "../errors/http-error";
import { ProviderProfileRepository } from "../repositories/provider-profile.repository";
import { UserRepository } from "../repositories/user.repository";

export class ProviderService {
  constructor(
    private providerRepo: ProviderProfileRepository,
    private userRepo: UserRepository
  ) {}

  async upsertProfile(userId: string, role: string, payload: any) {
    if (role !== "provider") throw new HttpError(403, "Only providers can update provider profile");
    return this.providerRepo.upsertByUserId(userId, payload);
  }

  async getMyProfile(userId: string, role: string) {
    if (role !== "provider") throw new HttpError(403, "Only providers can access this");
    return this.providerRepo.findByUserId(userId);
  }

  async topRated(limit: number) {
    const profiles = await this.providerRepo.topRated(limit);
    const userIds = profiles.map((p: any) => String(p.userId));
    const users = await this.userRepo.findByIds(userIds); // you may need to add this helper
    const byId = new Map(users.map((u: any) => [String(u._id), u]));
    return profiles.map((p: any) => ({
      ...p,
      user: byId.get(String(p.userId)) ?? null,
    }));
  }

  async search(params: { q?: string; profession?: string; availability?: string }) {
    const profiles = await this.providerRepo.search(params);
    const userIds = profiles.map((p: any) => String(p.userId));
    const users = await this.userRepo.findByIds(userIds); // helper
    const byId = new Map(users.map((u: any) => [String(u._id), u]));
    return profiles.map((p: any) => ({
      ...p,
      user: byId.get(String(p.userId)) ?? null,
    }));
  }

  async getProviderPublic(providerUserId: string) {
    const profile = await this.providerRepo.findByUserId(providerUserId);
    if (!profile) throw new HttpError(404, "Provider profile not found");
    const user = await this.userRepo.findById(providerUserId);
    if (!user) throw new HttpError(404, "Provider not found");
    return { profile, user };
  }
}
