import React from "react";
import { Controller } from "react-hook-form";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { Filter, RefreshCw } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Button, Form, Select, Input } from "@/components";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { WorkflowDefinitionsTable } from "../Table/WorkflowDefinitions";
import { useWorkflowDefinitionsFilterTable } from "../../hooks/useWorkflowDefinitionsFilter";
import type { WorkflowDefinitionsFilterProps } from "@/types/approval-workflow/workflow-definitions.types";

export const WorkflowDefinitionsFilterTable: React.FC<
  WorkflowDefinitionsFilterProps
> = ({
  selectedModule: selectedModuleFromForm,
  selectedSubModule: selectedSubModuleFromForm,
  onModuleChange,
  onSubModuleChange,
}) => {
  const isInternalUpdate = React.useRef(false);
  const {
    filterFormMethods,
    handleSearch,
    handleReset,
    searchResults,
    isSearching,
    isSearched,
    currentPage,
    moduleOptions,
    subModuleOptions,
    selectedModule,
    handleEdit,
    handleDelete,
    handlePageChange,
    showDeleteModal,
    definitionToDelete,
    confirmDeleteDefinition,
    cancelDeleteDefinition,
    deletingDefinitionId,
  } = useWorkflowDefinitionsFilterTable();

  const { control, register } = filterFormMethods;

  // Sync filter with form module selection
  React.useEffect(() => {
    if (selectedModuleFromForm && selectedModuleFromForm !== "all") {
      isInternalUpdate.current = true;
      filterFormMethods.setValue("module", selectedModuleFromForm);
      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 0);
    }
  }, [selectedModuleFromForm, filterFormMethods]);

  // Sync filter with form submodule selection
  React.useEffect(() => {
    if (selectedSubModuleFromForm && selectedSubModuleFromForm !== "all") {
      isInternalUpdate.current = true;
      filterFormMethods.setValue("subModule", selectedSubModuleFromForm);
      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 0);
    }
  }, [selectedSubModuleFromForm, filterFormMethods]);

  // Notify parent when filter module/submodule changes
  React.useEffect(() => {
    const subscription = filterFormMethods.watch((value, { name }) => {
      if (!isInternalUpdate.current) {
        if (name === "module" && value.module && onModuleChange) {
          onModuleChange(value.module);
        }
        if (name === "subModule" && value.subModule && onSubModuleChange) {
          onSubModuleChange(value.subModule);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [filterFormMethods, onModuleChange, onSubModuleChange]);

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-4 w-full">
        <HeaderWrapper>
          <TitleHeader title="Saved Definitions" />
        </HeaderWrapper>
      </Flex>

      {/* Filter Section */}
      <div className="mb-7 rounded-lg bg-gray-50 p-4">
        <Form.Row>
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Module">
              <Controller
                name="module"
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
                    options={[{ value: "all", label: "All" }, ...moduleOptions]}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Sub Module">
              <Controller
                name="subModule"
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
                    disabled={!selectedModule || selectedModule === "all"}
                    options={[
                      { value: "all", label: "All" },
                      ...subModuleOptions,
                    ]}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Workflow Name">
              <Input
                {...register("workflowName")}
                placeholder="Enter Workflow Name"
                size="form"
                variant="form"
                disabled={isSearching}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <div className="flex gap-2 pt-5 ">
              <Button
                type="button"
                variant="resetCompact"
                size="compactWhite"
                onClick={handleReset}
                className="w-full"
                disabled={isSearching}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
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
      <WorkflowDefinitionsTable
        definitions={searchResults.content || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isSearching}
        isSearched={isSearched}
        currentPage={currentPage}
        totalPages={searchResults.totalPages || 0}
        totalElements={searchResults.totalElements || 0}
        onPageChange={handlePageChange}
        moduleOptions={moduleOptions}
        deletingDefinitionId={deletingDefinitionId}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteDefinition}
        onCancel={cancelDeleteDefinition}
        title="Delete Workflow Definition"
        message={`Are you sure you want to delete the workflow "${definitionToDelete?.name}"? This action cannot be undone.`}
        confirmText={
          deletingDefinitionId === definitionToDelete?.id
            ? "Deleting..."
            : "Delete"
        }
        cancelText="Cancel"
        type="error"
        size="standard"
      />
    </FormContainer>
  );
};
