import bcrypt from "bcrypt";
import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repository";
import { PublicUser, UserRole } from "../types/user.type";

export class AdminService {
  constructor(private repo: UserRepository) {}

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
    };
  }

  async createUser(payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: "client" | "provider" | "admin";
    profession?: string;
    password: string;
    avatarUrl?: string;
  }) {
    const existing = await this.repo.findByEmail(payload.email);
    if (existing) throw new HttpError(409, "Email already registered");

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const user = await this.repo.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      profession: payload.profession,
      passwordHash,
      avatarUrl: payload.avatarUrl || "",
    });

    return { user: this.toPublicUser(user) };
  }

  async listUsers() {
    const users = await this.repo.findAll();
    return { users: users.map((u: any) => this.toPublicUser(u)) };
  }

  async getUserById(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new HttpError(404, "User not found");
    return { user: this.toPublicUser(user) };
  }

  async updateUserById(
    id: string,
    payload: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
      role?: "client" | "provider" | "admin";
      profession?: string;
      password?: string;
      avatarUrl?: string;
    }
  ) {
    let passwordHash: string | undefined;

    if (payload.password) {
      passwordHash = await bcrypt.hash(payload.password, 10);
    }

    const updated = await this.repo.adminUpdateById(id, {
      ...payload,
      passwordHash,
    });

    if (!updated) throw new HttpError(404, "User not found");

    return { user: this.toPublicUser(updated) };
  }

  async deleteUserById(id: string) {
    const deleted = await this.repo.deleteById(id);
    if (!deleted) throw new HttpError(404, "User not found");
    return { message: "User deleted" };
  }
}
