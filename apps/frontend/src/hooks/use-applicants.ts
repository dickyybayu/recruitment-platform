"use client";

import { useQueries, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { toQueryString } from "@/lib/query-string";
import {
  applicantStatuses,
  type Applicant,
  type ApplicantListQuery,
  type ApplicantListResult,
} from "@/types/applicant";
import type { ApiEnvelope } from "@/types/common";

export const defaultApplicantQuery: ApplicantListQuery = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export function useApplicants(query: ApplicantListQuery) {
  return useQuery({
    queryKey: ["applicants", query],
    queryFn: async () => {
      const response = await apiFetch<
        ApiEnvelope<{ applicants: ApplicantListResult }>
      >(`/api/applicants${toQueryString(query)}`);

      return response.data.applicants;
    },
  });
}

export function useApplicantStatusTotals() {
  const queries = useQueries({
    queries: applicantStatuses.map((status) => ({
      queryKey: ["applicants", "status-total", status],
      queryFn: async () => {
        const response = await apiFetch<
          ApiEnvelope<{ applicants: ApplicantListResult }>
        >(
          `/api/applicants${toQueryString({
            ...defaultApplicantQuery,
            page: 1,
            limit: 1,
            status,
          })}`,
        );

        return response.data.applicants.pagination.total;
      },
    })),
  });

  return applicantStatuses.map((status, index) => ({
    status,
    query: queries[index],
  }));
}

export function usePositionApplicantTotals(positionIds: string[]) {
  const queries = useQueries({
    queries: positionIds.map((positionId) => ({
      queryKey: ["applicants", "position-total", positionId],
      queryFn: async () => {
        const response = await apiFetch<
          ApiEnvelope<{ applicants: ApplicantListResult }>
        >(
          `/api/applicants${toQueryString({
            ...defaultApplicantQuery,
            page: 1,
            limit: 1,
            positionId,
          })}`,
        );

        return response.data.applicants.pagination.total;
      },
    })),
  });

  return positionIds.map((positionId, index) => ({
    positionId,
    query: queries[index],
  }));
}

export function useApplicant(id: string) {
  return useQuery({
    queryKey: ["applicant", id],
    queryFn: async () => {
      const response = await apiFetch<ApiEnvelope<{ applicant: Applicant }>>(
        `/api/applicants/${id}`,
      );

      return response.data.applicant;
    },
    retry: false,
  });
}
