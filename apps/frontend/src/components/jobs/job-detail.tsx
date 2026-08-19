"use client";

import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState, LoadingState } from "@/components/ui/state";
import { usePublicPosition } from "@/hooks/use-public-positions";
import { formatDate, formatEnum } from "@/lib/format";

export function JobDetail({ id }: { id: string }) {
  const jobQuery = usePublicPosition(id);

  if (jobQuery.isLoading) {
    return <LoadingState label="Loading job..." />;
  }

  if (jobQuery.isError) {
    return (
      <ErrorState
        title="Job not found"
        message={jobQuery.error.message}
        onRetry={() => void jobQuery.refetch()}
      />
    );
  }

  const job = jobQuery.data;

  if (!job) {
    return <ErrorState title="Job not found" />;
  }

  return (
    <div className="space-y-5">
      <Button variant="ghost" render={<Link href="/" />}>
        <ArrowLeft />
        Back to jobs
      </Button>

      <Card>
      <CardHeader className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-3xl tracking-tight">{job.title}</CardTitle>
            <p className="mt-2 text-base text-muted-foreground">{job.companyName}</p>
          </div>
          <Badge variant="secondary">{formatEnum(job.type)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-7 px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 text-sm sm:grid-cols-3">
          <DetailMeta label="Location" value={job.location} />
          <DetailMeta label="Salary" value={job.salary} />
          <DetailMeta label="Posted" value={formatDate(job.createdAt)} />
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="whitespace-pre-wrap text-base leading-7 text-muted-foreground">
            {job.description}
          </p>
        </section>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button className="h-9 px-4" render={<Link href={`/jobs/${job.id}/apply`} />}>
            <Send />
            Apply now
          </Button>
        </div>
      </CardContent>
      </Card>
    </div>
  );
}

function DetailMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
