import { toaster } from "@/components";
import { ENV } from "@/config";
import type { User, LoggerErrorOptions, LoggerInfoOptions } from "@/types";
import axios from "axios";

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
  errorContent,
  user,
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
        errorContent: serializeError(errorContent),
        user,
        timestamp: new Date().toISOString(),
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

async function pushInfoLog({
  message,
  metadata,
  user,
}: {
  message: string;
  metadata?: unknown;
  user?: User;
}): Promise<void> {
  try {
    if (ENV.DEV) return;

    await axios.post(
      ENV.VITE_FRONT_END_LOGGER_URL,
      {
        errorType: "Info",
        message,
        metadata: serializeError(metadata),
        user,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );
  } catch {
    // Silently ignore info logging errors in production
  }
}

// Store the current toast IDs to dismiss them when new toasts occur
let currentErrorToastId: string | undefined;
let currentInfoToastId: string | undefined;

export function error(error: unknown, options?: LoggerErrorOptions): string {
  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else if (
    error &&
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    message = String((error as { message: unknown }).message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "something went wrong";
  }

  if (options?.pushLog) {
    pushLog({
      errorContent: error,
      // user - can be passed via options later
    });
  }

  if (options?.toast) {
    // Dismiss the previous error toast if it exists
    if (currentErrorToastId !== undefined) {
      toaster.dismiss(currentErrorToastId);
    }

    // Show the new toast and store its ID
    currentErrorToastId = toaster.error(message);
  }

  if (ENV.DEV) {
    // Log error to console in development
    console.error(error);
  }
  return message;
}

export function info(message: string, options?: LoggerInfoOptions): string {
  const finalMessage =
    typeof message === "string" ? message : "Info logged without message";

  if (options?.toast) {
    // Dismiss the previous info toast if it exists
    if (currentInfoToastId !== undefined) {
      toaster.dismiss(currentInfoToastId);
    }

    // Show the new toast and store its ID
    currentInfoToastId = toaster.success(finalMessage);
  }

  if (options?.pushLog) {
    void pushInfoLog({
      message: finalMessage,
      user: options?.user,
    });
  }

  if (ENV.DEV) {
    // Log info to console in development
    console.info(finalMessage);
  }

  return finalMessage;
}
