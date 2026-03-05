import { UserModel } from "../models/user.model";

export class UserRepository {
  async findByEmail(email: string) {
    return UserModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return UserModel.findById(id).exec();
  }

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: "client" | "provider" | "admin";
    profession?: string;
    serviceSlug?: string;
    passwordHash: string;
    avatarUrl?: string;
    emailVerified?: boolean; // ✅ NEW (so admin can be verified)
  }) {
    const user = await UserModel.create(data);
    return user;
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
    const update: any = {};
    if (payload.firstName !== undefined) update.firstName = payload.firstName;
    if (payload.lastName !== undefined) update.lastName = payload.lastName;
    if (payload.phone !== undefined) update.phone = payload.phone;
    if (payload.email !== undefined) update.email = payload.email;

    return UserModel.findByIdAndUpdate(userId, update, { new: true }).exec();
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return UserModel.findByIdAndUpdate(userId, { avatarUrl }, { new: true }).exec();
  }

  async findAll() {
    return UserModel.find().sort({ createdAt: -1 }).exec();
  }

  async findProvidersByServiceSlug(serviceSlug: string) {
    return UserModel.find({
      role: "provider",
      serviceSlug: serviceSlug,
    })
      .select(
        "firstName lastName email phone avatarUrl role profession serviceSlug avgRating ratingCount"
      )
      .exec();
  }

  async adminUpdateById(
    id: string,
    payload: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
      role?: "client" | "provider" | "admin";
      profession?: string;
      serviceSlug?: string;
      passwordHash?: string;
      avatarUrl?: string;
    }
  ) {
    const update: any = {};
    if (payload.firstName !== undefined) update.firstName = payload.firstName;
    if (payload.lastName !== undefined) update.lastName = payload.lastName;
    if (payload.phone !== undefined) update.phone = payload.phone;
    if (payload.email !== undefined) update.email = payload.email;
    if (payload.role !== undefined) update.role = payload.role;
    if (payload.profession !== undefined) update.profession = payload.profession;
    if (payload.serviceSlug !== undefined) update.serviceSlug = payload.serviceSlug;
    if (payload.passwordHash !== undefined) update.passwordHash = payload.passwordHash;
    if (payload.avatarUrl !== undefined) update.avatarUrl = payload.avatarUrl;

    return UserModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async deleteById(id: string) {
    return UserModel.findByIdAndDelete(id).exec();
  }

  async findByIds(ids: string[]) {
    return UserModel.find({ _id: { $in: ids } })
      .select("firstName lastName email phone avatarUrl role profession serviceSlug")
      .exec();
  }

  async updateRatingStats(userId: string, stats: { avgRating: number; ratingCount: number }) {
    return UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          avgRating: stats.avgRating,
          ratingCount: stats.ratingCount,
        },
      },
      { new: true }
    ).exec();
  }

  // ✅ Email verification OTP
  async setEmailOtp(email: string, data: { emailOtpHash: string; emailOtpExpiresAt: Date }) {
    return UserModel.findOneAndUpdate({ email }, { $set: data }, { new: true }).exec();
  }

  async clearEmailOtp(email: string) {
    return UserModel.findOneAndUpdate(
      { email },
      { $set: { emailOtpHash: "", emailOtpExpiresAt: null } },
      { new: true }
    ).exec();
  }

  // ✅ Password reset OTP
  async setResetOtp(email: string, data: { resetOtpHash: string; resetOtpExpiresAt: Date }) {
    return UserModel.findOneAndUpdate({ email }, { $set: data }, { new: true }).exec();
  }

  async clearResetOtp(email: string) {
    return UserModel.findOneAndUpdate(
      { email },
      { $set: { resetOtpHash: "", resetOtpExpiresAt: null } },
      { new: true }
    ).exec();
  }
}