import { z } from "zod";

export const createRatingDto = z.object({
  bookingId: z.string().min(1),
  stars: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});