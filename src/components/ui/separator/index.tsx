import { cn } from "@/utils";
import React from "react";

export const Separator: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("border-border/40 border-t", className)} />
);
