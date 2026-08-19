import { z } from "zod";

export const createUserSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type CreateUserPayload = CreateUserInput & {
  role: "RECRUITER";
};
