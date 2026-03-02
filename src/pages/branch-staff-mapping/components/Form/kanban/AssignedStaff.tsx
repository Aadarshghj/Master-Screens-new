import React from "react";
import { Shield, Trash2, Save, Clock, X, Loader2 } from "lucide-react";
import { KanbanColumn } from "@/components/ui/kanban/KanbanColumn";
import { cn } from "@/utils";
import type { AssignedStaff } from "@/types/branch-staff-mapping/branch-staff";

interface Props {
  staff: AssignedStaff[];
  pendingCount: number;
  onRemove: (staff: AssignedStaff) => void;
  onClear: () => void;
  onSave: () => void;
  isLoading?: boolean;
}

export const AssignedColumn: React.FC<Props> = ({
  staff,
  pendingCount,
  onRemove,
  onClear,
  onSave,
  isLoading,
}) => {
  return (
    <>
      <KanbanColumn
        title="Assigned Staffs"
        icon={<Shield size={18} className="text-green-500" />}
        count={staff.length}
        footer={
          <div className="flex justify-end gap-3 border-t border-slate-200 bg-white p-2">
            <button
              onClick={onClear}
              disabled={pendingCount === 0}
              className={cn(
                "flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-bold text-red-600 shadow-sm transition-all hover:bg-red-100",
                pendingCount === 0 &&
                  "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-50"
              )}
            >
              <Trash2 size={11} /> Clear
            </button>

            <button
              onClick={onSave}
              disabled={pendingCount === 0}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md transition-all",
                pendingCount > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-slate-300"
              )}
            >
              <Save size={12} /> Save {pendingCount > 0 && `(${pendingCount})`}
            </button>
          </div>
        }
      >
        {isLoading ? (
          <div className="flex h-40 flex-col items-center justify-center text-sm text-slate-400">
            <Loader2 size={30} className="animate-spin text-blue-500" />
            <p className="mt-2 text-xs">Fetching assigned staffs...</p>
          </div>
        ) : staff.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-sm text-slate-400">
            <Shield size={30} className="mb-2 opacity-20" />
            No staffs assigned
          </div>
        ) : (
          staff.map((item) => {
            const isPending = item.status === "Pending";

            return (
              <div
                key={item.identity}
                className={cn(
                  "relative mb-3 rounded-lg border p-3 transition-all duration-200",
                  isPending
                    ? "border-orange-200 bg-orange-100"
                    : "border-green-200 bg-green-100"
                )}
              >
               
                <button
                  onClick={() => onRemove(item)}
                  className="absolute right-2 top-2 rounded-full p-1 text-slate-500 hover:bg-red-100 hover:text-red-600"
                >
                  <X size={12} strokeWidth={3} />
                </button>

               
                <div className="mb-1 flex items-center gap-2">
                  <Shield
                    size={12}
                    className={isPending ? "text-orange-700" : "text-green-700"}
                  />
                  <span
                    className={cn(
                      "text-[11px] font-semibold",
                      isPending ? "text-orange-800" : "text-green-800"
                    )}
                  >
                    {item.staffName}
                  </span>

                  {isPending && (
                    <span className="ml-2 flex items-center gap-1 text-[10px] font-medium text-orange-700">
                      <Clock size={10} /> (Pending)
                    </span>
                  )}

                  {!isPending && (
                    <span className="ml-2 text-[10px] font-medium text-green-700">
                      (Active)
                    </span>
                  )}
                </div>

                <p
                  className={cn(
                    "text-[10px]",
                    isPending ? "text-orange-600" : "text-green-700"
                  )}
                >
                  Branch: {item.branchName}
                </p>

                <div className="mt-2">
                  <button
                    onClick={() => onRemove(item)}
                    className="rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </KanbanColumn>
    </>
  );
};