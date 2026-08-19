"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ErrorState, LoadingState } from "@/components/ui/state";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { useApplicant } from "@/hooks/use-applicants";
import {
  updateApplicantStatusSchema,
  updateApplicantNotesSchema,
  type UpdateApplicantStatusInput,
  type UpdateApplicantNotesInput,
} from "@/schemas/applicant.schema";
import { applicantStatuses, type Applicant } from "@/types/applicant";
import type { ApiEnvelope } from "@/types/common";

export function ApplicantDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const applicantQuery = useApplicant(id);

  const notesForm = useForm<UpdateApplicantNotesInput>({
    resolver: zodResolver(updateApplicantNotesSchema),
    values: {
      notes: applicantQuery.data?.notes ?? "",
    },
  });

  const statusMutation = useMutation({
    mutationFn: (data: UpdateApplicantStatusInput) =>
      apiFetch<ApiEnvelope<{ applicant: Applicant }>>(`/api/applicants/${id}/status`, {
        method: "PATCH",
        body: data,
      }),
    onSuccess: async () => {
      toast.success("Status updated");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["applicant", id] }),
        queryClient.invalidateQueries({ queryKey: ["applicants"] }),
      ]);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const notesMutation = useMutation({
    mutationFn: (data: UpdateApplicantNotesInput) =>
      apiFetch<ApiEnvelope<{ applicant: Applicant }>>(`/api/applicants/${id}/notes`, {
        method: "PATCH",
        body: data,
      }),
    onSuccess: async () => {
      toast.success("Notes updated");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["applicant", id] }),
        queryClient.invalidateQueries({ queryKey: ["applicants"] }),
      ]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiFetch(`/api/applicants/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      toast.success("Applicant deleted");
      await queryClient.invalidateQueries({ queryKey: ["applicants"] });
      router.push("/applicants");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (applicantQuery.isLoading) {
    return <LoadingState label="Loading applicant..." />;
  }

  if (applicantQuery.isError) {
    return (
      <ErrorState
        title="Unable to load applicant"
        message={applicantQuery.error.message}
        onRetry={() => void applicantQuery.refetch()}
      />
    );
  }

  const applicant = applicantQuery.data;

  if (!applicant) {
    return <ErrorState title="Applicant not found" />;
  }

  function updateStatus(status: string) {
    const parsed = updateApplicantStatusSchema.safeParse({ status });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid applicant status");
      return;
    }

    statusMutation.mutate(parsed.data);
  }

  return (
    <section className="space-y-6">
      <div>
        <div>
          <Badge variant="secondary" className="mb-2">{applicant.status}</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">{applicant.fullName}</h1>
          <p className="mt-1 text-base text-muted-foreground">{applicant.email}</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="text-xl">Applicant profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 px-5 pb-5 sm:grid-cols-2 sm:px-6 sm:pb-6 lg:grid-cols-3">
          <Detail label="Phone" value={applicant.phone} />
          <Detail label="Position" value={applicant.positionTitle ?? applicant.positionId} />
          <Detail label="Education" value={applicant.education} />
          <Detail label="Experience" value={`${applicant.experience} years`} />
          <Detail label="Created" value={formatDate(applicant.createdAt)} />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Resume</p>
            <Button variant="outline" render={<Link href={applicant.resumeUrl} target="_blank" rel="noreferrer" />}>
              Open resume
            </Button>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant="secondary">{applicant.status}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="text-xl">Application status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 px-5 pb-5 sm:flex-row sm:items-center sm:px-6 sm:pb-6">
          <select
            value={applicant.status}
            disabled={statusMutation.isPending}
            onChange={(event) => updateStatus(event.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          >
            {applicantStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {statusMutation.isPending && (
            <p className="text-sm text-muted-foreground">Saving status...</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="text-xl">Notes</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
          <form
            className="space-y-4"
            onSubmit={notesForm.handleSubmit((data) =>
              notesMutation.mutate({
                notes: data.notes?.trim() ? data.notes : null,
              }),
            )}
            noValidate
          >
            <Label htmlFor="notes">Internal notes</Label>
            <Textarea id="notes" className="min-h-32" {...notesForm.register("notes")} />
            {notesMutation.isError && (
              <p className="text-sm text-destructive">{notesMutation.error.message}</p>
            )}
            <Button type="submit" className="w-full sm:w-auto" disabled={notesMutation.isPending}>
              {notesMutation.isPending ? "Saving..." : "Save notes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/30 shadow-sm">
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="text-xl">Danger zone</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 px-5 pb-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pb-6">
          <p className="text-sm text-muted-foreground">
            Delete this applicant record permanently.
          </p>
          <ConfirmDialog
            trigger={
              <Button type="button" variant="destructive">
                Delete applicant
              </Button>
            }
            title="Delete applicant"
            description={`Delete ${applicant.fullName}? This action cannot be undone.`}
            pending={deleteMutation.isPending}
            onConfirm={() => deleteMutation.mutate()}
          />
        </CardContent>
      </Card>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base font-medium">{value}</p>
    </div>
  );
}
