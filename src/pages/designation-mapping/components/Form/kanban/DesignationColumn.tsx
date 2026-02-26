import React from "react";
import { Briefcase, Check } from "lucide-react";
import { KanbanColumn } from "@/components/ui/kanban/KanbanColumn";
import { cn } from "@/utils";
import type { DesignationProfile, AssignedRole } from "../../../constants";

interface Props {
  designations: DesignationProfile[];
  assignments: Record<string, AssignedRole[]>;
  selectedDesignationId: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onDesignationSelect: (id: string) => void;
}

export const DesignationsColumn: React.FC<Props> = ({
  designations,
  assignments,
  selectedDesignationId,
  searchQuery,
  onSearchChange,
  onDesignationSelect,
}) => {
  return (
    <KanbanColumn
      title="Designation"
      icon={<Briefcase size={18} className="text-blue-600" />}
      count={designations.length}
    >
      <input
        type="text"
        placeholder="Search Designation..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        className="mb-3 w-full rounded border border-slate-200 bg-white p-2 text-xs"
      />

      {designations.map(designation => {
        const designationRoles = assignments[designation.id] || [];
        const activeCount = designationRoles.filter(
          r => r.status === "Active"
        ).length;
        const pendingCount = designationRoles.filter(
          r => r.status === "Pending"
        ).length;

        const isSelected = selectedDesignationId === designation.id;

        return (
          <div
            key={designation.id}
            onClick={() => onDesignationSelect(designation.id)}
            className={cn(
              "group relative mb-1.5 cursor-pointer rounded-lg border p-2 transition-all hover:shadow-sm",
              isSelected
                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500/20"
                : "border-slate-200 bg-white hover:border-blue-300"
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm",
                    designation.color
                  )}
                >
                  {designation.initial}
                </div>

                {activeCount > 0 && (
                  <div className="absolute -top-1 -left-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white bg-green-500 text-[8px] font-bold text-white">
                    {activeCount}
                  </div>
                )}

                {pendingCount > 0 && (
                  <div className="absolute top-3 -left-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white bg-orange-500 text-[8px] font-bold text-white">
                    {pendingCount}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-xs font-medium text-slate-800">
                  {designation.name}
                </h4>
                <p className="truncate text-[10px] text-slate-400">
                  {designation.department || "No Department"}
                </p>
              </div>

              {isSelected && (
                <div className="text-blue-600">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </KanbanColumn>
  );
};
