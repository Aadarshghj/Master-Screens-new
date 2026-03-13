import React, { useMemo, useState } from "react";
import { Briefcase, Check } from "lucide-react";
import { KanbanColumn } from "@/components/ui/kanban/KanbanColumn";
import { cn } from "@/utils";
import { Select} from "@/components/ui";
import type { Branch, AssignedStaff } from "@/types/customer-management/branch-staff";

interface BranchColumnProps {
  branch: Branch[];
  selectedBranchId: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onBranchSelect: (id: string) => void;
  branchAssignments: Record<string, AssignedStaff[]>;
  branchStaffMap: Record<string, AssignedStaff[]>;
}

export const BranchColumn: React.FC<BranchColumnProps> = ({
  branch,
  selectedBranchId,
  searchQuery,
  onSearchChange,
  onBranchSelect,
  branchAssignments,
  branchStaffMap,
}) => {
  const [sortOrder, setSortOrder] = useState<""|"none" | "asc" | "desc">("");

  const sortedBranches = useMemo(() => {
  if (sortOrder === "" || sortOrder === "none") {
    return branch
  }

  const sorted = [...branch].sort((a, b) =>
    a.branchName.localeCompare(b.branchName)
  )

  return sortOrder === "asc" ? sorted : sorted.reverse()
}, [branch, sortOrder])

  return (
    <KanbanColumn
      title="Branch"
      icon={<Briefcase size={18} className="text-blue-600" />}
      count={sortedBranches.length}
    >
      <div className="mb-3 flex gap-2 overflow-hidden">
         <input
    placeholder="Search Branch..."
    value={searchQuery}
    onChange={(e) => onSearchChange(e.target.value)}
    className="flex-[6] rounded border border-slate-200 bg-white p-2 text-xs "
  />

         <Select
  value={sortOrder}
  onValueChange={(value) =>
    setSortOrder(value as "" | "none" | "asc" | "desc")
  }
  options={[
    { label: "None", value: "none" },
    { label: "A-Z", value: "asc" },
    { label: "Z-A", value: "desc" },
  ]}
  placeholder="Sort By"
  size="form"
  triggerClassName="w-[110px] flex-none text-xs focus:outline-none"
/>
      </div>

      {sortedBranches.length === 0 ? (
        <div className="text-xs text-slate-400 text-center mt-4">
          No branches found
        </div>
      ) : (
        sortedBranches.map((item) => (
          <BranchItem
            key={item.identity}
            item={item}
            selectedBranchId={selectedBranchId}
            onBranchSelect={onBranchSelect}
            branchAssignments={branchAssignments}
            branchStaffMap={branchStaffMap}
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
  branchStaffMap: Record<string, AssignedStaff[]>;
}

const BranchItem: React.FC<BranchItemProps> = ({
  item,
  selectedBranchId,
  onBranchSelect,
  branchAssignments,
  branchStaffMap,
}) => {
  const backendStaff = branchStaffMap[item.identity] || [];
  const localStaff = branchAssignments[item.identity] || [];

  const allStaff: AssignedStaff[] = [...backendStaff, ...localStaff];

  const activeCount = allStaff.filter((r) => r.status === "Active").length;
  const pendingCount = allStaff.filter((r) => r.status === "Pending").length;

  const isSelected = selectedBranchId === item.identity;

  return (
    <div
      onClick={() => onBranchSelect(item.identity)}
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
            {item.branchCode} - {item.adminUnitTypeName}
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