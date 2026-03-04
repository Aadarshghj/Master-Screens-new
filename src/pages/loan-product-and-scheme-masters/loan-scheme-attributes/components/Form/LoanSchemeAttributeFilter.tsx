import React from "react";
import { Controller } from "react-hook-form";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { Filter, RefreshCw } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Button, Form, Input, Select } from "@/components";
import { LoanSchemeAttributesTable } from "../Table/LoanSchemeAttributes";
import { trueOrFalse } from "@/const/common-options.const";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { useLoanSchemeAttributesFilter } from "../../hooks/useLoanSchemeAttributeFilter";

export const LoanSchemeAttributesFilterTable: React.FC = () => {
  const {
    searchResults,
    isSearched,
    currentPage,
    isSearching,
    showDeleteModal,
    attributeToDelete,
    deletingAttributeId,
    filterControl,
    loanProductOptions,
    dataTypeOptions,
    handleSearch,
    handlePageChange,
    handleEdit,
    handleDelete,
    confirmDeleteAttribute,
    cancelDeleteAttribute,
    handleResetFilters,
  } = useLoanSchemeAttributesFilter();

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-4 w-full">
        <HeaderWrapper>
          <TitleHeader title="Loan Scheme Attributes" />
        </HeaderWrapper>
      </Flex>

      {/* Filter Section */}
      <div className="mb-7 rounded-lg bg-gray-50 p-4">
        <Form.Row>
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Product">
              <Controller
                name="loanProduct"
                control={filterControl}
                render={({ field }) => (
                  <Select
                    value={field.value || "all"}
                    onValueChange={value => {
                      field.onChange(value === "all" ? "" : value);
                    }}
                    placeholder="All"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    itemVariant="form"
                    options={[
                      { value: "all", label: "All" },
                      ...loanProductOptions,
                    ]}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Attribute Name">
              <Controller
                name="attributeName"
                control={filterControl}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter Attribute Name"
                    size="form"
                    variant="form"
                  />
                )}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Status">
              <Controller
                name="status"
                control={filterControl}
                render={({ field }) => (
                  <Select
                    value={field.value || "all"}
                    onValueChange={value => {
                      field.onChange(value === "all" ? "" : value);
                    }}
                    placeholder="All"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    itemVariant="form"
                    options={[{ value: "all", label: "All" }, ...trueOrFalse]}
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
                onClick={handleResetFilters}
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
      <LoanSchemeAttributesTable
        attributes={searchResults.content || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isSearching}
        isSearched={isSearched}
        currentPage={currentPage}
        totalPages={searchResults.totalPages || 0}
        totalElements={searchResults.totalElements || 0}
        onPageChange={handlePageChange}
        loanProductOptions={loanProductOptions}
        dataTypeOptions={dataTypeOptions}
        deletingAttributeId={deletingAttributeId}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteAttribute}
        onCancel={cancelDeleteAttribute}
        title="Delete Loan Scheme Attribute"
        message={`Are you sure you want to delete the attribute "${attributeToDelete?.name}"? This action cannot be undone.`}
        confirmText={
          deletingAttributeId === attributeToDelete?.id
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
