export type UserRole = "ADMIN" | "RECRUITER";

export type CurrentUser = {
  id: string;
  companyId: string;
  companyName: string;
  email: string;
  fullName: string;
  role: UserRole;
};

export type AuthResponseUser = {
  id: string;
  companyId: string;
  email: string;
  role: UserRole;
  fullName?: string;
};

export type AuthResponse = {
  token: string;
  user: AuthResponseUser;
};
