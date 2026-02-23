import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "client" | "provider" | "admin" | string;
      };
    }
  }
}
export {};
