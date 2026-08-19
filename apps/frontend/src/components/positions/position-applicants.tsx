"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApplicants } from "@/hooks/use-applicants";

export function PositionApplicants({ positionId }: { positionId: string }) {
  const applicantsQuery = useApplicants({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    positionId,
  });

  if (applicantsQuery.isLoading) {
    return <LoadingState label="Loading applicants..." />;
  }

  if (applicantsQuery.isError) {
    return (
      <ErrorState
        message={applicantsQuery.error.message}
        onRetry={() => void applicantsQuery.refetch()}
      />
    );
  }

  const applicants = applicantsQuery.data?.applicants ?? [];

  if (applicants.length === 0) {
    return <EmptyState title="No applicants" description="No one has applied to this position yet." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Experience</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applicants.map((applicant) => (
          <TableRow key={applicant.id}>
            <TableCell className="font-medium">{applicant.fullName}</TableCell>
            <TableCell>{applicant.email}</TableCell>
            <TableCell>
              <Badge variant="secondary">{applicant.status}</Badge>
            </TableCell>
            <TableCell>{applicant.experience}</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" render={<Link href={`/applicants/${applicant.id}`} />}>
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
