import { Router } from "express";
import { ServiceRepository } from "../repositories/service.repository";
import { ServiceService } from "../services/service.service";
import { ServiceController } from "../controllers/service.controller";

const router = Router();

const repo = new ServiceRepository();
const service = new ServiceService(repo);
const controller = new ServiceController(service);

router.get("/", controller.listActive);

export default router;
