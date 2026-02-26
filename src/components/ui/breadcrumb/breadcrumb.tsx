import * as React from "react";
import { ChevronRight } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";
import {
  breadcrumbVariants,
  breadcrumbItemVariants,
  breadcrumbLinkVariants,
  breadcrumbSeparatorVariants,
} from "./variants";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface BreadcrumbProps
  extends VariantProps<typeof breadcrumbVariants> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  variant = "default",
  size = "default",
  separator = <ChevronRight />,
  className,
}) => {
  const spacingClass =
    size === "xs"
      ? "space-x-0.5"
      : size === "sm"
        ? "space-x-1"
        : size === "default"
          ? "space-x-1"
          : "space-x-2";
  const separatorSpacing =
    size === "xs" ? "mx-1" : size === "sm" ? "mx-1" : "mx-2";

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(breadcrumbVariants({ variant, size }), className)}
    >
      <ol className={cn("flex flex-wrap items-center", spacingClass)}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isActive = item.active || isLast;

          return (
            <li key={index} className="mx-0 flex items-center pb-1">
              {item.href || item.onClick ? (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className={cn(
                    breadcrumbLinkVariants({ variant }),
                    isActive && "text-foreground cursor-default font-medium"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    breadcrumbItemVariants({ variant, active: isActive })
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span
                  className={cn(
                    breadcrumbSeparatorVariants({ variant, size }),
                    separatorSpacing
                  )}
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export { Breadcrumb };
