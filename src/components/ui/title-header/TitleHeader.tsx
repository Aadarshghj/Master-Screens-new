import React from "react";
import { cn } from "@/utils";

interface TitleHeaderProps {
  title: string;
  className?: string;
  variant?: "default" | "large" | "small";
  as?: "div" | "p" | "span" | "h1" | "h3" | "h4" | "h5" | "h6";
}

export const TitleHeader: React.FC<TitleHeaderProps> = ({
  title,
  className = "",
  variant = "default",
  as: Component = "div",
}) => {
  const variantClasses = {
    default: "text-sm font-semibold text-blue-950",
    large: "text-xl font-bold text-reset/80",
    small: "text-base font-medium text-reset/80",
  };

  return (
    <Component
      className={cn("kyc-form-title", variantClasses[variant], className)}
    >
      {title}
    </Component>
  );
};
