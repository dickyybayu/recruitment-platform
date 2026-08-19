export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Sorting<TSortBy extends string> = {
  sortBy: TSortBy;
  sortOrder: "asc" | "desc";
};

export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};
