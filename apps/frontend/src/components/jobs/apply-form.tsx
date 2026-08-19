"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import {
  createApplicantSchema,
  type CreateApplicantFormInput,
  type CreateApplicantInput,
} from "@/schemas/applicant.schema";
import type { Applicant } from "@/types/applicant";
import type { ApiEnvelope } from "@/types/common";

export function ApplyForm({ positionId }: { positionId: string }) {
  const form = useForm<CreateApplicantFormInput, unknown, CreateApplicantInput>({
    resolver: zodResolver(createApplicantSchema),
    defaultValues: {
      positionId,
      fullName: "",
      email: "",
      phone: "",
      education: "",
      experience: 0,
      resumeUrl: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateApplicantInput) =>
      apiFetch<ApiEnvelope<{ applicant: Applicant }>>("/api/applicants", {
        method: "POST",
        body: data,
      }),
  });

  if (mutation.isSuccess) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
            <CheckCircle2 className="size-6 text-foreground" />
          </div>
          <CardTitle className="text-2xl">Application submitted</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-center">
          <p className="text-base text-muted-foreground">
            Your application has been submitted successfully.
          </p>
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <Button render={<Link href={`/jobs/${positionId}`} />}>
              Back to job
            </Button>
            <Button variant="outline" render={<Link href="/" />}>
              Browse jobs
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="space-y-2 p-5 sm:p-6">
        <CardTitle className="text-2xl tracking-tight">Apply for this role</CardTitle>
        <p className="text-sm text-muted-foreground">
          Submit your contact details and resume URL for this position.
        </p>
      </CardHeader>
      <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          noValidate
        >
          <input type="hidden" {...form.register("positionId")} />

          <FieldError message={form.formState.errors.positionId?.message} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" {...form.register("fullName")} />
              <FieldError message={form.formState.errors.fullName?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
              <FieldError message={form.formState.errors.email?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...form.register("phone")} />
              <FieldError message={form.formState.errors.phone?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience (years)</Label>
              <Input
                id="experience"
                type="number"
                min={0}
                {...form.register("experience", { valueAsNumber: true })}
              />
              <FieldError message={form.formState.errors.experience?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Textarea id="education" className="min-h-24" {...form.register("education")} />
            <FieldError message={form.formState.errors.education?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumeUrl">Resume URL</Label>
            <Input id="resumeUrl" type="url" {...form.register("resumeUrl")} />
            <FieldError message={form.formState.errors.resumeUrl?.message} />
          </div>

          {mutation.isError && (
            <p className="text-sm text-destructive">{mutation.error.message}</p>
          )}

          <div className="pt-1">
          <Button type="submit" className="w-full sm:w-auto" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Submit application"}
          </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
}
