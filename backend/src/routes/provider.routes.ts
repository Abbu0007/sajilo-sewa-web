import { Router } from "express";
import { ProviderProfileRepository } from "../repositories/provider-profile.repository";
import { ProviderService } from "../services/provider.service";
import { ProviderController } from "../controllers/provider.controller";
import { UserRepository } from "../repositories/user.repository";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

const providerRepo = new ProviderProfileRepository();
const userRepo = new UserRepository();
const service = new ProviderService(providerRepo, userRepo);
const controller = new ProviderController(service);


router.get("/top-rated", controller.topRated);
router.get("/search", controller.search);

router.get("/me/profile", authMiddleware, controller.getMe);
router.put("/me/profile", authMiddleware, controller.upsertMe);


router.get("/:providerUserId", controller.getPublic);

export default router;
