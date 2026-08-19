import { z } from "zod";

export const applicantStatusSchema = z.enum([
  "APPLIED",
  "REVIEWED",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED",
]);

export const createApplicantSchema = z.object({
  positionId: z.string().uuid(),
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Invalid email"),
  phone: z.string().trim().min(1, "Phone is required"),
  education: z.string().trim().min(1, "Education is required"),
  experience: z.coerce
    .number()
    .int("Experience must be a whole number")
    .min(0, "Experience cannot be negative"),
  resumeUrl: z.string().trim().url("Resume URL must be a valid URL"),
});

export const updateApplicantStatusSchema = z.object({
  status: applicantStatusSchema,
});

export const updateApplicantNotesSchema = z.object({
  notes: z.string().trim().nullable(),
});

export type CreateApplicantInput = z.infer<typeof createApplicantSchema>;
export type CreateApplicantFormInput = z.input<typeof createApplicantSchema>;
export type UpdateApplicantStatusInput = z.infer<
  typeof updateApplicantStatusSchema
>;
export type UpdateApplicantNotesInput = z.infer<
  typeof updateApplicantNotesSchema
>;
