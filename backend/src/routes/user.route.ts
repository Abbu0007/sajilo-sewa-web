import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { avatarUpload } from "../config/multer";
import { EmailService } from "../services/email.service";

const router = Router();

// Initialize repository
const repo = new UserRepository();

// Initialize email service
const emailService = new EmailService();

// Initialize user service
const service = new UserService(repo, emailService);

// Initialize controller
const controller = new UserController(service);

// Get current user profile
router.get("/me", authMiddleware, controller.getMe);

// Update current user profile
router.patch("/me", authMiddleware, controller.updateMe);

// Upload avatar
router.post(
  "/me/avatar",
  authMiddleware,
  avatarUpload.single("avatar"),
  controller.uploadAvatar
);

// Remove avatar
router.delete("/me/avatar", authMiddleware, controller.removeAvatar);

export default router;