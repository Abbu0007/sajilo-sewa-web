import { Request, Response } from "express";
import { FavouriteService } from "../services/favourite.service";

export class FavouriteController {
  constructor(private service: FavouriteService) {}

  listMine = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await this.service.listMine(user.id);
    res.status(200).json(result);
  };

  toggle = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const providerId = req.params.providerId;
    const result = await this.service.toggle(user.id, providerId);
    res.status(200).json(result);
  };
}