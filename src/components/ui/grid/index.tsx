import React from "react";
import { cn } from "@/utils";

// Grid Container Component
interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  variant?:
    | "container"
    | "form"
    | "card-grid"
    | "dashboard"
    | "sidebar-content"
    | "gallery";
  className?: string;
  // Responsive props
  sm?: {
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  };
  md?: {
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  };
  lg?: {
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  };
  xl?: {
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  };
}

const GridRoot: React.FC<GridProps> = ({
  children,
  cols = 1,
  gap = 4,
  variant,
  className,
  sm,
  md,
  lg,
  xl,
}) => {
  // Variant styles
  const variantStyles = {
    container: "mx-auto max-w-7xl px-4",
    form: "space-y-0",
    "card-grid":
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
    dashboard: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
    "sidebar-content": "grid-cols-[300px_1fr] gap-6",
    gallery: "grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4",
  };

  const gridClasses = cn(
    "grid",
    // Base columns (only if no variant or variant doesn't specify columns)
    !variant && `grid-cols-${cols}`,
    // Base gap (only if no variant or variant doesn't specify gap)
    !variant && `gap-${gap}`,
    // Variant styles
    variant && variantStyles[variant],
    // Small responsive
    sm?.cols && `sm:grid-cols-${sm.cols}`,
    sm?.gap && `sm:gap-${sm.gap}`,
    // Medium responsive
    md?.cols && `md:grid-cols-${md.cols}`,
    md?.gap && `md:gap-${md.gap}`,
    // Large responsive
    lg?.cols && `lg:grid-cols-${lg.cols}`,
    lg?.gap && `lg:gap-${lg.gap}`,
    // Extra large responsive
    xl?.cols && `xl:grid-cols-${xl.cols}`,
    xl?.gap && `xl:gap-${xl.gap}`,
    className
  );

  return <div className={gridClasses}>{children}</div>;
};

// Grid Item Component
interface GridItemProps {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  end?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  variant?: "card" | "sidebar" | "content" | "form-section" | "full-width";
  className?: string;
  // Responsive props
  sm?: {
    span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    end?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
  md?: {
    span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    end?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
  lg?: {
    span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    end?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
  xl?: {
    span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    end?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
}

const GridItem: React.FC<GridItemProps> = ({
  children,
  span,
  start,
  end,
  variant,
  className,
  sm,
  md,
  lg,
  xl,
}) => {
  // Variant styles
  const variantStyles = {
    card: "rounded-lg border border-border bg-card p-6",
    sidebar: "border-r border-border bg-muted/20 p-6",
    content: "p-6",
    "form-section": "border border-border rounded-lg",
    "full-width": "col-span-full",
  };

  const itemClasses = cn(
    // Base span/positioning
    span && `col-span-${span}`,
    start && `col-start-${start}`,
    end && `col-end-${end}`,
    // Variant styles
    variant && variantStyles[variant],
    // Small responsive
    sm?.span && `sm:col-span-${sm.span}`,
    sm?.start && `sm:col-start-${sm.start}`,
    sm?.end && `sm:col-end-${sm.end}`,
    // Medium responsive
    md?.span && `md:col-span-${md.span}`,
    md?.start && `md:col-start-${md.start}`,
    md?.end && `md:col-end-${md.end}`,
    // Large responsive
    lg?.span && `lg:col-span-${lg.span}`,
    lg?.start && `lg:col-start-${lg.start}`,
    lg?.end && `lg:col-end-${lg.end}`,
    // Extra large responsive
    xl?.span && `xl:col-span-${xl.span}`,
    xl?.start && `xl:col-start-${xl.start}`,
    xl?.end && `xl:col-end-${xl.end}`,
    className
  );

  return <div className={itemClasses}>{children}</div>;
};

// Card Grid Component (for card layouts)
interface CardGridProps {
  children: React.ReactNode;
  minWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  variant?: "products" | "gallery" | "dashboard" | "list";
  className?: string;
}

const CardGrid: React.FC<CardGridProps> = ({
  children,
  minWidth = "md",
  gap = 4,
  variant,
  className,
}) => {
  const minWidthMap = {
    xs: "grid-cols-[repeat(auto-fill,minmax(200px,1fr))]",
    sm: "grid-cols-[repeat(auto-fill,minmax(250px,1fr))]",
    md: "grid-cols-[repeat(auto-fill,minmax(300px,1fr))]",
    lg: "grid-cols-[repeat(auto-fill,minmax(350px,1fr))]",
    xl: "grid-cols-[repeat(auto-fill,minmax(400px,1fr))]",
  };

  const variantStyles = {
    products: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
    gallery: "grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4",
    dashboard: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    list: "grid-cols-1 gap-4",
  };

  return (
    <div
      className={cn(
        "grid",
        variant
          ? variantStyles[variant]
          : `${minWidthMap[minWidth]} gap-${gap}`,
        className
      )}
    >
      {children}
    </div>
  );
};

// List Grid Component (for simple equal-width layouts)
interface ListGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  responsive?: boolean;
  variant?: "form-fields" | "stats" | "features";
  className?: string;
}

const ListGrid: React.FC<ListGridProps> = ({
  children,
  cols = 2,
  gap = 4,
  responsive = true,
  variant,
  className,
}) => {
  const variantStyles = {
    "form-fields": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
    stats: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
    features: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
  };

  const gridClasses = cn(
    "grid",
    variant
      ? variantStyles[variant]
      : cn(
          responsive ? "grid-cols-1" : `grid-cols-${cols}`,
          responsive && cols >= 2 && "sm:grid-cols-2",
          responsive && cols >= 3 && `md:grid-cols-${Math.min(cols, 3)}`,
          responsive && cols >= 4 && `lg:grid-cols-${cols}`,
          `gap-${gap}`
        ),
    className
  );

  return <div className={gridClasses}>{children}</div>;
};

// Section Grid Component (for content sections)
interface SectionGridProps {
  children: React.ReactNode;
  sidebar?: "left" | "right";
  sidebarWidth?: "narrow" | "normal" | "wide";
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  variant?: "main-sidebar" | "content-nav" | "form-preview";
  className?: string;
}

const SectionGrid: React.FC<SectionGridProps> = ({
  children,
  sidebar,
  sidebarWidth = "normal",
  gap = 6,
  variant,
  className,
}) => {
  const sidebarWidthMap = {
    narrow:
      sidebar === "left" ? "grid-cols-[200px_1fr]" : "grid-cols-[1fr_200px]",
    normal:
      sidebar === "left" ? "grid-cols-[250px_1fr]" : "grid-cols-[1fr_250px]",
    wide:
      sidebar === "left" ? "grid-cols-[300px_1fr]" : "grid-cols-[1fr_300px]",
  };

  const variantStyles = {
    "main-sidebar": "grid-cols-[250px_1fr] gap-6",
    "content-nav": "grid-cols-[1fr_200px] gap-4",
    "form-preview": "grid-cols-[300px_1fr] gap-0",
  };

  const gridClasses = cn(
    "grid",
    variant
      ? variantStyles[variant]
      : sidebar
        ? sidebarWidthMap[sidebarWidth]
        : "grid-cols-1",
    !variant && `gap-${gap}`,
    className
  );

  return <div className={gridClasses}>{children}</div>;
};

// Form Grid Component (specialized for forms)
interface FormGridProps {
  children: React.ReactNode;
  variant?: "two-column" | "three-column" | "four-column" | "sidebar-form";
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  className?: string;
}

const FormGrid: React.FC<FormGridProps> = ({
  children,
  variant = "four-column",
  gap = 4,
  className,
}) => {
  const variantStyles = {
    "two-column": "grid-cols-1 md:grid-cols-2",
    "three-column": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    "four-column": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    "sidebar-form": "grid-cols-[300px_1fr]",
  };

  return (
    <div
      className={cn("grid", variantStyles[variant], `gap-${gap}`, className)}
    >
      {children}
    </div>
  );
};

export const Grid = Object.assign(GridRoot, {
  Item: GridItem,
  Card: CardGrid,
  List: ListGrid,
  Section: SectionGrid,
  Form: FormGrid,
});
