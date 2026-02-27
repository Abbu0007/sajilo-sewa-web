import { Types } from "mongoose";
import { FavouriteModel } from "../models/favourite.model";

export class FavouriteRepository {
  private toObjectId(id: string) {
    try {
      return new Types.ObjectId(id);
    } catch {
      return null;
    }
  }

  async findByClient(clientId: string) {
    const oid = this.toObjectId(clientId);

    const filter = oid
      ? { $or: [{ clientId: oid }, { clientId: clientId as any }] }
      : { clientId: clientId as any };

    return FavouriteModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async exists(clientId: string, providerId: string) {
    const cOid = this.toObjectId(clientId);
    const pOid = this.toObjectId(providerId);

    const filter: any = { $and: [] as any[] };

    if (cOid) filter.$and.push({ $or: [{ clientId: cOid }, { clientId: clientId as any }] });
    else filter.$and.push({ clientId: clientId as any });

    if (pOid) filter.$and.push({ $or: [{ providerId: pOid }, { providerId: providerId as any }] });
    else filter.$and.push({ providerId: providerId as any });

    const row = await FavouriteModel.findOne(filter).exec();
    return !!row;
  }

  async add(clientId: string, providerId: string) {
    const cOid = this.toObjectId(clientId);
    const pOid = this.toObjectId(providerId);
    if (!cOid || !pOid) throw new Error("Invalid clientId/providerId");

    const row = await FavouriteModel.create({
      clientId: cOid,
      providerId: pOid,
    });
    return row;
  }

  async remove(clientId: string, providerId: string) {
    const cOid = this.toObjectId(clientId);
    const pOid = this.toObjectId(providerId);

    const filter: any = { $and: [] as any[] };

    if (cOid) filter.$and.push({ $or: [{ clientId: cOid }, { clientId: clientId as any }] });
    else filter.$and.push({ clientId: clientId as any });

    if (pOid) filter.$and.push({ $or: [{ providerId: pOid }, { providerId: providerId as any }] });
    else filter.$and.push({ providerId: providerId as any });

    return FavouriteModel.findOneAndDelete(filter).exec();
  }
}