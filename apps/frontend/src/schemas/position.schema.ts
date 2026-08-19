import { z } from "zod";

export const positionTypeSchema = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
]);

export const createPositionSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  location: z.string().trim().min(1, "Location is required"),
  type: positionTypeSchema,
  description: z.string().trim().min(1, "Description is required"),
  salary: z.string().trim().min(1, "Salary is required"),
  isActive: z.boolean().optional(),
});

export const updatePositionSchema = createPositionSchema;

export type CreatePositionInput = z.infer<typeof createPositionSchema>;
export type UpdatePositionInput = z.infer<typeof updatePositionSchema>;
