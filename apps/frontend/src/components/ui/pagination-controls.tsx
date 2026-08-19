import { Button } from "@/components/ui/button";
import type { Pagination } from "@/types/common";

export function PaginationControls({
  pagination,
  onPageChange,
}: {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}) {
  const canGoBack = pagination.page > 1;
  const canGoNext = pagination.page < pagination.totalPages;

  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Page {pagination.page} of {Math.max(pagination.totalPages, 1)} ·{" "}
        {pagination.total} total
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="min-w-24"
          disabled={!canGoBack}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-w-24"
          disabled={!canGoNext}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
