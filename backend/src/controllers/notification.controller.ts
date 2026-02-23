import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notification.service";

export class NotificationController {
  constructor(private service: NotificationService) {}

  listMine = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const unreadOnly = String(req.query.unreadOnly ?? "false") === "true";
      const limit = Number(req.query.limit ?? 30);
      const items = await this.service.list(user.id, { unreadOnly, limit: Number.isFinite(limit) ? limit : 30 });
      res.json({ items });
    } catch (e) {
      next(e);
    }
  };

  unreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const count = await this.service.unreadCount(user.id);
      res.json({ count });
    } catch (e) {
      next(e);
    }
  };

  markRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const notificationId = req.params.notificationId;
      const item = await this.service.markRead(user.id, notificationId);
      res.json({ item });
    } catch (e) {
      next(e);
    }
  };

  markAllRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const result = await this.service.markAllRead(user.id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  };
}
