const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

type ApiOptions =
  Omit<RequestInit, "body"> & {
    body?: unknown;
  };

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,

      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },

      body:
        options.body !== undefined
          ? JSON.stringify(options.body)
          : undefined,
    },
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const message =
      data?.message ??
      "Something went wrong";

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
