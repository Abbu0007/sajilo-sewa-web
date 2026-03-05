import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { EmailService } from "../services/email.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { avatarUpload } from "../config/multer";

const router = Router();

// Initialize repository
const repo = new UserRepository();

// Initialize email service
const emailService = new EmailService();

// Initialize user service
const service = new UserService(repo, emailService);

// Initialize controller
const controller = new AuthController(service);

// Register user
router.post("/register", controller.register);

// Verify email
router.post("/verify-email", controller.verifyEmail);

// Resend verification email
router.post("/resend-verification", controller.resendVerification);

// Login user
router.post("/login", controller.login);

// Forgot password
router.post("/forgot-password", controller.forgotPassword);

// Reset password
router.post("/reset-password", controller.resetPassword);

// Update profile
router.put("/:id", authMiddleware, avatarUpload.single("avatar"), controller.updateById);

export default router;