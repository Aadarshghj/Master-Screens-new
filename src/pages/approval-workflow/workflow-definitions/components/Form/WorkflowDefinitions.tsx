import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { useAppDispatch } from "@/hooks/store";
import { resetWorkflowDefinitionState } from "@/global/reducers/approval-workflow/workflow-definitions.reducer";
import type { WorkflowDefinitionFormProps } from "@/types/approval-workflow/workflow-definitions.types";
import { RefreshCw, Save, Plus, ChevronDown } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Label, Switch, Textarea, Input } from "@/components";
import { workflowDefinitionDefaultFormValues } from "../../constants/form.constants";
import { useWorkflowDefinitionsForm } from "../../hooks/useWorkflowDefinitionsForm";

export const WorkflowDefinitionsForm: React.FC<WorkflowDefinitionFormProps> = ({
  readonly = false,
  selectedModule: selectedModuleFromFilter,
  selectedSubModule: selectedSubModuleFromFilter,
  onModuleChange,
  onSubModuleChange,
}) => {
  const dispatch = useAppDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const isInternalUpdate = React.useRef(false);

  const {
    formMethods,
    onSubmit,
    handleReset,
    handleCancel,
    isEditMode,
    isLoading,
    isLoadingModules,
    moduleOptions,
    subModuleOptions,
    selectedModule,
  } = useWorkflowDefinitionsForm({ readonly });

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = formMethods;

  // Sync form with filter selection
  React.useEffect(() => {
    if (
      selectedModuleFromFilter &&
      selectedModuleFromFilter !== "all" &&
      !isEditMode
    ) {
      isInternalUpdate.current = true;
      setValue("module", selectedModuleFromFilter);
      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 0);
    }
  }, [selectedModuleFromFilter, isEditMode, setValue]);

  React.useEffect(() => {
    if (
      selectedSubModuleFromFilter &&
      selectedSubModuleFromFilter !== "all" &&
      !isEditMode
    ) {
      isInternalUpdate.current = true;
      setValue("subModule", selectedSubModuleFromFilter);
      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 0);
    }
  }, [selectedSubModuleFromFilter, isEditMode, setValue]);

  // Notify parent when form module/submodule changes
  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (!isInternalUpdate.current) {
        if (name === "module" && value.module && onModuleChange) {
          onModuleChange(value.module);
        }
        if (name === "subModule" && value.subModule && onSubModuleChange) {
          onSubModuleChange(value.subModule);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onModuleChange, onSubModuleChange]);

  useEffect(() => {
    const handleSaveSuccess = (event: CustomEvent) => {
      const { isEditMode } = event.detail;
      if (!isEditMode) {
        setIsFormOpen(false);
      }
    };

    window.addEventListener(
      "workflowDefinitionSaved",
      handleSaveSuccess as EventListener
    );
    return () => {
      window.removeEventListener(
        "workflowDefinitionSaved",
        handleSaveSuccess as EventListener
      );
    };
  }, []);

  const onCancelHandler = () => {
    handleCancel();
    setIsFormOpen(false);
  };

  const onAddNewDefinition = () => {
    dispatch(resetWorkflowDefinitionState());
    reset(workflowDefinitionDefaultFormValues);
    setIsFormOpen(false);
  };

  return (
    <article className="workflow-definitions-form-container">
      <FormContainer>
        <Flex justify="between" align="center" className="mb-6 w-full">
          <HeaderWrapper>
            <TitleHeader title="Workflow Definitions" />
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
              Add Workflow Definition
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${isFormOpen ? "rotate-180" : ""}`}
              />
            </Button>
          ) : (
            <Button
              variant="resetPrimary"
              size="compactWhite"
              onClick={onAddNewDefinition}
              disabled={isLoading}
            >
              <Plus className="mr-2 h-3 w-3" />
              Add New Definition
            </Button>
          )}
        </Flex>

        {(isFormOpen || isEditMode) && (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Module" required error={errors.module}>
                  <Controller
                    name="module"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading || readonly || isLoadingModules}
                        placeholder="Select Module"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={moduleOptions.map(opt => ({
                          value: opt.identity || opt.value,
                          label: opt.label,
                        }))}
                        loading={isLoadingModules}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Sub Module"
                  required
                  error={errors.subModule}
                >
                  <Controller
                    name="subModule"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={
                          isLoading ||
                          readonly ||
                          !selectedModule ||
                          subModuleOptions.length === 0
                        }
                        placeholder="Select Sub Module"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={subModuleOptions.map(opt => ({
                          value: opt.identity,
                          label: opt.label,
                        }))}
                        loading={isLoadingModules}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Workflow Name"
                  required
                  error={errors.workflowName}
                >
                  <Input
                    {...register("workflowName")}
                    placeholder="Enter Workflow Name"
                    size="form"
                    variant="form"
                    disabled={isLoading || readonly}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={4} md={12} span={12}>
                <Form.Field label="Description" error={errors.description}>
                  <Textarea
                    {...register("description")}
                    placeholder="Enter Description"
                    size="form"
                    variant="form"
                    rows={3}
                    disabled={isLoading || readonly}
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>

            <Form.Row className="mt-1">
              <Form.Col lg={2} md={6} span={12}>
                <Flex align="center" gap={2} className="mt-9 h-full">
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="isActive"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading || readonly}
                      />
                    )}
                  />
                  <Label htmlFor="isActive" className="text-xs font-medium">
                    Active
                  </Label>
                </Flex>
              </Form.Col>
            </Form.Row>

            <div className="mt-6">
              <Flex.ActionGroup>
                <Button
                  type="button"
                  variant="resetCompact"
                  size="compactWhite"
                  onClick={onCancelHandler}
                  disabled={isLoading || readonly}
                >
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
                      ? "Save Workflow Definition"
                      : "Save Workflow Definition"}
                </Button>
              </Flex.ActionGroup>
            </div>
          </Form>
        )}
      </FormContainer>
    </article>
  );
};
