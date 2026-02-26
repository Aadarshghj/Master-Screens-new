import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  setIsReady,
  resetWorkflowDefinitionState,
} from "@/global/reducers/approval-workflow/workflow-definitions.reducer";
import {
  useSaveWorkflowDefinitionMutation,
  useUpdateWorkflowDefinitionMutation,
  useGetModulesAndSubModulesQuery,
} from "@/global/service/end-points/approval-workflow/workflow-definitions";
import { logger } from "@/global/service";
import type {
  WorkflowDefinitionFormData,
  SaveWorkflowDefinitionPayload,
  UpdateWorkflowDefinitionPayload,
} from "@/types/approval-workflow/workflow-definitions.types";
import { workflowDefinitionDefaultFormValues } from "../constants/form.constants";
import { workflowDefinitionValidationSchema } from "@/global/validation/approval-workflow/workflowDefinitions-schema";

interface UseWorkflowDefinitionsFormProps {
  readonly?: boolean;
}

export const useWorkflowDefinitionsForm = ({
  readonly = false,
}: UseWorkflowDefinitionsFormProps = {}) => {
  const dispatch = useAppDispatch();

  // Redux state
  const { isEditMode, currentDefinitionId, currentDefinitionData } =
    useAppSelector(state => state.workflowDefinitions);

  // API hooks
  const { data: moduleOptions = [], isLoading: isLoadingModules } =
    useGetModulesAndSubModulesQuery();

  const [saveDefinition, { isLoading: isSaving }] =
    useSaveWorkflowDefinitionMutation();
  const [updateDefinition, { isLoading: isUpdating }] =
    useUpdateWorkflowDefinitionMutation();

  const isLoading = isSaving || isUpdating;

  // Form setup
  const formMethods = useForm<WorkflowDefinitionFormData>({
    resolver: yupResolver(workflowDefinitionValidationSchema),
    mode: "onBlur",
    defaultValues: workflowDefinitionDefaultFormValues,
  });

  const { reset, setValue, watch } = formMethods;

  // Derived state
  const selectedModule = watch("module");

  const subModuleOptions = useMemo(() => {
    if (!selectedModule || !moduleOptions.length) return [];

    const selectedModuleData = moduleOptions.find(
      mod => mod.identity === selectedModule
    );

    if (!selectedModuleData?.subModules) return [];

    return selectedModuleData.subModules
      .filter(sub => sub.isActive)
      .map(sub => ({
        value: sub.identity,
        label: sub.subModuleName,
        identity: sub.identity,
      }));
  }, [selectedModule, moduleOptions]);

  useEffect(() => {
    if (
      isEditMode &&
      currentDefinitionId &&
      currentDefinitionData &&
      moduleOptions.length > 0
    ) {
      const moduleIdentity =
        currentDefinitionData.moduleIdentity || currentDefinitionData.module;

      const subModuleIdentity =
        currentDefinitionData.subModuleIdentity ||
        currentDefinitionData.subModule;

      setTimeout(() => {
        setValue("module", moduleIdentity, { shouldValidate: false });
        setValue("workflowName", currentDefinitionData.workflowName, {
          shouldValidate: false,
        });
        setValue("description", currentDefinitionData.description || "", {
          shouldValidate: false,
        });
        setValue(
          "isActive",
          currentDefinitionData.active ?? currentDefinitionData.isActive,
          { shouldValidate: false }
        );

        setTimeout(() => {
          setValue("subModule", subModuleIdentity, { shouldValidate: false });
        }, 50);
      }, 0);

      logger.info("Workflow definition data loaded for editing");
    }
  }, [
    isEditMode,
    currentDefinitionId,
    currentDefinitionData,
    moduleOptions,
    setValue,
  ]);
  // Handlers
  const onSubmit = useCallback(
    async (data: WorkflowDefinitionFormData) => {
      try {
        const basePayload = {
          moduleIdentity: data.module,
          subModuleIdentity: data.subModule,
          workflowName: data.workflowName,
          description: data.description,
          active: data.isActive,
        };

        if (isEditMode && currentDefinitionId) {
          await updateDefinition({
            definitionId: currentDefinitionId,
            payload: basePayload as UpdateWorkflowDefinitionPayload,
          }).unwrap();

          logger.info("Workflow definition updated successfully", {
            toast: true,
          });
          dispatch(resetWorkflowDefinitionState());
        } else {
          await saveDefinition(
            basePayload as SaveWorkflowDefinitionPayload
          ).unwrap();

          logger.info("Workflow definition saved successfully", {
            toast: true,
          });
        }

        dispatch(setIsReady(true));
        reset(workflowDefinitionDefaultFormValues);

        window.dispatchEvent(
          new CustomEvent("workflowDefinitionSaved", {
            detail: { isEditMode },
          })
        );

        window.dispatchEvent(new CustomEvent("refreshWorkflowDefinitions"));
      } catch (error) {
        if (typeof error === "object" && error !== null) {
          const apiError = error as {
            status?: number;
            data?: {
              message?: string;
              error?: string;
              errorCode?: string;
              timestamp?: string;
            };
          };

          const errorMessage =
            apiError.data?.message ||
            apiError.data?.error ||
            `Failed to ${isEditMode ? "update" : "save"} workflow definition`;

          logger.error(errorMessage, { toast: true });
        } else {
          logger.error("An unexpected error occurred", { toast: true });
        }
      }
    },
    [
      saveDefinition,
      updateDefinition,
      dispatch,
      reset,
      currentDefinitionId,
      isEditMode,
    ]
  );

  const handleReset = useCallback(() => {
    if (isEditMode) {
      dispatch(resetWorkflowDefinitionState());
    }
    reset(workflowDefinitionDefaultFormValues);
  }, [reset, isEditMode, dispatch]);

  const handleCancel = useCallback(() => {
    if (isEditMode) {
      dispatch(resetWorkflowDefinitionState());
    }
    reset(workflowDefinitionDefaultFormValues);
  }, [reset, isEditMode, dispatch]);

  return {
    // Form methods
    formMethods,
    onSubmit,
    handleReset,
    handleCancel,

    // State
    isEditMode,
    isLoading,
    readonly,
    isLoadingModules,

    // Options
    moduleOptions,
    subModuleOptions,
    selectedModule,
  };
};
