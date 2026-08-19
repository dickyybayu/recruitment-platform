"use client";

import { useState } from "react";

import { ApplicantsTable } from "@/components/applicants/applicants-table";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { applicantStatuses, type ApplicantListQuery, type ApplicantSortBy, type ApplicantStatus } from "@/types/applicant";
import { defaultApplicantQuery, useApplicants } from "@/hooks/use-applicants";
import { defaultPositionQuery, usePositions } from "@/hooks/use-positions";

export function ApplicantsPage() {
  const [query, setQuery] = useState<ApplicantListQuery>(defaultApplicantQuery);
  const applicantsQuery = useApplicants(query);
  const positionsQuery = usePositions({
    ...defaultPositionQuery,
    limit: 100,
    sortBy: "title",
    sortOrder: "asc",
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Applicants</h1>
        <p className="mt-1 text-base text-muted-foreground">Review and manage candidate applications.</p>
      </div>

      <div className="grid gap-4 rounded-lg border bg-card p-5 shadow-sm sm:grid-cols-2 sm:p-6 lg:grid-cols-4 lg:items-end">
        <label className="space-y-2 text-sm">
          <span className="font-medium">Position</span>
          <select
            value={query.positionId ?? ""}
            onChange={(event) =>
              setQuery((prev) => ({
                ...prev,
                page: 1,
                positionId: event.target.value || undefined,
              }))
            }
            className="h-9 w-full rounded-lg border border-input bg-background px-3"
          >
            <option value="">All positions</option>
            {positionsQuery.data?.positions.map((position) => (
              <option key={position.id} value={position.id}>
                {position.title}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-medium">Status</span>
          <select
            value={query.status ?? ""}
            onChange={(event) =>
              setQuery((prev) => ({
                ...prev,
                page: 1,
                status: (event.target.value || undefined) as ApplicantStatus | undefined,
              }))
            }
            className="h-9 w-full rounded-lg border border-input bg-background px-3"
          >
            <option value="">All statuses</option>
            {applicantStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-medium">Sort by</span>
          <select
            value={query.sortBy}
            onChange={(event) =>
              setQuery((prev) => ({
                ...prev,
                page: 1,
                sortBy: event.target.value as ApplicantSortBy,
              }))
            }
            className="h-9 w-full rounded-lg border border-input bg-background px-3"
          >
            <option value="createdAt">Created</option>
            <option value="fullName">Name</option>
            <option value="status">Status</option>
            <option value="experience">Experience</option>
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-medium">Order</span>
          <select
            value={query.sortOrder}
            onChange={(event) =>
              setQuery((prev) => ({
                ...prev,
                page: 1,
                sortOrder: event.target.value as "asc" | "desc",
              }))
            }
            className="h-9 w-full rounded-lg border border-input bg-background px-3"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>

      {applicantsQuery.isLoading && <LoadingState label="Loading applicants..." />}
      {applicantsQuery.isError && (
        <ErrorState
          message={applicantsQuery.error.message}
          onRetry={() => void applicantsQuery.refetch()}
        />
      )}
      {applicantsQuery.data?.applicants.length === 0 && (
        <EmptyState title="No applicants" description="No applications match the selected filters." />
      )}
      {applicantsQuery.data && applicantsQuery.data.applicants.length > 0 && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
            <ApplicantsTable applicants={applicantsQuery.data.applicants} />
            <div className="px-4 pb-4">
              <PaginationControls
                pagination={applicantsQuery.data.pagination}
                onPageChange={(page) => setQuery((prev) => ({ ...prev, page }))}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
