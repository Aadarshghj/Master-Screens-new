import React, { useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CommonTable } from "@/components/ui/data-table";
import { Grid } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Pagination } from "@/components/ui/paginationUp";
import type { ApproverRoleMappingData } from "@/types/approval-workflow/approver-role-mapping.types";

interface ApproverRoleMappingTableProps {
  mappings: ApproverRoleMappingData[];
  onEdit: (mapping: ApproverRoleMappingData) => void;
  onDelete: (mapping: ApproverRoleMappingData) => void;
  isLoading?: boolean;
  isSearched: boolean;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  deletingMappingId?: string | null;
}

const columnHelper = createColumnHelper<ApproverRoleMappingData>();

export const ApproverRoleMappingTable: React.FC<
  ApproverRoleMappingTableProps
> = ({
  mappings,
  onEdit,
  onDelete,
  isLoading = false,
  isSearched,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  deletingMappingId,
}) => {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "siNo",
        header: "S No",
        cell: ({ row }) => (
          <span className="text-xs">{currentPage * 10 + row.index + 1}</span>
        ),
      }),
      columnHelper.accessor("roleCode", {
        header: "Role Code",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("userCode", {
        header: "User Code",
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("branchCode", {
        header: "Branch Code",
        cell: info => <span className="text-xs">{info.getValue() || "—"}</span>,
      }),
      columnHelper.accessor("regionCode", {
        header: "Region Code",
        cell: info => <span className="text-xs">{info.getValue() || "—"}</span>,
      }),
      columnHelper.accessor("clusterCode", {
        header: "Cluster Code",
        cell: info => <span className="text-xs">{info.getValue() || "—"}</span>,
      }),
      columnHelper.accessor("stateCode", {
        header: "State Code",
        cell: info => <span className="text-xs">{info.getValue() || "—"}</span>,
      }),

      columnHelper.accessor("effectiveFrom", {
        header: "Effective From",
        cell: info => {
          const value = info.getValue();
          return (
            <span className="text-xs">
              {value ? new Date(value).toLocaleDateString("en-GB") : "—"}
            </span>
          );
        },
      }),

      columnHelper.accessor("effectiveTo", {
        header: "Effective To",
        cell: info => {
          const value = info.getValue();
          return (
            <span className="text-xs">
              {value ? new Date(value).toLocaleDateString("en-GB") : "—"}
            </span>
          );
        },
      }),
      columnHelper.accessor("active", {
        header: "Status",
        cell: info => {
          const isActive = Boolean(info.getValue());
          return (
            <span
              className={`text-xs font-medium ${
                isActive ? "text-green-600" : "text-gray-600"
              }`}
            >
              {isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const mapping = row.original;
          const mappingId =
            mapping.mappingId ||
            (mapping as ApproverRoleMappingData & { identity?: string })
              .identity;
          const isDeleting = deletingMappingId === mappingId;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onEdit(mapping)}
                disabled={isDeleting}
                className="text-primary hover:bg-primary/50 h-6 w-6 p-0"
                title="Edit mapping"
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onDelete(mapping)}
                disabled={isDeleting}
                className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
                title="Delete mapping"
              >
                {isDeleting ? (
                  <div className="border-status-error h-3 w-3 animate-spin rounded-full border-b"></div>
                ) : (
                  <Trash2 className="h-3 w-3" />
                )}
              </Button>
            </div>
          );
        },
      }),
    ],
    [onEdit, onDelete, deletingMappingId, currentPage]
  );

  const table = useReactTable({
    data: mappings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const getNoDataText = () => {
    if (isLoading) {
      return "Loading approver role mappings...";
    }
    if (!isSearched) {
      return "Please filter to view results";
    }
    return "No approver role mappings found";
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
        {mappings.length > 0 && totalPages > 0 && (
          <Grid.Item className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground whitespace-nowrap">
                Showing {currentPage * 10 + 1} to{" "}
                {Math.min((currentPage + 1) * 10, totalElements)} of{" "}
                {totalElements} entries
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
          </Grid.Item>
        )}
      </Grid>
    </article>
  );
};
