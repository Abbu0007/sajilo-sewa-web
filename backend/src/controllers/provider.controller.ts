import { Request, Response, NextFunction } from "express";
import { ProviderService } from "../services/provider.service";
import { upsertProviderProfileDto } from "../dtos/provider.dto";

export class ProviderController {
  constructor(private service: ProviderService) {}

  topRated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.query.limit ?? 8);
      const items = await this.service.topRated(Number.isFinite(limit) ? limit : 8);
      res.json({ items });
    } catch (e) {
      next(e);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "");
      const profession = String(req.query.profession ?? "");
      const availability = String(req.query.availability ?? "");
      const items = await this.service.search({
        q: q || undefined,
        profession: profession || undefined,
        availability: availability || undefined,
      });
      res.json({ items });
    } catch (e) {
      next(e);
    }
  };

  getPublic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const providerUserId = req.params.providerUserId;
      const data = await this.service.getProviderPublic(providerUserId);
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const profile = await this.service.getMyProfile(user.id, user.role);
      res.json({ profile });
    } catch (e) {
      next(e);
    }
  };

  upsertMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const payload = upsertProviderProfileDto.parse(req.body);
      const profile = await this.service.upsertProfile(user.id, user.role, payload);
      res.json({ profile });
    } catch (e) {
      next(e);
    }
  };
}
