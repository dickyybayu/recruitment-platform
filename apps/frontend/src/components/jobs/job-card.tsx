import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatEnum } from "@/lib/format";
import type { PublicPositionListItem } from "@/types/position";

export function JobCard({ job }: { job: PublicPositionListItem }) {
  return (
    <Card className="transition-colors hover:border-foreground/20">
      <CardHeader className="space-y-3 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-xl leading-7">{job.title}</CardTitle>
            <p className="mt-1 text-base text-muted-foreground">{job.companyName}</p>
          </div>
          <Badge variant="secondary">{formatEnum(job.type)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <Meta label="Location" value={job.location} />
          <Meta label="Salary" value={job.salary} />
          <Meta label="Posted" value={formatDate(job.createdAt)} />
        </div>
        <Button render={<Link href={`/jobs/${job.id}`} />}>
          View details
          <ArrowRight />
        </Button>
      </CardContent>
    </Card>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
