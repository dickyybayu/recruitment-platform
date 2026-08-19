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
import { loginSchema, type LoginInput } from "@/schemas/auth.schema";
import type { AuthResponse } from "@/types/auth";

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: LoginInput) =>
      apiFetch<AuthResponse>(
        "/api/auth/login",
        {
          method: "POST",
          body: data,
        },
      ),

    onSuccess: async (data) => {
      queryClient.setQueryData(
        ["current-user"],
        data.user,
      );

      await queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });

      toast.success("Login successful");

      router.push("/dashboard");
      router.refresh();
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (
    data: LoginInput,
  ) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="email">
          Email
        </Label>

        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-destructive">
            {errors.email.message}
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
          autoComplete="current-password"
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
          ? "Signing in..."
          : "Sign in"}
      </Button>
    </form>
  );
}
