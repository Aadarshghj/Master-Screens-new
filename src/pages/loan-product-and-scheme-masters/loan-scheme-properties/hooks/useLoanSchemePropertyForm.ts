import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  setIsReady,
  resetSchemePropertyState,
} from "@/global/reducers/loan/loan-scheme-properties.reducer";
import {
  useGetLoanProductsQuery,
  useGetDataTypesQuery,
} from "@/global/service/end-points/loan-product-and-service-masters/loan-masters";
import {
  useSaveLoanSchemePropertyMutation,
  useUpdateLoanSchemePropertyMutation,
} from "@/global/service/end-points/loan-product-and-service-masters/loan-scheme-properties";
import { logger } from "@/global/service";
import { loanSchemePropertyValidationSchema } from "@/global/validation/loan-product-and-scheme-masters/loanSchemeProperties-schema";
import { loanSchemePropertyDefaultFormValues } from "../constants/form.constants";
import type {
  LoanSchemePropertyFormData,
  SaveLoanSchemePropertyPayload,
  UpdateLoanSchemePropertyPayload,
  ConfigOption,
} from "@/types/loan-product-and-scheme-masters/loan-scheme-properties.types";

export const useLoanSchemePropertyForm = (readonly: boolean = false) => {
  const dispatch = useAppDispatch();
  const { isEditMode, currentPropertyId, currentPropertyData } = useAppSelector(
    state => state.loanSchemeProperties
  );

  const [isFormOpen, setIsFormOpen] = useState(false);

  // API Queries
  const { data: loanProductOptions = [], isLoading: isLoadingProducts } =
    useGetLoanProductsQuery();
  const { data: dataTypeOptions = [], isLoading: isLoadingDataTypes } =
    useGetDataTypesQuery();

  // Mutations
  const [saveProperty, { isLoading: isSaving }] =
    useSaveLoanSchemePropertyMutation();
  const [updateProperty, { isLoading: isUpdating }] =
    useUpdateLoanSchemePropertyMutation();

  const isLoading = isSaving || isUpdating;

  // Form setup
  const formMethods = useForm<LoanSchemePropertyFormData>({
    resolver: yupResolver(loanSchemePropertyValidationSchema),
    mode: "onBlur",
    defaultValues: loanSchemePropertyDefaultFormValues,
  });

  const { handleSubmit, reset, watch, setValue, trigger } = formMethods;
  const selectedDataType = watch("dataType");

  // Utility functions
  const getIdentityFromValue = useCallback(
    (value: string, options: ConfigOption[]): string => {
      const option = options.find(opt => opt.value === value);
      return option?.identity || option?.value || value;
    },
    []
  );

  const getValueFromIdentity = useCallback(
    (identity: string, options: ConfigOption[]): string => {
      const option = options.find(
        opt => opt.identity === identity || opt.value === identity
      );
      return option?.value || identity;
    },
    []
  );

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && currentPropertyData) {
      setIsFormOpen(true);
    }
  }, [isEditMode, currentPropertyData]);

  useEffect(() => {
    if (isEditMode && currentPropertyData) {
      const productValue = getValueFromIdentity(
        String(currentPropertyData.productId || ""),
        loanProductOptions
      );
      const dataTypeValue = getValueFromIdentity(
        String(currentPropertyData.dataTypeId || ""),
        dataTypeOptions
      );

      const timeouts = [50, 200, 400, 600];
      const clearTimeouts: NodeJS.Timeout[] = [];

      // Set basic fields
      const timeout1 = setTimeout(() => {
        setValue("loanProduct", productValue);
        setValue("propertyKey", currentPropertyData.propertyKey || "");
        setValue("propertyName", currentPropertyData.propertyName || "");
        setValue("dataType", dataTypeValue);
        setValue("description", currentPropertyData.description || "");
        setValue("isRequired", Boolean(currentPropertyData.isRequired));
        setValue("isActive", Boolean(currentPropertyData.isActive));
      }, timeouts[0]);
      clearTimeouts.push(timeout1);

      // Set default value with multiple attempts
      timeouts.slice(1).forEach(delay => {
        const timeout = setTimeout(() => {
          setValue("defaultValue", currentPropertyData.defaultValue || "");
        }, delay);
        clearTimeouts.push(timeout);
      });

      return () => {
        clearTimeouts.forEach(timeout => clearTimeout(timeout));
      };
    }
  }, [
    isEditMode,
    currentPropertyData,
    setValue,
    loanProductOptions,
    dataTypeOptions,
    getValueFromIdentity,
  ]);

  // Form submission
  const onSubmit = useCallback(
    async (data: LoanSchemePropertyFormData) => {
      try {
        const basePayload = {
          productId: getIdentityFromValue(data.loanProduct, loanProductOptions),
          propertyKey: data.propertyKey,
          propertyName: data.propertyName,
          dataTypeId: getIdentityFromValue(data.dataType, dataTypeOptions),
          defaultValue: data.defaultValue || undefined,
          isRequired: data.isRequired,
          isActive: data.isActive,
          description: data.description,
        };

        if (isEditMode && currentPropertyId) {
          await updateProperty({
            propertyId: currentPropertyId,
            payload: basePayload as UpdateLoanSchemePropertyPayload,
          }).unwrap();

          logger.info("Loan scheme property updated successfully", {
            toast: true,
          });
          dispatch(resetSchemePropertyState());
        } else {
          await saveProperty(
            basePayload as SaveLoanSchemePropertyPayload
          ).unwrap();

          logger.info("Loan scheme property saved successfully", {
            toast: true,
          });
        }

        dispatch(setIsReady(true));
        reset(loanSchemePropertyDefaultFormValues);
        setIsFormOpen(false);

        window.dispatchEvent(new CustomEvent("refreshLoanSchemeProperties"));
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
            `Failed to ${isEditMode ? "update" : "save"} loan scheme property`;

          logger.error(errorMessage, { toast: true });
        } else {
          logger.error("An unexpected error occurred", { toast: true });
        }
      }
    },
    [
      saveProperty,
      updateProperty,
      dispatch,
      reset,
      currentPropertyId,
      isEditMode,
      loanProductOptions,
      dataTypeOptions,
      getIdentityFromValue,
    ]
  );

  // Reset handler
  const handleReset = useCallback(() => {
    dispatch(resetSchemePropertyState());
    reset(loanSchemePropertyDefaultFormValues);
    if (!isEditMode) {
      setIsFormOpen(false);
    }
  }, [reset, isEditMode, dispatch]);

  const handleClear = useCallback(() => {
    reset(loanSchemePropertyDefaultFormValues);
  }, [reset]);

  // Toggle form visibility
  const toggleForm = useCallback(() => {
    setIsFormOpen(!isFormOpen);
  }, [isFormOpen]);

  // Add new property in edit mode
  const handleAddNew = useCallback(() => {
    dispatch(resetSchemePropertyState());
    reset(loanSchemePropertyDefaultFormValues);
    setIsFormOpen(true);
  }, [dispatch, reset]);

  return {
    // Form state
    formMethods,
    isFormOpen,
    setIsFormOpen,
    isEditMode,
    currentPropertyId,
    currentPropertyData,

    // Data
    loanProductOptions,
    dataTypeOptions,
    selectedDataType,

    // Loading states
    isLoading,
    isLoadingProducts,
    isLoadingDataTypes,
    isSaving,
    isUpdating,

    // Handlers
    onSubmit: handleSubmit(onSubmit),
    handleReset,
    toggleForm,
    handleAddNew,
    handleClear,
    trigger,
    // Readonly
    readonly,
  };
};
