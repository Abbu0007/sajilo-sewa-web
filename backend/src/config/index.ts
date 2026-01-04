import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "dev_secret",
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
};
