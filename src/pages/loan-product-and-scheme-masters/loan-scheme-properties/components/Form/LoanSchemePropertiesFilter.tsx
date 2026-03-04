import React from "react";
import { Controller } from "react-hook-form";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { Filter, RefreshCw } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Button, Form, Select } from "@/components";
import { trueOrFalse, trueFalse } from "@/const/common-options.const";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Pagination } from "@/components/ui/paginationUp";
import { LoanSchemePropertiesTable } from "../Table/LoanSchemeProperties";
import { useLoanSchemePropertyFilter } from "../../hooks/useLoanSchemePropertyFilter";

export const LoanSchemePropertiesFilterTable: React.FC = () => {
  const {
    searchResults,
    isSearched,
    currentPage,
    pageSize,
    showDeleteModal,
    propertyToDelete,
    deletingPropertyId,
    filterControl,
    loanProductOptions,
    dataTypeOptions,
    isSearching,
    handleSearch,
    handlePageChange,
    handleEdit,
    handleDelete,
    confirmDeleteProperty,
    cancelDeleteProperty,
    handleResetFilters,
  } = useLoanSchemePropertyFilter();

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-4 w-full">
        <HeaderWrapper>
          <TitleHeader title="Loan Scheme Properties" />
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
            <Form.Field label="Data Type">
              <Controller
                name="dataType"
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
                      ...dataTypeOptions,
                    ]}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Required/Not">
              <Controller
                name="isRequired"
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
                    options={[{ value: "all", label: "All" }, ...trueFalse]}
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
      <LoanSchemePropertiesTable
        properties={searchResults.content || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isSearching}
        isSearched={isSearched}
        loanProductOptions={loanProductOptions}
        dataTypeOptions={dataTypeOptions}
        deletingPropertyId={deletingPropertyId}
      />

      {/* Pagination */}
      {searchResults.content &&
        searchResults.content.length > 0 &&
        searchResults.totalPages > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-muted-foreground whitespace-nowrap">
              Showing {currentPage * pageSize + 1} to{" "}
              {Math.min(
                (currentPage + 1) * pageSize,
                searchResults.totalElements
              )}{" "}
              of {searchResults.totalElements} entries
            </div>

            <div className="flex items-center gap-3">
              <Pagination
                currentPage={currentPage}
                totalPages={searchResults.totalPages}
                onPageChange={handlePageChange}
                onPreviousPage={() => {
                  if (currentPage > 0) {
                    handlePageChange(currentPage - 1);
                  }
                }}
                onNextPage={() => {
                  if (currentPage < searchResults.totalPages - 1) {
                    handlePageChange(currentPage + 1);
                  }
                }}
                canPreviousPage={currentPage > 0}
                canNextPage={currentPage < searchResults.totalPages - 1}
                maxVisiblePages={5}
              />
            </div>
          </div>
        )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteProperty}
        onCancel={cancelDeleteProperty}
        title="Delete Loan Scheme Property"
        message={`Are you sure you want to delete the property "${propertyToDelete?.name}"? This action cannot be undone.`}
        confirmText={
          deletingPropertyId === propertyToDelete?.id ? "Deleting..." : "Delete"
        }
        cancelText="Cancel"
        type="error"
        size="standard"
      />
    </FormContainer>
  );
};
