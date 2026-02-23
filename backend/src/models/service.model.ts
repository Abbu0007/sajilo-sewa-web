import { Schema, model, Types } from "mongoose";
import { ServiceStatus } from "../types/service.type";

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true, index: true },
    icon: { type: String, default: "" },
    basePriceFrom: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" as ServiceStatus },
  },
  { timestamps: true }
);

export type ServiceDoc = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  icon?: string;
  basePriceFrom?: number;
  status: ServiceStatus;
};

export const ServiceModel = model("Service", ServiceSchema);
