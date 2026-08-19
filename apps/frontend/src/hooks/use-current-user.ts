"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  apiFetch,
} from "@/lib/api";

import type {
  CurrentUser,
} from "@/types/auth";

type CurrentUserResponse =
  | CurrentUser
  | {
      success: boolean;
      data: {
        user: CurrentUser;
      };
    }
  | {
      user: CurrentUser;
    };

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],

    queryFn: async () => {
      const response =
        await apiFetch<CurrentUserResponse>(
          "/api/auth/me",
        );

      if ("data" in response) {
        return response.data.user;
      }

      if ("user" in response) {
        return response.user;
      }

      return response;
    },

    retry: false,
  });
}
