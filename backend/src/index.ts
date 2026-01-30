import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import adminRoutes from "./routes/admin.route";

import { connectMongo } from "./database/mongodb";
import { config } from "./config";
import { HttpError } from "./errors/http-error";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";

async function bootstrap() {
  await connectMongo();

  const app = express();

  app.use(cors());
  app.use(express.json());

  // static uploads
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // health
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/admin", adminRoutes);

  // seed admin
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const repo = new UserRepository();
    const service = new UserService(repo);
    await service.ensureAdmin(adminEmail, adminPassword);
  } else {
    console.log("ℹ️ Admin seed skipped (ADMIN_EMAIL / ADMIN_PASSWORD not set)");
  }


  app.use((err: any, _req: any, res: any, _next: any) => {
    if (err?.message === "Only jpg/png/webp allowed") {
      return res.status(400).json({ message: err.message });
    }

    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({
        message: err.message,
        details: err.details,
      });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  });

  app.listen(config.port, () => {
    console.log(`✅ Backend running on http://localhost:${config.port}`);
  });
}

bootstrap().catch((e) => {
  console.error("❌ Failed to start server:", e);
  process.exit(1);
});
