import { z } from "zod";

export const publicPositionQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .min(1)
    .optional(),

  location: z
    .string()
    .trim()
    .min(1)
    .optional(),

  type: z
    .enum([
      "FULL_TIME",
      "PART_TIME",
      "CONTRACT",
    ])
    .optional(),
});

export type PublicPositionQuery = z.infer<
  typeof publicPositionQuerySchema
>;