import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginData = z.infer<typeof loginSchema>;

const passwordSchema = z
  .string()
  .min(7, { message: "Password must be at least 7 characters" })
  .regex(/[A-Z]/, { message: "Password must include at least one capital letter" })
  .regex(/[0-9]/, { message: "Password must include at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Password must include at least one special character" });

export const registerSchema = z
  .object({
    firstName: z.string().min(2, { message: "Minimum 2 characters" }),
    lastName: z.string().min(2, { message: "Minimum 2 characters" }),
    email: z.string().email({ message: "Enter a valid email" }),

    phone: z.string().regex(/^\d{10}$/, { message: "Phone must be exactly 10 digits" }),

    role: z.enum(["client", "provider"], { message: "Role is required" }),

    profession: z.string().optional(),

    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: "Confirm your password" }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine(
    (v) => (v.role === "provider" ? !!v.profession && v.profession.trim().length >= 2 : true),
    {
      path: ["profession"],
      message: "Profession is required for service providers",
    }
  );

export type RegisterData = z.infer<typeof registerSchema>;
