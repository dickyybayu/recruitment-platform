import type { Pagination, Sorting } from "@/types/common";

export const applicantStatuses = [
  "APPLIED",
  "REVIEWED",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED",
] as const;

export type ApplicantStatus = (typeof applicantStatuses)[number];

export type Applicant = {
  id: string;
  positionId: string;
  fullName: string;
  email: string;
  phone: string;
  education: string;
  experience: number;
  resumeUrl: string;
  status: ApplicantStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  positionTitle?: string;
  companyId?: string;
};

export type ApplicantSortBy =
  | "createdAt"
  | "fullName"
  | "status"
  | "experience";

export type ApplicantListQuery = {
  page: number;
  limit: number;
  sortBy: ApplicantSortBy;
  sortOrder: "asc" | "desc";
  positionId?: string;
  status?: ApplicantStatus;
};

export type ApplicantListResult = {
  applicants: Applicant[];
  pagination: Pagination;
  sorting: Sorting<ApplicantSortBy>;
};
