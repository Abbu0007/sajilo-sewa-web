import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ClientController } from "../controllers/client.controller";
import { ClientService } from "../services/client.service";

const router = Router();

const service = new ClientService();
const controller = new ClientController(service);

router.get("/me/profile", authMiddleware, controller.getMyProfile);

export default router;