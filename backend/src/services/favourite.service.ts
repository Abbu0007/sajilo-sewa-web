import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repository";
import { FavouriteRepository } from "../repositories/favourite.repository";

export class FavouriteService {
  constructor(private favRepo: FavouriteRepository, private userRepo: UserRepository) {}

  async listMine(clientId: string) {
    const favs = await this.favRepo.findByClient(clientId);
    const providerIds = favs.map((f: any) => String(f.providerId));
    const providers = await this.userRepo.findByIds(providerIds);
    const map = new Map(providers.map((p: any) => [String(p._id), p]));
    const items = providerIds.map((id) => map.get(id)).filter(Boolean);

    return { items };
  }

  async toggle(clientId: string, providerId: string) {
    const provider = await this.userRepo.findById(providerId);
    if (!provider) throw new HttpError(404, "Provider not found");
    if ((provider as any).role !== "provider") throw new HttpError(400, "Target user is not a provider");

    const exists = await this.favRepo.exists(clientId, providerId);
    if (exists) {
      await this.favRepo.remove(clientId, providerId);
      return { isFavourite: false };
    }

    await this.favRepo.add(clientId, providerId);
    return { isFavourite: true };
  }
}
