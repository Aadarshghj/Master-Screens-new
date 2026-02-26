import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { businessRulesValidationSchema } from "@/global/validation/loan-product-and-scheme/businessRules";

import { useAppSelector } from "@/hooks/store";
import { logger } from "@/global/service";
import {
  useGetMasterBusinessRulesQuery,
  useGetBusinessRulesQuery,
  useCreateBusinessRuleMutation,
  useUpdateBusinessRuleMutation,
  useDeleteBusinessRuleMutation,
} from "@/global/service/end-points/loan-product-and-scheme/business-rules";
import type {
  BusinessRuleFormData,
  BusinessRuleTableData,
  MasterBusinessRule,
} from "@/types/loan-product-and schema Stepper/business-rules.types";
import { businessRulesDefaultFormValues } from "../../constants/form.constants";

export const useBusinessRule = () => {
  const { currentSchemeId, currentSchemeName } = useAppSelector(
    state => state.loanProduct
  );
  const [tableData, setTableData] = useState<BusinessRuleTableData[]>([]);
  const [editingItem, setEditingItem] = useState<BusinessRuleTableData | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] =
    useState<BusinessRuleTableData | null>(null);

  const { data: masterBusinessRules } = useGetMasterBusinessRulesQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: businessRules } = useGetBusinessRulesQuery(
    { schemeId: currentSchemeId || "" },
    { skip: !currentSchemeId }
  );

  const [deleteBusinessRule] = useDeleteBusinessRuleMutation();
  const [createBusinessRule] = useCreateBusinessRuleMutation();
  const [updateBusinessRule] = useUpdateBusinessRuleMutation();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState,
    formState: { errors },
  } = useForm<BusinessRuleFormData>({
    resolver: yupResolver(businessRulesValidationSchema),
    defaultValues: businessRulesDefaultFormValues,
    mode: "all",
  });

  useEffect(() => {
    if (businessRules?.schemeName) {
      setValue("loanName", businessRules.schemeName);
    } else if (currentSchemeName) {
      setValue("loanName", currentSchemeName);
    }
  }, [businessRules, currentSchemeName, setValue]);

  useEffect(() => {
    if (businessRules) {
      const mappedData: BusinessRuleTableData[] =
        businessRules.businessRules.map(
          (rule: {
            id: string;
            businessRuleIdentity: string;
            executionOrder: number;
            effectiveFrom: string;
            effectiveTo: string;
            isActive: boolean;
          }) => ({
            id: rule.id,
            businessRuleIdentity: rule.businessRuleIdentity,
            businessRuleName:
              masterBusinessRules?.find(
                (master: { value: string; label: string }) =>
                  master.value === rule.businessRuleIdentity
              )?.label || rule.businessRuleIdentity,
            executionOrder: rule.executionOrder,
            effectiveFrom: rule.effectiveFrom,
            effectiveTo: rule.effectiveTo,
            isActive: rule.isActive,
          })
        );
      setTableData(mappedData);
    }
  }, [businessRules, masterBusinessRules]);

  const handleEdit = useCallback(
    (item: BusinessRuleTableData) => {
      setEditingItem(item);
      setIsEditing(true);
      setValue("businessRuleIdentity", item.businessRuleIdentity);
      setValue("executionOrder", item.executionOrder);
      setValue("effectiveFrom", item.effectiveFrom);
      setValue("effectiveTo", item.effectiveTo);
      setValue("isActive", item.isActive);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setValue]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingItem(null);
    setIsEditing(false);
    reset({
      ...businessRulesDefaultFormValues,
      loanName: businessRules?.schemeName || currentSchemeName || "",
    });
  }, [reset, businessRules?.schemeName, currentSchemeName]);

  const handleDelete = useCallback((item: BusinessRuleTableData) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      if (!currentSchemeId) {
        logger.error("No scheme ID available", { toast: true });
        return;
      }

      await deleteBusinessRule({
        schemeId: currentSchemeId,
        ruleId: itemToDelete.id,
      }).unwrap();

      logger.info("Business rule deleted successfully", { toast: true });
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      const errorMessage =
        apiError.data?.message || "Failed to delete business rule";
      logger.error(errorMessage, { toast: true });
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, currentSchemeId, deleteBusinessRule]);

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  }, []);

  const onSubmit = async (
    data: BusinessRuleFormData,
    onSave?: () => void,
    onComplete?: () => void
  ) => {
    try {
      if (!currentSchemeId) {
        logger.error("No scheme ID available", { toast: true });
        return;
      }

      const payload = {
        businessRuleIdentity: data.businessRuleIdentity,
        executionOrder: data.executionOrder,
        effectiveFrom: data.effectiveFrom,
        effectiveTo: data.effectiveTo,
        isActive: data.isActive,
      };

      if (isEditing && editingItem) {
        await updateBusinessRule({
          schemeId: currentSchemeId,
          ruleId: editingItem.id,
          payload,
        }).unwrap();
        logger.info("Business rule updated successfully", { toast: true });
      } else {
        await createBusinessRule({
          schemeId: currentSchemeId,
          payload,
        }).unwrap();
        logger.info("Business rule created successfully", { toast: true });
      }

      handleCancelEdit();

      if (onSave) onSave();
      if (onComplete) onComplete();
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      const errorMessage =
        apiError.data?.message || "Failed to save business rule";
      logger.error(errorMessage, { toast: true });
    }
  };

  const businessRuleOptions: MasterBusinessRule[] = masterBusinessRules || [];

  return {
    control,
    handleSubmit,
    errors,
    trigger,
    tableData,
    editingItem,
    isEditing,
    businessRuleOptions,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    showDeleteModal,
    onSubmit,
    formState,
    hasUnsavedChanges: formState.isDirty && isEditing,
    hasBeenSaved: tableData.length > 0,
  };
};
