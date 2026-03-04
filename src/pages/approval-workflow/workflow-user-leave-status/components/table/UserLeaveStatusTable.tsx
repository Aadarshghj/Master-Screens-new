import React, { useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CommonTable } from "@/components/ui/data-table";
import { Grid } from "@/components/ui";
import { Pencil, Trash2 } from "lucide-react";
import { Pagination } from "@/components/ui/paginationUp";
import type {
  UserLeaveStatusData,
  UserLeaveStatusTableProps,
} from "@/types/approval-workflow/user-leave-status.types";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

const columnHelper = createColumnHelper<UserLeaveStatusData>();

export const UserLeaveStatusTable: React.FC<UserLeaveStatusTableProps> = ({
  page,
  size,
  handlePageChange,
  data,
  isLoading,
  handleDelete,
  onEdit,
}) => {
  const tableData = data?.content || [];
  const currentPage = data?.pageable.pageNumber ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "slNo",
        header: "S.No",
        cell: ({ row }) => (
          <span className="text-xs font-medium">
            {page * size + row.index + 1}
          </span>
        ),
      }),
      columnHelper.accessor("branchCode", {
        header: "Branch Code",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("userCode", {
        header: "User Code",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),

      columnHelper.accessor("leaveFrom", {
        header: "Leave From",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("leaveTo", {
        header: "Leave To",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),

      columnHelper.accessor("delegateUserCode", {
        header: "Delegate User",
        cell: info => <span className="text-xs">{info.getValue() ?? "-"}</span>,
      }),
      columnHelper.accessor("remarks", {
        header: "Remarks",
        cell: info => <span className="text-xs">{info.getValue() ?? "-"}</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const editItem = row.original;
          const item = row.original.identity;

          return (
            <div className="flex items-center gap-2">
              <NeumorphicButton
                variant="none"
                onClick={() => onEdit(editItem)}
                className="text-primary hover:bg-primary/50 h-6 w-6  p-0"
              >
                <Pencil size={13} />
              </NeumorphicButton>

              <NeumorphicButton
                variant="none"
                onClick={() => handleDelete(item)}
                className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
              >
                <Trash2 size={13} />
              </NeumorphicButton>
            </div>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const getNoDataText = () => {
    if (isLoading) {
      return "Loading user leave status...";
    }
    return "No  user leave status found";
  };

  return (
    <article className="mt-4">
      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            size="default"
            noDataText={getNoDataText()}
            className="bg-card"
          />
        </Grid.Item>
        {tableData.length > 0 && totalPages > 0 && (
          <Grid.Item className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground whitespace-nowrap">
                Showing {currentPage * 10 + 1} to{" "}
                {Math.min((currentPage + 1) * 10, totalElements)} of{" "}
                {totalElements} entries
              </div>
              <div className="flex items-center gap-3">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  onPreviousPage={() => {
                    if (page > 0) {
                      handlePageChange(page - 1);
                    }
                  }}
                  onNextPage={() => {
                    if (page < totalPages - 1) {
                      handlePageChange(page + 1);
                    }
                  }}
                  canPreviousPage={page > 0}
                  canNextPage={page < totalPages - 1}
                />
              </div>
            </div>
          </Grid.Item>
        )}
      </Grid>
    </article>
  );
};
