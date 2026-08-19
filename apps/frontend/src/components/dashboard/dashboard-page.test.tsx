import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { renderWithQuery } from "@/test/test-utils";

vi.mock("@/hooks/use-positions", () => ({
  defaultPositionQuery: {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  usePositions: vi.fn(() => ({
    isLoading: false,
    isError: false,
    data: {
      positions: [],
      pagination: { page: 1, limit: 10, total: 7, totalPages: 1 },
      sorting: { sortBy: "createdAt", sortOrder: "desc" },
    },
  })),
}));

vi.mock("@/hooks/use-applicants", () => ({
  defaultApplicantQuery: {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  useApplicants: vi.fn(() => ({
    isLoading: false,
    isError: false,
    data: {
      applicants: [],
      pagination: { page: 1, limit: 10, total: 15, totalPages: 2 },
      sorting: { sortBy: "createdAt", sortOrder: "desc" },
    },
  })),
  useApplicantStatusTotals: vi.fn(() => [
    { status: "APPLIED", query: { isLoading: false, isError: false, data: 5 } },
    { status: "REVIEWED", query: { isLoading: false, isError: false, data: 4 } },
    { status: "INTERVIEW", query: { isLoading: false, isError: false, data: 3 } },
    { status: "ACCEPTED", query: { isLoading: false, isError: false, data: 2 } },
    { status: "REJECTED", query: { isLoading: false, isError: false, data: 1 } },
  ]),
}));

describe("DashboardPage", () => {
  it("renders total positions, total applicants, and applicant totals by status", () => {
    renderWithQuery(<DashboardPage />);

    expect(screen.getByText("Total positions")).toBeInTheDocument();
    expect(screen.getByText("Total applicants")).toBeInTheDocument();
    expect(screen.getByText("Applicants by status")).toBeInTheDocument();

    expect(screen.getByText("Applied")).toBeInTheDocument();
    expect(screen.getByText("Reviewed")).toBeInTheDocument();
    expect(screen.getByText("Interview")).toBeInTheDocument();
    expect(screen.getByText("Accepted")).toBeInTheDocument();
    expect(screen.getByText("Rejected")).toBeInTheDocument();

    ["7", "15", "5", "4", "3", "2", "1"].forEach((value) => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });
});
