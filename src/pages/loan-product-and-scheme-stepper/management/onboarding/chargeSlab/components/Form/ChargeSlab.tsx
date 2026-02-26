import React from "react";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { FormContainer } from "@/components/ui/form-container";
import { Button, Form, Input, Select } from "@/components";
import { Controller } from "react-hook-form";
import { Save } from "lucide-react";
import { LoanSchemeChargeSlabTable } from "../Table/ChargeSlab";
import type { LoanSchemeChargeSlabProps } from "@/types/loan-product-and schema Stepper/charge-slab.types";
import { useChargeSlab } from "../hooks/useChargeSlab";
import { useAppSelector } from "@/hooks/store";

export const LoanSchemeChargeSlab: React.FC<LoanSchemeChargeSlabProps> = ({
  onComplete,
  onSave,
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
    chargesOptions,
    rateTypesOptions,
    chargeOnOptions,
    handleEdit,
    handleCancelEdit,
    onSubmit,
    hasBeenSaved,
  } = useChargeSlab();

  const hasCalledCompletionRef = React.useRef(false);
  const hasInitializedRef = React.useRef(false);

  React.useEffect(() => {
    hasCalledCompletionRef.current = false;
  }, [tableData.length]);

  // Clear step from sessionStorage on mount if no data saved
  React.useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;

      if (!hasBeenSaved) {
        try {
          const completedStepsStr =
            sessionStorage.getItem("loanCompletedSteps");
          if (completedStepsStr) {
            const steps = JSON.parse(completedStepsStr);
            const filtered = steps.filter(
              (s: string) => s !== "loan-scheme-charge-slab"
            );
            if (steps.length !== filtered.length) {
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
    }
  }, [hasBeenSaved, tableData.length]);

  // Clear step from sessionStorage if no data saved
  React.useEffect(() => {
    if (!hasBeenSaved) {
      try {
        const completedStepsStr = sessionStorage.getItem("loanCompletedSteps");

        if (completedStepsStr) {
          const steps = JSON.parse(completedStepsStr);
          const filtered = steps.filter(
            (s: string) => s !== "loan-scheme-charge-slab"
          );
          if (steps.length !== filtered.length) {
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
          <TitleHeader title="Loan Scheme Charge Slab" />
        </HeaderWrapper>
      </Flex>

      <Form onSubmit={handleSubmit(data => onSubmit(data, onSave, onComplete))}>
        <Form.Row className="gap-10">
          <Form.Col lg={2} md={2} span={12}>
            <Form.Field label="Loan Scheme" required>
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

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Charges" required>
              <Controller
                name="charges"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Select
                    {...field}
                    value={value}
                    onValueChange={onChange}
                    placeholder="Select Charges"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    options={chargesOptions}
                  />
                )}
              />

              <Form.Error error={errors.charges} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Rate Type" required>
              <Controller
                name="rateType"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Select
                    {...field}
                    value={value}
                    onValueChange={onChange}
                    placeholder="Select Rate Type"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    options={rateTypesOptions}
                  />
                )}
              />
              <Form.Error error={errors.rateType} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Slab Rate" required>
              <Controller
                name="slabRate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="Enter Slab Rate"
                    size="form"
                    className="[-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                )}
              />
              <Form.Error error={errors.slabRate} />
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
                    type="number"
                    placeholder="Enter From Amount"
                    size="form"
                    className="[-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                )}
              />
              <Form.Error error={errors.fromAmount} />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        <Form.Row className="gap-10">
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="To Amount" required>
              <Controller
                name="toAmount"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter To Amount"
                    size="form"
                    className="[-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                )}
              />
              <Form.Error error={errors.toAmount} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Charge On" required>
              <Controller
                name="chargeOn"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Select
                    {...field}
                    value={value}
                    onValueChange={onChange}
                    placeholder="Select Charge On"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    options={chargeOnOptions}
                  />
                )}
              />
              <Form.Error error={errors.chargeOn} />
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
              {isEditing ? "Update Charge Slab" : "Save Charge Slab"}
            </Button>
          </Flex>
        </Flex>
      </Form>

      {/* Charge Slab Details Section */}
      <div className="mt-6 w-full">
        <LoanSchemeChargeSlabTable tableData={tableData} onEdit={handleEdit} />
      </div>
    </FormContainer>
  );
};
