import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { JobBoard } from "@/components/jobs/job-board";
import { JobCard } from "@/components/jobs/job-card";
import { usePublicPositions } from "@/hooks/use-public-positions";
import { renderWithQuery } from "@/test/test-utils";

vi.mock("@/hooks/use-public-positions", () => ({
  usePublicPositions: vi.fn(),
}));

describe("Job board components", () => {
  it("renders empty state", () => {
    vi.mocked(usePublicPositions).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as never);

    renderWithQuery(<JobBoard />);

    expect(screen.getByText(/no jobs found/i)).toBeInTheDocument();
  });

  it("renders job card content", () => {
    renderWithQuery(
      <JobCard
        job={{
          id: "11111111-1111-1111-1111-111111111111",
          title: "Backend Developer",
          companyName: "PT Maju Jaya",
          location: "Jakarta",
          type: "FULL_TIME",
          salary: "8-12 juta",
          createdAt: "2026-08-01T00:00:00.000Z",
        }}
      />,
    );

    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
    expect(screen.getByText("PT Maju Jaya")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view details/i })).toHaveAttribute(
      "href",
      "/jobs/11111111-1111-1111-1111-111111111111",
    );
  });
});
