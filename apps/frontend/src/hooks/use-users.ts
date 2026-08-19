"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { ApiEnvelope } from "@/types/common";
import type { User } from "@/types/user";

export function useUsers(enabled = true) {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiFetch<ApiEnvelope<{ users: User[] }>>(
        "/api/users",
      );

      return response.data.users;
    },
    enabled,
  });
}
