import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { HttpError } from "../errors/http-error";
import { config } from "../config";
import { PublicUser, UserRole } from "../types/user.type";

export class UserService {
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

  async register(payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: "client" | "provider";
    profession?: string;
    password: string;
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
      avatarUrl: "",
    });

    return { user: this.toPublicUser(user) };
  }

  async login(payload: { email: string; password: string }) {
    const user = await this.repo.findByEmail(payload.email);
    if (!user) throw new HttpError(401, "Invalid email or password");

    const ok = await bcrypt.compare(payload.password, user.passwordHash);
    if (!ok) throw new HttpError(401, "Invalid email or password");

    const token = jwt.sign(
      { sub: String(user._id), email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return { token, user: this.toPublicUser(user) };
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
      passwordHash,
      avatarUrl: "",
    });

    console.log(`✅ Admin seeded: ${email}`);
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

    
    if (payload.profession !== undefined && (finalUser as any).role === "provider") {
      (finalUser as any).profession = payload.profession;
      await (finalUser as any).save();
    }

    return { user: this.toPublicUser(finalUser) };
  }
}
