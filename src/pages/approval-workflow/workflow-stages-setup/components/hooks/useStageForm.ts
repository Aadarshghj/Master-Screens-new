import React, { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { logger } from "@/global/service";
import {
  useGetWorkflowsQuery,
  useGetRolesQuery,
  useCreateWorkflowStageMutation,
  useUpdateWorkflowStageMutation,
} from "@/global/service/end-points/approval-workflow/stage-setup";
import { workflowStageDefaultValues } from "@/pages/approval-workflow/workflow-stages-setup/constants/form.constants";
import { workflowStageValidationSchema } from "@/global/validation/approval-workflow/workflowStageStetup-schema";
import type {
  WorkflowStageFormData,
  WorkflowStage,
} from "@/types/approval-workflow/workflow-stagesetup";

interface UseStageFormProps {
  editingStage: WorkflowStage | null;
  setEditingStage: (stage: WorkflowStage | null) => void;
  onStageUpdated: () => void;
}

export const useStageForm = ({
  editingStage,
  setEditingStage,
  onStageUpdated,
}: UseStageFormProps) => {
  // Form state
  const {
    handleSubmit,
    control,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WorkflowStageFormData>({
    resolver: yupResolver(workflowStageValidationSchema),
    defaultValues: workflowStageDefaultValues,
  });

  // API queries
  const { data: workflowOptions = [], isLoading: isLoadingWorkflows } =
    useGetWorkflowsQuery();
  const { data: roleOptions = [], isLoading: isLoadingRoles } =
    useGetRolesQuery();

  // API mutations
  const [createWorkflowStage, { isLoading: isCreating }] =
    useCreateWorkflowStageMutation();
  const [updateWorkflowStage, { isLoading: isUpdating }] =
    useUpdateWorkflowStageMutation();

  // Form handlers
  const onSubmit = useCallback(
    async (data: WorkflowStageFormData) => {
      try {
        // Create clean payload with only required fields
        const cleanData: WorkflowStageFormData = {
          workflow: data.workflow,
          levelName: data.levelName,
          assignedToRole: data.assignedToRole,
          finalLevel: data.finalLevel,
        };

        if (editingStage) {
          await updateWorkflowStage({
            identity: editingStage.identity!,
            data: cleanData,
          }).unwrap();
          logger.info("Workflow stage updated successfully", { toast: true });
          setEditingStage(null);
        } else {
          await createWorkflowStage(cleanData).unwrap();
          logger.info("Workflow stage created successfully", { toast: true });
        }
        reset(workflowStageDefaultValues);
        onStageUpdated();
      } catch (error: unknown) {
        const errorMessage =
          error && typeof error === "object" && "data" in error
            ? (error as { data?: { message?: string } }).data?.message ||
              (error as { message?: string }).message ||
              "An error occurred"
            : "An error occurred";
        logger.error(errorMessage, { toast: true });
      }
    },
    [
      editingStage,
      createWorkflowStage,
      updateWorkflowStage,
      reset,
      onStageUpdated,
      setEditingStage,
    ]
  );

  const handleReset = useCallback(() => {
    reset(workflowStageDefaultValues);
    setEditingStage(null);
  }, [reset, setEditingStage]);

  const handleCancel = useCallback(() => {
    reset(workflowStageDefaultValues);
    setEditingStage(null);
  }, [reset, setEditingStage]);

  // Update form when editingStage changes
  React.useEffect(() => {
    if (editingStage && workflowOptions.length > 0 && roleOptions.length > 0) {
      const workflowValue =
        editingStage.workflowIdentity || editingStage.workflow || "";
      const roleValue =
        editingStage.assignedRoleIdentity || editingStage.assignedToRole || "";
      const levelNameValue = editingStage.levelName || "";
      const finalLevelValue =
        editingStage.isFinalLevel !== undefined
          ? editingStage.isFinalLevel
          : editingStage.finalLevel || false;

      // Use setTimeout to ensure Select components are mounted
      setTimeout(() => {
        setValue("workflow", workflowValue, { shouldValidate: false });
        setValue("assignedToRole", roleValue, { shouldValidate: false });
        setValue("levelName", levelNameValue, { shouldValidate: false });
        setValue("finalLevel", finalLevelValue, { shouldValidate: false });
      }, 0);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (!editingStage) {
      reset(workflowStageDefaultValues);
    }
  }, [editingStage, workflowOptions, roleOptions, setValue, reset]);

  return {
    // Form
    handleSubmit,
    control,
    register,
    reset,
    setValue,
    watch,
    errors,
    onSubmit,
    handleReset,
    handleCancel,

    // Data
    workflowOptions,
    roleOptions,

    // Loading states
    isLoadingWorkflows,
    isLoadingRoles,
    isLoading: isCreating || isUpdating,

    // Utils
    Controller,
  };
};
