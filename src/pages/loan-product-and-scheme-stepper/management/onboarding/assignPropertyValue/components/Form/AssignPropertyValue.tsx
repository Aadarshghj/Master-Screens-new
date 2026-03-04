// AssignPropertyValues.tsx
import React from "react";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { FormContainer } from "@/components/ui/form-container";
import { Button, Form, Input } from "@/components";
import { Controller } from "react-hook-form";
import { Save } from "lucide-react";

import type { AssignPropertyValuesProps } from "@/types/loan-product-and schema Stepper/assign-property.types";

import { PropertyValuesTable } from "../Table/AssignPropertyValue";

import { useAssignProperty } from "../hooks/useAssignProperty";
import { useAppSelector } from "@/hooks/store";

export const AssignPropertyValues: React.FC<AssignPropertyValuesProps> = ({
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
    touchedFields,
    glAccountOptions,
    handlePropertyValueChange,
    handleGLAccountChange,
    handleGLAccountNameChange,
    handleStatusChange,
    onSubmit,
    hasUnsavedChanges,
    hasBeenSaved,
  } = useAssignProperty();

  const hasCalledCompletionRef = React.useRef(false);

  React.useEffect(() => {
    if (onUnsavedChanges) {
      onUnsavedChanges(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges, onUnsavedChanges]);

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
          <TitleHeader title="Assign property values for loan scheme" />
        </HeaderWrapper>
      </Flex>

      <Form
        onSubmit={handleSubmit(
          () => onSubmit(onSave, onComplete),
          () => {}
        )}
      >
        <Form.Row>
          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Loan Scheme " required>
              <Controller
                name="loanSchemeName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Auto fetch from first stepper"
                    size="form"
                    disabled
                  />
                )}
              />
              <Form.Error error={errors.loanSchemeName} />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        <div className="mt-6 w-full">
          <PropertyValuesTable
            tableData={tableData}
            handlePropertyValueChange={handlePropertyValueChange}
            handleGLAccountChange={handleGLAccountChange}
            handleGLAccountNameChange={handleGLAccountNameChange}
            handleStatusChange={handleStatusChange}
            glAccountOptions={glAccountOptions}
            touchedFields={touchedFields}
          />
        </div>

        {/* Action Buttons */}
        <Flex justify="end" className="mt-9">
          <Button
            type="submit"
            variant="primary"
            size="compactWhite"
            className="flex items-center gap-2"
            disabled={isSentForApproval}
          >
            <Save className="h-3 w-3" />
            Save Property Value
          </Button>
        </Flex>
      </Form>
    </FormContainer>
  );
};
