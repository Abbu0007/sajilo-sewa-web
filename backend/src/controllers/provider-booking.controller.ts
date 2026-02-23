import { Request, Response, NextFunction } from "express";
import { BookingService } from "../services/booking.service";
import { providerDecisionDto, providerUpdateStatusDto } from "../dtos/booking.dto";

export class ProviderBookingController {
  constructor(private service: BookingService) {}

  listMine = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const status = String(req.query.status ?? "all");
      const items = await this.service.listProviderBookings(user.id, user.role, status);
      res.json({ items });
    } catch (e) {
      next(e);
    }
  };

  accept = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const bookingId = req.params.bookingId;
      const booking = await this.service.providerAccept(user.id, user.role, bookingId);
      res.json({ booking });
    } catch (e) {
      next(e);
    }
  };

  reject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const bookingId = req.params.bookingId;
      const payload = providerDecisionDto.parse(req.body ?? {});
      const booking = await this.service.providerReject(user.id, user.role, bookingId, payload.reason);
      res.json({ booking });
    } catch (e) {
      next(e);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const bookingId = req.params.bookingId;
      const payload = providerUpdateStatusDto.parse(req.body);
      const booking = await this.service.providerUpdateStatus(user.id, user.role, bookingId, payload.status, payload.reason);
      res.json({ booking });
    } catch (e) {
      next(e);
    }
  };
}
