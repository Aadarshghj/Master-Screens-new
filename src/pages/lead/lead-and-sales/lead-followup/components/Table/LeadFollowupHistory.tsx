import React, { useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { CommonTable } from "@/components/ui/data-table";
import { Grid } from "@/components/ui";
import type { LeadFollowupHistoryData } from "@/types/lead/lead-followup.types";
import { Pagination } from "@/components/ui/paginationUp";

interface LeadFollowupHistoryTableProps {
  history: LeadFollowupHistoryData[];
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

const columnHelper = createColumnHelper<LeadFollowupHistoryData>();

export const LeadFollowupHistoryTable: React.FC<
  LeadFollowupHistoryTableProps
> = ({
  history,
  isLoading = false,
  isError = false,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor(row => `${row.leadCode} - ${row.leadFullName}`, {
        id: "leadIdentity",
        header: "Lead ID - Name",
        cell: info => (
          <span className="text-muted-foreground">{info.getValue()}</span>
        ),
      }),

      columnHelper.accessor("staffName", {
        header: "Assigned To",
        cell: info => (
          <span className="text-muted-foreground"> {info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("leadDate", {
        header: "Lead Date",
        cell: info => (
          <span className="text-muted-foreground">
            {new Date(info.getValue()).toLocaleDateString("en-GB")}
          </span>
        ),
      }),
      columnHelper.accessor("followUpDate", {
        header: "Follow-up Date",
        cell: info => (
          <span className="text-muted-foreground">
            {new Date(info.getValue()).toLocaleDateString("en-GB")}
          </span>
        ),
      }),

      columnHelper.accessor("leadStageName", {
        header: "Lead Stage",
        cell: info => (
          <span className="text-muted-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("nextFollowUpDate", {
        header: "Next Follow-up Date",
        cell: info => (
          <span className="text-muted-foreground">
            {new Date(info.getValue()).toLocaleDateString("en-GB")}
          </span>
        ),
      }),

      columnHelper.accessor("currentFollowupType", {
        header: "Follow-up Type",
        cell: info => (
          <span className="text-muted-foreground">
            {info.getValue() || "-"}
          </span>
        ),
      }),
      columnHelper.accessor("stageChangeRemarks", {
        header: "Remarks",
        cell: info => (
          <span className="text-muted-foreground">
            {info.getValue() || "-"}
          </span>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: history,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const getNoDataMessage = () => {
    if (isLoading) {
      return "Loading history...";
    }
    if (isError) {
      return "No lead follow-up history found. Please adjust your filters and try again.";
    }
    return "No follow-up history found. Please apply filters to view data.";
  };

  return (
    <article className="mt-4">
      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            size="default"
            noDataText={getNoDataMessage()}
          />
        </Grid.Item>

        {history.length > 0 && totalPages > 0 && (
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
                  onPreviousPage={handlePreviousPage}
                  onNextPage={handleNextPage}
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
