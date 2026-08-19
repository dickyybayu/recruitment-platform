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
import { formatEnum } from "@/lib/format";
import type { Position } from "@/types/position";

export function PositionsTable({
  positions,
  applicantCounts,
  onDelete,
  deletingId,
}: {
  positions: Position[];
  applicantCounts: Record<string, number>;
  onDelete: (position: Position) => void;
  deletingId?: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applicants</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((position) => (
          <TableRow key={position.id}>
            <TableCell className="font-medium">{position.title}</TableCell>
            <TableCell>{position.location}</TableCell>
            <TableCell>
              <Badge variant="outline">{formatEnum(position.type)}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={position.isActive ? "secondary" : "outline"}>
                {position.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>{applicantCounts[position.id] ?? 0}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button variant="outline" render={<Link href={`/positions/${position.id}`} />}>
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={deletingId === position.id}
                  onClick={() => onDelete(position)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
