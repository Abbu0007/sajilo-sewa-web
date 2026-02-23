import { z } from "zod";

export const toggleFavouriteDto = z.object({
  providerId: z.string().min(1),
});
