import { Request, Response, NextFunction } from "express";
import { ServiceService } from "../services/service.service";

export class ServiceController {
  constructor(private service: ServiceService) {}

  listActive = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.service.listActive();
      res.json({ items });
    } catch (e) {
      next(e);
    }
  };
}
