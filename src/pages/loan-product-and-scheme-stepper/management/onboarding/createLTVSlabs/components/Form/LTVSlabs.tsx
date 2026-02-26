import React from "react";
import { Controller } from "react-hook-form";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { Button, Form, Input, Select, ConfirmationModal } from "@/components";
import { FormContainer } from "@/components/ui/form-container/FormContainer";
import { Save } from "lucide-react";
import type { LTVSlabsProps } from "@/types/loan-product-and schema Stepper/ltv-slabs.types";
import { LTVSlabTable } from "../Table/LTVSlabs";
import { useLTVSlab } from "../hooks/useLTVSlab";
import { useAppSelector } from "@/hooks/store";

export const LTVSlabForm: React.FC<LTVSlabsProps> = ({
  onComplete,
  onSave,
  onUnsavedChanges,
}) => {
  const { approvalStatus } = useAppSelector(state => state.loanProduct);
  const isSentForApproval =
    approvalStatus === "PENDING" || approvalStatus === "APPROVED";

  const {
    control,
    handleSubmit,
    errors,
    tableData,
    isEditing,
    ltvOnOptionsData,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    showDeleteModal,
    onSubmit,
    hasUnsavedChanges,
    hasBeenSaved,
  } = useLTVSlab();

  const hasCalledCompletionRef = React.useRef(false);

  React.useEffect(() => {
    if (onUnsavedChanges) {
      onUnsavedChanges(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges, onUnsavedChanges]);

  React.useEffect(() => {
    hasCalledCompletionRef.current = false;
  }, [tableData.length]);

  React.useEffect(() => {
    if (hasBeenSaved && onComplete && !hasCalledCompletionRef.current) {
      onComplete();
      hasCalledCompletionRef.current = true;
    }
  }, [hasBeenSaved, onComplete]);

  // Wrapper functions to match table component expectations
  const handleEditById = (id: string) => {
    const item = tableData.find(data => data.id === id);
    if (item) handleEdit(item);
  };

  const handleDeleteById = (id: string) => {
    const item = tableData.find(data => data.id === id);
    if (item) handleDelete(item);
  };

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-4 w-full">
        <HeaderWrapper>
          <TitleHeader title="LTV Slabs" />
        </HeaderWrapper>
      </Flex>

      <Form onSubmit={handleSubmit(data => onSubmit(data, onSave, onComplete))}>
        <Form.Row>
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Loan Scheme">
              <Controller
                name="loanScheme"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="//Auto fetch from first stepper"
                    size="form"
                    disabled
                  />
                )}
              />
              <Form.Error error={errors.loanScheme} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="From Amount" required>
              <Controller
                name="fromAmount"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter From Amount"
                    size="form"
                  />
                )}
              />
              <Form.Error error={errors.fromAmount} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="To Amount" required>
              <Controller
                name="toAmount"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter To Amount" size="form" />
                )}
              />
              <Form.Error error={errors.toAmount} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="LTV %" required>
              <Controller
                name="ltvPercentage"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter LTV Percentage"
                    size="form"
                  />
                )}
              />
              <Form.Error error={errors.ltvPercentage} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="LTV On" required>
              <Controller
                name="ltvOn"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select scheme type"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    itemVariant="form"
                    options={ltvOnOptionsData}
                  />
                )}
              />
              <Form.Error error={errors.ltvOn} />
            </Form.Field>
          </Form.Col>
        </Form.Row>
        {/* Form Action Buttons */}
        <Flex justify="end" className="mt-4">
          <Flex className="gap-3">
            {isEditing && (
              <Button
                type="button"
                variant="secondary"
                size="default"
                className="bg-reset-button hover:bg-reset-button/80 text-white"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              size="compact"
              className="flex items-center gap-2"
              disabled={isSentForApproval}
            >
              <Save className="h-3 w-3" />
              {isEditing ? "Update LTV Slab" : "Save LTV Slab"}
            </Button>
          </Flex>
        </Flex>
      </Form>

      <div className="mt-6 w-full">
        <LTVSlabTable
          data={tableData}
          onEdit={handleEditById}
          onDelete={handleDeleteById}
        />
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete LTV Slab"
        message="Are you sure you want to delete this LTV slab? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </FormContainer>
  );
};
