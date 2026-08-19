import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import type { Applicant } from "@/types/applicant";

export function ApplicantsTable({ applicants }: { applicants: Applicant[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Experience</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applicants.map((applicant) => (
          <TableRow key={applicant.id}>
            <TableCell className="font-medium">{applicant.fullName}</TableCell>
            <TableCell>{applicant.email}</TableCell>
            <TableCell>{applicant.positionTitle ?? "-"}</TableCell>
            <TableCell>{applicant.experience}</TableCell>
            <TableCell>
              <Badge variant="secondary">{applicant.status}</Badge>
            </TableCell>
            <TableCell>{formatDate(applicant.createdAt)}</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" render={<Link href={`/applicants/${applicant.id}`} />}>
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
