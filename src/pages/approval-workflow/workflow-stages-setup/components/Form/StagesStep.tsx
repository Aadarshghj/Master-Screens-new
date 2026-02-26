import React, { useState } from "react";
import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { FormContainer } from "@/components/ui/form-container";
import { Save, RefreshCw, Plus, ChevronDown } from "lucide-react";
import { useStageForm } from "../hooks";
import type { StagesSetupProps } from "@/types/approval-workflow/workflow-stagesetup";

export const StagesSetup: React.FC<StagesSetupProps> = ({
  editingStage,
  setEditingStage,
  onStageUpdated,
  selectedWorkflow,
  onWorkflowChange,
}) => {
  const isInternalUpdate = React.useRef(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    handleSubmit,
    control,
    register,
    errors,
    onSubmit,
    handleReset,
    handleCancel,
    workflowOptions,
    roleOptions,
    isLoadingWorkflows,
    isLoadingRoles,
    isLoading,
    Controller,
    setValue,
    watch,
  } = useStageForm({ editingStage, setEditingStage, onStageUpdated });

  // Sync workflow field with filter selection
  React.useEffect(() => {
    if (selectedWorkflow && selectedWorkflow !== "all" && !editingStage) {
      isInternalUpdate.current = true;
      setValue("workflow", selectedWorkflow);
      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 0);
    }
  }, [selectedWorkflow, editingStage, setValue]);

  // Notify parent when form workflow changes
  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (
        name === "workflow" &&
        value.workflow &&
        onWorkflowChange &&
        !isInternalUpdate.current
      ) {
        onWorkflowChange(value.workflow);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onWorkflowChange]);

  const onCancelHandler = () => {
    handleCancel();
    setIsFormOpen(false);
  };

  const onAddNewStage = () => {
    handleReset();
    setIsFormOpen(false);
  };

  React.useEffect(() => {
    if (editingStage) {
      setIsFormOpen(true);
    }
  }, [editingStage]);

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-6 w-full">
        <HeaderWrapper>
          <TitleHeader title="Workflow Stages Setup" />
        </HeaderWrapper>

        {!editingStage ? (
          <Button
            variant="resetPrimary"
            size="compactWhite"
            onClick={() => setIsFormOpen(!isFormOpen)}
            disabled={isLoading}
          >
            <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-white">
              <Plus className="text-primary h-3 w-3" />
            </div>
            Add workflow stages setup
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${isFormOpen ? "rotate-180" : ""}`}
            />
          </Button>
        ) : (
          <Button
            variant="resetPrimary"
            size="compactWhite"
            onClick={onAddNewStage}
            disabled={isLoading}
          >
            <Plus className="mr-2 h-3 w-3" />
            Add New Stage
          </Button>
        )}
      </Flex>

      {(isFormOpen || editingStage) && (
        <Form
          onSubmit={handleSubmit(onSubmit)}
          key={editingStage?.identity || "new"}
        >
          <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Workflow" required>
                <Controller
                  name="workflow"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select workflow"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={workflowOptions}
                      loading={isLoadingWorkflows}
                      disabled={isLoadingWorkflows}
                    />
                  )}
                />
                <Form.Error error={errors.workflow} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Level Name" required>
                <Input
                  type="text"
                  size="form"
                  variant="form"
                  placeholder="eg: bank manager, compliance"
                  {...register("levelName")}
                />
                <Form.Error error={errors.levelName} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Assigned to role" required>
                <Controller
                  name="assignedToRole"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select role"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={roleOptions}
                      loading={isLoadingRoles}
                      disabled={isLoadingRoles}
                    />
                  )}
                />
                <Form.Error error={errors.assignedToRole} />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Final Level">
                <div className="flex items-center gap-3 pt-2">
                  <Controller
                    name="finalLevel"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <div className="mt-4 mb-6">
            <Flex.ActionGroup>
              <Button
                type="button"
                variant="resetCompact"
                size="compactWhite"
                onClick={onCancelHandler}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="resetCompact"
                size="compactWhite"
                onClick={handleReset}
                disabled={isLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                type="submit"
                variant="resetPrimary"
                size="compactWhite"
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading
                  ? "Processing..."
                  : editingStage
                    ? "Update"
                    : "Save workflow stages setup"}
              </Button>
            </Flex.ActionGroup>
          </div>
        </Form>
      )}
    </FormContainer>
  );
};
