import { Request, Response, NextFunction } from "express";
import { createRatingDto } from "../dtos/rating.dto";
import { RatingService } from "../services/rating.service";

export class RatingController {
  constructor(private service: RatingService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const payload = createRatingDto.parse(req.body);
      const rating = await this.service.createRating(user.id, user.role, payload);
      res.status(201).json({ rating });
    } catch (e) {
      next(e);
    }
  };

  listMine = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const items = await this.service.listMyRatings(user.id, user.role);
      res.json({ items });
    } catch (e) {
      next(e);
    }
  };
}