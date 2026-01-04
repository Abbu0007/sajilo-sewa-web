import { Request, Response } from "express";
import { registerDto, loginDto } from "../dtos/user.dto";
import { HttpError } from "../errors/http-error";
import { UserService } from "../services/user.service";

export class AuthController {
  constructor(private service: UserService) {}

  register = async (req: Request, res: Response) => {
    const parsed = registerDto.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "DTO validation failed", parsed.error.flatten());
    }
    const result = await this.service.register(parsed.data);
    res.status(201).json({ message: "Registered successfully", ...result });
  };

  login = async (req: Request, res: Response) => {
    const parsed = loginDto.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "DTO validation failed", parsed.error.flatten());
    }
    const result = await this.service.login(parsed.data);
    res.status(200).json({ message: "Login successful", ...result });
  };
}
