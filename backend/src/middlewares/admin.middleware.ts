import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http-error";

export function adminMiddleware(req: Request, _res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user) return next(new HttpError(401, "Unauthorized"));
  if (user.role !== "admin") return next(new HttpError(403, "Admin only"));
  return next();
}
