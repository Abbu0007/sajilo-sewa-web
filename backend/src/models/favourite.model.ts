import { Schema, model, Types } from "mongoose";

const FavouriteSchema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);
FavouriteSchema.index({ clientId: 1, providerId: 1 }, { unique: true });

export type FavouriteDoc = {
  _id: Types.ObjectId;
  clientId: Types.ObjectId;
  providerId: Types.ObjectId;
};

export const FavouriteModel = model("Favourite", FavouriteSchema);
