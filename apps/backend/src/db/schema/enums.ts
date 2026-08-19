import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "ADMIN",
  "RECRUITER",
]);

export const positionTypeEnum = pgEnum("position_type", [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
]);

export const applicantStatusEnum = pgEnum("applicant_status", [
  "APPLIED",
  "REVIEWED",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED",
]);