import { toaster } from "@/components";
import { ENV } from "@/config";
import type { User } from "@/types";
import axios from "axios";

type LoggerErrorOptionsType = {
  toast?: boolean;
  pushLog?: boolean;
};

function serializeError(err: unknown) {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  }
  return err;
}

async function pushLog({
  ...logData
}: {
  errorContent: unknown;
  user?: User;
}): Promise<void> {
  try {
    if (ENV.DEV) return;

    await axios.post(
      ENV.VITE_FRONT_END_LOGGER_URL,
      {
        errorType: "Error",
        ...logData,
        errorContent: serializeError(logData?.errorContent),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );
  } catch {
    // Silently ignore logging errors in production
  }
}

// Store the current toast ID to dismiss it when a new error occurs
let currentToastId: string | undefined;

export function error(
  error: unknown,
  options?: LoggerErrorOptionsType
): string {
  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "something went wrong";
  }

  if (options?.pushLog) {
    pushLog({
      errorContent: error,
      // user - user is optional we can get it from storage
    });
  }

  if (options?.toast) {
    // Dismiss the previous toast if it exists
    if (currentToastId !== undefined) {
      toaster.dismiss(currentToastId);
    }

    // Show the new toast and store its ID
    currentToastId = toaster.error(message);
  }

  if (ENV.DEV) {
    // Log error to console in development
    console.error(error);
  }
  return message;
}
