import { Request, Response, NextFunction } from "express";
import { ClientService } from "../services/client.service";

export class ClientController {
  constructor(private service: ClientService) {}

  getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const profile = await this.service.getMyClientProfile(user.id);
      res.json({ profile });
    } catch (e) {
      next(e);
    }
  };
}