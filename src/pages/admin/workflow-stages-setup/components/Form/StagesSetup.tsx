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
import type { Option, WorkflowStageForm } from "@/types/admin/workflow-stages";

interface StagesSetupProps {
  control: Control<WorkflowStageForm>;
  errors: FieldErrors<WorkflowStageForm>;
  register: UseFormRegister<WorkflowStageForm>;
  isSubmitting: boolean;
  readonly: boolean;
  workflowOptions: Option[];
  roleOptions: Option[];
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const StagesSetup: React.FC<StagesSetupProps> = ({
  control,
  errors,
  register,
  isSubmitting,
  workflowOptions,
  roleOptions,
  onSubmit,
  onCancel,
  onReset,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <TitleHeader title="Workflow Stages Setup" />
            <Button
              className="border-b border-gray-300 shadow-[0_3px_4px_-3px_rgba(0,0,0,0.25)]"
              type="submit"
              variant="default"
              size="sm"
            >
              <PlusCircle width={12} className="mr-1" />
              Add Workflow Stages Setup
            </Button>
          </div>

          <div className="mt-6">
            <Form.Row>
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="Workflow">
                  <Controller
                    name="workflowIdentity"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value?.value ?? ""}
                        onValueChange={value => {
                          const selected =
                            workflowOptions.find(
                              option => option.value === value
                            ) || null;
                          field.onChange(selected);
                        }}
                        placeholder="Select workflow"
                        size="form"
                        variant="form"
                        fullWidth
                        itemVariant="form"
                        options={workflowOptions}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Level Order"
                  required
                  error={errors.levelOrder}
                >
                  <Input
                    {...register("levelOrder", {
                      valueAsNumber: true,
                      min: 1,
                    })}
                    type="number"
                    placeholder="1 for Level 1, 2 for Level 2"
                    size="form"
                    variant="form"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Level Name"
                  required
                  error={errors.levelName}
                >
                  <Input
                    {...register("levelName")}
                    placeholder="Enter level name"
                    size="form"
                    variant="form"
                    className="uppercase"
                    onInput={e => {
                      const target = e.target as HTMLInputElement;
                      target.value = target.value.replace(
                        /[^A-Za-z0-9\s]/g,
                        ""
                      );
                    }}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Assigned To Role">
                  <Controller
                    name="assignedRoleIdentity"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value?.value ?? ""}
                        onValueChange={value => {
                          const selected =
                            roleOptions.find(
                              option => option.value === value
                            ) || null;
                          field.onChange(selected);
                        }}
                        placeholder="Select role"
                        size="form"
                        variant="form"
                        fullWidth
                        itemVariant="form"
                        options={roleOptions}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>
              <div className="mt-4 w-100">
                <Form.Col lg={2} md={6} span={12}>
                  <Flex direction="col" gap={1}>
                    <Flex align="center" gap={2}>
                      <Controller
                        name="isFinalLevel"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            id="isFinalLevel"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isSubmitting}
                          />
                        )}
                      />
                      <Label htmlFor="isFinalLevel">Final Stage</Label>
                    </Flex>
                  </Flex>
                </Form.Col>
              </div>
            </Form.Row>

            <Flex.ActionGroup className="mt-14 gap-4">
              <Button
                className="border-b border-gray-300 shadow-[0_3px_4px_-3px_rgba(0,0,0,0.25)]"
                type="button"
                variant="footer"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>

              <Button
                className="border-b border-gray-300 shadow-[0_3px_4px_-3px_rgba(0,0,0,0.25)]"
                type="button"
                variant="reset"
                onClick={onReset}
                disabled={isSubmitting}
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>

              <Button
                className="border-b border-gray-300 shadow-[0_3px_4px_-3px_rgba(0,0,0,0.25)]"
                type="submit"
                variant="default"
                disabled={isSubmitting}
              >
                <Save className="h-3 w-3" />
                {isSubmitting ? "Saving..." : "Save Workflow Stages Setup"}
              </Button>
            </Flex.ActionGroup>
          </div>
        </div>
      </Form>
    </FormContainer>
  );
};
