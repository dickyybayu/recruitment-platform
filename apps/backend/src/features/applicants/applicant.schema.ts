import { z } from "zod";

export const applicantStatuses = [
  "APPLIED",
  "REVIEWED",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED",
] as const;

export const createApplicantSchema = z.object({
  positionId: z.string().uuid(),
  fullName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
  education: z.string().trim().min(1),
  experience: z.coerce.number().int().min(0),
  resumeUrl: z.string().trim().url(),
});

export const updateApplicantStatusSchema = z.object({
  status: z.enum(applicantStatuses),
});

export const updateApplicantNotesSchema = z.object({
  notes: z.string().trim().nullable(),
});

export const applicantQuerySchema = z.object({
  positionId: z
    .string()
    .uuid()
    .optional(),

  status: z
    .enum([
      "APPLIED",
      "REVIEWED",
      "INTERVIEW",
      "ACCEPTED",
      "REJECTED",
    ])
    .optional(),

  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),

  sortBy: z
    .enum([
      "createdAt",
      "fullName",
      "status",
      "experience",
    ])
    .default("createdAt"),

  sortOrder: z
    .enum([
      "asc",
      "desc",
    ])
    .default("desc"),
});

export type CreateApplicantInput = z.infer<
  typeof createApplicantSchema
>;

export type ApplicantQuery = z.infer<
  typeof applicantQuerySchema
>;

export type ApplicantStatus =
  (typeof applicantStatuses)[number];