import { cva } from "class-variance-authority";

export const pageWrapperVariants = cva("min-h-screen", {
  variants: {
    variant: {
      default: "bg-theme-primary/10",
      primary: "bg-theme-primary",
      secondary: "bg-muted",
      neutral: "bg-background",
      card: "bg-card",
    },
    padding: {
      none: "p-0",
      sm: "p-2",
      default: "p-3",
      md: "p-4",
      lg: "p-5",
      xl: "pt-4 md:pt-7 px-3 lg:px-4 lg:pt-6 lg:pb-4",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "default",
  },
});

export const pageContentVariants = cva(
  "w-full mx-auto bg-card rounded-lg shadow-sm overflow-hidden border border-border",
  {
    variants: {
      maxWidth: {
        sm: "max-w-2xl",
        md: "max-w-4xl",
        lg: "max-w-6xl",
        xl: "max-w-7xl",
        full: "max-w-full",
      },
      contentPadding: {
        none: "p-0",
        sm: "p-2",
        default: "p-6 md:p-10 lg:p-12",
        md: "p-4",
        lg: "p-5",
      },
    },
    defaultVariants: {
      maxWidth: "xl",
      contentPadding: "default",
    },
  }
);

export const simplePageWrapperVariants = cva([
  "min-h-screen bg-theme-primary p-5",
]);

export const simplePageContentVariants = cva([
  "bg-card border-border mx-auto w-full max-w-7xl rounded-lg border p-3 shadow-sm",
]);
