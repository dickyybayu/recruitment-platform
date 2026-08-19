"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      apiFetch<{ success: boolean; message: string }>("/api/auth/logout", {
        method: "POST",
      }),

    onSuccess: () => {
      queryClient.clear();
      toast.success("Logout successful");
      router.push("/login");
      router.refresh();
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      <LogOut />
      {mutation.isPending ? "Signing out..." : "Logout"}
    </Button>
  );
}
