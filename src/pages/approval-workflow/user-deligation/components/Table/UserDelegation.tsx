// components/UserDelegation/Table/UserDelegationTable.tsx

import React, { useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CommonTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/paginationUp";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type {
  UserDelegation,
  OptionType,
} from "@/types/approval-workflow/user-delegation.types";

interface UserDelegationTableProps {
  delegations: UserDelegation[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalElements: number;
  onEdit: (delegation: UserDelegation) => void;
  onDelete: (identity: string) => void;
  userOptions: OptionType[];
  moduleOptions: OptionType[];
}

const columnHelper = createColumnHelper<UserDelegation>();

export const UserDelegationTable: React.FC<UserDelegationTableProps> = ({
  delegations,

  currentPage,
  totalPages,
  onPageChange,
  totalElements,
  onEdit,
  onDelete,
  userOptions,
  moduleOptions,
}) => {
  const getUserName = (userId: string) => {
    const user = userOptions.find(opt => opt.value === userId);
    return user?.label || userId;
  };

  const getModuleName = (moduleId: string) => {
    const module = moduleOptions.find(opt => opt.value === moduleId);
    return module?.label || moduleId;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sNo",
        header: "S.No",
        cell: ({ row }) => (
          <span className="text-foreground font-medium">
            {currentPage * 10 + row.index + 1}
          </span>
        ),
      }),
      columnHelper.accessor("fromUserIdentity", {
        header: "From User",
        cell: info => {
          const delegation = info.row.original;
          const displayName =
            delegation.fromUserName || getUserName(info.getValue() || "");
          return (
            <span className="text-foreground font-medium">{displayName}</span>
          );
        },
      }),
      columnHelper.accessor("toUserIdentity", {
        header: "To User",
        cell: info => {
          const delegation = info.row.original;
          const displayName =
            delegation.toUserName || getUserName(info.getValue() || "");
          return (
            <span className="text-foreground font-medium">{displayName}</span>
          );
        },
      }),
      columnHelper.accessor("startDate", {
        header: "Start Date",
        cell: info => (
          <span className="text-foreground">{formatDate(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor("endDate", {
        header: "End Date",
        cell: info => (
          <span className="text-foreground">{formatDate(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor("moduleIdentity", {
        header: "Module",
        cell: info => (
          <span className="text-foreground">
            {getModuleName(info.getValue() || "")}
          </span>
        ),
      }),
      columnHelper.accessor("reason", {
        header: "Reason",
        cell: info => (
          <span
            className="text-foreground max-w-xs truncate"
            title={info.getValue()}
          >
            {info.getValue() || "-"}
          </span>
        ),
      }),
      columnHelper.accessor("active", {
        header: "Status",
        cell: info => (
          <Badge variant={info.getValue() ? "default" : "secondary"}>
            {info.getValue() ? "ACTIVE" : "INACTIVE"}
          </Badge>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onEdit(row.original)}
              className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() =>
                onDelete(
                  row.original.identity || row.original.userDelegationIdentity!
                )
              }
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    [currentPage, onEdit, onDelete, userOptions, moduleOptions]
  );

  const table = useReactTable({
    data: delegations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="space-y-4">
      <CommonTable
        table={table}
        size="default"
        noDataText="No user delegations found. Please add a new delegation."
        className="bg-card"
      />

      {delegations.length > 0 && totalPages > 0 && (
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground whitespace-nowrap">
            Showing {currentPage * 10 + 1} to{" "}
            {Math.min((currentPage + 1) * 10, totalElements)} of {totalElements}{" "}
            entries
          </div>
          <div className="flex items-center gap-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onPreviousPage={() => {
                if (currentPage > 0) {
                  onPageChange(currentPage - 1);
                }
              }}
              onNextPage={() => {
                if (currentPage < totalPages - 1) {
                  onPageChange(currentPage + 1);
                }
              }}
              canPreviousPage={currentPage > 0}
              canNextPage={currentPage < totalPages - 1}
              maxVisiblePages={5}
            />
          </div>
        </div>
      )}
    </div>
  );
};
