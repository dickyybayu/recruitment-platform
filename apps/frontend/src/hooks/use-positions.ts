"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { toQueryString } from "@/lib/query-string";
import type { ApiEnvelope } from "@/types/common";
import type {
  Position,
  PositionListQuery,
  PositionListResult,
} from "@/types/position";

export const defaultPositionQuery: PositionListQuery = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export function usePositions(query: PositionListQuery) {
  return useQuery({
    queryKey: ["positions", query],
    queryFn: async () => {
      const response = await apiFetch<ApiEnvelope<PositionListResult>>(
        `/api/positions${toQueryString(query)}`,
      );

      return response.data;
    },
  });
}

export function usePosition(id: string) {
  return useQuery({
    queryKey: ["position", id],
    queryFn: async () => {
      const response = await apiFetch<ApiEnvelope<{ position: Position }>>(
        `/api/positions/${id}`,
      );

      return response.data.position;
    },
    retry: false,
  });
}
