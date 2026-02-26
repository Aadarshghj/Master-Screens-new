import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { logger } from "@/global/service";
import { workflowAmountValidationSchema } from "@/global/validation/approval-workflow/workflowAmountRules-schema";
import {
  useSearchWorkflowAmountRulesQuery,
  useCreateWorkflowAmountRuleMutation,
  useUpdateWorkflowAmountRuleMutation,
  useDeleteWorkflowAmountRuleMutation,
  useToggleWorkflowAmountRuleStatusMutation,
  useGetWorkflowsForAmountQuery,
  useGetApprovalFlowsQuery,
  useLazyGetAssignedRolesByWorkflowQuery,
  useGetAmountOnOptionsQuery,
} from "@/global/service/end-points/approval-workflow/workflow-amount";

interface UseAmountRulesProps {
  editData?: {
    identity?: string;
    workflowIdentity?: string;
    workflow?: string;
    fromAmount?: number;
    toAmount?: number;
    amountOn?: string;
    approvalFlow?: string | string[];
    active?: boolean;
    // Add common alternative field names from WorkflowAmountRule
    workflowAmountRuleIdentity?: string;
    amountOnIdentity?: string;
    approvalFlowIdentity?: string | string[];
  };
  onSuccess?: () => void;
}

export const useAmountRules = ({
  editData,
  onSuccess,
}: UseAmountRulesProps = {}) => {
  // Form state
  const form = useForm({
    resolver: yupResolver(workflowAmountValidationSchema),
    defaultValues: {
      workflow: "",
      fromAmount: "",
      toAmount: "",
      amountOn: "",
      approvalFlow: [],
      active: true,
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const activeValue = watch("active");

  // UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<
    UseAmountRulesProps["editData"] | null
  >(null);

  // Filter state
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");
  const [selectedApprovalFlow, setSelectedApprovalFlow] = useState<string>("");
  const [selectedAmountOn, setSelectedAmountOn] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Table state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [workflow] = useState<string>("");

  // API queries
  const { data, isLoading, refetch } = useSearchWorkflowAmountRulesQuery({
    workflow,
    page,
    size,
  });
  const { data: workflows, isLoading: isLoadingWorkflows } =
    useGetWorkflowsForAmountQuery();
  const { data: approvalFlows, isLoading: isLoadingApprovalFlows } =
    useGetApprovalFlowsQuery();
  const [
    getAssignedRoles,
    { data: assignedRoles, isLoading: isLoadingAssignedRoles },
  ] = useLazyGetAssignedRolesByWorkflowQuery();
  const { data: amountOnOptions, isLoading: isLoadingAmountOn } =
    useGetAmountOnOptionsQuery();

  // API mutations
  const [createAmountRule, { isLoading: isCreating }] =
    useCreateWorkflowAmountRuleMutation();
  const [updateAmountRule, { isLoading: isUpdating }] =
    useUpdateWorkflowAmountRuleMutation();
  const [deleteAmountRule, { isLoading: isDeleting }] =
    useDeleteWorkflowAmountRuleMutation();
  const [toggleStatus, { isLoading: isToggling }] =
    useToggleWorkflowAmountRuleStatusMutation();

  // Form handlers
  const formatNumberInput = (value: string): string => {
    const numStr = value.replace(/[^\d.,]/g, "");
    const parts = numStr.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }
    if (parts[0]) {
      parts[0] = parts[0]
        .replace(/,/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return parts.join(".");
  };

  const onSubmit = async (data: {
    workflow: string;
    fromAmount: string;
    toAmount: string;
    amountOn: string;
    approvalFlow: string[];
    active: boolean;
  }) => {
    try {
      // Validate data before sending
      if (!data.workflow) {
        logger.error("Workflow is required. Please select a workflow.", {
          toast: true,
        });
        return;
      }
      if (!data.fromAmount) {
        logger.error("From amount is required", { toast: true });
        return;
      }
      if (!data.toAmount) {
        logger.error("To amount is required", { toast: true });
        return;
      }
      if (!data.amountOn) {
        logger.error("Amount on is required", { toast: true });
        return;
      }
      if (!data.approvalFlow || data.approvalFlow.length === 0) {
        logger.error("At least one approval flow is required", { toast: true });
        return;
      }

      const payload = {
        workflow: data.workflow,
        fromAmount: data.fromAmount,
        toAmount: data.toAmount,
        amountOn: data.amountOn,
        approvalFlow: data.approvalFlow,
        active: data.active,
      };

      if (editData?.identity) {
        const updatePayload = { identity: editData.identity, data: payload };
        await updateAmountRule(updatePayload).unwrap();
        logger.info("Workflow amount rule updated successfully", {
          toast: true,
        });
      } else {
        await createAmountRule(payload).unwrap();
        logger.info("Workflow amount rule created successfully", {
          toast: true,
        });
      }
      reset();
      setIsFormOpen(false);
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message ||
            (error as { message?: string }).message ||
            "Failed to save workflow amount rule"
          : "Failed to save workflow amount rule";
      logger.error(errorMessage, { toast: true });
    }
  };

  const handleReset = (
    setEditingRule: (rule: UseAmountRulesProps["editData"] | null) => void
  ) => {
    reset();
    setEditingRule(null);
    if (!editingRule) {
      setIsFormOpen(false);
    }
  };

  const handleCancel = (
    setEditingRule: (rule: UseAmountRulesProps["editData"] | null) => void
  ) => {
    reset();
    setEditingRule(null);
    setIsFormOpen(false);
  };

  // Update form when editData changes
  React.useEffect(() => {
    if (editData) {
      setIsFormOpen(true);
      const workflowId = editData.workflowIdentity || "";
      if (workflowId) {
        getAssignedRoles(workflowId);
      }
      reset({
        workflow: workflowId,
        fromAmount: editData.fromAmount?.toString() || "",
        toAmount: editData.toAmount?.toString() || "",
        amountOn: editData.amountOn || "",
        approvalFlow: Array.isArray(editData.approvalFlow)
          ? editData.approvalFlow
          : editData.approvalFlow
            ? [editData.approvalFlow]
            : [],
        active: editData.active ?? true,
      });
    } else {
      reset({
        workflow: "",
        fromAmount: "",
        toAmount: "",
        amountOn: "",
        approvalFlow: [],
        active: true,
      });
    }
  }, [editData, reset, getAssignedRoles]);

  // Filter handlers
  const handleWorkflowChange = (workflowId: string) => {
    setSelectedWorkflow(workflowId);
  };

  const handleApprovalFlowChange = (flowId: string) => {
    setSelectedApprovalFlow(flowId);
  };

  const handleAmountOnChange = (amountOnId: string) => {
    setSelectedAmountOn(amountOnId);
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const resetFilters = () => {
    setSelectedWorkflow("");
    setSelectedApprovalFlow("");
    setSelectedAmountOn("");
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  // Table handlers
  const handleDelete = async (identity: string) => {
    try {
      await deleteAmountRule(identity).unwrap();
      refetch();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleToggleStatus = async (identity: string, active: boolean) => {
    try {
      await toggleStatus({ identity, active }).unwrap();
      refetch();
    } catch (error) {
      console.error("Status toggle failed:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  return {
    // Form
    form,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    errors,
    activeValue,
    onSubmit,
    formatNumberInput,
    handleReset,
    handleCancel,

    // UI State
    isFormOpen,
    setIsFormOpen,
    editingRule,
    setEditingRule,

    // Filter
    selectedWorkflow,
    selectedApprovalFlow,
    selectedAmountOn,
    isFilterOpen,
    handleWorkflowChange,
    handleApprovalFlowChange,
    handleAmountOnChange,
    handleFilterToggle,
    resetFilters,
    applyFilters,

    // Table
    data,
    page,
    size,
    handleDelete,
    handleToggleStatus,
    handlePageChange,
    handleSizeChange,
    refetch,

    // Data
    workflows,
    approvalFlows,
    assignedRoles,
    amountOnOptions,
    getAssignedRoles,

    // Loading states
    isLoading,
    isLoadingWorkflows,
    isLoadingApprovalFlows,
    isLoadingAssignedRoles,
    isLoadingAmountOn,
    isCreating,
    isUpdating,
    isDeleting,
    isToggling,

    // Utils
    Controller,
  };
};
