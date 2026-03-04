import React from "react";
import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { FormContainer } from "@/components/ui/form-container";
import { Save, RefreshCw, Plus, ChevronDown } from "lucide-react";
import { useAmountRules } from "../hooks";
import type { WorkflowAmountRule } from "@/types/approval-workflow/workflow-amount.types";

interface WorkflowAmountRulesProps {
  editingRule: WorkflowAmountRule | null;
  setEditingRule: (rule: WorkflowAmountRule | null) => void;
  onRuleUpdated: () => void;
  selectedWorkflow?: string;
  onWorkflowChange?: (workflow: string) => void;
}

export const WorkflowAmountRules: React.FC<WorkflowAmountRulesProps> = ({
  editingRule,
  setEditingRule,
  onRuleUpdated,
  selectedWorkflow,
  onWorkflowChange,
}) => {
  const isInternalUpdate = React.useRef(false);
  // Helper function to extract error message
  const getErrorMessage = (
    error: { message?: string | { message?: string } } | undefined
  ): string | undefined => {
    if (!error) return undefined;
    if (typeof error.message === "string") return error.message;
    if (typeof error.message === "object" && error.message?.message)
      return error.message.message;
    return "Validation error";
  };

  const {
    // Form
    handleSubmit,
    control,
    reset,
    errors,
    setValue,
    watch,

    onSubmit,
    formatNumberInput,
    handleReset: handleResetFromHook,
    handleCancel: handleCancelFromHook,

    // UI State
    isFormOpen,
    setIsFormOpen,

    // Data
    workflows,
    approvalFlows,
    assignedRoles,
    amountOnOptions,
    getAssignedRoles,
    isLoadingWorkflows,
    isLoadingApprovalFlows,
    isLoadingAssignedRoles,
    isLoadingAmountOn,
    isCreating,
    isUpdating,
    Controller,
  } = useAmountRules({
    editData: editingRule || undefined,
    onSuccess: onRuleUpdated,
  });

  // Watch workflow field to trigger assigned roles API
  const workflowValue = watch("workflow");

  // Debug form errors
  React.useEffect(() => {
    console.log("Form errors:", errors);
    console.log("Form values:", watch());
  }, [errors, watch]);

  React.useEffect(() => {
    console.log("Workflow value changed:", workflowValue);
    if (workflowValue) {
      console.log("Calling getAssignedRoles with:", workflowValue);
      // Force refetch to get fresh data with new transformation
      getAssignedRoles(workflowValue, true);
    }
  }, [workflowValue, getAssignedRoles]);

  // Log assigned roles data
  React.useEffect(() => {
    console.log("Assigned roles data:", assignedRoles);
    console.log("Is loading assigned roles:", isLoadingAssignedRoles);
    if (assignedRoles && assignedRoles.length > 0) {
      console.log("First assigned role:", assignedRoles[0]);
    }
  }, [assignedRoles, isLoadingAssignedRoles]);

  // Sync workflow field with filter selection
  React.useEffect(() => {
    if (selectedWorkflow && selectedWorkflow !== "all" && !editingRule) {
      isInternalUpdate.current = true;
      setValue("workflow", selectedWorkflow);
      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 0);
    }
  }, [selectedWorkflow, editingRule, setValue]);

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

  // Debug and populate form when editingRule changes
  React.useEffect(() => {
    if (
      editingRule &&
      workflows &&
      workflows.length > 0 &&
      amountOnOptions &&
      amountOnOptions.length > 0
    ) {
      console.log("EditingRule changed:", editingRule);
      console.log("Available workflows:", workflows);
      console.log("Available amountOnOptions:", amountOnOptions);

      setIsFormOpen(true);

      // Use setTimeout to ensure the form is ready
      setTimeout(() => {
        reset({
          workflow: editingRule.workflowIdentity || "",
          fromAmount: editingRule.fromAmount?.toString() || "",
          toAmount: editingRule.toAmount?.toString() || "",
          amountOn: editingRule.amountOn || "",
          approvalFlow: Array.isArray(editingRule.approvalFlow)
            ? editingRule.approvalFlow
            : editingRule.approvalFlow
              ? [editingRule.approvalFlow]
              : [],
          active: editingRule.active ?? true,
        });
      }, 100);
    }
  }, [editingRule, reset, workflows, amountOnOptions]);

  const handleReset = () => {
    handleResetFromHook(rule =>
      setEditingRule(rule as WorkflowAmountRule | null)
    );
  };

  const handleCancel = () => {
    handleCancelFromHook(rule =>
      setEditingRule(rule as WorkflowAmountRule | null)
    );
  };

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-6 w-full">
        <HeaderWrapper>
          <TitleHeader title="Workflow Amount Rules" />
        </HeaderWrapper>
        {!editingRule ? (
          <Button
            variant="resetPrimary"
            size="compactWhite"
            onClick={() => setIsFormOpen(!isFormOpen)}
            disabled={isCreating || isUpdating}
          >
            <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-white">
              <Plus className="text-primary h-3 w-3" />
            </div>
            Add Amount Rule
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${isFormOpen ? "rotate-180" : ""}`}
            />
          </Button>
        ) : (
          <Button
            variant="resetPrimary"
            size="compactWhite"
            onClick={() => {
              setEditingRule(null);
              reset();
              setIsFormOpen(false);
            }}
            disabled={isCreating || isUpdating}
          >
            <Plus className="mr-2 h-3 w-3" />
            Add New Rule
          </Button>
        )}
      </Flex>

      {(isFormOpen || editingRule) && (
        <Form
          onSubmit={handleSubmit(data => {
            console.log("Form onSubmit triggered with data:", data);
            onSubmit(data);
          })}
        >
          <Form.Row>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Workflow" required>
                <Controller
                  name="workflow"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={value => {
                        console.log("Workflow Select onChange:", value);
                        field.onChange(value);
                      }}
                      placeholder="Select workflow"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={workflows || []}
                      loading={isLoadingWorkflows}
                      disabled={isLoadingWorkflows}
                    />
                  )}
                />
                <Form.Error
                  error={
                    errors.workflow
                      ? {
                          message: getErrorMessage(errors.workflow),
                          type: "validation",
                        }
                      : undefined
                  }
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="From Amount" required>
                <Controller
                  name="fromAmount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      size="form"
                      variant="form"
                      placeholder="eg: 0.00"
                      value={field.value}
                      onChange={e => {
                        const formatted = formatNumberInput(e.target.value);
                        field.onChange(formatted);
                      }}
                    />
                  )}
                />
                <Form.Error
                  error={
                    errors.fromAmount
                      ? {
                          message: getErrorMessage(errors.fromAmount),
                          type: "validation",
                        }
                      : undefined
                  }
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="To Amount" required>
                <Controller
                  name="toAmount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      size="form"
                      variant="form"
                      placeholder="eg: 100000.00"
                      value={field.value}
                      onChange={e => {
                        const formatted = formatNumberInput(e.target.value);
                        field.onChange(formatted);
                      }}
                    />
                  )}
                />
                <Form.Error
                  error={
                    errors.toAmount
                      ? {
                          message: getErrorMessage(errors.toAmount),
                          type: "validation",
                        }
                      : undefined
                  }
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Amount On" required>
                <Controller
                  name="amountOn"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select amount on"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={amountOnOptions || []}
                      loading={isLoadingAmountOn}
                      disabled={isLoadingAmountOn}
                    />
                  )}
                />
                <Form.Error
                  error={
                    errors.amountOn
                      ? {
                          message: getErrorMessage(errors.amountOn),
                          type: "validation",
                        }
                      : undefined
                  }
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Approval Flow" required>
                <Controller
                  name="approvalFlow"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => {
                    const rawOptions = assignedRoles || approvalFlows || [];
                    console.log(
                      "Raw options before fix:",
                      JSON.stringify(rawOptions)
                    );

                    // Fix options with undefined values
                    const options = rawOptions.map(opt => {
                      console.log(
                        "Mapping option:",
                        opt,
                        "value:",
                        opt.value,
                        "label:",
                        opt.label
                      );
                      return {
                        value: opt.value || opt.label,
                        label: opt.label,
                      };
                    });

                    console.log(
                      "Fixed MultiSelect options:",
                      JSON.stringify(options)
                    );
                    console.log("MultiSelect current value:", field.value);

                    return (
                      <MultiSelect
                        value={field.value || []}
                        onValueChange={value => {
                          console.log("Raw value from MultiSelect:", value);
                          const filtered = (value || []).filter(
                            v => v !== undefined && v !== null && v !== ""
                          );
                          console.log("Filtered approval flow:", filtered);
                          field.onChange(filtered.length > 0 ? filtered : []);
                        }}
                        placeholder="Select approval flows"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        options={options}
                        loading={
                          isLoadingAssignedRoles || isLoadingApprovalFlows
                        }
                        disabled={
                          isLoadingAssignedRoles ||
                          isLoadingApprovalFlows ||
                          !workflowValue
                        }
                      />
                    );
                  }}
                />
                <Form.Error
                  error={
                    errors.approvalFlow
                      ? {
                          message: getErrorMessage(errors.approvalFlow),
                          type: "validation",
                        }
                      : undefined
                  }
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Active">
                <div className="flex items-center gap-3 pt-2">
                  <Controller
                    name="active"
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
              {editingRule && (
                <Button
                  type="button"
                  variant="resetCompact"
                  size="compactWhite"
                  onClick={handleCancel}
                  disabled={isCreating || isUpdating}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="button"
                variant="resetCompact"
                size="compactWhite"
                onClick={handleReset}
                disabled={isCreating || isUpdating}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                type="submit"
                variant="resetPrimary"
                size="compactWhite"
                disabled={isCreating || isUpdating}
              >
                <Save className="mr-2 h-4 w-4" />
                {isCreating || isUpdating
                  ? "Processing..."
                  : editingRule
                    ? "Update Rule"
                    : "Save Amount Rule"}
              </Button>
            </Flex.ActionGroup>
          </div>
        </Form>
      )}
    </FormContainer>
  );
};
