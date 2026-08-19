import { z } from "zod";

export const registerSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, "Company name is required"),

  email: z
    .string()
    .trim()
    .email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required"),

  phone: z
    .string()
    .trim()
    .min(1, "Phone is required"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type RegisterInput =
  z.infer<typeof registerSchema>;

export type LoginInput =
  z.infer<typeof loginSchema>;