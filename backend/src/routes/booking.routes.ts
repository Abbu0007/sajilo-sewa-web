import { Router } from "express";
import { BookingRepository } from "../repositories/booking.repository";
import { NotificationRepository } from "../repositories/notification.repository";
import { ProviderProfileRepository } from "../repositories/provider-profile.repository";
import { UserRepository } from "../repositories/user.repository";
import { NotificationService } from "../services/notification.service";
import { BookingService } from "../services/booking.service";
import { BookingController } from "../controllers/booking.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

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
const controller = new BookingController(bookingService);

// Create booking
router.post("/", authMiddleware, controller.create);

// List client bookings
router.get("/mine", authMiddleware, controller.listMine);

// Get booking details
router.get("/:bookingId", authMiddleware, controller.details);

// Cancel booking
router.patch("/:bookingId/cancel", authMiddleware, controller.cancel);

// Confirm payment
router.patch(
  "/:bookingId/confirm-payment",
  authMiddleware,
  controller.confirmPayment
);

export default router;