export type AuthUser = {
  id: string;
  companyId: string;
  companyName: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "RECRUITER";
};

export type AppVariables = {
  user: AuthUser;
};
