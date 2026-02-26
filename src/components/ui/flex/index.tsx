import React from "react";
import { cn } from "@/utils";

interface FlexProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  variant?:
    | "container"
    | "card"
    | "header"
    | "form-row"
    | "form-field"
    | "button-group"
    | "status"
    | "preview"
    | "center"
    | "sidebar";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  // Responsive props
  sm?: {
    direction?: "row" | "col" | "row-reverse" | "col-reverse";
    justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
    align?: "start" | "end" | "center" | "baseline" | "stretch";
    gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  };
  md?: {
    direction?: "row" | "col" | "row-reverse" | "col-reverse";
    justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
    align?: "start" | "end" | "center" | "baseline" | "stretch";
    gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  };
  lg?: {
    direction?: "row" | "col" | "row-reverse" | "col-reverse";
    justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
    align?: "start" | "end" | "center" | "baseline" | "stretch";
    gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  };
}

const FlexRoot: React.FC<FlexProps> = ({
  children,
  direction = "row",
  wrap,
  justify = "start",
  align = "start",
  gap = 2,
  variant,
  size = "md",
  className,
  style,
  sm,
  md,
  lg,
}) => {
  // Variant styles
  const variantStyles = {
    container: "mx-auto max-w-7xl px-4",
    card: "rounded-lg border border-border bg-card p-6",
    header: "mb-6 w-full justify-between items-center",
    "form-row": "space-y-0",
    "form-field": "flex-col space-y-1",
    "button-group": "justify-end gap-3 mt-6",
    status: "rounded border p-2 text-xs",
    preview:
      "aspect-[4/4] w-full max-w-[180px] overflow-hidden rounded-lg border border-input bg-muted justify-center items-center",
    center: "justify-center items-center",
    sidebar:
      "border-r border-border bg-muted/20 p-6 h-full flex-col items-center gap-4",
  };

  // Size styles
  const sizeStyles = {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const flexClasses = cn(
    "flex",
    // Base direction
    direction === "col" && "flex-col",
    direction === "row-reverse" && "flex-row-reverse",
    direction === "col-reverse" && "flex-col-reverse",
    // Wrap
    wrap === "wrap" && "flex-wrap",
    wrap === "nowrap" && "flex-nowrap",
    wrap === "wrap-reverse" && "flex-wrap-reverse",
    // Justify content
    justify === "start" && "justify-start",
    justify === "end" && "justify-end",
    justify === "center" && "justify-center",
    justify === "between" && "justify-between",
    justify === "around" && "justify-around",
    justify === "evenly" && "justify-evenly",
    // Align items
    align === "start" && "items-start",
    align === "end" && "items-end",
    align === "center" && "items-center",
    align === "baseline" && "items-baseline",
    align === "stretch" && "items-stretch",
    // Gap (only if variant doesn't include gap)
    !variant && `gap-${gap}`,
    variant && !variantStyles[variant]?.includes("gap-") && sizeStyles[size],
    // Variant styles
    variant && variantStyles[variant],
    // Small responsive
    sm?.direction === "col" && "sm:flex-col",
    sm?.direction === "row" && "sm:flex-row",
    sm?.direction === "row-reverse" && "sm:flex-row-reverse",
    sm?.direction === "col-reverse" && "sm:flex-col-reverse",
    sm?.justify === "start" && "sm:justify-start",
    sm?.justify === "end" && "sm:justify-end",
    sm?.justify === "center" && "sm:justify-center",
    sm?.justify === "between" && "sm:justify-between",
    sm?.justify === "around" && "sm:justify-around",
    sm?.justify === "evenly" && "sm:justify-evenly",
    sm?.align === "start" && "sm:items-start",
    sm?.align === "end" && "sm:items-end",
    sm?.align === "center" && "sm:items-center",
    sm?.align === "baseline" && "sm:items-baseline",
    sm?.align === "stretch" && "sm:items-stretch",
    sm?.gap && `sm:gap-${sm.gap}`,
    // Medium responsive
    md?.direction === "col" && "md:flex-col",
    md?.direction === "row" && "md:flex-row",
    md?.direction === "row-reverse" && "md:flex-row-reverse",
    md?.direction === "col-reverse" && "md:flex-col-reverse",
    md?.justify === "start" && "md:justify-start",
    md?.justify === "end" && "md:justify-end",
    md?.justify === "center" && "md:justify-center",
    md?.justify === "between" && "md:justify-between",
    md?.justify === "around" && "md:justify-around",
    md?.justify === "evenly" && "md:justify-evenly",
    md?.align === "start" && "md:items-start",
    md?.align === "end" && "md:items-end",
    md?.align === "center" && "md:items-center",
    md?.align === "baseline" && "md:items-baseline",
    md?.align === "stretch" && "md:items-stretch",
    md?.gap && `md:gap-${md.gap}`,
    // Large responsive
    lg?.direction === "col" && "lg:flex-col",
    lg?.direction === "row" && "lg:flex-row",
    lg?.direction === "row-reverse" && "lg:flex-row-reverse",
    lg?.direction === "col-reverse" && "lg:flex-col-reverse",
    lg?.justify === "start" && "lg:justify-start",
    lg?.justify === "end" && "lg:justify-end",
    lg?.justify === "center" && "lg:justify-center",
    lg?.justify === "between" && "lg:justify-between",
    lg?.justify === "around" && "lg:justify-around",
    lg?.justify === "evenly" && "lg:justify-evenly",
    lg?.align === "start" && "lg:items-start",
    lg?.align === "end" && "lg:items-end",
    lg?.align === "center" && "lg:items-center",
    lg?.align === "baseline" && "lg:items-baseline",
    lg?.align === "stretch" && "lg:items-stretch",
    lg?.gap && `lg:gap-${lg.gap}`,
    className
  );

  return (
    <div className={flexClasses} style={style}>
      {children}
    </div>
  );
};

// Action Group Component (for buttons and actions)
interface ActionGroupProps {
  children: React.ReactNode;
  position?: "start" | "end" | "center" | "between";
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  variant?: "form-actions" | "toolbar" | "pagination";
  className?: string;
}

const ActionGroup: React.FC<ActionGroupProps> = ({
  children,
  position = "end",
  orientation = "horizontal",
  size = "md",
  variant,
  className,
}) => {
  const positionMap = {
    start: "justify-start",
    end: "justify-end",
    center: "justify-center",
    between: "justify-between",
  };

  const gapMap = {
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-3",
  };

  const variantStyles = {
    "form-actions": "justify-end gap-3 mt-6",
    toolbar: "justify-between items-center p-4 border-b border-border",
    pagination: "justify-center items-center gap-2 mt-4",
  };

  return (
    <div
      className={cn(
        "flex",
        orientation === "vertical" ? "flex-col" : "flex-row",
        !variant && positionMap[position],
        "items-center",
        !variant && gapMap[size],
        variant && variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

// Section Group Component (for form sections)
interface SectionGroupProps {
  children: React.ReactNode;
  spacing?: "tight" | "normal" | "loose";
  responsive?: boolean;
  variant?: "form-section" | "card-section" | "header-section";
  className?: string;
}

const SectionGroup: React.FC<SectionGroupProps> = ({
  children,
  spacing = "normal",
  responsive = true,
  variant,
  className,
}) => {
  const spacingMap = {
    tight: "gap-2",
    normal: "gap-4",
    loose: "gap-6",
  };

  const variantStyles = {
    "form-section": "space-y-4 p-6",
    "card-section": "rounded-lg border border-border p-6 space-y-4",
    "header-section": "mb-6 justify-between items-center",
  };

  return (
    <div
      className={cn(
        "flex",
        responsive
          ? "flex-col lg:flex-row lg:items-center lg:justify-between"
          : "flex-row items-center justify-between",
        !variant && spacingMap[spacing],
        variant && variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

// Control Group Component (for form controls like switches)
interface ControlGroupProps {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  spacing?: "tight" | "normal" | "loose";
  responsive?: boolean;
  variant?: "form-controls" | "filter-controls" | "toggle-group";
  className?: string;
}

const ControlGroup: React.FC<ControlGroupProps> = ({
  children,
  orientation = "horizontal",
  spacing = "normal",
  responsive = true,
  variant,
  className,
}) => {
  const spacingMap = {
    tight: "gap-2",
    normal: "gap-4",
    loose: "gap-6",
  };

  const variantStyles = {
    "form-controls": "flex-wrap gap-4 items-center",
    "filter-controls":
      "flex-wrap gap-2 items-center p-4 bg-muted/20 rounded-lg",
    "toggle-group": "gap-1 items-center bg-muted rounded-lg p-1",
  };

  const gapClass = spacingMap[spacing];

  return (
    <div
      className={cn(
        "flex",
        responsive
          ? `flex-col ${orientation === "horizontal" ? "sm:flex-row sm:items-center" : ""}`
          : orientation === "horizontal"
            ? "flex-row items-center"
            : "flex-col",
        !variant && gapClass,
        variant && variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

// Status Display Component
interface StatusDisplayProps {
  children: React.ReactNode;
  status?: "success" | "error" | "warning" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({
  children,
  status = "info",
  size = "sm",
  className,
}) => {
  const statusStyles = {
    success:
      "bg-status-success-background text-status-success border-status-success/20",
    error:
      "bg-status-error-background text-status-error border-status-error/20",
    warning:
      "bg-status-warning-background text-status-warning border-status-warning/20",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const sizeStyles = {
    sm: "text-xs p-2",
    md: "text-sm p-3",
    lg: "text-base p-4",
  };

  return (
    <div
      className={cn(
        "rounded border",
        statusStyles[status],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </div>
  );
};

// Compound Component Export
export const Flex = Object.assign(FlexRoot, {
  ActionGroup,
  SectionGroup,
  ControlGroup,
  StatusDisplay,
});
