import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { HttpError } from "../errors/http-error";

export type AuthUser = { id: string; email: string; role: string };

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Unauthorized"));
  }

  const token = header.substring("Bearer ".length);

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    (req as any).user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    } satisfies AuthUser;

    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired token"));
  }
}
