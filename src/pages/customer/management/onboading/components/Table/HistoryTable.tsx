import React from "react";
import type { HistoryTableProps } from "@/types/customer/shared.types";

export const HistoryTable: React.FC<HistoryTableProps> = () => {
  return (
    <div className="border-border bg-card rounded border p-2">
      <div className="flex w-full justify-center">
        <p className="text-primary ml-2 text-xs font-medium">
          Customer has provided updated PAN card, use it instead of Form 60
        </p>
      </div>
    </div>
  );
};
