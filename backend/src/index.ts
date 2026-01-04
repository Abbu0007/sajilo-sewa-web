import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import { connectMongo } from "./database/mongodb";
import { config } from "./config";
import { HttpError } from "./errors/http-error";

async function bootstrap() {
  await connectMongo();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);

  app.use((err: any, _req: any, res: any, _next: any) => {
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
