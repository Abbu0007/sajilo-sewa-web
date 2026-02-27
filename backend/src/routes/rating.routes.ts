import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

import { RatingRepository } from "../repositories/rating.repository";
import { BookingRepository } from "../repositories/booking.repository";
import { UserRepository } from "../repositories/user.repository";
import { ProviderProfileRepository } from "../repositories/provider-profile.repository"; // ✅ NEW

import { RatingService } from "../services/rating.service";
import { RatingController } from "../controllers/rating.controller";

const router = Router();

const ratingRepo = new RatingRepository();
const bookingRepo = new BookingRepository();
const userRepo = new UserRepository();
const providerProfileRepo = new ProviderProfileRepository(); // ✅ NEW

const ratingService = new RatingService(
  ratingRepo,
  bookingRepo,
  userRepo,
  providerProfileRepo 
);

const controller = new RatingController(ratingService);

router.post("/", authMiddleware, controller.create);
router.get("/mine", authMiddleware, controller.listMine);

export default router;