"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { toQueryString } from "@/lib/query-string";
import type { ApiEnvelope } from "@/types/common";
import type {
  PublicPosition,
  PublicPositionFilters,
  PublicPositionListItem,
} from "@/types/position";

export function usePublicPositions(filters: PublicPositionFilters) {
  return useQuery({
    queryKey: ["public-positions", filters],
    queryFn: async () => {
      const response = await apiFetch<
        ApiEnvelope<{ positions: PublicPositionListItem[] }>
      >(`/api/public/positions${toQueryString(filters)}`);

      return response.data.positions;
    },
  });
}

export function usePublicPosition(id: string) {
  return useQuery({
    queryKey: ["public-position", id],
    queryFn: async () => {
      const response = await apiFetch<ApiEnvelope<{ position: PublicPosition }>>(
        `/api/public/positions/${id}`,
      );

      return response.data.position;
    },
    retry: false,
  });
}
