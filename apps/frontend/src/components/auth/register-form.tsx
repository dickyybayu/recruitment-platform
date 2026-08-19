"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  registerSchema,
  type RegisterInput,
} from "@/schemas/auth.schema";
import type { AuthResponse } from "@/types/auth";

export function RegisterForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<RegisterInput>({
    resolver:
      zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: (
      data: RegisterInput,
    ) =>
      apiFetch<AuthResponse>(
        "/api/auth/register",
        {
          method: "POST",
          body: data,
        },
      ),

    onSuccess: (data) => {
      queryClient.setQueryData(
        ["current-user"],
        data.user,
      );

      void queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });

      toast.success(
        "Account created successfully",
      );

      router.push("/dashboard");
      router.refresh();
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <form
      onSubmit={handleSubmit(
        (data) =>
          mutation.mutate(data),
      )}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="companyName">
          Company name
        </Label>

        <Input
          id="companyName"
          {...register("companyName")}
        />

        {errors.companyName && (
          <p className="text-sm text-destructive">
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">
          Full name
        </Label>

        <Input
          id="fullName"
          {...register("fullName")}
        />

        {errors.fullName && (
          <p className="text-sm text-destructive">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email
        </Label>

        <Input
          id="email"
          type="email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone
        </Label>

        <Input
          id="phone"
          {...register("phone")}
        />

        {errors.phone && (
          <p className="text-sm text-destructive">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password
        </Label>

        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {mutation.isError && (
        <p className="text-sm text-destructive">
          {mutation.error.message}
        </p>
      )}

      <Button
        type="submit"
          className="h-9 w-full"
        disabled={mutation.isPending}
      >
        {mutation.isPending
          ? "Creating account..."
          : "Create account"}
      </Button>
    </form>
  );
}
