import { NotificationModel } from "../models/notification.model";

export class NotificationRepository {
  async create(data: any) {
    const doc = await NotificationModel.create(data);
    return doc.toObject();
  }

  async list(userId: string, opts?: { unreadOnly?: boolean; limit?: number }) {
    const filter: any = { userId };
    if (opts?.unreadOnly) filter.isRead = false;

    const limit = opts?.limit ?? 30;

    return NotificationModel.find(filter)
      .populate({
        path: "bookingId",
        populate: [
          { path: "clientId", select: "firstName lastName phone avatarUrl" },
          { path: "providerId", select: "firstName lastName phone avatarUrl" },
          { path: "serviceId", select: "name icon basePriceFrom" },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async unreadCount(userId: string) {
    return NotificationModel.countDocuments({ userId, isRead: false });
  }

  async markRead(userId: string, notificationId: string) {
    return NotificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { $set: { isRead: true } },
      { new: true }
    ).lean();
  }

  async markAllRead(userId: string) {
    await NotificationModel.updateMany({ userId, isRead: false }, { $set: { isRead: true } });
    return { ok: true };
  }
}
