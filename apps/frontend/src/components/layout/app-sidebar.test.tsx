import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { renderWithQuery } from "@/test/test-utils";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

const baseUser = {
  id: "user-1",
  companyId: "company-1",
  companyName: "PT Maju Jaya",
  email: "user@example.com",
  fullName: "User",
} as const;

describe("AppSidebar RBAC", () => {
  it("shows Users for ADMIN", () => {
    renderWithQuery(<AppSidebar user={{ ...baseUser, role: "ADMIN" }} />);

    expect(screen.getByRole("link", { name: /users/i })).toBeInTheDocument();
    expect(screen.getByText("PT Maju Jaya")).toBeInTheDocument();
  });

  it("hides Users for RECRUITER", () => {
    renderWithQuery(<AppSidebar user={{ ...baseUser, role: "RECRUITER" }} />);

    expect(screen.queryByRole("link", { name: /users/i })).not.toBeInTheDocument();
  });
});
