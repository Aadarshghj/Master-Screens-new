import React, { useMemo, useState } from "react";
import { Search, AlertCircle } from "lucide-react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { CommonTable } from "@/components";
import type { DesignationProfile, AssignedRole } from "../../constants";

interface DesignationRoleMappingTableProps {
  designations: DesignationProfile[];
  designationAssignments: Record<string, AssignedRole[]>;
  onManageDesignation: (designationId: string) => void;
}

const columnHelper = createColumnHelper<DesignationProfile>();

export const DesignationRoleMappingTable: React.FC<
  DesignationRoleMappingTableProps
> = ({ designations, designationAssignments, onManageDesignation }) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const activeDesignationsForTable = useMemo(() => {
    return designations.filter(designation => {
      const roles = designationAssignments[designation.id] || [];
      return roles.some(role => role.status === "Active");
    });
  }, [designations, designationAssignments]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "Sl No.",
        cell: info => info.row.index + 1,
        size: 60,
      }),
      columnHelper.accessor("name", {
        header: "Designation",
        cell: info => (
          <span className="text-xs font-medium text-slate-700">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "activeRoles",
        header: "Assigned Roles",
        cell: ({ row }) => {
          const roles = designationAssignments[row.original.id] || [];
          const activeRoles = roles.filter(r => r.status === "Active");

          return (
            <div className="flex flex-wrap gap-1.5">
              {activeRoles.map(role => (
                <span
                  key={role.id}
                  className="inline-flex items-center rounded border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700"
                >
                  {role.title}
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
            onClick={() => onManageDesignation(row.original.id)}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Manage Roles
          </button>
        ),
      }),
    ],
    [designationAssignments, onManageDesignation]
  );

  const table = useReactTable({
    data: activeDesignationsForTable,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  const isEmpty = activeDesignationsForTable.length === 0;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 bg-white p-3">
        <h3 className="text-sm font-semibold text-slate-700">
          Designation Roles Overview
        </h3>

        <div className="relative w-64">
          <Search
            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            size={14}
          />
          <input
            type="text"
            placeholder="Search table..."
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-full rounded border border-slate-200 bg-slate-50 py-1.5 pr-4 pl-9 text-xs outline-none focus:border-blue-400"
          />
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden p-3">
        <CommonTable
          table={table}
          noDataText=""
          className="h-full border-none"
          size="default"
        />

        {isEmpty && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-white/50">
            <div className="max-w-sm rounded-lg border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
              <AlertCircle className="mx-auto mb-2 h-5 w-5 text-slate-400" />
              <strong>No active designations found.</strong>
              <br />
              Assign roles in the "Assignment View" to populate this table.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
