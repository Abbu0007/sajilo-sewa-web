import { Router } from "express";
import { BookingRepository } from "../repositories/booking.repository";
import { NotificationRepository } from "../repositories/notification.repository";
import { NotificationService } from "../services/notification.service";
import { BookingService } from "../services/booking.service";
import { BookingController } from "../controllers/booking.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

const bookingRepo = new BookingRepository();
const notifRepo = new NotificationRepository();
const notifService = new NotificationService(notifRepo);
const bookingService = new BookingService(bookingRepo, notifService);
const controller = new BookingController(bookingService);

router.post("/", authMiddleware, controller.create);
router.get("/mine", authMiddleware, controller.listMine);
router.get("/:bookingId", authMiddleware, controller.details);
router.patch("/:bookingId/cancel", authMiddleware, controller.cancel);

export default router;
