"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import {
  createUserSchema,
  type CreateUserInput,
  type CreateUserPayload,
} from "@/schemas/user.schema";
import type { ApiEnvelope } from "@/types/common";
import type { User } from "@/types/user";

export function CreateUserForm() {
  const queryClient = useQueryClient();
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateUserInput) =>
      apiFetch<ApiEnvelope<{ user: User }>>("/api/users", {
        method: "POST",
        body: {
          ...data,
          role: "RECRUITER",
        } satisfies CreateUserPayload,
      }),
    onSuccess: async () => {
      toast.success("Recruiter created");
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <form
      className="space-y-5"
      onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-3">
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
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...form.register("password")} />
          <FieldError message={form.formState.errors.password?.message} />
        </div>
      </div>
      {mutation.isError && <p className="text-sm text-destructive">{mutation.error.message}</p>}
      <Button type="submit" className="w-full sm:w-auto" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create recruiter"}
      </Button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}
