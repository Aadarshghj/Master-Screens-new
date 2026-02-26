import { Modal } from "@/components/ui/modal/modal";
import { DynamicSearchForm } from "@/components/filterDataView/DynamicSearchForm";
import { DynamicSearchResultsTable } from "@/components/filterDataView/DynamicSearchResultsTable";
import type { UserLeaveStatusImportModalProps } from "@/types/approval-workflow/user-leave-status.types";
import { leaveStatusHistoryInputFields } from "../../constants/form.constants";
import { useLeaveStatusHistoryDetail } from "../../hooks/useLeaveStatusHistoryDetail";
import { useLeaveStatusTableColumns } from "../../hooks/useLeaveStatusTableColumns";

export function LeaveStatusHistoryDetailView({
  isOpen,
  onClose,
  batchIdentity,
  batchId,
  uploadedBy,
  type,
  userOptions,
}: UserLeaveStatusImportModalProps) {
  const {
    searchResults,
    isSearched,
    displayBatchId,
    uploadedByName,
    isLoadingBatchDetails,
    modalTitle,
    theme,
    handleSearch,
    handleReset,
  } = useLeaveStatusHistoryDetail({
    isOpen,
    batchIdentity,
    batchId,
    uploadedBy,
    type,
  });

  const tableColumns = useLeaveStatusTableColumns(type);

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      width="3xl"
      isClosable={true}
      compact={true}
      maxHeight="90vh"
      className="mx-4 w-full"
      title={modalTitle}
      titleVariant="default"
    >
      <div className="space-y-4">
        <DynamicSearchForm
          fields={leaveStatusHistoryInputFields(userOptions)}
          onSubmit={handleSearch}
          onReset={handleReset}
          isLoading={isLoadingBatchDetails}
          readonly
          theme={theme}
          defaultValues={{
            batchId: displayBatchId,
            updatedBy: uploadedByName,
          }}
          submitButtonText="Filter"
        />

        <DynamicSearchResultsTable
          data={searchResults}
          columns={tableColumns}
          title=""
          isSearched={isSearched}
          noDataText={`No ${type === "success" ? "successful" : "failed"} records found`}
          searchPromptText="Loading details..."
        />
      </div>
    </Modal>
  );
}
