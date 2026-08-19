import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CreateUserForm } from "@/components/users/create-user-form";
import { apiFetch } from "@/lib/api";
import { renderWithQuery } from "@/test/test-utils";

vi.mock("@/lib/api", () => ({
  apiFetch: vi.fn(),
}));

describe("CreateUserForm", () => {
  it("does not expose role or company fields", () => {
    renderWithQuery(<CreateUserForm />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/^role$/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/company/i)).not.toBeInTheDocument();
  });

  it("sends recruiter role in mutation payload without exposing a role field", async () => {
    vi.mocked(apiFetch).mockResolvedValue({
      success: true,
      data: {
        user: {
          id: "user-1",
          companyId: "company-1",
          email: "recruiter@example.com",
          fullName: "Recruiter Example",
          role: "RECRUITER",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });

    renderWithQuery(<CreateUserForm />);

    await userEvent.type(screen.getByLabelText(/full name/i), "Recruiter Example");
    await userEvent.type(screen.getByLabelText(/email/i), "recruiter@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "Password123!");
    await userEvent.click(screen.getByRole("button", { name: /create recruiter/i }));

    expect(apiFetch).toHaveBeenCalledWith("/api/users", {
      method: "POST",
      body: {
        fullName: "Recruiter Example",
        email: "recruiter@example.com",
        password: "Password123!",
        role: "RECRUITER",
      },
    });
    expect(screen.queryByLabelText(/^role$/i)).not.toBeInTheDocument();
  });
});
