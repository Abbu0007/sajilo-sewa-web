import { Router } from "express";
import { BookingRepository } from "../repositories/booking.repository";
import { NotificationRepository } from "../repositories/notification.repository";
import { ProviderProfileRepository } from "../repositories/provider-profile.repository";
import { UserRepository } from "../repositories/user.repository";
import { NotificationService } from "../services/notification.service";
import { BookingService } from "../services/booking.service";
import { ProviderBookingController } from "../controllers/provider-booking.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

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

const controller = new ProviderBookingController(bookingService);

router.get("/earnings", authMiddleware, controller.earnings);
router.get("/mine", authMiddleware, controller.listMine);
router.patch("/:bookingId/accept", authMiddleware, controller.accept);
router.patch("/:bookingId/reject", authMiddleware, controller.reject);
router.patch("/:bookingId/status", authMiddleware, controller.updateStatus);

export default router;