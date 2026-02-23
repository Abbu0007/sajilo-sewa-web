import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { avatarUpload } from "../config/multer";

const router = Router();

const repo = new UserRepository();
const service = new UserService(repo);
const controller = new UserController(service);


router.get("/me", authMiddleware, controller.getMe);


router.patch("/me", authMiddleware, controller.updateMe);


router.post(
  "/me/avatar",
  authMiddleware,
  avatarUpload.single("avatar"),
  controller.uploadAvatar
);

router.delete("/me/avatar", authMiddleware, controller.removeAvatar);

export default router;
