import type { Request, Response, NextFunction } from "express";
import { BookingService } from "../services/booking.service";

function firstQueryValue(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return undefined;
}

function toInt(v: unknown, fallback: number) {
  const s = firstQueryValue(v);
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function toDate(v: unknown): Date | undefined {
  const s = firstQueryValue(v);
  if (!s) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export class AdminBookingController {
  constructor(private service: BookingService) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user as { role?: string } | undefined;
      const role = String(user?.role ?? "");

      const status = firstQueryValue(req.query.status) ?? "all";
      const q = firstQueryValue(req.query.q) ?? "";

      const page = toInt(req.query.page, 1);
      const limit = toInt(req.query.limit, 20);

      const dateFrom = toDate(req.query.dateFrom);
      const dateTo = toDate(req.query.dateTo);

      const result = await this.service.adminList(role, {
        status,
        q: q.trim() ? q.trim() : undefined,
        dateFrom,
        dateTo,
        page,
        limit,
      });

      return res.json(result);
    } catch (e) {
      return next(e);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user as { role?: string } | undefined;
      const role = String(user?.role ?? "");
      const bookingId = String(req.params.bookingId ?? "");

      const booking = await this.service.adminGet(role, bookingId);
      return res.json({ booking });
    } catch (e) {
      return next(e);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user as { role?: string } | undefined;
      const role = String(user?.role ?? "");
      const bookingId = String(req.params.bookingId ?? "");
      const reason = String(req.body?.reason ?? "");

      const updated = await this.service.adminCancel(role, bookingId, reason);
      return res.json({ booking: updated });
    } catch (e) {
      return next(e);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user as { role?: string } | undefined;
      const role = String(user?.role ?? "");
      const bookingId = String(req.params.bookingId ?? "");

      const result = await this.service.adminDelete(role, bookingId);
      return res.json(result);
    } catch (e) {
      return next(e);
    }
  };
}