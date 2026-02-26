import { useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import type {
  UserProfile,
  AssignedRole,
} from "@/types/user-role-mapping/user-mapping";

interface UseUserRoleMappingTableProps {
  users: UserProfile[];
  assignments: Record<string, AssignedRole[]>;
  onManageUser: (userId: string) => void;
}

const columnHelper = createColumnHelper<UserProfile>();

export const useUserRoleMappingTable = ({
  users,
  assignments,
  onManageUser,
}: UseUserRoleMappingTableProps) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const activeUsersForTable = useMemo(() => {
    return users.filter(user => {
      const userRoles = assignments[user.id] || assignments[user.empId] || [];
      return userRoles.some(role => role.status === "Active");
    });
  }, [users, assignments]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "Sl No.",
        cell: info => info.row.index + 1,
        size: 60,
      }),
      columnHelper.accessor("name", {
        header: "User Name",
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
          const userRoles =
            assignments[row.original.id] ||
            assignments[row.original.empId] ||
            [];
          const activeRoles = userRoles.filter(r => r.status === "Active");

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
            onClick={() => onManageUser(row.original.id)}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Manage Roles
          </button>
        ),
      }),
    ],
    [assignments, onManageUser]
  );

  const table = useReactTable({
    data: activeUsersForTable,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const isEmpty = activeUsersForTable.length === 0;

  return {
    table,
    globalFilter,
    setGlobalFilter,
    isEmpty,
  };
};
