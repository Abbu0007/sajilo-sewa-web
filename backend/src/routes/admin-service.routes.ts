import { Router } from "express";
import { ServiceModel } from "../models/service.model";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();

router.post("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { name, slug, icon, basePriceFrom, status } = req.body;

    const service = await ServiceModel.create({
      name,
      slug,
      icon: icon ?? "",
      basePriceFrom: basePriceFrom ?? 0,
      status: status ?? "active",
    });

    res.status(201).json({ service });
  } catch (e) {
    next(e);
  }
});

// Admin list all 
router.get("/", authMiddleware, adminMiddleware, async (_req, res, next) => {
  try {
    const items = await ServiceModel.find().sort({ createdAt: -1 }).lean();
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

export default router;
