import { z } from "zod";

export const registerDto = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),

    role: z.enum(["client", "provider"]).default("client"),

    profession: z.string().optional(),

    password: z
      .string()
      .min(7, "Password must be at least 7 characters")
      .regex(/[A-Z]/, "Password must include at least one capital letter")
      .regex(/[0-9]/, "Password must include at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must include at least one special character"),
  })
  .refine(
    (data) =>
      data.role === "provider"
        ? !!data.profession && data.profession.trim().length >= 2
        : true,
    { path: ["profession"], message: "Profession is required for service providers" }
  );

export type RegisterDto = z.infer<typeof registerDto>;

export const loginDto = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginDto = z.infer<typeof loginDto>;
