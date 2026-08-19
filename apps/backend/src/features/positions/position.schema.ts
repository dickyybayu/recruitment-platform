import { z } from "zod";

export const createPositionSchema = z.object({
  title: z.string().trim().min(1),
  location: z.string().trim().min(1),

  type: z.enum([
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
  ]),

  description: z.string().trim().min(1),
  salary: z.string().trim().min(1),

  isActive: z.boolean().optional(),
});

export const updatePositionSchema =
  createPositionSchema.partial();

export type CreatePositionInput = z.infer<
  typeof createPositionSchema
>;

export type UpdatePositionInput = z.infer<
  typeof updatePositionSchema
>;

export const positionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  sortBy: z
    .enum([
      "createdAt",
      "title",
      "location",
      "type",
    ])
    .default("createdAt"),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
});

export type PositionQuery = z.infer<
  typeof positionQuerySchema
>;