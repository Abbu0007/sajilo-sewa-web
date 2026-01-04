import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  // Keeping login simple, but aligning min length to 7 is safer with your new rule
  password: z.string().min(7, "Password must be at least 7 characters"),
  remember: z.boolean().optional(),
});

export type LoginValues = z.infer<typeof loginSchema>;

const roleEnum = z.enum(["book", "provide"] as const);

// Password rules:
// - min 7 chars
// - at least 1 uppercase
// - at least 1 number
// - at least 1 special character
const passwordSchema = z
  .string()
  .min(7, "Password must be at least 7 characters")
  .regex(/[A-Z]/, "Password must include at least one capital letter")
  .regex(/[0-9]/, "Password must include at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must include at least one special character");

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Please enter a valid email"),

    // EXACTLY 10 digits
    phone: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),

    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),

    role: roleEnum,

    // Only required when role === "provide"
    profession: z.string().optional(),

    agree: z.boolean().refine((v) => v === true, "You must agree to the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine(
    (data) => {
      if (data.role === "provide") {
        return !!data.profession && data.profession.trim().length >= 2;
      }
      return true;
    },
    {
      path: ["profession"],
      message: "Profession is required for service providers",
    }
  );

export type RegisterValues = z.infer<typeof registerSchema>;
