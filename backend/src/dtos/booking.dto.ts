import { z } from "zod";

export const createBookingDto = z.object({
  providerId: z.string().min(1),
  serviceId: z.string().min(1),
  scheduledAt: z.string().min(1), // ISO string from frontend
  note: z.string().max(2000).optional(),
  addressText: z.string().max(500).optional(), // simple for now
});

export const cancelBookingDto = z.object({
  reason: z.string().max(500).optional(),
});

export const providerDecisionDto = z.object({
  reason: z.string().max(500).optional(),
});

export const providerUpdateStatusDto = z.object({
  status: z.enum(["in_progress", "completed", "cancelled"]),
  reason: z.string().max(500).optional(),
});
