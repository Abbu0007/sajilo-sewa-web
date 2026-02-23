import { NotificationRepository } from "../repositories/notification.repository";

export class NotificationService {
  constructor(private repo: NotificationRepository) {}

  list(userId: string, opts?: { unreadOnly?: boolean; limit?: number }) {
    return this.repo.list(userId, opts);
  }

  unreadCount(userId: string) {
    return this.repo.unreadCount(userId);
  }

  markRead(userId: string, notificationId: string) {
    return this.repo.markRead(userId, notificationId);
  }

  markAllRead(userId: string) {
    return this.repo.markAllRead(userId);
  }

  create(data: any) {
    return this.repo.create(data);
  }
}
