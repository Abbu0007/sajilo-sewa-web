import { Request, Response } from "express";
import {
  registerDto,
  loginDto,
  verifyEmailDto,
  resendVerificationDto,
  forgotPasswordDto,
  resetPasswordDto,
} from "../dtos/user.dto";
import { HttpError } from "../errors/http-error";
import { UserService } from "../services/user.service";

// Auth controller
export class AuthController {
  constructor(private service: UserService) {}

  // Register user
  register = async (req: Request, res: Response) => {
    const parsed = registerDto.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "DTO validation failed", parsed.error.flatten());
    }

    const result = await this.service.register(parsed.data);
    res.status(201).json({ message: "Registered successfully", ...result });
  };

  // Verify email
  verifyEmail = async (req: Request, res: Response) => {
    const parsed = verifyEmailDto.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "DTO validation failed", parsed.error.flatten());
    }

    const result = await this.service.verifyEmail(parsed.data);
    res.status(200).json({ message: "Email verified", ...result });
  };

  // Resend verification email
  resendVerification = async (req: Request, res: Response) => {
    const parsed = resendVerificationDto.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "DTO validation failed", parsed.error.flatten());
    }

    const result = await this.service.resendVerification(parsed.data);
    res.status(200).json(result);
  };

  // Login user
  login = async (req: Request, res: Response) => {
    const parsed = loginDto.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "DTO validation failed", parsed.error.flatten());
    }

    const result = await this.service.login(parsed.data);
    res.status(200).json({ message: "Login successful", ...result });
  };

  // Request password reset
  forgotPassword = async (req: Request, res: Response) => {
    const parsed = forgotPasswordDto.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "DTO validation failed", parsed.error.flatten());
    }

    const result = await this.service.forgotPassword(parsed.data);
    res.status(200).json(result);
  };

  // Reset password
  resetPassword = async (req: Request, res: Response) => {
    const parsed = resetPasswordDto.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "DTO validation failed", parsed.error.flatten());
    }

    const result = await this.service.resetPassword(parsed.data);
    res.status(200).json(result);
  };

  // Update user by id
  updateById = async (req: Request, res: Response) => {
    const id = req.params.id;

    // Build avatar url from uploaded file
    const avatarUrl = (req as any).file
      ? `${req.protocol}://${req.get("host")}/uploads/avatars/${(req as any).file.filename}`
      : undefined;

    const result = await this.service.updateById(id, (req as any).user, {
      ...req.body,
      avatarUrl,
    });

    res.status(200).json({ message: "User updated", ...result });
  };
}