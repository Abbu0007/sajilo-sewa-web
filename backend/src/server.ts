import { connectMongo } from "./database/mongodb";
import { config } from "./config";
import { createApp } from "./app";

import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { EmailService } from "./services/email.service";

async function bootstrap() {
  // connect to mongodb
  await connectMongo();

  // create express app
  const app = createApp();

  // seed admin account
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const repo = new UserRepository();
    const emailService = new EmailService();
    const service = new UserService(repo, emailService);
    await service.ensureAdmin(adminEmail, adminPassword);
  } else {
    console.log("ℹ️ Admin seed skipped (ADMIN_EMAIL / ADMIN_PASSWORD not set)");
  }

  // start server
  app.listen(config.port, () => {
    console.log(`✅ Backend running on http://localhost:${config.port}`);
  });
}

// start application
bootstrap().catch((e) => {
  console.error("❌ Failed to start server:", e);
  process.exit(1);
});