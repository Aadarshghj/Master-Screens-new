import { cva } from "class-variance-authority";

export const modalVariants = cva(
  "relative w-full rounded-xl border border-border bg-card text-card-foreground shadow-xl",
  {
    variants: {
      width: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        "2xl": "max-w-6xl",
        "3xl": "max-w-7xl",
      },
      zIndex: {
        base: "z-40",
        modal: "z-50",
        top: "z-[9999]",
      },
      padding: {
        default: "p-6",
        compact: "p-4",
        none: "p-0",
      },
    },
    defaultVariants: {
      width: "lg",
      zIndex: "modal",
      padding: "default",
    },
  }
);

export const modalOverlayVariants = cva("bg-background/80", {
  variants: {
    zIndex: {
      base: "z-40",
      modal: "z-50",
      top: "z-[9999]",
    },
    background: {
      default: "bg-black/50",
      light: "bg-black/30",
      dark: "bg-black/70",
    },
  },
  defaultVariants: {
    zIndex: "modal",
    background: "default",
  },
});

export const modalCloseButtonVariants = cva(
  "rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
  {
    variants: {
      size: {
        default: "h-6 w-6",
        compact: "h-5 w-5",
        small: "h-4 w-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export const modalHeaderVariants = cva(
  "text-foreground font-semibold leading-none tracking-tight",
  {
    variants: {
      size: {
        default: "text-lg",
        compact: "text-base",
        small: "text-sm",
        large: "text-xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export const modalContentVariants = cva("text-sm text-muted-foreground", {
  variants: {
    spacing: {
      default: "space-y-4",
      compact: "space-y-3",
      tight: "space-y-2",
      loose: "space-y-6",
    },
    padding: {
      default: "",
      top: "pt-4",
      bottom: "pb-4",
      vertical: "py-4",
      horizontal: "px-4",
    },
  },
  defaultVariants: {
    spacing: "default",
    padding: "default",
  },
});

export const modalFooterVariants = cva("border-t border-border pt-4", {
  variants: {
    spacing: {
      default: "mt-6",
      compact: "mt-4",
      tight: "mt-3",
      loose: "mt-8",
    },
    border: {
      none: "border-t-0 pt-0",
      top: "border-t border-border pt-4",
    },
  },
  defaultVariants: {
    spacing: "default",
    border: "top",
  },
});
