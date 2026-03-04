import React from "react";
import { cn } from "@/utils";

interface HeaderWrapperProps {
  className?: string;
  children?: React.ReactNode;
}

export const HeaderWrapper: React.FC<HeaderWrapperProps> = ({
  className = "",
  children,
}) => {
  return (
    <header className={cn("flex items-center justify-between", className)}>
      {children}
    </header>
  );
};
