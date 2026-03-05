import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// mock EmailService so no real emails are sent during tests
jest.mock("../src/services/email.service", () => {
  return {
    EmailService: jest.fn().mockImplementation(() => {
      return new Proxy(
        {},
        {
          get: () => jest.fn().mockResolvedValue(undefined),
        }
      );
    }),
  };
});

let mongo: MongoMemoryServer | null = null;

// increase timeout for this hook (first time it downloads MongoDB binary)
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
}, 120000); // 2 minutes

afterEach(async () => {
  const db = mongoose.connection.db;
  if (!db) return;

  const collections = await db.collections();
  for (const c of collections) {
    await c.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();

  // safe stop (in case beforeAll failed)
  if (mongo) {
    await mongo.stop();
    mongo = null;
  }
});