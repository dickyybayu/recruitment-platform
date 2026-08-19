import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/components/auth/login-form";
import { apiFetch } from "@/lib/api";
import { renderWithQuery } from "@/test/test-utils";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/lib/api", () => ({
  apiFetch: vi.fn(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
  });

  it("shows validation errors", async () => {
    renderWithQuery(<LoginForm />);

    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it("disables submit while login is pending", async () => {
    vi.mocked(apiFetch).mockImplementation(() => new Promise(() => undefined));
    renderWithQuery(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/email/i), "admin.a@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "Password123!");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();
    });
  });

  it("shows API errors", async () => {
    vi.mocked(apiFetch).mockRejectedValue(new Error("Invalid email or password"));
    renderWithQuery(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/email/i), "admin.a@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "wrong-password");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });
});
