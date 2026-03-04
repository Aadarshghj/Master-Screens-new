import { cva, type VariantProps } from "class-variance-authority";

export const starRatingVariants = cva(
  "absolute", // base classes
  {
    variants: {
      size: {
        xs: "h-2 w-2",
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
        xl: "h-6 w-6",
      },
      color: {
        default: "text-yellow-400",
        warning: "text-status-warning",
        amber: "text-amber-400",
        orange: "text-orange-400",
        custom: "",
      },
      layout: {
        arc: "", // default arc layout
        linear: "", // for linear arrangement
        circle: "", // for full circle
      },
    },
    defaultVariants: {
      size: "sm",
      color: "warning",
      layout: "arc",
    },
  }
);

export type StarRatingVariants = VariantProps<typeof starRatingVariants>;
