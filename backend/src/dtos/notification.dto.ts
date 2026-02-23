import { z } from "zod";

export const markReadDto = z.object({
  isRead: z.boolean().optional(),
});
