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
    passwordHash: string;
    avatarUrl?: string;
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

  async adminUpdateById(
    id: string,
    payload: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
      role?: "client" | "provider" | "admin";
      profession?: string;
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
    if (payload.passwordHash !== undefined) update.passwordHash = payload.passwordHash;
    if (payload.avatarUrl !== undefined) update.avatarUrl = payload.avatarUrl;

    return UserModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async deleteById(id: string) {
    return UserModel.findByIdAndDelete(id).exec();
  }

}
