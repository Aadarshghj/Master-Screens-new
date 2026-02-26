/**
 * Common error handling utilities
 */

/**
 * Extracts a user-friendly error message from various error types
 * @param error - The error object to extract message from
 * @returns A user-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (!error) return "An unknown error occurred";

  const errorObj = error as Record<string, unknown>;

  // Check if it's a serialized error
  if (errorObj?.name === "SerializedError") {
    return "Network connection failed. Please check your internet connection.";
  }

  // Check if it's an axios error
  if (typeof errorObj?.status === "number") {
    const status = errorObj.status as number;
    if (status >= 500) {
      return "Server error. Please try again later.";
    }
    if (status === 401) {
      return "Authentication failed. Please log in again.";
    }
    if (status === 403) {
      return "You don't have permission to perform this action.";
    }
    if (status === 404) {
      return "The requested resource was not found.";
    }
    if (status === 422) {
      return "Invalid data provided. Please check your input.";
    }
  }

  // Network errors
  if (errorObj?.status === "FETCH_ERROR") {
    return "Network connection failed. Please check your internet connection.";
  }

  // Default error message
  const data = errorObj?.data as Record<string, unknown>;
  const message = errorObj?.message as string;

  return (
    (data?.message as string) ||
    message ||
    "An unexpected error occurred. Please try again."
  );
};
