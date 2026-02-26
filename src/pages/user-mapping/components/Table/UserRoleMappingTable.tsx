import React from "react";
import { Search, AlertCircle } from "lucide-react";
import { CommonTable } from "@/components";
import type {
  UserProfile,
  AssignedRole,
} from "@/types/user-role-mapping/user-mapping";
import { useUserRoleMappingTable } from "../Hooks/useUserRoleMappingTable.tsx";

interface UserRoleMappingTableProps {
  users: UserProfile[];
  assignments: Record<string, AssignedRole[]>;
  onManageUser: (userId: string) => void;
}

export const UserRoleMappingTable: React.FC<UserRoleMappingTableProps> = ({
  users,
  assignments,
  onManageUser,
}) => {
  const { table, globalFilter, setGlobalFilter, isEmpty } =
    useUserRoleMappingTable({
      users,
      assignments,
      onManageUser,
    });

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 bg-white p-3">
        <h3 className="text-sm font-semibold text-slate-700">
          User Roles Overview
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

      <div className="relative min-h-0 flex-1 overflow-auto p-3">
        <CommonTable
          table={table}
          noDataText=""
          className="h-full w-full border-none"
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
