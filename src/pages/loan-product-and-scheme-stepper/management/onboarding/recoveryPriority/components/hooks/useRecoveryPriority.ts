import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector } from "@/hooks/store";
import { logger } from "@/global/service";
import {
  useGetRecoveryPrioritiesQuery,
  useCreateRecoveryPrioritiesMutation,
  useUpdateRecoveryPrioritiesMutation,
} from "@/global/service/end-points/loan-product-and-scheme/recovery-priorities";
import type {
  RecoveryPriorityFormData,
  RecoveryComponent,
  RecoveryPriorityPayload,
} from "@/types/loan-product-and schema Stepper/recovery-priority";
import { recoveryPriorityDefaultFormValues } from "../../constants/form.constants";

export const useRecoveryPriority = () => {
  const { currentSchemeId, currentSchemeName } = useAppSelector(
    state => state.loanProduct
  );
  const [tableData, setTableData] = useState<RecoveryComponent[]>([]);
  const [hasSavedInSession, setHasSavedInSession] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: recoveryPriorities, refetch: refetchRecoveryPriorities } =
    useGetRecoveryPrioritiesQuery(
      { schemeId: currentSchemeId || "" },
      { skip: !currentSchemeId }
    );
  const [createRecoveryPriorities] = useCreateRecoveryPrioritiesMutation();
  const [updateRecoveryPriorities] = useUpdateRecoveryPrioritiesMutation();

  const {
    control,
    handleSubmit,

    setValue,
    formState,
    formState: { errors },
  } = useForm<RecoveryPriorityFormData>({
    defaultValues: recoveryPriorityDefaultFormValues,
    resolver: undefined, // Remove resolver due to type mismatch
    mode: "onChange",
  });

  useEffect(() => {
    if (recoveryPriorities?.schemeName) {
      setValue("loanScheme", recoveryPriorities.schemeName, {
        shouldDirty: false,
      });
    } else if (currentSchemeName) {
      setValue("loanScheme", currentSchemeName, { shouldDirty: false });
    }
  }, [recoveryPriorities, currentSchemeName, setValue]);

  useEffect(() => {
    if (recoveryPriorities) {
      const { recoveryPriorities: priorities } = recoveryPriorities;

      if (priorities && priorities.length > 0) {
        // Check if at least one priority has status=true AND priority is a valid integer
        const hasValidData = priorities.some(
          priority =>
            priority.status === true &&
            priority.priority !== null &&
            priority.priority !== undefined &&
            Number.isInteger(priority.priority)
        );

        const mappedData: RecoveryComponent[] = priorities.map(priority => ({
          id: priority.identity,
          component: priority.dueType,
          priority: priority.priority || 0,
          description: priority.description,
          isActive: priority.status ?? true,
          dueTypeId: priority.identity,
        }));
        setTableData(mappedData);

        if (hasValidData) {
          setHasSavedInSession(true);
        } else {
          setHasSavedInSession(false);
        }
      } else {
        const defaultComponents = [
          { component: "Principal", description: "Principal amount recovery" },
          { component: "Interest", description: "Interest amount recovery" },
          { component: "Penalty", description: "Penalty charges recovery" },
          { component: "Fees", description: "Processing fees recovery" },
        ];

        const mappedData: RecoveryComponent[] = defaultComponents.map(
          (defaultComp, index) => ({
            id: `default-${index}`,
            component: defaultComp.component,
            priority: 0,
            description: defaultComp.description,
            isActive: true,
            dueTypeId: undefined,
          })
        );
        setTableData(mappedData);
        setHasSavedInSession(false);
      }
    }
  }, [recoveryPriorities]);

  const handlePriorityChange = useCallback(
    (index: number, priority: number) => {
      setHasUnsavedChanges(true);
      setTableData(prev => {
        const updatedData = [...prev];
        updatedData[index].priority = priority;
        return updatedData;
      });
    },
    []
  );

  const handleDescriptionChange = useCallback(
    (index: number, description: string) => {
      setHasUnsavedChanges(true);
      setTableData(prev => {
        const updatedData = [...prev];
        updatedData[index].description = description;
        return updatedData;
      });
    },
    []
  );

  const handleActiveChange = useCallback((index: number, isActive: boolean) => {
    setHasUnsavedChanges(true);
    setTableData(prev => {
      const updatedData = [...prev];
      updatedData[index].isActive = isActive;
      return updatedData;
    });
  }, []);

  const onSubmit = async (onSave?: () => void) => {
    try {
      if (!currentSchemeId) {
        logger.error("No scheme ID available", { toast: true });
        return;
      }

      const payload: RecoveryPriorityPayload = {
        recoveryPriorities: tableData
          .filter(
            item => item.dueTypeId && !item.dueTypeId.startsWith("default-")
          )
          .map(item => ({
            dueType: item.dueTypeId!,
            priority: item.priority,
            description: item.description,
            active: item.isActive,
          })),
      };

      const hasExistingData = tableData.some(
        item => item.dueTypeId && !item.dueTypeId.startsWith("default-")
      );

      if (hasExistingData) {
        await updateRecoveryPriorities({
          schemeId: currentSchemeId,
          payload,
        }).unwrap();
        logger.info("Recovery priorities updated successfully", {
          toast: true,
        });
      } else {
        await createRecoveryPriorities({
          schemeId: currentSchemeId,
          payload,
        }).unwrap();
        logger.info("Recovery priorities created successfully", {
          toast: true,
        });
      }

      await refetchRecoveryPriorities();
      setHasSavedInSession(true);
      setHasUnsavedChanges(false);

      onSave?.();
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      const errorMessage =
        apiError.data?.message || "Failed to save recovery priorities";
      logger.error(errorMessage, { toast: true });
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    tableData,
    setTableData,
    handlePriorityChange,
    handleDescriptionChange,
    handleActiveChange,
    onSubmit,
    formState,
    hasUnsavedChanges,
    hasBeenSaved: hasSavedInSession,
  };
};
