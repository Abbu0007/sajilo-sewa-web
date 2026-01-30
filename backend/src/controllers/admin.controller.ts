import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";

export class AdminController {
  constructor(private service: AdminService) {}

  private avatarUrl(req: Request) {
    if (!req.file) return undefined;
    return `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`;
  }

  createUser = async (req: Request, res: Response) => {
    const result = await this.service.createUser({
      ...req.body,
      avatarUrl: this.avatarUrl(req),
    });
    res.status(201).json(result);
  };

  listUsers = async (_req: Request, res: Response) => {
    const result = await this.service.listUsers();
    res.json(result);
  };

  getUser = async (req: Request, res: Response) => {
    const result = await this.service.getUserById(req.params.id);
    res.json(result);
  };

  updateUser = async (req: Request, res: Response) => {
    const result = await this.service.updateUserById(req.params.id, {
      ...req.body,
      avatarUrl: this.avatarUrl(req), // only present if file uploaded
    });
    res.json(result);
  };

  deleteUser = async (req: Request, res: Response) => {
    const result = await this.service.deleteUserById(req.params.id);
    res.json(result);
  };
}
