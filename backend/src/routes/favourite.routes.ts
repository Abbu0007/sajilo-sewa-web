import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { FavouriteRepository } from "../repositories/favourite.repository";
import { UserRepository } from "../repositories/user.repository";
import { FavouriteService } from "../services/favourite.service";
import { FavouriteController } from "../controllers/favourite.controller";

const router = Router();

const favRepo = new FavouriteRepository();
const userRepo = new UserRepository();
const service = new FavouriteService(favRepo, userRepo);
const controller = new FavouriteController(service);

router.get("/", authMiddleware, controller.listMine);
router.post("/:providerId", authMiddleware, controller.toggle);

export default router;
