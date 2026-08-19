import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().trim().email(),
  fullName: z.string().trim().min(1),
  password: z.string().min(8),
  role: z.literal("RECRUITER"),
});

export type CreateUserInput = z.infer<
  typeof createUserSchema
>;
