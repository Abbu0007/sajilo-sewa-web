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
}
