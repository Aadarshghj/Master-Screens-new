import React from "react";
import { Shield, Plus } from "lucide-react";
import { KanbanColumn } from "@/components/ui/kanban/KanbanColumn";
import { cn } from "@/utils";
import type { AvailableStaff } from "@/types/customer-management/branch-staff";

interface Props {
  staff: AvailableStaff[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onMove: (staff: AvailableStaff) => void;
  isLoading?: boolean; 
  isBranchSelected: boolean;
}

export const AvailableColumn: React.FC<Props> = ({
  staff,
  searchQuery,
  onSearchChange,
  onMove,
  isLoading = false,
  isBranchSelected,
  
}) => {
  return (
    <KanbanColumn
      title="Available Staffs"
      icon={<Shield size={18} className="text-slate-400" />}
      count={staff.length}
    >
      <input
        type="text"
        placeholder="Search available staff..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mb-3 w-full rounded border border-slate-200 bg-white p-2 text-xs"
      />

      {isLoading ? (
        <div className="text-center text-slate-400 text-xs mt-4">
          Loading available staff...
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center text-slate-400 text-xs mt-4">
          No available staff found
        </div>
      ) : (
        staff.map((item) => (
          <div
            key={item.id}
            className="group mb-2 rounded-lg border border-slate-100 bg-white p-3 transition-all hover:border-blue-400 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <Shield size={14} className="shrink-0 text-gray-400" />
                  <h4 className="truncate text-[10px] font-bold text-slate-700 group-hover:text-blue-700">
                    {item.staffName}
                  </h4>
                </div>
                <p className="truncate text-[10px] leading-tight text-slate-400">
                  Staff Code: {item.staffCode}
                </p>
              </div>

             <button
  onClick={() => onMove(item)}
  disabled={!isBranchSelected}
  // title="Select branch"
  className={cn(
    "flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold whitespace-nowrap shadow-sm transition-all",
    !isBranchSelected
      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
  )}
>
  <Plus size={10} strokeWidth={3} />
  Add
</button>
            </div>
          </div>
        ))
      )}
    </KanbanColumn>
  );
};