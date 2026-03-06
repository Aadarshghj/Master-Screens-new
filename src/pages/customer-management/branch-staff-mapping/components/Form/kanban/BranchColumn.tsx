import React from "react";
import { Briefcase, Check } from "lucide-react";
import { KanbanColumn } from "@/components/ui/kanban/KanbanColumn";
import { cn } from "@/utils";
import type { Branch, AssignedStaff } from "@/types/customer-management/branch-staff";
import { useGetAssignedStaffQuery } from "@/global/service/end-points/customer-management/branch-staff-mapping";

interface BranchColumnProps {
  branch: Branch[];
  selectedBranchId: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onBranchSelect: (id: string) => void;
  branchAssignments: Record<string, AssignedStaff[]>; 
}

export const BranchColumn: React.FC<BranchColumnProps> = ({
  branch,
  selectedBranchId,
  searchQuery,
  onSearchChange,
  onBranchSelect,
  branchAssignments,
}) => {
  return (
    <KanbanColumn
      title="Branch"
      icon={<Briefcase size={18} className="text-blue-600" />}
      count={branch.length}
    >
      <input
        type="text"
        placeholder="Search Branch..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mb-3 w-full rounded border border-slate-200 bg-white p-2 text-xs"
      />

      {branch.length === 0 ? (
        <div className="text-xs text-slate-400 text-center mt-4">
          No branches found
        </div>
      ) : (
        branch.map((item) => (
          <BranchItem
            key={item.id}
            item={item}
            selectedBranchId={selectedBranchId}
            onBranchSelect={onBranchSelect}
            branchAssignments={branchAssignments} 
          />
        ))
      )}
    </KanbanColumn>
  );
};

interface BranchItemProps {
  item: Branch;
  selectedBranchId: string;
  onBranchSelect: (id: string) => void;
  branchAssignments: Record<string, AssignedStaff[]>; 
}

const BranchItem: React.FC<BranchItemProps> = ({
  item,
  selectedBranchId,
  onBranchSelect,
  branchAssignments,
}) => {
  
  const { data: branchStaff = [] } = useGetAssignedStaffQuery(item.id);

  
  const allStaff: AssignedStaff[] = [
    ...branchStaff,
    ...(branchAssignments[item.id] || []),
  ];

  const activeCount = allStaff.filter((r) => r.status === "Active").length;
  const pendingCount = allStaff.filter((r) => r.status === "Pending").length;

  const isSelected = selectedBranchId === item.id;

  return (
    <div
      onClick={() => onBranchSelect(item.id)}
      className={cn(
        "group relative mb-1.5 cursor-pointer rounded-lg border p-2 transition-all hover:shadow-sm",
        isSelected
          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500/20"
          : "border-slate-200 bg-white hover:border-blue-300"
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className="relative shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-sm">
            {item.branchName?.charAt(0)?.toUpperCase()}
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
  {item.branchName}
  
</h4>
          <p className="truncate text-[10px] text-slate-400">
            {item.branchCode || "No Code"}
          </p>
          <p className="truncate text-[10px] text-slate-400">
            {item.adminUnitTypeName}
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
};