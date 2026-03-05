import crypto from "crypto";

// Generate numeric otp
export function generateOtp(length = 6) {
  // 000000 - 999999
  const max = 10 ** length;
  const n = crypto.randomInt(0, max);
  return String(n).padStart(length, "0");
}

// Hash otp using sha256
export function hashOtp(otp: string) {
  const secret = process.env.JWT_SECRET || "otp_secret";
  return crypto.createHmac("sha256", secret).update(otp).digest("hex");
}

// Check if otp is still valid
export function isOtpValid(expiresAt?: Date | null) {
  if (!expiresAt) return false;
  return expiresAt.getTime() > Date.now();
}