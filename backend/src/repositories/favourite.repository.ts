import { Types } from "mongoose";
import { FavouriteModel } from "../models/favourite.model";

export class FavouriteRepository {
  async findByClient(clientId: string) {
    return FavouriteModel.find({ clientId: new Types.ObjectId(clientId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async exists(clientId: string, providerId: string) {
    const row = await FavouriteModel.findOne({
      clientId: new Types.ObjectId(clientId),
      providerId: new Types.ObjectId(providerId),
    }).exec();
    return !!row;
  }

  async add(clientId: string, providerId: string) {
    const row = await FavouriteModel.create({
      clientId: new Types.ObjectId(clientId),
      providerId: new Types.ObjectId(providerId),
    });
    return row;
  }

  async remove(clientId: string, providerId: string) {
    return FavouriteModel.findOneAndDelete({
      clientId: new Types.ObjectId(clientId),
      providerId: new Types.ObjectId(providerId),
    }).exec();
  }
}
