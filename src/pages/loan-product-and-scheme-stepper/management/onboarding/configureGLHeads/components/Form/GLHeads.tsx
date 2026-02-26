import React from "react";
import { Controller } from "react-hook-form";
import {
  Form,
  Input,
  Select,
  Button,
  Flex,
  FormContainer,
  HeaderWrapper,
  TitleHeader,
} from "@/components";
import { Save } from "lucide-react";
import { GLHeadsTable } from "../Table/GLHeads";
import type { GLMappingsProps } from "@/types/loan-product-and schema Stepper/gl-mappings.types";
import { useGLMapping } from "../hooks/useGLMapping";
import { useAppSelector } from "@/hooks/store";

export const GLHeads: React.FC<GLMappingsProps> = ({
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
    glTypeOptions,
    glAccountOptions,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    onSubmit,
    hasUnsavedChanges,
    hasBeenSaved,
  } = useGLMapping();

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
          <TitleHeader title="GL Heads for Loan Scheme" />
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
                    placeholder="Auto-populated from stepper"
                    size="form"
                    disabled
                  />
                )}
              />

              <Form.Error error={errors.loanScheme} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="GL Account Type" required>
              <Controller
                name="glAccountType"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Select
                    {...field}
                    value={value}
                    onValueChange={onChange}
                    placeholder="Select GL Account Type"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    options={glTypeOptions}
                  />
                )}
              />
              <Form.Error error={errors.glAccountType} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="GL Account" required>
              <Controller
                name="glAccount"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Select
                    {...field}
                    value={value}
                    onValueChange={onChange}
                    placeholder="Select GL Account"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    options={glAccountOptions}
                  />
                )}
              />
              <Form.Error error={errors.glAccount} />
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
              {isEditing ? "Update GL Head" : "Save GL Head"}
            </Button>
          </Flex>
        </Flex>
      </Form>

      {/* GL Heads Details Section */}
      <div className="mt-6 w-full">
        <HeaderWrapper className="mb-4">
          <TitleHeader title="GL Heads Details" />
        </HeaderWrapper>

        <GLHeadsTable
          tableData={tableData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </FormContainer>
  );
};
