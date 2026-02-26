import React from "react";
import { cn } from "@/utils";
import { type VariantProps } from "class-variance-authority";
import { statusBadgeVariants } from "./variants";

export interface StatusBadgeProps
  extends VariantProps<typeof statusBadgeVariants> {
  status: string | boolean;
  type?: "verification" | "status";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = "status",
  size,
  className,
}) => {
  const getVariantByStatus = ():
    | "success"
    | "warning"
    | "error"
    | "neutral" => {
    const statusString =
      typeof status === "boolean"
        ? status
          ? "true"
          : "false"
        : String(status).toLowerCase();

    if (type === "verification") {
      switch (statusString) {
        case "true":
        case "verified":
        case "approved":
        case "confirmed":
          return "success";
        case "pending":
        case "in-progress":
        case "reviewing":
          return "warning";
        case "false":
        case "rejected":
        case "failed":
        case "denied":
          return "error";
        default:
          return "neutral";
      }
    } else {
      switch (statusString) {
        case "true":
        case "active":
        case "enabled":
        case "verified":
        case "completed":
        case "success":
          return "success";
        case "pending":
        case "processing":
        case "in-progress":
        case "warning":
          return "warning";
        case "false":
        case "inactive":
        case "disabled":
        case "expired":
        case "failed":
        case "error":
        case "rejected":
          return "error";
        default:
          return "neutral";
      }
    }
  };

  const variant = getVariantByStatus();

  const displayStatus =
    typeof status === "boolean"
      ? status
        ? "Active"
        : "Inactive"
      : String(status);

  return (
    <span className={cn(statusBadgeVariants({ variant, size }), className)}>
      {displayStatus}
    </span>
  );
};
