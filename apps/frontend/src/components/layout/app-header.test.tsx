import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppHeader } from "@/components/layout/app-header";
import { renderWithQuery } from "@/test/test-utils";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe("AppHeader", () => {
  it("renders current user name, email, role badge, and session action", () => {
    renderWithQuery(
      <AppHeader
        user={{
          id: "user-1",
          companyId: "company-1",
          companyName: "PT Maju Jaya",
          email: "admin@example.com",
          fullName: "Admin User",
          role: "ADMIN",
        }}
      />,
    );

    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("admin@example.com")).toBeInTheDocument();
    expect(screen.getByText("ADMIN")).toBeInTheDocument();
    expect(screen.queryByText("PT Maju Jaya")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });
});
