import { cva } from "class-variance-authority";

export const statusBadgeVariants = cva("inline-flex items-center font-medium", {
  variants: {
    variant: {
      success: "text-status-success",
      warning: "text-status-warning",
      error: "text-status-error",
      neutral: "text-status-neutral",
    },
    size: {
      xs: "text-xxs",
      sm: "text-xxs",
      default: "text-xxs",
      md: "text-xs",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    variant: "neutral",
    size: "default",
  },
});
