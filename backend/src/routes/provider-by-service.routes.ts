import { Router } from "express";
import { UserModel } from "../models/user.model";

const router = Router();

router.get("/:serviceSlug", async (req, res, next) => {
  try {
    const { serviceSlug } = req.params;

    const items = await UserModel.find({
      role: "provider",
      serviceSlug,
    })
      .select("firstName lastName email phone avatarUrl profession serviceSlug")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ items });
  } catch (e) {
    next(e);
  }
});

export default router;
