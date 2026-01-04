import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";

const router = Router();

const repo = new UserRepository();
const service = new UserService(repo);
const controller = new AuthController(service);

router.post("/register", controller.register);
router.post("/login", controller.login);

export default router;
