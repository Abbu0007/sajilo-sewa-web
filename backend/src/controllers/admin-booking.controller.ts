import { Request, Response, NextFunction } from "express";
import { BookingService } from "../services/booking.service";

export class AdminBookingController {
  constructor(private service: BookingService) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      const status = String(req.query.status ?? "all");
      const q = String(req.query.q ?? "");
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 20);

      const dateFrom = req.query.dateFrom ? new Date(String(req.query.dateFrom)) : undefined;
      const dateTo = req.query.dateTo ? new Date(String(req.query.dateTo)) : undefined;

      const result = await this.service.adminList(user.role, {
        status,
        q: q || undefined,
        dateFrom,
        dateTo,
        page: Number.isFinite(page) && page > 0 ? page : 1,
        limit: Number.isFinite(limit) && limit > 0 ? limit : 20,
      });

      res.json(result);
    } catch (e) {
      next(e);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const bookingId = req.params.bookingId;
      const booking = await this.service.adminGet(user.role, bookingId);
      res.json({ booking });
    } catch (e) {
      next(e);
    }
  };
}
