import React from "react";
import { Controller } from "react-hook-form";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { FormContainer } from "@/components/ui/form-container";
import { Button, Form, Input, Switch } from "@/components";

import { InterestSlabTable } from "../Table/InterestSlabs";
import { Save } from "lucide-react";
import type {
  InterestSlabFormProps,
  InterestSlabFormData,
} from "@/types/loan-product-and schema Stepper/interest-slabs.types";
import { useInterestSlab } from "../hooks/useInterestSlab";
import { useAppSelector } from "@/hooks/store";

export const InterestSlabForm: React.FC<InterestSlabFormProps> = ({
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
    handleEdit,
    handleCancelEdit,
    handleDelete,
    onSubmit,
    formState,
    hasUnsavedChanges,
  } = useInterestSlab();

  React.useEffect(() => {
    if (onUnsavedChanges) {
      onUnsavedChanges(
        hasUnsavedChanges ||
          (formState?.isDirty && Object.keys(formState.dirtyFields).length > 0)
      );
    }
  }, [
    hasUnsavedChanges,
    formState?.isDirty,
    formState?.dirtyFields,
    onUnsavedChanges,
  ]);

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-4 w-full">
        <HeaderWrapper>
          <TitleHeader title="Interest Slabs" />
        </HeaderWrapper>
      </Flex>

      <Form
        onSubmit={handleSubmit(data =>
          onSubmit(data as unknown as InterestSlabFormData, onSave, onComplete)
        )}
      >
        <Form.Row>
          <Form.Col lg={3} md={6} span={12}>
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
            <Form.Field label="Start Period" required>
              <Controller
                name="startPeriod"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter start period"
                    size="form"
                  />
                )}
              />
              <Form.Error error={errors.startPeriod} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="End Period" required>
              <Controller
                name="endPeriod"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter end period"
                    size="form"
                  />
                )}
              />
              <Form.Error error={errors.endPeriod} />
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
                    disabled
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
                  <Input
                    {...field}
                    placeholder="Enter To Amount"
                    size="form"
                    disabled
                  />
                )}
              />

              <Form.Error error={errors.toAmount} />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        <Form.Row>
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Slab Interest Rate" required>
              <Controller
                name="slabInterestRate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter Slab Interest Rate"
                    size="form"
                  />
                )}
              />
              <Form.Error error={errors.slabInterestRate} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Annual ROI(%)" required>
              <Controller
                name="annualROI"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter the Annual ROI"
                    size="form"
                  />
                )}
              />
              <Form.Error error={errors.annualROI} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Rebate Based on Annual ROI" required>
              <Controller
                name="rebateAnnualROI"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Auto-calculated"
                    size="form"
                    disabled
                  />
                )}
              />
              <Form.Error error={errors.rebateAnnualROI} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12} className="ml-4">
            <Flex align="end" className="h-full gap-1">
              <Form.Field label="Recomputation Required">
                <div className="mt-2">
                  <Controller
                    name="recomputationRequired"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </Form.Field>
            </Flex>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12} className="ml-4">
            <Flex align="end" className="h-full gap-1">
              <Form.Field label="Expired">
                <div className="mt-2">
                  <Controller
                    name="expired"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </Form.Field>
            </Flex>
          </Form.Col>
        </Form.Row>

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
              {isEditing ? "Update Interest Slab" : "Save Interest Slab"}
            </Button>
          </Flex>
        </Flex>
      </Form>

      <div className="mt-6 w-full">
        <InterestSlabTable
          data={tableData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </FormContainer>
  );
};
