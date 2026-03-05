import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { avatarUpload } from "../config/multer";

import { UserRepository } from "../repositories/user.repository";
import { AdminService } from "../services/admin.service";
import { AdminController } from "../controllers/admin.controller";

const router = Router();

// Initialize repository
const repo = new UserRepository();

// Initialize service
const service = new AdminService(repo);

// Initialize controller
const controller = new AdminController(service);

// Protect all admin routes
router.use(authMiddleware, adminMiddleware);

// Create user
router.post("/users", avatarUpload.single("avatar"), controller.createUser);

// List users
router.get("/users", controller.listUsers);

// Get user by id
router.get("/users/:id", controller.getUser);

// Update user
router.put("/users/:id", avatarUpload.single("avatar"), controller.updateUser);

// Delete user
router.delete("/users/:id", controller.deleteUser);

export default router;