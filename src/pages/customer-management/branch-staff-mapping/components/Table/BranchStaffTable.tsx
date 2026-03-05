import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { CommonTable } from "@/components";
import type { Branch, AssignedStaff } from "@/types/customer-management/branch-staff";

interface BranchStaffMappingTableProps {
  branches: Branch[];
  branchAssignments: Record<string, AssignedStaff[]>;
  onManageBranch: (branchId: string) => void;
}

const columnHelper = createColumnHelper<Branch>();

export const BranchStaffMappingTable: React.FC<BranchStaffMappingTableProps> = ({
  branches,
  branchAssignments,
  onManageBranch,
}) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const activeBranches = useMemo(
    () => branches.filter((b) => (branchAssignments[b.id] || []).length > 0),
    [branches, branchAssignments]
  );

  const filteredBranches = useMemo(() => {
    if (!globalFilter) return activeBranches;

    const lower = globalFilter.toLowerCase();
    return activeBranches.filter((branch) => {
      const branchMatch =
        branch.branchName.toLowerCase().includes(lower) ||
        branch.branchCode?.toLowerCase().includes(lower);

      const staffMatch = (branchAssignments[branch.id] || []).some(
        (member) =>
          member.staffName.toLowerCase().includes(lower) ||
          member.staffCode.toLowerCase().includes(lower)
      );

      return branchMatch || staffMatch;
    });
  }, [globalFilter, activeBranches, branchAssignments]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "Sl No.",
        cell: (info) => info.row.index + 1,
        size: 60,
      }),
      columnHelper.accessor("branchName", { header: "Branch" }),
      columnHelper.display({
        id: "assignedStaff",
        header: "Assigned Staff",
        cell: ({ row }) => {
          const staff = branchAssignments[row.original.id] || [];
          return (
            <div className="flex flex-wrap gap-1.5">
              {staff.map((member) => (
                <span
                  key={member.identity}
                  className="inline-flex items-center rounded border border-blue-100 bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700"
                >
                <div className="flex items-center gap-1 text-[10px] font-medium text-blue-700">
             <span>{member.staffName}</span>
               {member.staffCode && <span>- {member.staffCode}</span>}
              </div>
                </span>
              ))}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <button
            onClick={() => onManageBranch(row.original.id)}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Manage Staff
          </button>
        ),
      }),
    ],
    [branchAssignments, onManageBranch]
  );

  const table = useReactTable({
    data: filteredBranches,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isEmpty = filteredBranches.length === 0;

  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 bg-white p-3">
        <h3 className="text-sm font-semibold text-slate-700">Branch Staff Overview</h3>
        <div className="relative w-64">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search branch or staff..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full rounded border border-slate-200 bg-slate-50 py-1.5 pr-4 pl-9 text-xs outline-none focus:border-blue-400"
          />
        </div>
      </div>

      <div className="relative p-7">
        <CommonTable table={table} noDataText="" className="h-full border-none" size="default" />
        {isEmpty && (
          <div className="py-10 text-center text-xs font-medium text-slate-500">
            No branch staff overview found.
          </div>
        )}
      </div>
    </div>
  );
};