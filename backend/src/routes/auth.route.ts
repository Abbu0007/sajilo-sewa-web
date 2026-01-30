import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { avatarUpload } from "../config/multer";

const router = Router();

const repo = new UserRepository();
const service = new UserService(repo);
const controller = new AuthController(service);

router.post("/register", controller.register);
router.post("/login", controller.login);

router.put("/:id", authMiddleware, avatarUpload.single("avatar"), controller.updateById);

export default router;
