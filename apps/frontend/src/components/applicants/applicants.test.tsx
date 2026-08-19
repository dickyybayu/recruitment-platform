import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ApplicantDetailPage } from "@/components/applicants/applicant-detail-page";
import { ApplicantsTable } from "@/components/applicants/applicants-table";
import { useApplicant } from "@/hooks/use-applicants";
import { renderWithQuery } from "@/test/test-utils";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/hooks/use-applicants", () => ({
  useApplicant: vi.fn(),
}));

describe("Applicants components", () => {
  it("renders applicant rows", () => {
    renderWithQuery(
      <ApplicantsTable
        applicants={[
          {
            id: "applicant-1",
            positionId: "position-1",
            fullName: "Andi Saputra",
            email: "andi@example.com",
            phone: "081234567890",
            education: "S1 Informatika",
            experience: 2,
            resumeUrl: "https://example.com/resume/andi",
            status: "APPLIED",
            notes: null,
            createdAt: "2026-08-01T00:00:00.000Z",
            updatedAt: "2026-08-01T00:00:00.000Z",
            positionTitle: "Backend Developer",
          },
        ]}
      />,
    );

    expect(screen.getByText("Andi Saputra")).toBeInTheDocument();
    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
    expect(screen.getByText("APPLIED")).toBeInTheDocument();
  });

  it("renders applicant status options", () => {
    vi.mocked(useApplicant).mockReturnValue({
      data: {
        id: "applicant-1",
        positionId: "position-1",
        fullName: "Andi Saputra",
        email: "andi@example.com",
        phone: "081234567890",
        education: "S1 Informatika",
        experience: 2,
        resumeUrl: "https://example.com/resume/andi",
        status: "APPLIED",
        notes: null,
        createdAt: "2026-08-01T00:00:00.000Z",
        updatedAt: "2026-08-01T00:00:00.000Z",
        positionTitle: "Backend Developer",
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as never);

    renderWithQuery(<ApplicantDetailPage id="applicant-1" />);

    expect(screen.getByRole("option", { name: "APPLIED" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "INTERVIEW" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "REJECTED" })).toBeInTheDocument();
  });
});
