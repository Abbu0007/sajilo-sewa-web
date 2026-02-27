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

const controller = new BookingController(bookingService);

router.post("/", authMiddleware, controller.create);
router.get("/mine", authMiddleware, controller.listMine);
router.get("/:bookingId", authMiddleware, controller.details);
router.patch("/:bookingId/cancel", authMiddleware, controller.cancel);

/* 🔥 NEW ROUTE */
router.patch(
  "/:bookingId/confirm-payment",
  authMiddleware,
  controller.confirmPayment
);

export default router;