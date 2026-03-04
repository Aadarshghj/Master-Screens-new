import React from "react";
import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/paginationUp";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { FormContainer } from "@/components/ui/form-container";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Filter } from "lucide-react";
import { useStageTable } from "../hooks";
import type { StagesTableProps } from "@/types/approval-workflow/workflow-stagesetup";
import { WorkflowStagesTable } from "../Table/StagesStep";

export const StagesTable: React.FC<StagesTableProps> = ({
  onEdit,
  onRefresh,
  onWorkflowChange,
  selectedWorkflow,
}) => {
  const isInternalUpdate = React.useRef(false);

  const {
    filterControl,
    handleSearch,
    stages,
    currentPage,
    totalPages,
    totalElements,
    handlePageChange,
    handleDelete,
    confirmDelete,
    cancelDelete,
    showDeleteModal,
    stageToDelete,
    isLoadingStages,
    workflowOptions,
    roleOptions,
    refetchStages,
    Controller,
    watchFilter,
    setFilterValue,
  } = useStageTable();

  // Sync filter with form workflow selection
  React.useEffect(() => {
    if (selectedWorkflow && selectedWorkflow !== watchFilter("workflow")) {
      isInternalUpdate.current = true;
      setFilterValue("workflow", selectedWorkflow);
      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 0);
    }
  }, [selectedWorkflow, setFilterValue, watchFilter]);

  // Notify parent when workflow filter changes
  React.useEffect(() => {
    const workflow = watchFilter("workflow");
    if (
      onWorkflowChange &&
      workflow &&
      workflow !== "all" &&
      !isInternalUpdate.current
    ) {
      onWorkflowChange(workflow);
    }
  }, [watchFilter("workflow"), onWorkflowChange]);

  // Trigger refetch when onRefresh changes (but not on initial render)
  const prevRefresh = React.useRef(onRefresh);
  React.useEffect(() => {
    if (
      onRefresh &&
      onRefresh !== prevRefresh.current &&
      prevRefresh.current !== undefined
    ) {
      refetchStages();
    }
    prevRefresh.current = onRefresh;
  }, [onRefresh, refetchStages]);

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-4 w-full">
        <HeaderWrapper>
          <TitleHeader title="Saved Stages" />
        </HeaderWrapper>
      </Flex>

      {/* Filter Section */}
      <div className="mb-7 rounded-lg bg-gray-50 p-4">
        <Form.Row>
          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Workflow">
              <Controller
                name="workflow"
                control={filterControl}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="All"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    itemVariant="form"
                    options={[
                      { value: "all", label: "All" },
                      ...workflowOptions,
                    ]}
                    loading={false}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <div className="flex gap-2 pt-5">
              <Button
                type="button"
                variant="resetPrimary"
                size="compactWhite"
                onClick={handleSearch}
                className="w-full"
                disabled={isLoadingStages}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </Form.Col>
        </Form.Row>
      </div>

      {/* Table Section */}
      <WorkflowStagesTable
        stages={stages}
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={handlePageChange}
        onEdit={onEdit}
        onDelete={handleDelete}
        workflowOptions={workflowOptions}
        roleOptions={roleOptions}
      />

      {/* Pagination */}
      {stages.length > 0 && totalPages > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-muted-foreground whitespace-nowrap">
            Showing {currentPage * 10 + 1} to{" "}
            {Math.min((currentPage + 1) * 10, totalElements)} of {totalElements}{" "}
            entries
          </div>
          <div className="flex items-center gap-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onPreviousPage={() => {
                if (currentPage > 0) {
                  handlePageChange(currentPage - 1);
                }
              }}
              onNextPage={() => {
                if (currentPage < totalPages - 1) {
                  handlePageChange(currentPage + 1);
                }
              }}
              canPreviousPage={currentPage > 0}
              canNextPage={currentPage < totalPages - 1}
              maxVisiblePages={5}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete Workflow Stage"
        message={`Are you sure you want to delete the stage "${stageToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="standard"
      />
    </FormContainer>
  );
};
