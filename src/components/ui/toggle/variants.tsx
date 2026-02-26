import { cva } from "class-variance-authority";

export const toggleVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-full",
  {
    variants: {
      variant: {
        active: "bg-primary text-primary-foreground shadow",
        inactive: "bg-transparent text-theme-primary hover:text-primary",
      },
      size: {
        default: "px-6 py-1 text-sm",
        sm: "px-4 py-1 text-xs",
        lg: "px-8 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "inactive",
      size: "default",
    },
  }
);
