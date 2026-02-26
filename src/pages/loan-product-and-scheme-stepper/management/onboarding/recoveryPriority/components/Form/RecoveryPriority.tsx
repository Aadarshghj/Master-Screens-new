import React from "react";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { FormContainer } from "@/components/ui/form-container";
import { Button, Form, Input } from "@/components";
import { Controller } from "react-hook-form";
import { RecoveryPriorityTable } from "../Table/RecoveryPriority";
import type { RecoveryPriorityProps } from "@/types/loan-product-and schema Stepper/recovery-priority";
import { useRecoveryPriority } from "../hooks/useRecoveryPriority";
import { useAppSelector } from "@/hooks/store";

export const RecoveryPriority: React.FC<RecoveryPriorityProps> = ({
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
    handlePriorityChange,
    handleActiveChange,
    onSubmit,
    hasUnsavedChanges,
    hasBeenSaved,
  } = useRecoveryPriority();

  const hasCalledCompletionRef = React.useRef(false);
  const hasCalledIncompleteRef = React.useRef(false);

  React.useEffect(() => {
    if (onUnsavedChanges) {
      onUnsavedChanges(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges, onUnsavedChanges]);

  React.useEffect(() => {
    hasCalledCompletionRef.current = false;
    hasCalledIncompleteRef.current = false;
  }, [tableData.length]);

  // Mark step as incomplete if no data saved - run immediately
  React.useEffect(() => {
    if (!hasBeenSaved) {
      try {
        const completedStepsStr = sessionStorage.getItem("loanCompletedSteps");

        if (completedStepsStr) {
          const steps = JSON.parse(completedStepsStr);
          const wasIncluded = steps.includes("recovery-priority");
          const filtered = steps.filter(
            (s: string) => s !== "recovery-priority"
          );

          if (wasIncluded) {
            sessionStorage.setItem(
              "loanCompletedSteps",
              JSON.stringify(filtered)
            );
            window.dispatchEvent(new CustomEvent("loanStepStatusChanged"));
          }
        }
      } catch {
        // Ignore error
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
          <TitleHeader title="Recovery Priority" />
        </HeaderWrapper>
      </Flex>

      <Form onSubmit={handleSubmit(() => {})}>
        <Form.Row>
          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Loan Scheme">
              <Controller
                name="loanScheme"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="(Only fetch from first stepper)"
                    size="form"
                    disabled
                  />
                )}
              />
              <Form.Error error={errors.loanScheme} />
            </Form.Field>
          </Form.Col>
        </Form.Row>
      </Form>

      <div className="mt-6 w-full">
        <RecoveryPriorityTable
          tableData={tableData}
          onPriorityChange={handlePriorityChange}
          onActiveChange={handleActiveChange}
        />
      </div>

      <Flex justify="end" className="mt-6">
        <Button
          type="button"
          variant="primary"
          size="compactWhite"
          onClick={() => {
            onSubmit(onSave);
          }}
          disabled={isSentForApproval}
        >
          Save Recovery Priority
        </Button>
      </Flex>
    </FormContainer>
  );
};
