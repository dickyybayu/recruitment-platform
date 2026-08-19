import type { Pagination, Sorting } from "@/types/common";

export const positionTypes = ["FULL_TIME", "PART_TIME", "CONTRACT"] as const;

export type PositionType = (typeof positionTypes)[number];

export type Position = {
  id: string;
  companyId: string;
  createdBy: string;
  title: string;
  location: string;
  type: PositionType;
  description: string;
  salary: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PublicPositionListItem = Pick<
  Position,
  "id" | "title" | "location" | "type" | "salary" | "createdAt"
> & {
  companyName: string;
};

export type PublicPosition = PublicPositionListItem &
  Pick<Position, "description">;

export type PositionSortBy = "createdAt" | "title" | "location" | "type";

export type PositionListQuery = {
  page: number;
  limit: number;
  sortBy: PositionSortBy;
  sortOrder: "asc" | "desc";
};

export type PositionListResult = {
  positions: Position[];
  pagination: Pagination;
  sorting: Sorting<PositionSortBy>;
};

export type PublicPositionFilters = {
  search?: string;
  location?: string;
  type?: PositionType;
};
