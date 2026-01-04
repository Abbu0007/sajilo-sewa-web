import mongoose from "mongoose";
import { config } from "../config";

export async function connectMongo() {
  if (!config.mongoUri) {
    throw new Error("MONGODB_URI is missing in .env");
  }
  await mongoose.connect(config.mongoUri);
  console.log("✅ MongoDB connected");
}
