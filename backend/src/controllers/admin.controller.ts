import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";

// Admin controller
export class AdminController {
  constructor(private service: AdminService) {}

  // Build avatar url from uploaded file
  private avatarUrl(req: Request) {
    if (!req.file) return undefined;
    return `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`;
  }

  // Create user
  createUser = async (req: Request, res: Response) => {
    const result = await this.service.createUser({
      ...req.body,
      avatarUrl: this.avatarUrl(req),
    });
    res.status(201).json(result);
  };

  // List users
  listUsers = async (_req: Request, res: Response) => {
    const result = await this.service.listUsers();
    res.json(result);
  };

  // Get user by id
  getUser = async (req: Request, res: Response) => {
    const result = await this.service.getUserById(req.params.id);
    res.json(result);
  };

  // Update user
  updateUser = async (req: Request, res: Response) => {
    const result = await this.service.updateUserById(req.params.id, {
      ...req.body,
      avatarUrl: this.avatarUrl(req), // only present if file uploaded
    });
    res.json(result);
  };

  // Delete user
  deleteUser = async (req: Request, res: Response) => {
    const result = await this.service.deleteUserById(req.params.id);
    res.json(result);
  };
}