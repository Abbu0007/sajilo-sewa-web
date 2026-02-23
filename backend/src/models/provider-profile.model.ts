import { Schema, model, Types } from "mongoose";
import { ProviderAvailability } from "../types/provider.type";

const ProviderProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    profession: { type: String, required: true, trim: true },
    bio: { type: String, default: "" },
    startingPrice: { type: Number, default: 0 },
    serviceAreas: { type: [String], default: [] },
    availability: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "available" as ProviderAvailability,
      index: true,
    },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ProviderProfileDoc = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  profession: string;
  bio?: string;
  startingPrice?: number;
  serviceAreas?: string[];
  availability: ProviderAvailability;
  ratingAvg: number;
  ratingCount: number;
  completedJobs: number;
};

export const ProviderProfileModel = model("ProviderProfile", ProviderProfileSchema);
