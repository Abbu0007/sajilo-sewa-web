import bcrypt from "bcrypt";
import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repository";
import { PublicUser, UserRole } from "../types/user.type";
import { Types } from "mongoose";
import { BookingModel } from "../models/booking.model";
import { RatingModel } from "../models/rating.model";

// Admin service
export class AdminService {
  constructor(private repo: UserRepository) {}

  // Convert string ids to object ids
  private toObjectIds(ids: string[]) {
    const out: Types.ObjectId[] = [];
    for (const id of ids) {
      try {
        out.push(new Types.ObjectId(id));
      } catch {}
    }
    return out;
  }

  // Build rating stats map
  private async getRatingMap(userIds: string[], rateeRole: "client" | "provider") {
    const oids = this.toObjectIds(userIds);
    const out = new Map<string, { ratingAvg: number; ratingCount: number }>();
    if (oids.length === 0) return out;

    const agg = await RatingModel.aggregate([
      { $match: { rateeRole, rateeId: { $in: oids } } },
      { $group: { _id: "$rateeId", ratingAvg: { $avg: "$stars" }, ratingCount: { $sum: 1 } } },
    ]);

    for (const x of agg ?? []) {
      out.set(String(x._id), {
        ratingAvg: Number(x.ratingAvg ?? 0),
        ratingCount: Number(x.ratingCount ?? 0),
      });
    }

    return out;
  }

  // Build completed bookings map
  private async getCompletedMap(userIds: string[], field: "clientId" | "providerId") {
    const oids = this.toObjectIds(userIds);
    const out = new Map<string, number>();
    if (oids.length === 0) return out;

    const agg = await BookingModel.aggregate([
      { $match: { [field]: { $in: oids }, status: "completed" } },
      { $group: { _id: `$${field}`, completedBookings: { $sum: 1 } } },
    ]);

    for (const x of agg ?? []) {
      out.set(String(x._id), Number(x.completedBookings ?? 0));
    }

    return out;
  }

  // Convert db user to public user
  private toPublicUser(
    user: any,
    stats?: { ratingAvg?: number; ratingCount?: number; completedBookings?: number }
  ): PublicUser {
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
      ratingAvg: Number(stats?.ratingAvg ?? 0),
      ratingCount: Number(stats?.ratingCount ?? 0),
      completedBookings: Number(stats?.completedBookings ?? 0),
    } as any;
  }

  // Create user by admin
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
      serviceSlug: (payload as any).serviceSlug ?? "",
    } as any);

    return { user: this.toPublicUser(user) };
  }

  // List users with stats
  async listUsers() {
    const users = await this.repo.findAll();

    const clients = users.filter((u: any) => String(u.role) === "client");
    const providers = users.filter((u: any) => String(u.role) === "provider");

    const clientIds = Array.from(new Set(clients.map((u: any) => String(u._id))));
    const providerIds = Array.from(new Set(providers.map((u: any) => String(u._id))));

    const [
      clientRatings,
      providerRatings,
      clientCompleted,
      providerCompleted,
    ] = await Promise.all([
      this.getRatingMap(clientIds, "client"),
      this.getRatingMap(providerIds, "provider"),
      this.getCompletedMap(clientIds, "clientId"),
      this.getCompletedMap(providerIds, "providerId"),
    ]);

    const out = users.map((u: any) => {
      const role = String(u.role ?? "");
      const id = String(u._id);

      const rating =
        role === "client"
          ? clientRatings.get(id)
          : role === "provider"
          ? providerRatings.get(id)
          : undefined;

      const completed =
        role === "client"
          ? clientCompleted.get(id)
          : role === "provider"
          ? providerCompleted.get(id)
          : 0;

      return this.toPublicUser(u, {
        ratingAvg: Number(rating?.ratingAvg ?? 0),
        ratingCount: Number(rating?.ratingCount ?? 0),
        completedBookings: Number(completed ?? 0),
      });
    });

    return { users: out };
  }

  // Get user by id with stats
  async getUserById(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new HttpError(404, "User not found");

    const role = String((user as any).role ?? "");
    const uid = String((user as any)._id);

    const [ratingMap, completedMap] = await Promise.all([
      role === "client" || role === "provider" ? this.getRatingMap([uid], role as any) : Promise.resolve(new Map()),
      role === "client"
        ? this.getCompletedMap([uid], "clientId")
        : role === "provider"
        ? this.getCompletedMap([uid], "providerId")
        : Promise.resolve(new Map()),
    ]);

    const r = ratingMap.get(uid) ?? { ratingAvg: 0, ratingCount: 0 };
    const c = completedMap.get(uid) ?? 0;

    return { user: this.toPublicUser(user, { ratingAvg: r.ratingAvg, ratingCount: r.ratingCount, completedBookings: c }) };
  }

  // Update user by id
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
      serviceSlug?: string;
    }
  ) {
    let passwordHash: string | undefined;

    // Hash password if provided
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

  // Delete user by id
  async deleteUserById(id: string) {
    const deleted = await this.repo.deleteById(id);
    if (!deleted) throw new HttpError(404, "User not found");
    return { message: "User deleted" };
  }
}