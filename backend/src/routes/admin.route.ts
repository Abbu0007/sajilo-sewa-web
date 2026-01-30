import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { avatarUpload } from "../config/multer";

import { UserRepository } from "../repositories/user.repository";
import { AdminService } from "../services/admin.service";
import { AdminController } from "../controllers/admin.controller";

const router = Router();

const repo = new UserRepository();
const service = new AdminService(repo);
const controller = new AdminController(service);

// protect ALL admin endpoints
router.use(authMiddleware, adminMiddleware);

router.post("/users", avatarUpload.single("avatar"), controller.createUser);
router.get("/users", controller.listUsers);
router.get("/users/:id", controller.getUser);
router.put("/users/:id", avatarUpload.single("avatar"), controller.updateUser);
router.delete("/users/:id", controller.deleteUser);

export default router;
