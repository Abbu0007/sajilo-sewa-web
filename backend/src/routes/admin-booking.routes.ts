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

// Initialize repositories
const bookingRepo = new BookingRepository();
const notifRepo = new NotificationRepository();
const providerProfileRepo = new ProviderProfileRepository();
const userRepo = new UserRepository();

// Initialize services
const notifService = new NotificationService(notifRepo);

const bookingService = new BookingService(
  bookingRepo,
  notifService,
  providerProfileRepo,
  userRepo
);

// Initialize controller
const controller = new AdminBookingController(bookingService);

// List bookings
router.get("/", authMiddleware, adminMiddleware, controller.list);

// Get booking by id
router.get("/:bookingId", authMiddleware, adminMiddleware, controller.get);

// Cancel booking
router.patch("/:bookingId/cancel", authMiddleware, adminMiddleware, controller.cancel);

// Delete booking
router.delete("/:bookingId", authMiddleware, adminMiddleware, controller.remove);

export default router;