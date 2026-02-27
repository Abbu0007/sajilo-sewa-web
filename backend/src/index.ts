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
import serviceRoutes from "./routes/service.routes";
import providerRoutes from "./routes/provider.routes";
import bookingRoutes from "./routes/booking.routes";
import notificationRoutes from "./routes/notification.routes";
import favouriteRoutes from "./routes/favourite.routes";
import providerBookingRoutes from "./routes/provider-booking.routes";
import adminBookingRoutes from "./routes/admin-booking.routes";
import adminServiceRoutes from "./routes/admin-service.routes";
import providerByServiceRoutes from "./routes/provider-by-service.routes";
import ratingRoutes from "./routes/rating.routes";
import clientRoutes from "./routes/client.routes";

async function bootstrap() {
  await connectMongo();

  const app = express();


  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );


  app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(express.json());

  // static uploads
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // health
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/admin", adminRoutes);

  app.use("/api/services", serviceRoutes);
  app.use("/api/providers", providerRoutes);
  app.use("/api/admin/services", adminServiceRoutes);
  app.use("/api/providers/by-service", providerByServiceRoutes);

  // client
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/favourites", favouriteRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/ratings", ratingRoutes);

  // provider
  app.use("/api/provider/bookings", providerBookingRoutes);

  //client
  app.use("/api/clients", clientRoutes);
  
  // admin
  app.use("/api/admin/bookings", adminBookingRoutes);

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

  // error handler
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
