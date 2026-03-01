import { Router } from "express";
import { BookingRepository } from "../repositories/booking.repository";
import { NotificationRepository } from "../repositories/notification.repository";
import { ProviderProfileRepository } from "../repositories/provider-profile.repository";
import { UserRepository } from "../repositories/user.repository";
import { NotificationService } from "../services/notification.service";
import { BookingService } from "../services/booking.service";
import { AdminBookingController } from "../controllers/admin-booking.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();

const bookingRepo = new BookingRepository();
const notifRepo = new NotificationRepository();
const notifService = new NotificationService(notifRepo);
const providerProfileRepo = new ProviderProfileRepository();
const userRepo = new UserRepository();

const bookingService = new BookingService(
  bookingRepo,
  notifService,
  providerProfileRepo,
  userRepo
);

const controller = new AdminBookingController(bookingService);

router.get("/", authMiddleware, adminMiddleware, controller.list);
router.get("/:bookingId", authMiddleware, adminMiddleware, controller.get);
router.patch("/:bookingId/cancel", authMiddleware, adminMiddleware, controller.cancel);
router.delete("/:bookingId", authMiddleware, adminMiddleware, controller.remove);

export default router;