import React from "react";
import { Controller } from "react-hook-form";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { Filter } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Button, Form, Select } from "@/components";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { WorkflowActionsTable } from "../Table/WorkflowActions";
import { useWorkflowActionsFilterTable } from "../../hooks/useWorkflowActionsFilter";

export const WorkflowActionsFilterTable: React.FC<{
  selectedWorkflow?: string;
  onWorkflowChange?: (workflow: string) => void;
}> = ({ selectedWorkflow: selectedWorkflowFromForm, onWorkflowChange }) => {
  const isInternalUpdate = React.useRef(false);
  const {
    filterFormMethods,
    handleSearch,
    handleReset,
    searchResults,
    isSearching,
    isSearched,
    currentPage,
    workflowOptions,
    handleEdit,
    handleDelete,
    handlePageChange,
    showDeleteModal,
    actionToDelete,
    confirmDeleteAction,
    cancelDeleteAction,
    deletingActionId,
  } = useWorkflowActionsFilterTable();

  const { control } = filterFormMethods;

  // Sync filter with form workflow selection
  React.useEffect(() => {
    if (selectedWorkflowFromForm && selectedWorkflowFromForm !== "all") {
      isInternalUpdate.current = true;
      filterFormMethods.setValue("workflow", selectedWorkflowFromForm);
      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 0);
    }
  }, [selectedWorkflowFromForm, filterFormMethods]);

  // Notify parent when filter workflow changes
  React.useEffect(() => {
    const subscription = filterFormMethods.watch((value, { name }) => {
      if (
        name === "workflow" &&
        value.workflow &&
        onWorkflowChange &&
        !isInternalUpdate.current
      ) {
        onWorkflowChange(value.workflow);
      }
    });
    return () => subscription.unsubscribe();
  }, [filterFormMethods, onWorkflowChange]);

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-4 w-full">
        <HeaderWrapper>
          <TitleHeader title="Saved Actions" />
        </HeaderWrapper>
      </Flex>

      {/* Filter Section */}
      <div className="mb-7 rounded-lg bg-gray-50 p-4">
        <Form.Row>
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Workflow">
              <Controller
                name="workflow"
                control={control}
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
                  />
                )}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <div className="flex gap-2 pt-5">
              <Button
                type="button"
                variant="resetCompact"
                size="compactWhite"
                onClick={handleReset}
                className="w-full"
                disabled={isSearching}
              >
                Reset
              </Button>
              <Button
                type="button"
                variant="resetPrimary"
                size="compactWhite"
                onClick={handleSearch}
                className="w-full"
                disabled={isSearching}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </Form.Col>
        </Form.Row>
      </div>

      {/* Table Section */}
      <WorkflowActionsTable
        actions={searchResults.content || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isSearching}
        isSearched={isSearched}
        currentPage={currentPage}
        totalPages={searchResults.totalPages || 0}
        totalElements={searchResults.totalElements || 0}
        onPageChange={handlePageChange}
        workflowOptions={workflowOptions}
        deletingActionId={deletingActionId}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteAction}
        onCancel={cancelDeleteAction}
        title="Delete Workflow Action"
        message="Are you sure you want to delete the action? This action cannot be undone."
        confirmText={
          deletingActionId === actionToDelete?.id ? "Deleting..." : "Delete"
        }
        cancelText="Cancel"
        type="error"
        size="standard"
      />
    </FormContainer>
  );
};
