import { toaster } from "@/components";
import { ENV } from "@/config";
import type { User, LoggerInfoOptions } from "@/types";
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

async function pushWarnLog({
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
        errorType: "Warning",
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
  } catch (error: unknown) {
    // eslint-disable-next-line
    console.warn("Failed to send warn log:", error);
  }
}

// Store the current warning toast ID to dismiss it when a new warning occurs
let currentWarnToastId: string | undefined;

export function warn(message: string, options?: LoggerInfoOptions): string {
  const finalMessage =
    typeof message === "string" ? message : "Warning logged without message";

  if (options?.toast) {
    // Dismiss the previous warning toast if it exists
    if (currentWarnToastId !== undefined) {
      toaster.dismiss(currentWarnToastId);
    }

    // Show the new toast and store its ID
    currentWarnToastId = toaster.success(finalMessage);
  }

  if (options?.pushLog) {
    void pushWarnLog({
      message: finalMessage,
      user: options?.user,
    });
  }

  if (ENV.DEV) {
    // eslint-disable-next-line
    console.warn("[WARN]", finalMessage);
  }

  return finalMessage;
}
