import React from "react";
import { Grid } from "@/components/ui/grid";
import { cn } from "@/utils";

export interface FormContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
};

const paddingClasses = {
  none: "",
  sm: "px-2",
  md: "px-4",
  lg: "px-6",
};

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  className,
  maxWidth = "7xl",
  padding = "md",
}) => {
  return (
    <Grid
      className={cn(
        "mx-auto",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </Grid>
  );
};
