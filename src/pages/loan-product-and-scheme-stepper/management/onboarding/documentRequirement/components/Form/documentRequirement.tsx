import React from "react";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { FormContainer } from "@/components/ui/form-container";
import { Button, Form, Input, Select, Switch } from "@/components";
import { Controller } from "react-hook-form";
import { Save } from "lucide-react";
import { DocumentRequirementTable } from "../Table/documentRequirement";
import type { DocumentRequirementProps } from "@/types/loan-product-and schema Stepper/document-requirements.types";
import { useDocumentRequirement } from "../hooks/useDocumentRequirement";
import { useAppSelector } from "@/hooks/store";

export const DocumentRequirement: React.FC<DocumentRequirementProps> = ({
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
    documentOptionsData,
    acceptanceLevelOptions,
    isEditing,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    onSubmit,
    hasUnsavedChanges,
    hasBeenSaved,
  } = useDocumentRequirement();

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

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-4 w-full">
        <HeaderWrapper>
          <TitleHeader title="Document Requirement for Loan Scheme" />
        </HeaderWrapper>
      </Flex>

      <Form onSubmit={handleSubmit(data => onSubmit(data, onSave, onComplete))}>
        <Form.Row>
          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Loan Scheme">
              <Controller
                name="loanScheme"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Select loan from first stepper"
                    size="form"
                    disabled
                  />
                )}
              />

              <Form.Error error={errors.loanScheme} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Document" required>
              <Controller
                name="document"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Select
                    {...field}
                    value={value}
                    onValueChange={onChange}
                    placeholder="Select document"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    options={documentOptionsData}
                  />
                )}
              />
              <Form.Error error={errors.document} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Acceptance Level" required>
              <Controller
                name="acceptanceLevel"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Select
                    {...field}
                    value={value}
                    onValueChange={onChange}
                    placeholder="Select acceptance level"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    options={acceptanceLevelOptions}
                  />
                )}
              />
              <Form.Error error={errors.acceptanceLevel} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <Form.Field>
              <div className="flex items-center gap-2 pt-6">
                <Controller
                  name="mandatoryStatus"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="mandatoryStatus"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="mandatoryStatus"
                  className="text-[10px] font-medium text-gray-700"
                >
                  Mandatory Status
                </label>
              </div>
              <Form.Error error={errors.mandatoryStatus} />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        {/* Save Button */}
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
              {isEditing
                ? "Update Document Requirement"
                : "Save Document Requirement"}
            </Button>
          </Flex>
        </Flex>
      </Form>

      {/* Document Requirement Details Section */}
      <div className="mt-6 w-full">
        <HeaderWrapper className="mb-4">
          <TitleHeader title="Document Requirement Details" />
        </HeaderWrapper>

        <DocumentRequirementTable
          tableData={tableData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </FormContainer>
  );
};
