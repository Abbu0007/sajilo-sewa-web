import { UserModel } from "../models/user.model";

export class UserRepository {
  async findByEmail(email: string) {
    return UserModel.findOne({ email }).exec();
  }

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: "client" | "provider" | "admin";
    profession?: string;
    passwordHash: string;
  }) {
    const user = await UserModel.create(data);
    return user;
  }
}
