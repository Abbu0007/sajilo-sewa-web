import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { HttpError } from "../errors/http-error";

export class UserController {
  constructor(private service: UserService) {}

 
  getMe = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) throw new HttpError(401, "Unauthorized");

    const result = await this.service.getMe(userId);
    return res.status(200).json({ user: result.user });
  };

  
  updateMe = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) throw new HttpError(401, "Unauthorized");

    const { firstName, lastName, phone, email } = req.body ?? {};

    const result = await this.service.updateMe(userId, {
      firstName,
      lastName,
      phone,
      email,
    });

    return res.status(200).json({ message: "Profile updated", user: result.user });
  };

  
  uploadAvatar = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) throw new HttpError(401, "Unauthorized");

    if (!req.file) throw new HttpError(400, "No file uploaded");

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const avatarUrl = `${baseUrl}/uploads/avatars/${req.file.filename}`;

    const result = await this.service.updateAvatar(userId, avatarUrl);
    res.status(200).json({ message: "Avatar updated", user: result.user });
  };

  removeAvatar = async (req: any, res: any, next: any) => {
  try {
    const user = req.user;
    const updated = await this.service.removeAvatar(user.id);
    res.json({ user: updated });
  } catch (e) {
    next(e);
  }
};
}
