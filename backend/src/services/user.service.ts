import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { HttpError } from "../errors/http-error";
import { config } from "../config";
import { PublicUser, UserRole } from "../types/user.type";
import { ServiceModel } from "../models/service.model";
import { EmailService } from "./email.service";
import { generateOtp, hashOtp, isOtpValid } from "../utils/otp";

export class UserService {
  constructor(private repo: UserRepository, private email: EmailService) {}

  private toPublicUser(user: any): PublicUser {
    return {
      id: String(user._id),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role as UserRole,
      profession: user.profession,
      avatarUrl: user.avatarUrl || "",
      serviceSlug: user.serviceSlug || "",
    } as any;
  }

  async register(payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: "client" | "provider";
    profession?: string;
    serviceSlug?: string;
    password: string;
  }) {
    const existing = await this.repo.findByEmail(payload.email);
    if (existing) throw new HttpError(409, "Email already registered");

    if (payload.role === "provider") {
      const serviceSlug = (payload.serviceSlug ?? "").trim();
      if (!serviceSlug) throw new HttpError(400, "Service is required for service providers");

      const service = await ServiceModel.findOne({ slug: serviceSlug, status: "active" }).lean();
      if (!service) throw new HttpError(400, "Invalid service selected");
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const user = await this.repo.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      profession: payload.profession,
      serviceSlug: payload.serviceSlug ?? "",
      passwordHash,
      avatarUrl: "",
    });
    const otp = generateOtp(6);
    const emailOtpHash = hashOtp(otp);
    const emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.repo.setEmailOtp(user.email, { emailOtpHash, emailOtpExpiresAt });
    await this.email.sendOtpEmail(user.email, "Verify your email", otp);

    return {
      user: this.toPublicUser(user),
      needsEmailVerification: true,
    };
  }

  async login(payload: { email: string; password: string }) {
    const user = await this.repo.findByEmail(payload.email);
    if (!user) throw new HttpError(401, "Invalid email or password");

    const ok = await bcrypt.compare(payload.password, user.passwordHash);
    if (!ok) throw new HttpError(401, "Invalid email or password");

    if (!(user as any).emailVerified) {
      throw new HttpError(403, "Email not verified. Please verify your email first.");
    }

    const token = jwt.sign(
      { sub: String(user._id), email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return { token, user: this.toPublicUser(user) };
  }

  async verifyEmail(payload: { email: string; otp: string }) {
    const user = await this.repo.findByEmail(payload.email);
    if (!user) throw new HttpError(400, "Invalid email or code");

    const expiresAt = (user as any).emailOtpExpiresAt as Date | null;
    const otpHash = ((user as any).emailOtpHash as string) || "";

    if (!otpHash || !isOtpValid(expiresAt)) {
      throw new HttpError(400, "Code expired. Please resend.");
    }

    if (hashOtp(payload.otp) !== otpHash) {
      throw new HttpError(400, "Invalid email or code");
    }

    (user as any).emailVerified = true;
    (user as any).emailOtpHash = "";
    (user as any).emailOtpExpiresAt = null;

    await (user as any).save();

    return { user: this.toPublicUser(user) };
  }

  async resendVerification(payload: { email: string }) {
    const user = await this.repo.findByEmail(payload.email);
    if (!user) throw new HttpError(404, "User not found");

    if ((user as any).emailVerified) {
      return { message: "Email already verified" };
    }

    const otp = generateOtp(6);
    const emailOtpHash = hashOtp(otp);
    const emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.repo.setEmailOtp(user.email, { emailOtpHash, emailOtpExpiresAt });
    await this.email.sendOtpEmail(user.email, "Verify your email", otp);

    return { message: "Verification code sent" };
  }

  async forgotPassword(payload: { email: string }) {
    const user = await this.repo.findByEmail(payload.email);

    if (!user) return { message: "If the email exists, we sent a reset code." };

    const otp = generateOtp(6);
    const resetOtpHash = hashOtp(otp);
    const resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.repo.setResetOtp(user.email, { resetOtpHash, resetOtpExpiresAt });
    await this.email.sendOtpEmail(user.email, "Reset your password", otp);

    return { message: "If the email exists, we sent a reset code." };
  }

  async resetPassword(payload: { email: string; otp: string; newPassword: string }) {
    const user = await this.repo.findByEmail(payload.email);
    if (!user) throw new HttpError(400, "Invalid email or code");

    const expiresAt = (user as any).resetOtpExpiresAt as Date | null;
    const otpHash = ((user as any).resetOtpHash as string) || "";

    if (!otpHash || !isOtpValid(expiresAt)) {
      throw new HttpError(400, "Code expired. Please request a new one.");
    }

    if (hashOtp(payload.otp) !== otpHash) {
      throw new HttpError(400, "Invalid email or code");
    }

    const passwordHash = await bcrypt.hash(payload.newPassword, 10);
    (user as any).passwordHash = passwordHash;

    (user as any).resetOtpHash = "";
    (user as any).resetOtpExpiresAt = null;

    await (user as any).save();

    return { message: "Password updated successfully" };
  }

  async getMe(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) throw new HttpError(404, "User not found");
    return { user: this.toPublicUser(user) };
  }

  async updateMe(
    userId: string,
    payload: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
    }
  ) {
    const updated = await this.repo.updateMe(userId, payload);
    if (!updated) throw new HttpError(404, "User not found");
    return { user: this.toPublicUser(updated) };
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    const updated = await this.repo.updateAvatar(userId, avatarUrl);
    if (!updated) throw new HttpError(404, "User not found");
    return { user: this.toPublicUser(updated) };
  }

  async ensureAdmin(email: string, password: string) {
    const existing = await this.repo.findByEmail(email);
    if (existing) return;

    const passwordHash = await bcrypt.hash(password, 10);

    await this.repo.create({
      firstName: "Admin",
      lastName: "User",
      email,
      phone: "0000000000",
      role: "admin",
      profession: "admin",
      serviceSlug: "admin",
      passwordHash,
      avatarUrl: "",
      emailVerified: true,
    });

    console.log(`✅ Admin seeded: ${email}`);
  }

  async removeAvatar(userId: string) {
    const user = await this.repo.updateAvatar(userId, "");
    return user;
  }

  async updateById(
    id: string,
    loggedUser: { id: string; role: string },
    payload: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
      profession?: string;
      serviceSlug?: string;
      avatarUrl?: string;
    }
  ) {
    if (!loggedUser) throw new HttpError(401, "Unauthorized");

    if (loggedUser.role !== "admin" && String(loggedUser.id) !== String(id)) {
      throw new HttpError(403, "Forbidden");
    }

    const updatedBasic = await this.repo.updateMe(id, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      email: payload.email,
    });

    if (!updatedBasic) throw new HttpError(404, "User not found");

    let finalUser = updatedBasic;

    if (payload.avatarUrl) {
      const updatedAvatar = await this.repo.updateAvatar(id, payload.avatarUrl);
      if (!updatedAvatar) throw new HttpError(404, "User not found");
      finalUser = updatedAvatar;
    }

    if ((finalUser as any).role === "provider") {
      let changed = false;

      if (payload.profession !== undefined) {
        (finalUser as any).profession = payload.profession;
        changed = true;
      }

      if (payload.serviceSlug !== undefined) {
        const serviceSlug = (payload.serviceSlug ?? "").trim();
        if (!serviceSlug) throw new HttpError(400, "Service is required for service providers");

        const service = await ServiceModel.findOne({ slug: serviceSlug, status: "active" }).lean();
        if (!service) throw new HttpError(400, "Invalid service selected");

        (finalUser as any).serviceSlug = serviceSlug;
        changed = true;
      }

      if (changed) {
        await (finalUser as any).save();
      }
    }

    return { user: this.toPublicUser(finalUser) };
  }
}