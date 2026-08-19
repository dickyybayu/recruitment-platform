"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState, LoadingState } from "@/components/ui/state";
import { useApplicantStatusTotals, useApplicants } from "@/hooks/use-applicants";
import { defaultPositionQuery, usePositions } from "@/hooks/use-positions";
import { defaultApplicantQuery } from "@/hooks/use-applicants";
import { formatEnum } from "@/lib/format";

export function DashboardPage() {
  const positionsQuery = usePositions(defaultPositionQuery);
  const applicantsQuery = useApplicants(defaultApplicantQuery);
  const applicantStatusTotals = useApplicantStatusTotals();
  const statusTotalError = applicantStatusTotals.find(({ query }) => query.isError);

  if (
    positionsQuery.isLoading ||
    applicantsQuery.isLoading ||
    applicantStatusTotals.some(({ query }) => query.isLoading)
  ) {
    return <LoadingState label="Loading dashboard..." />;
  }

  if (positionsQuery.isError) {
    return (
      <ErrorState
        message={positionsQuery.error.message}
        onRetry={() => void positionsQuery.refetch()}
      />
    );
  }

  if (applicantsQuery.isError) {
    return (
      <ErrorState
        message={applicantsQuery.error.message}
        onRetry={() => void applicantsQuery.refetch()}
      />
    );
  }

  if (statusTotalError) {
    return (
      <ErrorState
        message={
          statusTotalError.query.error?.message ??
          "Unable to load applicant status totals"
        }
        onRetry={() => {
          applicantStatusTotals.forEach(({ query }) => {
            void query.refetch();
          });
        }}
      />
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Manage positions, applicants, and your recruitment team.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Total positions"
          value={positionsQuery.data?.pagination.total ?? 0}
        />
        <SummaryCard
          title="Total applicants"
          value={applicantsQuery.data?.pagination.total ?? 0}
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Applicants by status</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {applicantStatusTotals.map(({ status, query }) => (
            <SummaryCard
              key={status}
              title={formatEnum(status)}
              value={query.data ?? 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
