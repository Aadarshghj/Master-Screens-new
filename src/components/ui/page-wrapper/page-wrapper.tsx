import React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";
import {
  pageWrapperVariants,
  pageContentVariants,
  simplePageWrapperVariants,
  simplePageContentVariants,
} from "./variant";

export interface PageWrapperProps
  extends VariantProps<typeof pageWrapperVariants> {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  contentPadding?: "none" | "sm" | "default" | "md" | "lg";
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  variant = "default",
  padding = "default",
  maxWidth = "xl",
  contentPadding = "default",
  className,
  contentClassName,
}) => {
  return (
    <div className={cn(pageWrapperVariants({ variant, padding }), className)}>
      <div
        className={cn(
          pageContentVariants({ maxWidth, contentPadding }),
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};

export const SimplePageWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}> = ({ children, className, contentClassName }) => {
  return (
    <div className={cn(simplePageWrapperVariants(), className)}>
      <div className={cn(simplePageContentVariants(), contentClassName)}>
        {children}
      </div>
    </div>
  );
};
