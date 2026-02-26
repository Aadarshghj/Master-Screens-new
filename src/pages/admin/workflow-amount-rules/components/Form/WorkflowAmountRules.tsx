import React from "react";
import { PlusCircle, RotateCcw, Save, X } from "lucide-react";
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
  Controller,
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Label, Switch } from "@/components/ui";
import { Button, Form, Select, TitleHeader } from "@/components";
import type { Option, WorkflowAmountRules } from "@/types/admin/amountrules";

interface ApprovalFlowSetupProps {
  control: Control<WorkflowAmountRules>;
  errors: FieldErrors<WorkflowAmountRules>;
  register: UseFormRegister<WorkflowAmountRules>;
  isSubmitting: boolean;
  workflowOptions: Option[];
  approvalFlowOptions: Option[];
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const ApprovalFlowSetup: React.FC<ApprovalFlowSetupProps> = ({
  control,
  errors,
  register,
  isSubmitting,
  workflowOptions,
  approvalFlowOptions,
  onSubmit,
  onCancel,
  onReset,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <TitleHeader title="Approval Flow Setup" />
            <Button
              type="submit"
              size="sm"
              variant="default"
              className="border-b border-gray-300 shadow-[0_3px_4px_-3px_rgba(0,0,0,0.25)]"
            >
              <PlusCircle className="mr-1 h-3 w-3" />
              Add Workflow Amount Rules
            </Button>
          </div>

          <div className="mt-6">
            <Form.Row>
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="Workflow" required error={errors.workflow}>
                  <Controller
                    name="workflow"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        placeholder="Select workflow"
                        options={workflowOptions}
                        size="form"
                        variant="form"
                        fullWidth
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="From Amount"
                  required
                  error={errors.fromAmount}
                >
                  <Input
                    {...register("fromAmount", { valueAsNumber: true })}
                    type="number"
                    placeholder="eg: 0.00"
                    size="form"
                    variant="form"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="To Amount" required error={errors.toAmount}>
                  <Input
                    {...register("toAmount", { valueAsNumber: true })}
                    type="number"
                    placeholder="eg: 1000000.00"
                    size="form"
                    variant="form"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Amount on" required error={errors.amountOn}>
                  <Controller
                    name="amountOn"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        placeholder="Select loan amount/customer exposure"
                        options={approvalFlowOptions}
                        size="form"
                        variant="form"
                        fullWidth
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Approval Flow"
                  required
                  error={errors.approvalFlow}
                >
                  <Controller
                    name="approvalFlow"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        placeholder="Select approval flow"
                        options={approvalFlowOptions}
                        size="form"
                        variant="form"
                        fullWidth
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Flex direction="col" gap={1}>
                  <Flex align="center" gap={2}>
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      )}
                    />
                    <Label>Active</Label>
                  </Flex>
                </Flex>
              </Form.Col>
            </Form.Row>

            <Flex.ActionGroup className="mt-14 justify-end gap-4">
              <Button
                type="button"
                variant="footer"
                onClick={onCancel}
                disabled={isSubmitting}
                className="border-b border-gray-300 shadow-[0_3px_4px_-3px_rgba(0,0,0,0.25)]"
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>

              <Button
                type="button"
                variant="reset"
                onClick={onReset}
                disabled={isSubmitting}
                className="border-b border-gray-300 shadow-[0_3px_4px_-3px_rgba(0,0,0,0.25)]"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>

              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting}
                className="border-b border-gray-300 shadow-[0_3px_4px_-3px_rgba(0,0,0,0.25)]"
              >
                <Save className="h-3 w-3" />
                {isSubmitting ? "Saving..." : "Save Workflow Amount Rules"}
              </Button>
            </Flex.ActionGroup>
          </div>
        </div>
      </Form>
    </FormContainer>
  );
};
