import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { NotificationModel } from "../models/notification.model"; 

const router = Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const user = (req as any).user;

    const items = await NotificationModel.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({ items });
  } catch (e) {
    next(e);
  }
});


router.patch("/:id/read", authMiddleware, async (req, res, next) => {
  try {
    const user = (req as any).user;

    const updated = await NotificationModel.findOneAndUpdate(
      { _id: req.params.id, userId: user.id },
      { isRead: true },
      { new: true }
    ).lean();

    if (!updated) return res.status(404).json({ message: "Notification not found" });
    res.json({ ok: true, notification: updated });
  } catch (e) {
    next(e);
  }
});

export default router;
