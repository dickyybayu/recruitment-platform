"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPositionSchema, type CreatePositionInput } from "@/schemas/position.schema";
import { positionTypes, type Position } from "@/types/position";

export function PositionForm({
  initialValue,
  submitLabel,
  pending,
  error,
  onSubmit,
}: {
  initialValue?: Position;
  submitLabel: string;
  pending?: boolean;
  error?: string;
  onSubmit: (data: CreatePositionInput) => void;
}) {
  const form = useForm<CreatePositionInput>({
    resolver: zodResolver(createPositionSchema),
    defaultValues: {
      title: initialValue?.title ?? "",
      location: initialValue?.location ?? "",
      type: initialValue?.type ?? "FULL_TIME",
      description: initialValue?.description ?? "",
      salary: initialValue?.salary ?? "",
      isActive: initialValue?.isActive ?? true,
    },
  });

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register("title")} />
          <FieldError message={form.formState.errors.title?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...form.register("location")} />
          <FieldError message={form.formState.errors.location?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            {...form.register("type")}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {positionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <FieldError message={form.formState.errors.type?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salary">Salary</Label>
          <Input id="salary" {...form.register("salary")} />
          <FieldError message={form.formState.errors.salary?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" className="min-h-32" {...form.register("description")} />
        <FieldError message={form.formState.errors.description?.message} />
      </div>

      <label className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm">
        <input type="checkbox" {...form.register("isActive")} />
        Active
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="border-t pt-4">
      <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}
