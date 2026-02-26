import React from "react";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { FormContainer } from "@/components/ui/form-container";
import {
  Button,
  Form,
  Input,
  Select,
  Switch,
  ConfirmationModal,
} from "@/components";
import { Controller } from "react-hook-form";
import { Save } from "lucide-react";
import { BusinessRulesTable } from "../Table/businessRule";
import type {
  BusinessRuleProps,
  BusinessRuleFormData,
} from "@/types/loan-product-and schema Stepper/business-rules.types";
import { useBusinessRule } from "../hooks/useBusinessRule";
import { useAppSelector } from "@/hooks/store";

export const BusinessRule: React.FC<BusinessRuleProps> = ({
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
    trigger,
    tableData,
    isEditing,
    businessRuleOptions,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    showDeleteModal,
    onSubmit,

    hasUnsavedChanges,
    hasBeenSaved,
  } = useBusinessRule();

  const hasCalledCompletionRef = React.useRef(false);

  React.useEffect(() => {
    if (onUnsavedChanges) {
      onUnsavedChanges(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges, onUnsavedChanges]);

  React.useEffect(() => {
    hasCalledCompletionRef.current = false;
  }, [tableData.length]);

  // Clear step from sessionStorage if no data saved
  React.useEffect(() => {
    if (!hasBeenSaved) {
      try {
        const completedStepsStr = sessionStorage.getItem("loanCompletedSteps");
        if (completedStepsStr) {
          const steps = JSON.parse(completedStepsStr);
          const filtered = steps.filter((s: string) => s !== "business-rules");
          if (steps.length !== filtered.length) {
            sessionStorage.setItem(
              "loanCompletedSteps",
              JSON.stringify(filtered)
            );
            window.dispatchEvent(new CustomEvent("loanStepStatusChanged"));
          }
        }
      } catch (error) {
        console.error("Failed to update sessionStorage", error);
      }
    }
  }, [hasBeenSaved]);

  React.useEffect(() => {
    if (hasBeenSaved && onComplete && !hasCalledCompletionRef.current) {
      onComplete();
      hasCalledCompletionRef.current = true;
    }
  }, [hasBeenSaved, onComplete]);

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-4 w-full">
        <HeaderWrapper>
          <TitleHeader title="Business Rules" />
        </HeaderWrapper>
      </Flex>

      <Form
        onSubmit={async e => {
          e.preventDefault();
          const isValid = await trigger();
          if (!isValid) {
            return;
          }
          handleSubmit(data => {
            onSubmit(
              data as unknown as BusinessRuleFormData,
              onSave,
              onComplete
            );
          })(e);
        }}
      >
        <Form.Row>
          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Loan Name">
              <Controller
                name="loanName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Auto-populated from stepper"
                    size="form"
                    disabled
                  />
                )}
              />
              <Form.Error error={errors.loanName} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Business Rule" required>
              <Controller
                name="businessRuleIdentity"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Select
                    {...field}
                    value={value}
                    onValueChange={onChange}
                    placeholder="Select Business Rule"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    options={businessRuleOptions}
                  />
                )}
              />
              <Form.Error error={errors.businessRuleIdentity} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Execution Order" required>
              <Controller
                name="executionOrder"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter execution order"
                    size="form"
                  />
                )}
              />
              <Form.Error error={errors.executionOrder} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Effective From" required>
              <Controller
                name="effectiveFrom"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="date" size="form" />
                )}
              />
              <Form.Error error={errors.effectiveFrom} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Effective To" required>
              <Controller
                name="effectiveTo"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="date" size="form" />
                )}
              />
              <Form.Error error={errors.effectiveTo} />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        <Form.Row>
          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Active Status">
              <Controller
                name="isActive"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <div className="mt-2 flex items-center gap-2">
                    <Switch
                      {...field}
                      checked={value}
                      onCheckedChange={onChange}
                    />
                    <span className="text-sm text-gray-700">
                      {value ? "Active" : "Inactive"}
                    </span>
                  </div>
                )}
              />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        <Flex justify="end" className="mt-6">
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
              size="compactWhite"
              className="flex items-center gap-2"
              disabled={isSentForApproval}
            >
              <Save className="h-3 w-3" />
              {isEditing ? "Update Business Rule" : "Save Business Rule"}
            </Button>
          </Flex>
        </Flex>
      </Form>

      <div className="mt-6 w-full">
        <HeaderWrapper className="mb-4">
          <TitleHeader title="Business Rules Details" />
        </HeaderWrapper>

        <BusinessRulesTable
          tableData={tableData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete Business Rule"
        message="Are you sure you want to delete this business rule? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </FormContainer>
  );
};
