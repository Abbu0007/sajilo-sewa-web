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

// ✅ Fetch current user profile
router.get("/me", authMiddleware, controller.getMe);

// ✅ Update current user profile
router.patch("/me", authMiddleware, controller.updateMe);

// ✅ Upload avatar
router.post(
  "/me/avatar",
  authMiddleware,
  avatarUpload.single("avatar"),
  controller.uploadAvatar
);

export default router;
