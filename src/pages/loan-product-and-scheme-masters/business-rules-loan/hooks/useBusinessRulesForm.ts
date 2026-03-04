import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  setIsReady,
  resetBusinessRuleState,
} from "@/global/reducers/loan/business-rules.reducer";
import {
  useSaveLoanBusinessRuleMutation,
  useUpdateLoanBusinessRuleMutation,
  useLazyGetLoanBusinessRuleByIdQuery,
} from "@/global/service/end-points/loan-product-and-service-masters/business-rules";
import {
  useGetLoanProductsQuery,
  useGetRuleCategoriesQuery,
} from "@/global/service/end-points/loan-product-and-service-masters/loan-masters";
import { logger } from "@/global/service";
import type {
  LoanBusinessRuleFormData,
  SaveLoanBusinessRulePayload,
  UpdateLoanBusinessRulePayload,
  ConfigOption,
} from "@/types/loan-product-and-scheme-masters/business-rules.types";
import { loanBusinessRuleDefaultFormValues } from "../constants/form.constants";
import { loanBusinessRuleValidationSchema } from "@/global/validation/loan-product-and-scheme-masters/businessRules-schema";

export const useBusinessRulesForm = (readonly = false) => {
  const dispatch = useAppDispatch();
  const { isEditMode, currentRuleId } = useAppSelector(
    state => state.loanBusinessRules
  );

  // API Queries
  const { data: loanProductOptions = [], isLoading: isLoadingProducts } =
    useGetLoanProductsQuery();
  const { data: ruleCategoryOptions = [], isLoading: isLoadingCategories } =
    useGetRuleCategoriesQuery();

  // API Mutations
  const [saveRule, { isLoading: isSaving }] = useSaveLoanBusinessRuleMutation();
  const [updateRule, { isLoading: isUpdating }] =
    useUpdateLoanBusinessRuleMutation();
  const [triggerGetById, { isLoading: isLoadingById }] =
    useLazyGetLoanBusinessRuleByIdQuery();

  const isLoading = isSaving || isUpdating || isLoadingById;

  // Form setup
  const form = useForm<LoanBusinessRuleFormData>({
    resolver: yupResolver(loanBusinessRuleValidationSchema),
    mode: "onBlur",
    defaultValues: loanBusinessRuleDefaultFormValues,
  });

  const { reset, setValue } = form;

  // Utility functions
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

  // Load rule data for editing
  useEffect(() => {
    if (isEditMode && currentRuleId) {
      triggerGetById(currentRuleId)
        .unwrap()
        .then(ruleData => {
          setValue(
            "loanProduct",
            getValueFromIdentity(ruleData.productIdentity, loanProductOptions)
          );
          setValue("ruleCode", ruleData.ruleCode);
          setValue("ruleName", ruleData.ruleName);
          setValue(
            "ruleCategory",
            getValueFromIdentity(
              ruleData.ruleCategoryIdentity,
              ruleCategoryOptions
            )
          );
          setValue("conditionExpression", ruleData.conditionExpression);
          setValue("actionExpression", ruleData.actionExpression);
          setValue("isActive", ruleData.active);

          logger.info("Business rule data loaded for editing");
        })
        .catch(error => {
          logger.error(error, { toast: true });
        });
    }
  }, [
    isEditMode,
    currentRuleId,
    triggerGetById,
    setValue,
    loanProductOptions,
    ruleCategoryOptions,
    getValueFromIdentity,
  ]);

  // Submit handler
  const onSubmit = useCallback(
    async (data: LoanBusinessRuleFormData) => {
      try {
        const basePayload = {
          productIdentity: getIdentityFromValue(
            data.loanProduct,
            loanProductOptions
          ),
          ruleCode: data.ruleCode,
          ruleName: data.ruleName,
          ruleCategoryIdentity: getIdentityFromValue(
            data.ruleCategory,
            ruleCategoryOptions
          ),
          conditionExpression: data.conditionExpression,
          actionExpression: data.actionExpression,
          active: data.isActive,
        };

        if (isEditMode && currentRuleId) {
          await updateRule({
            ruleId: currentRuleId,
            payload: basePayload as UpdateLoanBusinessRulePayload,
          }).unwrap();

          logger.info("Business rule updated successfully", {
            toast: true,
          });
          dispatch(resetBusinessRuleState());
        } else {
          await saveRule(basePayload as SaveLoanBusinessRulePayload).unwrap();

          logger.info("Business rule saved successfully", {
            toast: true,
          });
        }

        dispatch(setIsReady(true));
        reset(loanBusinessRuleDefaultFormValues);

        window.dispatchEvent(new CustomEvent("refreshLoanBusinessRules"));

        return true;
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
            `Failed to ${isEditMode ? "update" : "save"} business rule`;

          logger.error(errorMessage, { toast: true });
        } else {
          logger.error("An unexpected error occurred", { toast: true });
        }
        return false;
      }
    },
    [
      saveRule,
      updateRule,
      dispatch,
      reset,
      currentRuleId,
      isEditMode,
      loanProductOptions,
      ruleCategoryOptions,
      getIdentityFromValue,
    ]
  );

  // Reset handler
  const handleReset = useCallback(() => {
    if (isEditMode) {
      dispatch(resetBusinessRuleState());
    }
    reset(loanBusinessRuleDefaultFormValues);
  }, [reset, isEditMode, dispatch]);

  // Cancel edit mode
  const handleCancelEdit = useCallback(() => {
    dispatch(resetBusinessRuleState());
    reset(loanBusinessRuleDefaultFormValues);
  }, [dispatch, reset]);

  const handleClear = useCallback(() => {
    reset(loanBusinessRuleDefaultFormValues);
  }, [reset]);

  return {
    form,
    isEditMode,
    isLoading,
    readonly,
    loanProductOptions,
    ruleCategoryOptions,
    isLoadingProducts,
    isLoadingCategories,
    onSubmit,
    handleReset,
    handleCancelEdit,
    handleClear,
  };
};
