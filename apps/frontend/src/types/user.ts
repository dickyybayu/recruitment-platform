import type { UserRole } from "@/types/auth";

export type User = {
  id: string;
  companyId: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
};
