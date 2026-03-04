import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  setIsReady,
  resetWorkflowActionState,
} from "@/global/reducers/approval-workflow/workflow-actions.reducer";
import {
  useSaveWorkflowActionMutation,
  useUpdateWorkflowActionMutation,
  useLazyGetLinkedStagesQuery,
  useAutoPopulateWorkflowActionsMutation,
} from "@/global/service/end-points/approval-workflow/workflow-actions";
import {
  useGetWorkflowActionQuery,
  useGetWorkflowDefinitionsQuery,
} from "@/global/service/end-points/approval-workflow/workflow-definitions";
import { logger } from "@/global/service";
import type {
  WorkflowActionFormData,
  SaveWorkflowActionPayload,
  UpdateWorkflowActionPayload,
  ConfigOption,
} from "@/types/approval-workflow/workflow-actions.types";
import { workflowActionDefaultFormValues } from "../constants/form.constants";
import { workflowActionValidationSchema } from "@/global/validation/approval-workflow/workflowActions-schema";

interface UseWorkflowActionsFormProps {
  readonly?: boolean;
}

export const useWorkflowActionsForm = ({
  readonly = false,
}: UseWorkflowActionsFormProps = {}) => {
  const dispatch = useAppDispatch();

  // Redux state
  const { isEditMode, currentActionId, currentActionData } = useAppSelector(
    state => state.workflowActions
  );

  // Local state
  const [linkedStageOptions, setLinkedStageOptions] = useState<ConfigOption[]>(
    []
  );
  const [hasStageError, setHasStageError] = useState(false);

  // API hooks
  const { data: workflowOptions = [], isLoading: isLoadingWorkflows } =
    useGetWorkflowDefinitionsQuery();

  const {
    data: workflowActionOptions = [],
    isLoading: isLoadingWorkflowAction,
  } = useGetWorkflowActionQuery();

  const [triggerWorkflowStage, { isLoading: isLoadingWorkflowStage }] =
    useLazyGetLinkedStagesQuery();

  const [saveAction, { isLoading: isSaving }] = useSaveWorkflowActionMutation();
  const [updateAction, { isLoading: isUpdating }] =
    useUpdateWorkflowActionMutation();
  const [autoPopulate, { isLoading: isAutoPopulating }] =
    useAutoPopulateWorkflowActionsMutation();

  const isLoading = isSaving || isUpdating || isAutoPopulating;

  // Form setup
  const formMethods = useForm<WorkflowActionFormData>({
    resolver: yupResolver(workflowActionValidationSchema),
    mode: "onBlur",
    defaultValues: workflowActionDefaultFormValues,
  });

  const { reset, setValue, watch } = formMethods;

  // Derived state - watch the workflow field
  const selectedWorkflowValue = watch("workflow");

  // Helper functions
  const getValueFromIdentity = useCallback(
    (identity: string, options: ConfigOption[]): string => {
      const option = options.find(
        opt => opt.identity === identity || opt.value === identity
      );
      return option?.value || identity;
    },
    []
  );

  const getIdentityFromValue = useCallback(
    (value: string, options: ConfigOption[]): string => {
      const option = options.find(opt => opt.value === value);
      return option?.identity || option?.value || value;
    },
    []
  );

  useEffect(() => {
    if (
      !selectedWorkflowValue ||
      selectedWorkflowValue === "" ||
      workflowOptions.length === 0
    ) {
      setLinkedStageOptions([]);
      setHasStageError(false);
      return;
    }

    const workflowIdentity = selectedWorkflowValue;

    triggerWorkflowStage(workflowIdentity)
      .unwrap()
      .then(linkedStages => {
        setLinkedStageOptions(linkedStages);
        setHasStageError(false);
      })
      .catch(error => {
        const apiError = error as {
          data?: {
            message?: string;
          };
        };
        const errorMessage =
          apiError.data?.message || "Failed to fetch linked stages";
        logger.error(errorMessage, { toast: true });
        setLinkedStageOptions([]);
        setHasStageError(true);
      });
  }, [selectedWorkflowValue, workflowOptions.length, triggerWorkflowStage]);

  useEffect(() => {
    if (isEditMode && currentActionId && currentActionData) {
      if (
        currentActionData.workflowIdentity &&
        linkedStageOptions.length === 0 &&
        !isLoadingWorkflowStage
      ) {
        setValue(
          "workflow",
          getValueFromIdentity(
            currentActionData.workflowIdentity,
            workflowOptions
          )
        );
        return;
      }

      if (linkedStageOptions.length > 0 && currentActionData.workflowIdentity) {
        const workflowValue = getValueFromIdentity(
          currentActionData.workflowIdentity,
          workflowOptions
        );

        const linkedStageValue = getValueFromIdentity(
          currentActionData.linkedStageIdentity ?? "",
          linkedStageOptions
        );

        let nextLevelValue = "";
        if (currentActionData.nextLevelIdentity) {
          nextLevelValue = getValueFromIdentity(
            currentActionData.nextLevelIdentity,
            linkedStageOptions
          );
        } else if (currentActionData.nextLevelStageName) {
          const nextLevelOption = linkedStageOptions.find(
            opt => opt.label === currentActionData.nextLevelStageName
          );
          nextLevelValue = nextLevelOption?.value || "";
        }

        setTimeout(() => {
          setValue("workflow", workflowValue);
          setValue("linkedStage", linkedStageValue);
          setValue("actionName", currentActionData.actionName);
          setValue("nextLevel", nextLevelValue);
          setValue("terminalAction", currentActionData.terminalAction);
        }, 0);

        logger.info(
          "Workflow action data loaded for editing from search results"
        );
      }
    }
  }, [
    isEditMode,
    currentActionId,
    currentActionData,
    setValue,
    workflowOptions,
    linkedStageOptions,
    isLoadingWorkflowStage,
    getValueFromIdentity,
  ]);

  const onSubmit = useCallback(
    async (data: WorkflowActionFormData) => {
      try {
        const basePayload = {
          workflowIdentity: getIdentityFromValue(
            data.workflow,
            workflowOptions
          ),
          linkedStageIdentity: getIdentityFromValue(
            data.linkedStage,
            linkedStageOptions
          ),
          actionName: data.actionName,
          nextLevelStageIdentity: getIdentityFromValue(
            data.nextLevel || "",
            linkedStageOptions
          ),
          isTerminalAction: data.terminalAction,
          tenantIdentity: "1563455e-fb89-4049-9cbe-02148017e1e6",
        };

        if (isEditMode && currentActionId) {
          await updateAction({
            actionId: currentActionId,
            payload: basePayload as UpdateWorkflowActionPayload,
          }).unwrap();

          logger.info("Workflow action updated successfully", {
            toast: true,
          });
          dispatch(resetWorkflowActionState());
        } else {
          await saveAction(basePayload as SaveWorkflowActionPayload).unwrap();

          logger.info("Workflow action saved successfully", {
            toast: true,
          });
        }

        dispatch(setIsReady(true));
        reset(workflowActionDefaultFormValues);

        // Dispatch success event
        window.dispatchEvent(
          new CustomEvent("workflowActionSaved", {
            detail: { isEditMode },
          })
        );

        window.dispatchEvent(new CustomEvent("refreshWorkflowActions"));
      } catch (error) {
        const apiError = error as {
          status?: number;
          data?: {
            message?: string;
            error?: string;
          };
        };

        const errorMessage =
          apiError.data?.message ||
          apiError.data?.error ||
          `Failed to ${isEditMode ? "update" : "save"} workflow action`;

        logger.error(errorMessage, { toast: true });
      }
    },
    [
      saveAction,
      updateAction,
      dispatch,
      reset,
      currentActionId,
      isEditMode,
      workflowOptions,
      linkedStageOptions,
      getIdentityFromValue,
    ]
  );

  const handleReset = useCallback(() => {
    if (isEditMode) {
      dispatch(resetWorkflowActionState());
    }
    reset(workflowActionDefaultFormValues);
  }, [reset, isEditMode, dispatch]);

  const handleCancel = useCallback(() => {
    if (isEditMode) {
      dispatch(resetWorkflowActionState());
    }
    reset(workflowActionDefaultFormValues);
  }, [reset, isEditMode, dispatch]);

  const handleAutoPopulate = useCallback(async () => {
    if (!selectedWorkflowValue) return;

    try {
      await autoPopulate(selectedWorkflowValue).unwrap();
      logger.info("Workflow actions auto-populated successfully", {
        toast: true,
      });
      window.dispatchEvent(new CustomEvent("refreshWorkflowActions"));
    } catch (error) {
      const apiError = error as {
        data?: {
          message?: string;
        };
      };
      const errorMessage =
        apiError.data?.message || "Failed to auto-populate workflow actions";
      logger.error(errorMessage, { toast: true });
    }
  }, [selectedWorkflowValue, autoPopulate]);

  return {
    // Form methods
    formMethods,
    onSubmit,
    handleReset,
    handleCancel,
    handleAutoPopulate,

    // State
    isEditMode,
    isLoading,
    readonly,
    isLoadingWorkflows,
    isLoadingWorkflowAction,
    isLoadingWorkflowStage,

    // Options
    workflowOptions,
    workflowActionOptions,
    linkedStageOptions,
    selectedWorkflowDefinition: selectedWorkflowValue,
    hasStageError,
  };
};
