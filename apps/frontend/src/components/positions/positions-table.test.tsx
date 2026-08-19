import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PositionsTable } from "@/components/positions/positions-table";
import { EmptyState } from "@/components/ui/state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { renderWithQuery } from "@/test/test-utils";

describe("Positions components", () => {
  it("renders position rows", () => {
    renderWithQuery(
      <PositionsTable
        positions={[
          {
            id: "position-1",
            companyId: "company-1",
            createdBy: "user-1",
            title: "Frontend Developer",
            location: "Jakarta",
            type: "FULL_TIME",
            description: "Build UI",
            salary: "7-10 juta",
            isActive: true,
            createdAt: "2026-08-01T00:00:00.000Z",
            updatedAt: "2026-08-01T00:00:00.000Z",
          },
        ]}
        applicantCounts={{ "position-1": 3 }}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Jakarta")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /applicants/i })).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.queryByRole("columnheader", { name: /salary/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("columnheader", { name: /created/i })).not.toBeInTheDocument();
    expect(screen.queryByText("7-10 juta")).not.toBeInTheDocument();
  });

  it("renders empty state and pagination", () => {
    const onPageChange = vi.fn();
    renderWithQuery(
      <>
        <EmptyState title="No positions" />
        <PaginationControls
          pagination={{ page: 1, limit: 10, total: 0, totalPages: 0 }}
          onPageChange={onPageChange}
        />
      </>,
    );

    expect(screen.getByText(/no positions/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });
});
