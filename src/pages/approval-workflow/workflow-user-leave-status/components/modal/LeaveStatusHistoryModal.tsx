import { Modal } from "@/components/ui/modal/modal";
import { DynamicSearchForm } from "@/components/filterDataView/DynamicSearchForm";
import type { FieldProps } from "@/components/filterDataView/DynamicSearchForm";
import { DynamicSearchResultsTable } from "@/components/filterDataView/DynamicSearchResultsTable";
import type { TableColumnConfig } from "@/components/filterDataView/DynamicSearchResultsTable";
import { Pagination } from "@/components/ui/paginationUp";
import type {
  ImportHistoryDataLeaveStatus,
  UserLeaveStatusImportHistoryModalProps,
  UserLeaveStatusImportHistorySearchForm,
} from "@/types/approval-workflow/user-leave-status.types";
import { useLeaveStatusHistory } from "../../hooks/useLeaveStatusHistory";
import { LeaveStatusHistoryDetailView } from "./LeaveStatusHistoryDetailView";

export function LeaveStatusHistoryModal({
  isOpen,
  onClose,
}: UserLeaveStatusImportHistoryModalProps) {
  const {
    searchResults,
    isSearched,
    selectedBatchIdDisplay,
    selectedUploadedBy,
    currentPage,
    pageSize,
    totalPages,
    totalElements,
    selectedBatchId,
    detailsModalType,
    isSearching,
    userOptions,
    handleSearch,
    handleReset,
    handleOpenDetailsModal,
    handleCloseDetailsModal,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
  } = useLeaveStatusHistory({ isOpen });

  const searchFields: FieldProps<UserLeaveStatusImportHistorySearchForm>[] = [
    {
      name: "uploadedBy",
      label: "Uploaded By",
      placeholder: "Select User",
      fieldType: "select",
      options: [{ value: "all", label: "All" }, ...userOptions],
      colSpan: { lg: 2, md: 6, span: 12 },
    },
    {
      name: "createdDate",
      label: "Uploaded Date",
      placeholder: "Select Date",
      fieldType: "date",
      colSpan: { lg: 2, md: 6, span: 12 },
    },
  ];

  const tableColumns: TableColumnConfig<ImportHistoryDataLeaveStatus>[] = [
    {
      accessorKey: "batchName",
      header: "Batch ID",
      cell: value => (
        <span className="text-xs font-medium">{String(value)}</span>
      ),
    },
    {
      accessorKey: "uploadedByName",
      header: "Uploaded By",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "uploadedDate",
      header: "Uploaded Date",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "uploadedTime",
      header: "Uploaded Time",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "totalRecords",
      header: "Total Row Count",
      cell: value => <span className="text-xs">{String(value)}</span>,
    },
    {
      accessorKey: "processedRecords",
      header: "Completed",
      cell: (value, row) => (
        <button
          onClick={() =>
            handleOpenDetailsModal(
              row.batchIdentity,
              row.batchName,
              row.uploadedBy,
              "success"
            )
          }
          className="cursor-pointer text-xs font-medium text-green-600 hover:text-green-800 hover:underline"
        >
          {String(value)}
        </button>
      ),
    },
    {
      accessorKey: "erroredRecords",
      header: "Failure",
      cell: (value, row) => (
        <button
          onClick={() =>
            handleOpenDetailsModal(
              row.batchIdentity,
              row.batchName,
              row.uploadedBy,
              "error"
            )
          }
          className="cursor-pointer text-xs font-medium text-red-600 hover:text-red-800 hover:underline"
        >
          {String(value)}
        </button>
      ),
    },
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        close={onClose}
        width="3xl"
        isClosable={true}
        compact={true}
        maxHeight="90vh"
        className="mx-4 w-full"
        title="User leave status Import History"
        titleVariant="default"
        closeIconClassName="h-4 w-4"
      >
        <div className="space-y-4">
          <DynamicSearchForm<UserLeaveStatusImportHistorySearchForm>
            fields={searchFields}
            onSubmit={handleSearch}
            onReset={handleReset}
            isLoading={isSearching}
            theme="primary"
            defaultValues={{
              uploadedBy: "",
              createdDate: "",
            }}
            actionButtons={{
              type: "submit",
              submitIcon: "filter",
              submitText: "Filter",
              showResetIcon: false,
            }}
            inlineAlignment
          />

          <DynamicSearchResultsTable<ImportHistoryDataLeaveStatus>
            data={searchResults}
            columns={tableColumns}
            title=""
            isSearched={isSearched}
            noDataText="No import history found"
            searchPromptText="Loading import history..."
          />

          {searchResults.length > 0 && totalPages > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="text-muted-foreground whitespace-nowrap">
                Showing {currentPage * pageSize + 1} to{" "}
                {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
                {totalElements} entries
              </div>
              <div className="flex items-center gap-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  onPreviousPage={handlePreviousPage}
                  onNextPage={handleNextPage}
                  canPreviousPage={currentPage > 0}
                  canNextPage={currentPage < totalPages - 1}
                  maxVisiblePages={5}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>

      {detailsModalType && (
        <LeaveStatusHistoryDetailView
          isOpen={!!detailsModalType}
          onClose={handleCloseDetailsModal}
          batchIdentity={selectedBatchId}
          batchId={selectedBatchIdDisplay}
          uploadedBy={selectedUploadedBy}
          type={detailsModalType}
          userOptions={userOptions}
        />
      )}
    </>
  );
}
