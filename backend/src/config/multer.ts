import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// Avatar upload directory
const uploadDir = path.join(process.cwd(), "uploads", "avatars");

// Ensure upload directory exists
fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage configuration
const storage = multer.diskStorage({
  // Destination folder for uploaded avatars
  destination: (_req, _file, cb) => cb(null, uploadDir),

  // Generate unique filename
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

// Avatar upload middleware
export const avatarUpload = multer({
  storage,

  // File size limit
  limits: { fileSize: 5 * 1024 * 1024 },

  // Allow only specific image types
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg/png/webp allowed"));
    }
  },
});