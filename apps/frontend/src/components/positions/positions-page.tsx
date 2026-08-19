"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PositionsTable } from "@/components/positions/positions-table";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { apiFetch } from "@/lib/api";
import { usePositionApplicantTotals } from "@/hooks/use-applicants";
import { defaultPositionQuery, usePositions } from "@/hooks/use-positions";
import type { Position, PositionListQuery, PositionSortBy } from "@/types/position";

export function PositionsPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState<PositionListQuery>(defaultPositionQuery);
  const [deleteTarget, setDeleteTarget] = useState<Position | null>(null);

  const positionsQuery = usePositions(query);
  const positions = positionsQuery.data?.positions ?? [];
  const applicantTotals = usePositionApplicantTotals(
    positions.map((position) => position.id),
  );
  const applicantTotalError = applicantTotals.find(({ query }) => query.isError);
  const applicantCounts = Object.fromEntries(
    applicantTotals.map(({ positionId, query }) => [positionId, query.data ?? 0]),
  );
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/positions/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      toast.success("Position deleted");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Positions</h1>
          <p className="mt-1 text-base text-muted-foreground">Manage company openings.</p>
        </div>
        <Button className="h-9" render={<Link href="/positions/new" />}>
          Create Position
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border bg-card p-5 shadow-sm sm:flex-row sm:items-end sm:p-6">
        <label className="space-y-2 text-sm">
          <span className="font-medium">Sort by</span>
          <select
            value={query.sortBy}
            onChange={(event) =>
              setQuery((prev) => ({
                ...prev,
                page: 1,
                sortBy: event.target.value as PositionSortBy,
              }))
            }
            className="h-9 rounded-lg border border-input bg-background px-3"
          >
            <option value="createdAt">Created</option>
            <option value="title">Title</option>
            <option value="location">Location</option>
            <option value="type">Type</option>
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
            className="h-9 rounded-lg border border-input bg-background px-3"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>

      {positionsQuery.isLoading && <LoadingState label="Loading positions..." />}
      {positionsQuery.isError && (
        <ErrorState message={positionsQuery.error.message} onRetry={() => void positionsQuery.refetch()} />
      )}
      {positions.length > 0 && applicantTotals.some(({ query }) => query.isLoading) && (
        <LoadingState label="Loading applicant totals..." />
      )}
      {applicantTotalError && (
        <ErrorState
          message={
            applicantTotalError.query.error?.message ??
            "Unable to load applicant totals"
          }
          onRetry={() => {
            applicantTotals.forEach(({ query }) => {
              void query.refetch();
            });
          }}
        />
      )}
      {positionsQuery.data?.positions.length === 0 && (
        <EmptyState title="No positions" description="Create the first position for this company." />
      )}
      {positionsQuery.data &&
        positions.length > 0 &&
        applicantTotals.every(({ query }) => query.isSuccess) && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
            <PositionsTable
              positions={positions}
              applicantCounts={applicantCounts}
              deletingId={deleteMutation.variables}
              onDelete={setDeleteTarget}
            />
            <div className="px-4 pb-4">
              <PaginationControls
                pagination={positionsQuery.data.pagination}
                onPageChange={(page) => setQuery((prev) => ({ ...prev, page }))}
              />
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteTarget(null);
            }
          }}
          title="Delete position"
          description={`Delete ${deleteTarget.title}? This action cannot be undone.`}
          pending={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        />
      )}
    </section>
  );
}
