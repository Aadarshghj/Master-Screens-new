import React from "react";
import { CommonTable } from "@/components/ui/data-table";
import { Grid } from "@/components/ui";
import { Pagination } from "@/components/ui/paginationUp";
import type { AprovalQueueResponse } from "@/types/approval-workflow/approval-queue.types";
import { ApprovalQueueViewModal } from "../modal/ApprovalQueueViewModal";
import { useApprovalQueueTable } from "../../hooks/useApprovalQueueTable";

interface TableProps {
  page: number;
  size: number;
  handlePageChange: (newPage: number) => void;
  data: AprovalQueueResponse | undefined;
  isLoading: boolean;
}

export const ApprovalQueueTable: React.FC<TableProps> = ({
  page,
  size,
  handlePageChange,
  data,
  isLoading,
}) => {
  const {
    identity,
    moduleCode,
    showApprovalView,
    tableData,
    totalPages,
    totalElements,
    currentPage,
    table,
    handleClose,
    getNoDataText,
  } = useApprovalQueueTable({ page, size, data, isLoading });
  return (
    <article className="mt-4">
      <ApprovalQueueViewModal
        isOpen={showApprovalView}
        onClose={handleClose}
        identity={identity}
        moduleCode={moduleCode}
        readOnly
      />
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
