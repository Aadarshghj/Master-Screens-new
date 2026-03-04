import type { ApiErrorResponse } from "@/types/api-error";

export const handleApiError = (error: ApiErrorResponse | unknown): string => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const apiError = (error as ApiErrorResponse).data;

    if (apiError?.errorCode === "500" && apiError?.status === 400) {
      return "System error occurred. Please try again later.";
    }

    return apiError?.message ?? "An unexpected error occurred";
  }

  return "An unexpected error occurred";
};

export const getCorrelationId = (
  error: ApiErrorResponse
): string | undefined => {
  const apiError = error.error?.data || error.data;
  return apiError?.correlationId;
};
