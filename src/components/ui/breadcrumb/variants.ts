import { cva } from "class-variance-authority";

export const breadcrumbVariants = cva("flex items-center", {
  variants: {
    variant: {
      default: "text-gray-600",
      primary: "text-blue-600",
      secondary: "text-gray-500",
      muted: "text-gray-400",
    },
    size: {
      xs: "text-xxs space-x-0.5",
      sm: "text-xxs space-x-1",
      default: "text-xs space-x-1",
      md: "text-sm space-x-2",
      lg: "text-base space-x-2",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export const breadcrumbItemVariants = cva(
  "inline-flex items-center transition-colors cursor-none",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        primary: "text-theme-primary hover:text-theme-primary/80",
        secondary: "text-gray-500 hover:text-gray-700",
        muted: "text-gray-400 hover:text-gray-600",
      },
      active: {
        true: "text-theme-primary font-medium",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      active: false,
    },
  }
);

export const breadcrumbLinkVariants = cva(
  "transition-colors hover:text-text-red-600 cursor-pointer",
  {
    variants: {
      variant: {
        default: "text-foreground font-medium hover:text-foreground/60",
        primary: "text-theme-primary hover:text-theme-primary/80",
        secondary: "text-gray-500 hover:text-gray-700",
        muted: "text-gray-400 hover:text-gray-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const breadcrumbSeparatorVariants = cva("flex items-center px-1", {
  variants: {
    variant: {
      default: "text-foreground",
      primary: "text-blue-300",
      secondary: "text-gray-300",
      muted: "text-gray-200",
    },
    size: {
      xs: "[&>svg]:h-2.5 [&>svg]:w-2.5",
      sm: "[&>svg]:h-3 [&>svg]:w-3",
      default: "[&>svg]:h-4 [&>svg]:w-4",
      md: "[&>svg]:h-5 [&>svg]:w-5",
      lg: "[&>svg]:h-6 [&>svg]:w-6",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
