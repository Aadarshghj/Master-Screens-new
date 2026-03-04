import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  setIsReady,
  resetSchemeAttributeState,
} from "@/global/reducers/loan/loan-scheme-attributes.reducer";
import {
  useSaveLoanSchemeAttributeMutation,
  useUpdateLoanSchemeAttributeMutation,
  useLazyGetLoanSchemeAttributeByIdQuery,
} from "@/global/service/end-points/loan-product-and-service-masters/loan-scheme-attributes";
import {
  useGetLoanProductsQuery,
  useGetDataTypesQuery,
} from "@/global/service/end-points/loan-product-and-service-masters/loan-masters";
import { logger } from "@/global/service";
import type {
  LoanSchemeAttributeFormData,
  SaveLoanSchemeAttributePayload,
  UpdateLoanSchemeAttributePayload,
  ConfigOption,
} from "@/types/loan-product-and-scheme-masters/loan-scheme-attributes.types";
import { loanSchemeAttributeValidationSchema } from "@/global/validation/loan-product-and-scheme-masters/loanSchemeAttributes-schema";
import { loanSchemeAttributeDefaultFormValues } from "../constants/form.constants";

export const useLoanSchemeAttributesForm = (readonly: boolean = false) => {
  const dispatch = useAppDispatch();
  const { isEditMode, currentAttributeId } = useAppSelector(
    state => state.loanSchemeAttributes
  );

  const [isFormOpen, setIsFormOpen] = useState(false);

  // API Queries
  const { data: loanProductOptions = [], isLoading: isLoadingProducts } =
    useGetLoanProductsQuery();
  const { data: dataTypeOptions = [], isLoading: isLoadingDataTypes } =
    useGetDataTypesQuery();

  // API Mutations
  const [saveAttribute, { isLoading: isSaving }] =
    useSaveLoanSchemeAttributeMutation();
  const [updateAttribute, { isLoading: isUpdating }] =
    useUpdateLoanSchemeAttributeMutation();
  const [triggerGetById, { isLoading: isLoadingById }] =
    useLazyGetLoanSchemeAttributeByIdQuery();

  const isLoading = isSaving || isUpdating || isLoadingById;

  // Form setup
  const form = useForm<LoanSchemeAttributeFormData>({
    resolver: yupResolver(loanSchemeAttributeValidationSchema),
    mode: "onBlur",
    defaultValues: loanSchemeAttributeDefaultFormValues,
  });

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState,
    setValue,
    watch,
    trigger,
  } = form;
  const selectedDataType = watch("dataType");
  const listValues = watch("listValues");

  // Get data type name from options
  const selectedDataTypeName =
    dataTypeOptions
      .find(
        opt =>
          opt.value === selectedDataType || opt.identity === selectedDataType
      )
      ?.label?.toLowerCase() ||
    selectedDataType?.toLowerCase() ||
    "";

  // Clear list values when data type is not string
  useEffect(() => {
    if (
      selectedDataTypeName &&
      selectedDataTypeName !== "string" &&
      listValues
    ) {
      setValue("listValues", "");
    }
  }, [selectedDataTypeName, listValues, setValue]);

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

  // Load attribute data for editing
  useEffect(() => {
    if (isEditMode && currentAttributeId) {
      setIsFormOpen(true);

      triggerGetById(currentAttributeId)
        .unwrap()
        .then(attributeData => {
          setValue(
            "loanProduct",
            getValueFromIdentity(
              attributeData.productIdentity,
              loanProductOptions
            )
          );
          setValue("attributeKey", attributeData.attributeKey);
          setValue("attributeName", attributeData.attributeName);
          setValue(
            "dataType",
            getValueFromIdentity(attributeData.dataType, dataTypeOptions)
          );
          setValue("defaultValue", attributeData.defaultValue || "");
          setValue("listValues", attributeData.listValues || "");
          setValue("description", attributeData.description || "");
          setValue("isRequired", attributeData.required);
          setValue("isActive", attributeData.active);
          setValue("takeoverBtiScheme", attributeData.takeoverBtiScheme);

          setTimeout(() => {
            setValue("defaultValue", attributeData.defaultValue || "");
          }, 100);

          logger.info("Attribute data loaded for editing");
        })
        .catch(error => {
          logger.error(error, { toast: true });
        });
    }
  }, [
    isEditMode,
    currentAttributeId,
    triggerGetById,
    setValue,
    loanProductOptions,
    dataTypeOptions,
    getValueFromIdentity,
  ]);

  // Form submission
  const onSubmit = useCallback(
    async (data: LoanSchemeAttributeFormData) => {
      try {
        const basePayload = {
          productIdentity: getIdentityFromValue(
            data.loanProduct,
            loanProductOptions
          ),
          attributeKey: data.attributeKey,
          attributeName: data.attributeName,
          dataType: getIdentityFromValue(data.dataType, dataTypeOptions),
          defaultValue: data.defaultValue || undefined,
          description: data.description || undefined,
          required: data.isRequired,
          active: data.isActive,
          listValues: data.listValues || undefined,
          takeoverBtiScheme: data.takeoverBtiScheme,
        };

        if (isEditMode && currentAttributeId) {
          await updateAttribute({
            attributeId: currentAttributeId,
            payload: basePayload as UpdateLoanSchemeAttributePayload,
          }).unwrap();

          logger.info("Loan scheme attribute updated successfully", {
            toast: true,
          });
          dispatch(resetSchemeAttributeState());
        } else {
          await saveAttribute(
            basePayload as SaveLoanSchemeAttributePayload
          ).unwrap();

          logger.info("Loan scheme attribute saved successfully", {
            toast: true,
          });
        }

        dispatch(setIsReady(true));
        reset(loanSchemeAttributeDefaultFormValues);
        setIsFormOpen(false);

        window.dispatchEvent(new CustomEvent("refreshLoanSchemeAttributes"));
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
            `Failed to ${isEditMode ? "update" : "save"} loan scheme attribute`;

          logger.error(errorMessage, { toast: true });
        } else {
          logger.error("An unexpected error occurred", { toast: true });
        }
      }
    },
    [
      saveAttribute,
      updateAttribute,
      dispatch,
      reset,
      currentAttributeId,
      isEditMode,
      loanProductOptions,
      dataTypeOptions,
      getIdentityFromValue,
    ]
  );

  // Reset form
  const handleReset = useCallback(() => {
    if (isEditMode) {
      dispatch(resetSchemeAttributeState());
    }
    reset(loanSchemeAttributeDefaultFormValues);
    if (!isEditMode) {
      setIsFormOpen(false);
    }
  }, [reset, isEditMode, dispatch]);

  const handleClear = useCallback(() => {
    reset(loanSchemeAttributeDefaultFormValues);
  }, [reset]);

  // Toggle form visibility
  const toggleForm = useCallback(() => {
    setIsFormOpen(prev => !prev);
  }, []);

  // Handle add new attribute
  const handleAddNew = useCallback(() => {
    dispatch(resetSchemeAttributeState());
    reset(loanSchemeAttributeDefaultFormValues);
    setIsFormOpen(false);
  }, [dispatch, reset]);

  return {
    // State
    isFormOpen,
    isEditMode,
    isLoading,
    isLoadingProducts,
    isLoadingDataTypes,
    selectedDataType,
    selectedDataTypeName,

    // Form
    form,
    control,
    register,
    errors: formState.errors,
    setValue,
    watch,
    trigger,
    // Options
    loanProductOptions,
    dataTypeOptions,

    // Handlers
    onSubmit: handleSubmit(onSubmit),
    handleReset,
    toggleForm,
    handleAddNew,
    handleClear,

    // Readonly
    readonly,
  };
};
