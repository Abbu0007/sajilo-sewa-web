import { Request, Response, NextFunction } from "express";
import { BookingService } from "../services/booking.service";
import { createBookingDto, cancelBookingDto } from "../dtos/booking.dto";

export class BookingController {
  constructor(private service: BookingService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const payload = createBookingDto.parse(req.body);
      const booking = await this.service.createBooking(user.id, user.role, payload);
      res.status(201).json({ booking });
    } catch (e) {
      next(e);
    }
  };

  listMine = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const status = String(req.query.status ?? "all");
      const items = await this.service.listClientBookings(user.id, user.role, status);
      res.json({ items });
    } catch (e) {
      next(e);
    }
  };

  details = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const bookingId = req.params.bookingId;
      const booking = await this.service.getBookingDetails(user.id, user.role, bookingId);
      res.json({ booking });
    } catch (e) {
      next(e);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const bookingId = req.params.bookingId;
      const payload = cancelBookingDto.parse(req.body ?? {});
      const booking = await this.service.clientCancel(user.id, user.role, bookingId, payload.reason);
      res.json({ booking });
    } catch (e) {
      next(e);
    }
  };
}
