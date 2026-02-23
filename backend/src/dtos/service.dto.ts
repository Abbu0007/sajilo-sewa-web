import { z } from "zod";

export const createServiceDto = z.object({
  name: z.string().min(1).max(80),
  slug: z.string().min(1).max(100),
  icon: z.string().max(200).optional(),
  basePriceFrom: z.number().min(0).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});
