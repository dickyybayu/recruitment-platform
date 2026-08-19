import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ApplyForm } from "@/components/jobs/apply-form";
import { apiFetch } from "@/lib/api";
import { renderWithQuery } from "@/test/test-utils";

vi.mock("@/lib/api", () => ({
  apiFetch: vi.fn(),
}));

describe("ApplyForm", () => {
  it("shows client-side validation errors for invalid applicant input", async () => {
    renderWithQuery(<ApplyForm positionId="11111111-1111-1111-1111-111111111111" />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Candidate" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: "08123456789" },
    });
    fireEvent.change(screen.getByLabelText(/experience/i), {
      target: { value: "-1" },
    });
    fireEvent.change(screen.getByLabelText(/education/i), {
      target: { value: "Bachelor degree" },
    });
    fireEvent.change(screen.getByLabelText(/resume url/i), {
      target: { value: "hello" },
    });
    await userEvent.click(screen.getByRole("button", { name: /submit application/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    expect(screen.getByText(/experience cannot be negative/i)).toBeInTheDocument();
    expect(screen.getByText(/resume url must be a valid url/i)).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
  });
});
