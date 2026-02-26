import React from "react";
import { Controller } from "react-hook-form";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { Filter, RefreshCw } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Button, Form, Select, Input } from "@/components";
import { trueOrFalse } from "@/const/common-options.const";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { LoanBusinessRulesTable } from "../Table/BusinessRules";
import { useBusinessRulesFilter } from "../../hooks/useBusinessRulesFilter";

export const LoanBusinessRulesFilterTable: React.FC = () => {
  const {
    filterForm,
    searchResults,
    isSearched,
    isSearching,
    currentPage,
    ruleCategoryOptions,
    loanProductOptions,
    showDeleteModal,
    ruleToDelete,
    deletingRuleId,
    handleSearch,
    handlePageChange,
    handleEdit,
    handleDelete,
    confirmDeleteRule,
    cancelDeleteRule,
    handleResetFilters,
  } = useBusinessRulesFilter();

  const { control, register } = filterForm;

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-4 w-full">
        <HeaderWrapper>
          <TitleHeader title="History" />
        </HeaderWrapper>
      </Flex>

      {/* Filter Section */}
      <div className="mb-7 rounded-lg bg-gray-50 p-4">
        <Form.Row>
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Loan Product">
              <Controller
                name="loanProduct"
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
                      ...loanProductOptions,
                    ]}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Category">
              <Controller
                name="category"
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
                      ...ruleCategoryOptions,
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
                    options={[{ value: "all", label: "All" }, ...trueOrFalse]}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Rule Code">
              <Input
                {...register("ruleCode")}
                placeholder="Enter Rule Code"
                size="form"
                variant="form"
                disabled={isSearching}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Rule Name">
              <Input
                {...register("ruleName")}
                placeholder="Enter Rule Name"
                size="form"
                variant="form"
                disabled={isSearching}
              />
            </Form.Field>
          </Form.Col>
        </Form.Row>
        <Form.Row className="mt-4">
          <Form.Col lg={12} md={12} span={12}>
            {/* <div className="flex gap-2 pt-5"> */}
            <div className="flex justify-end gap-2">
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
                // className="w-full"
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
      <LoanBusinessRulesTable
        rules={searchResults.content || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isSearching}
        isSearched={isSearched}
        currentPage={currentPage}
        totalPages={searchResults.totalPages || 0}
        totalElements={searchResults.totalElements || 0}
        onPageChange={handlePageChange}
        loanProductOptions={loanProductOptions}
        deletingRuleId={deletingRuleId}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteRule}
        onCancel={cancelDeleteRule}
        title="Delete Business Rule"
        message={`Are you sure you want to delete the rule "${ruleToDelete?.name}"? This action cannot be undone.`}
        confirmText={
          deletingRuleId === ruleToDelete?.id ? "Deleting..." : "Delete"
        }
        cancelText="Cancel"
        type="error"
        size="standard"
      />
    </FormContainer>
  );
};
