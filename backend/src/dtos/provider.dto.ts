import { z } from "zod";

export const upsertProviderProfileDto = z.object({
  profession: z.string().min(1).max(80),
  bio: z.string().max(2000).optional(),
  startingPrice: z.number().min(0).optional(),
  serviceAreas: z.array(z.string().max(80)).optional(),
  availability: z.enum(["available", "busy", "offline"]).optional(),
});
