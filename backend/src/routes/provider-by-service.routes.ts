import { Router } from "express";
import { UserModel } from "../models/user.model";
import { ProviderProfileModel } from "../models/provider-profile.model";

const router = Router();

router.get("/:serviceSlug", async (req, res, next) => {
  try {
    const { serviceSlug } = req.params;

    const users = await UserModel.find({
      role: "provider",
      serviceSlug,
    })
      .select("_id firstName lastName email phone avatarUrl profession serviceSlug")
      .sort({ createdAt: -1 })
      .lean();

    const ids = users.map((u: any) => String(u._id));
    const profiles = await ProviderProfileModel.find({ userId: { $in: ids } })
      .select("userId ratingAvg ratingCount completedJobs startingPrice profession")
      .lean();

    const profileMap = new Map<string, any>();
    for (const p of profiles) profileMap.set(String(p.userId), p);

    const items = users.map((u: any) => {
      const prof = profileMap.get(String(u._id));

      return {
        _id: String(u._id),
        firstName: u.firstName ?? "",
        lastName: u.lastName ?? "",
        email: u.email ?? "",
        phone: u.phone ?? "",
        avatarUrl: u.avatarUrl ?? "",
        profession: u.profession ?? prof?.profession ?? "",
        serviceSlug: u.serviceSlug ?? serviceSlug,
        avgRating: typeof prof?.ratingAvg === "number" ? prof.ratingAvg : 0,
        ratingCount: typeof prof?.ratingCount === "number" ? prof.ratingCount : 0,
        completedJobs: typeof prof?.completedJobs === "number" ? prof.completedJobs : 0,
        startingPrice: typeof prof?.startingPrice === "number" ? prof.startingPrice : 0,
      };
    });

    res.json({ items });
  } catch (e) {
    next(e);
  }
});

export default router;