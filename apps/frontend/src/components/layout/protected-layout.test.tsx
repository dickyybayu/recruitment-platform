import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProtectedLayout } from "@/components/layout/protected-layout";
import { ApiError, apiFetch } from "@/lib/api";
import { renderWithQuery } from "@/test/test-utils";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    replace,
  }),
}));

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();

  return {
    ...actual,
    apiFetch: vi.fn(),
  };
});

const currentUserResponse = {
  id: "user-1",
  companyId: "company-1",
  companyName: "PT Maju Jaya",
  email: "admin@example.com",
  fullName: "Admin User",
  role: "ADMIN",
} as const;

describe("ProtectedLayout auth guard", () => {
  beforeEach(() => {
    replace.mockReset();
    vi.mocked(apiFetch).mockReset();
  });

  it("renders protected content when current user is authenticated", async () => {
    vi.mocked(apiFetch).mockResolvedValue(currentUserResponse);

    renderWithQuery(
      <ProtectedLayout>
        <div>Protected dashboard content</div>
      </ProtectedLayout>,
    );

    expect(await screen.findByText("Protected dashboard content")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("redirects to login only when current user returns 401", async () => {
    vi.mocked(apiFetch).mockRejectedValue(new ApiError("Unauthorized", 401));

    renderWithQuery(
      <ProtectedLayout>
        <div>Protected dashboard content</div>
      </ProtectedLayout>,
    );

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/login");
    });
    expect(screen.queryByText("Protected dashboard content")).not.toBeInTheDocument();
  });

  it("shows retryable auth error and does not redirect on network failure", async () => {
    vi.mocked(apiFetch).mockRejectedValue(new TypeError("Failed to fetch"));

    renderWithQuery(
      <ProtectedLayout>
        <div>Protected dashboard content</div>
      </ProtectedLayout>,
    );

    expect(await screen.findByText(/unable to verify your session/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    expect(screen.queryByText("Protected dashboard content")).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("shows retryable auth error and does not redirect on 5xx", async () => {
    vi.mocked(apiFetch).mockRejectedValue(new ApiError("Internal server error", 500));

    renderWithQuery(
      <ProtectedLayout>
        <div>Protected dashboard content</div>
      </ProtectedLayout>,
    );

    expect(await screen.findByText(/unable to verify your session/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    expect(screen.queryByText("Protected dashboard content")).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("refetches current user on retry and renders content after a successful retry", async () => {
    vi.mocked(apiFetch)
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(currentUserResponse);

    renderWithQuery(
      <ProtectedLayout>
        <div>Protected dashboard content</div>
      </ProtectedLayout>,
    );

    await userEvent.click(await screen.findByRole("button", { name: /retry/i }));

    expect(await screen.findByText("Protected dashboard content")).toBeInTheDocument();
    expect(vi.mocked(apiFetch)).toHaveBeenCalledTimes(2);
    expect(replace).not.toHaveBeenCalled();
  });
});
