"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PositionForm } from "@/components/positions/position-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import type { ApiEnvelope } from "@/types/common";
import type { Position } from "@/types/position";
import type { CreatePositionInput } from "@/schemas/position.schema";

export function CreatePositionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreatePositionInput) =>
      apiFetch<ApiEnvelope<{ position: Position }>>("/api/positions", {
        method: "POST",
        body: data,
      }),
    onSuccess: async (response) => {
      toast.success("Position created");
      await queryClient.invalidateQueries({ queryKey: ["positions"] });
      router.push(`/positions/${response.data.position.id}`);
    },
  });

  return (
    <section className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Create Position</h1>
        <p className="mt-1 text-base text-muted-foreground">Add a new role for your company.</p>
      </div>
      <Card className="shadow-sm">
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="text-xl">Position details</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
          <PositionForm
            submitLabel="Create position"
            pending={mutation.isPending}
            error={mutation.isError ? mutation.error.message : undefined}
            onSubmit={(data) => mutation.mutate(data)}
          />
        </CardContent>
      </Card>
    </section>
  );
}
