"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PositionApplicants } from "@/components/positions/position-applicants";
import { PositionForm } from "@/components/positions/position-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ErrorState, LoadingState } from "@/components/ui/state";
import { apiFetch } from "@/lib/api";
import { formatDate, formatEnum } from "@/lib/format";
import { usePosition } from "@/hooks/use-positions";
import type { ApiEnvelope } from "@/types/common";
import type { Position } from "@/types/position";
import type { UpdatePositionInput } from "@/schemas/position.schema";

export function PositionDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const positionQuery = usePosition(id);

  const updateMutation = useMutation({
    mutationFn: (data: UpdatePositionInput) =>
      apiFetch<ApiEnvelope<{ position: Position }>>(`/api/positions/${id}`, {
        method: "PUT",
        body: data,
      }),
    onSuccess: async () => {
      toast.success("Position updated");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["position", id] }),
        queryClient.invalidateQueries({ queryKey: ["positions"] }),
      ]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiFetch(`/api/positions/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      toast.success("Position deleted");
      await queryClient.invalidateQueries({ queryKey: ["positions"] });
      router.push("/positions");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (positionQuery.isLoading) {
    return <LoadingState label="Loading position..." />;
  }

  if (positionQuery.isError) {
    return (
      <ErrorState
        title="Unable to load position"
        message={positionQuery.error.message}
        onRetry={() => void positionQuery.refetch()}
      />
    );
  }

  const position = positionQuery.data;

  if (!position) {
    return <ErrorState title="Position not found" />;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={position.isActive ? "secondary" : "outline"}>
              {position.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline">{formatEnum(position.type)}</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{position.title}</h1>
          <p className="mt-1 text-base text-muted-foreground">
            {position.location} · {formatEnum(position.type)} · Created {formatDate(position.createdAt)}
          </p>
        </div>
        <ConfirmDialog
          trigger={
            <Button type="button" variant="destructive">
              Delete
            </Button>
          }
          title="Delete position"
          description={`Delete ${position.title}? This action cannot be undone.`}
          pending={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate()}
        />
      </div>

      <Card className="shadow-sm">
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="text-xl">Edit position</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
          <PositionForm
            initialValue={position}
            submitLabel="Save changes"
            pending={updateMutation.isPending}
            error={updateMutation.isError ? updateMutation.error.message : undefined}
            onSubmit={(data) => updateMutation.mutate(data)}
          />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="text-xl">Applicants</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
          <PositionApplicants positionId={position.id} />
        </CardContent>
      </Card>
    </section>
  );
}
