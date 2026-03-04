import React from "react";
// import { cn } from "@/utils";

interface KanbanColumnProps {
  title: string;
  icon?: React.ReactNode;
  count?: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerRight?: React.ReactNode;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  icon,
  count,
  children,
  footer,
  headerRight,
}) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:col-span-4">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {icon}
          {title}
        </div>

        <div className="flex items-center gap-2">
          {count !== undefined && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
              {count}
            </span>
          )}
          {headerRight}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/30 p-3">
        {children}
      </div>

      {footer && (
        <div className="border-t border-slate-200 bg-white p-3">{footer}</div>
      )}
    </div>
  );
};
