import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { useAppDispatch } from "@/hooks/store";
import { resetWorkflowActionState } from "@/global/reducers/approval-workflow/workflow-actions.reducer";
import type { WorkflowActionFormProps } from "@/types/approval-workflow/workflow-actions.types";
import { RefreshCw, Save, Plus, ChevronDown, X } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Switch } from "@/components";
import { workflowActionDefaultFormValues } from "../../constants/form.constants";
import { useWorkflowActionsForm } from "../../hooks/useWorkflowActionsForm";

export const WorkflowActionsForm: React.FC<WorkflowActionFormProps> = ({
  readonly = false,
  selectedWorkflow,
  onWorkflowChange,
}) => {
  const dispatch = useAppDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const isInternalUpdate = React.useRef(false);

  const {
    formMethods,
    onSubmit,
    handleReset,
    isEditMode,
    isLoading,
    isLoadingWorkflows,
    isLoadingWorkflowAction,
    isLoadingWorkflowStage,
    workflowOptions,
    workflowActionOptions,
    linkedStageOptions,
    handleAutoPopulate,
    hasStageError,
  } = useWorkflowActionsForm({ readonly });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = formMethods;

  // Sync workflow field with filter selection
  React.useEffect(() => {
    if (selectedWorkflow && selectedWorkflow !== "all" && !isEditMode) {
      isInternalUpdate.current = true;
      setValue("workflow", selectedWorkflow);
      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 0);
    }
  }, [selectedWorkflow, isEditMode, setValue]);

  // Notify parent when form workflow changes
  const workflowValue = watch("workflow");

  // Fetch linked stages when workflow changes
  useEffect(() => {
    if (workflowValue && workflowValue !== "" && workflowOptions.length > 0) {
      workflowOptions.find(opt => opt.value === workflowValue);
    }
  }, [workflowValue, linkedStageOptions, workflowOptions]);
  React.useEffect(() => {
    if (workflowValue && onWorkflowChange && !isInternalUpdate.current) {
      onWorkflowChange(workflowValue);
    }
  }, [workflowValue, onWorkflowChange]);

  useEffect(() => {
    const handleSaveSuccess = (event: CustomEvent) => {
      const { isEditMode } = event.detail;
      if (!isEditMode) {
        setIsFormOpen(false);
      }
    };

    window.addEventListener(
      "workflowActionSaved",
      handleSaveSuccess as EventListener
    );
    return () => {
      window.removeEventListener(
        "workflowActionSaved",
        handleSaveSuccess as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (isEditMode) {
      setIsFormOpen(true);
    }
  }, [isEditMode]);

  const onResetHandler = () => {
    handleReset();
    if (!isEditMode) {
      setIsFormOpen(false);
    }
  };

  const onAddNewAction = () => {
    dispatch(resetWorkflowActionState());
    reset(workflowActionDefaultFormValues);
    setIsFormOpen(false);
  };

  return (
    <article className="workflow-actions-form-container">
      <FormContainer>
        <Flex justify="between" align="center" className="mb-6 w-full">
          <HeaderWrapper>
            <TitleHeader title="Workflow Actions" />
          </HeaderWrapper>

          {!isEditMode ? (
            <Button
              variant="resetPrimary"
              size="compactWhite"
              onClick={() => setIsFormOpen(!isFormOpen)}
              disabled={isLoading}
            >
              <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                <Plus className="text-primary h-3 w-3" />
              </div>
              Add Workflow Actions
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${isFormOpen ? "rotate-180" : ""}`}
              />
            </Button>
          ) : (
            <Button
              variant="resetPrimary"
              size="compactWhite"
              onClick={onAddNewAction}
              disabled={isLoading}
            >
              <Plus className="mr-2 h-3 w-3" />
              Add New Action
            </Button>
          )}
        </Flex>

        {(isFormOpen || isEditMode) && (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Workflow" required error={errors.workflow}>
                  <Controller
                    name="workflow"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading || readonly || isLoadingWorkflows}
                        placeholder="Select Workflow"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={workflowOptions}
                        loading={isLoadingWorkflows}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>
              <Form.Col lg={2} md={6} span={12}>
                <div className="pt-5 pl-4">
                  <Button
                    type="button"
                    variant="resetPrimary"
                    size="compactWhite"
                    disabled={!workflowValue || isLoading || hasStageError}
                    onClick={handleAutoPopulate}
                  >
                    Auto Populate All Actions
                  </Button>
                </div>
              </Form.Col>
            </Form.Row>

            <Form.Row className="mt-4">
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Linked Stage"
                  required
                  error={errors.linkedStage}
                >
                  <Controller
                    name="linkedStage"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={
                          isLoading ||
                          readonly ||
                          isLoadingWorkflowStage ||
                          !workflowValue
                        }
                        placeholder="Select Linked Stage"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={linkedStageOptions}
                        loading={isLoadingWorkflowStage}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Action Name"
                  required
                  error={errors.actionName}
                >
                  <Controller
                    name="actionName"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={
                          isLoading || readonly || isLoadingWorkflowAction
                        }
                        placeholder="Select Action"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={workflowActionOptions}
                        loading={isLoadingWorkflowAction}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Next Level" error={errors.nextLevel}>
                  <Controller
                    name="nextLevel"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={
                          isLoading || readonly || isLoadingWorkflowStage
                        }
                        placeholder="Select Next Level"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={linkedStageOptions}
                        loading={isLoadingWorkflowStage}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <div className="flex gap-6 pt-2">
                  <Form.Field label=" Terminal Action">
                    <Switch
                      id="terminalAction"
                      checked={watch("terminalAction")}
                      onCheckedChange={value =>
                        setValue("terminalAction", value)
                      }
                      disabled={isLoading || readonly}
                    />
                  </Form.Field>
                </div>
              </Form.Col>
            </Form.Row>

            <div className="mt-6">
              <Flex.ActionGroup>
                <Button
                  type="button"
                  variant="resetCompact"
                  size="compactWhite"
                  onClick={onResetHandler}
                  disabled={isLoading || readonly}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="resetCompact"
                  size="compactWhite"
                  onClick={handleReset}
                  disabled={isLoading || readonly}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>

                <Button
                  type="submit"
                  variant="resetPrimary"
                  size="compactWhite"
                  disabled={isLoading || readonly}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading
                    ? "Processing..."
                    : isEditMode
                      ? "Update Workflow Action"
                      : "Save Workflow Action"}
                </Button>
              </Flex.ActionGroup>
            </div>
          </Form>
        )}
      </FormContainer>
    </article>
  );
};
