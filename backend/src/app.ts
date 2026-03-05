import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import adminRoutes from "./routes/admin.route";
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

import { HttpError } from "./errors/http-error";

// create express app
export function createApp() {
  const app = express();

  // enable cors
  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // handle preflight requests
  app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });

  // parse json body
  app.use(express.json());

  // serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // health check endpoint
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // auth routes
  app.use("/api/auth", authRoutes);

  // user routes
  app.use("/api/users", userRoutes);

  // admin routes
  app.use("/api/admin", adminRoutes);

  // service routes
  app.use("/api/services", serviceRoutes);

  // provider routes
  app.use("/api/providers", providerRoutes);

  // admin service management
  app.use("/api/admin/services", adminServiceRoutes);

  // providers by service
  app.use("/api/providers/by-service", providerByServiceRoutes);

  // client booking routes
  app.use("/api/bookings", bookingRoutes);

  // favourites routes
  app.use("/api/favourites", favouriteRoutes);

  // notification routes
  app.use("/api/notifications", notificationRoutes);

  // rating routes
  app.use("/api/ratings", ratingRoutes);

  // provider booking routes
  app.use("/api/provider/bookings", providerBookingRoutes);

  // client routes
  app.use("/api/clients", clientRoutes);

  // admin booking routes
  app.use("/api/admin/bookings", adminBookingRoutes);

  // global error handler
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

  return app;
}