import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector, useAppDispatch } from "@/hooks/store";
import { logger } from "@/global/service";
import {
  setEditMode,
  setInterestTypeFlag,
} from "@/global/reducers/loan-stepper/loan-product.reducer";
import {
  useCreateLoanSchemeMutation,
  useUpdateLoanSchemeMutation,
  useGetLoanSchemeByIdQuery,
  useGetSlabPeriodTypeQuery,
} from "@/global/service/end-points/loan-product-and-scheme/loan-product-scheme";
import {
  useGetLoanProductsQuery,
  useGetSchemeTypesQuery,
  useGetMinPeriodTypesQuery,
  useGetMaxPeriodTypesQuery,
  useGetInterestTypesQuery,
  useGetPenalInterestBasesQuery,
  useGetRebateBasesQuery,
} from "@/global/service/end-points/master/loan-master";
import { loanProductSchemeValidationSchema } from "@/global/validation/loan-product-and-scheme/loanProductScheme";
import { loanSchemeDefaultFormValues } from "../../constants/form.constants";
import type {
  LoanSchemeFormData,
  SchemeData,
  SchemeApiResponse,
  CustomEventDetail,
} from "@/types/loan-product-and schema Stepper/create-loan-and-product.types";

export const useLoanScheme = () => {
  const dispatch = useAppDispatch();
  const { isEditMode, currentSchemeId } = useAppSelector(
    state => state.loanProduct
  );
  const [localEditMode, setLocalEditMode] = useState(false);
  const formInitialized = useRef(false);

  // Query hooks for dropdown options
  const { data: loanProductOptions = [] } = useGetLoanProductsQuery();
  const { data: schemeTypeOptions = [] } = useGetSchemeTypesQuery();
  const { data: periodMinTypeOptions = [] } = useGetMinPeriodTypesQuery();
  const { data: periodMaxTypeOptions = [] } = useGetMaxPeriodTypesQuery();
  const { data: interestTypeOptions = [] } = useGetInterestTypesQuery();
  const { data: penalInterestBaseOptions = [] } =
    useGetPenalInterestBasesQuery();
  const { data: rebateBaseOptions = [] } = useGetRebateBasesQuery();
  const { data: slabPeriodTypeData } = useGetSlabPeriodTypeQuery();
  const slabPeriodTypeOptions =
    slabPeriodTypeData?.map(item => ({
      value: item.identity,
      label: item.slabPeriodTypeName,
    })) || [];

  // Create validation schema with options context
  const validationSchema = useMemo(
    () =>
      loanProductSchemeValidationSchema(
        periodMinTypeOptions,
        periodMaxTypeOptions,
        interestTypeOptions
      ),
    [periodMinTypeOptions, periodMaxTypeOptions, interestTypeOptions]
  );

  // Query and Mutation hooks
  const { data: schemeData, isLoading: isLoadingScheme } =
    useGetLoanSchemeByIdQuery(currentSchemeId || "", {
      skip: !currentSchemeId || !isEditMode,
    });
  const [createLoanScheme, { isLoading: isCreating }] =
    useCreateLoanSchemeMutation();
  const [updateLoanScheme, { isLoading: isUpdating }] =
    useUpdateLoanSchemeMutation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState,
    formState: { errors },
  } = useForm<LoanSchemeFormData>({
    resolver: yupResolver(validationSchema),
    mode: "all",
    reValidateMode: "onChange",
    shouldFocusError: true,
    criteriaMode: "all",
    defaultValues: loanSchemeDefaultFormValues,
  });

  const watchMoratoriumInterestRequired = watch("moratoriumInterestRequired");
  const watchRebateApplicable = watch("rebateApplicable");
  const watchReverseInterestApplicable = watch("reverseInterestApplicable");
  const watchPenalInterestApplicable = watch("penalInterestApplicable");
  const watchEmiApplicable = watch("emiApplicable");
  const watchInterestType = watch("interestTypeName");

  // Update Redux when interest type changes
  useEffect(() => {
    if (watchInterestType) {
      dispatch(setInterestTypeFlag(watchInterestType));
    }
  }, [watchInterestType, dispatch]);

  // Format API data to form schema
  const formatSchemeDataForForm = useCallback(
    (apiData: SchemeData): Partial<LoanSchemeFormData> => {
      const data = apiData.data || apiData;

      return {
        loanProductName: data.productIdentity || data.loanProductName || "",
        schemeCode: data.schemeCode || "",
        schemeName: data.schemeName || "",
        schemeTypeName: data.schemeTypeIdentity || data.schemeTypeName || "",
        effectiveFrom: data.effectiveFrom || "",
        effectiveTo: data.effectiveTo || "",
        fromAmount: data.fromAmount?.toString() || "",
        toAmount: data.toAmount?.toString() || "",
        minimumPeriod:
          data.minPeriod?.toString() || data.minimumPeriod?.toString() || "",
        minPeriodTypeName:
          data.minPeriodTypeIdentity || data.minPeriodTypeName || "",
        maximumPeriod:
          data.maxPeriod?.toString() || data.maximumPeriod?.toString() || "",
        periodTypeName: data.maxPeriodTypeIdentity || data.periodTypeName || "",
        interestTypeName:
          data.interestTypeIdentity || data.interestTypeName || "",
        fixedInterestRate: data.fixedInterestRate?.toString() || "",
        penalInterestApplicable: data.penalInterestApplicable || false,
        penalInterest: data.penalInterestRate?.toString() || "",
        penalInterestBaseName:
          data.penalInterestOnIdentity || data.penalInterestBaseName || "",
        emiApplicable: data.emiScheme || false,
        gracePeriod:
          data.gracePeriod !== undefined && data.gracePeriod !== null
            ? data.gracePeriod.toString()
            : "",
        moratoriumInterestRequired:
          data.moratoriumInterestVariationReq || false,
        moratoriumInterestRate: data.moratoriumInterestRate?.toString() || "",
        rebateApplicable: data.rebate || false,
        rebateBaseName: data.rebateOnIdentity || data.rebateBaseName || "",
        rebatePercentage: data.rebatePercentage?.toString() || "",
        reverseInterestApplicable: data.reverseInterestApplicable || false,
        remarks: data.remarks || "",
        takeoverScheme: data.takeOverScheme || false,
        coLendingScheme: data.coLendingScheme || false,
        active: data.active ?? true,
      };
    },
    []
  );

  const onSubmit = useCallback(
    async (
      data: LoanSchemeFormData,
      onSave?: () => void,
      onComplete?: (schemeId?: string) => void
    ) => {
      try {
        const transformedPayload = {
          productIdentity: data.loanProductName,
          schemeName: data.schemeName,
          schemeTypeIdentity: data.schemeTypeName,
          effectiveFrom: data.effectiveFrom,
          effectiveTo: data.effectiveTo,
          fromAmount: data.fromAmount,
          toAmount: data.toAmount,
          minPeriod: data.minimumPeriod,
          minPeriodTypeIdentity: data.minPeriodTypeName,
          maxPeriod: data.maximumPeriod,
          maxPeriodTypeIdentity: data.periodTypeName || data.minPeriodTypeName,
          interestTypeIdentity: data.interestTypeName,
          fixedInterestRate: data.fixedInterestRate,
          ...(data.maxPeriodTypeName && {
            slabPeriodTypeIdentity: data.maxPeriodTypeName,
          }),
          penalInterestApplicable: data.penalInterestApplicable,
          ...(data.penalInterestApplicable && {
            penalInterestRate: data.penalInterest,
            penalInterestOnIdentity: data.penalInterestBaseName,
          }),
          emiScheme: data.emiApplicable,
          ...(data.emiApplicable && {
            gracePeriod: data.gracePeriod,
          }),
          moratoriumInterestVariationReq: data.moratoriumInterestRequired,
          ...(data.moratoriumInterestRequired && {
            moratoriumInterestRate: data.moratoriumInterestRate,
          }),
          rebate: data.rebateApplicable,
          ...(data.rebateApplicable && {
            rebateOnIdentity: data.rebateBaseName,
            rebatePercentage: data.rebatePercentage,
          }),
          reverseInterestApplicable: data.reverseInterestApplicable,
          remarks: data.remarks,
          takeOverScheme: data.takeoverScheme,
          coLendingScheme: data.coLendingScheme,
          active: data.active,
        };

        if ((isEditMode || localEditMode) && currentSchemeId) {
          await updateLoanScheme({
            schemeId: currentSchemeId,
            payload: transformedPayload as unknown as Record<string, unknown>,
          }).unwrap();
          logger.info("Loan scheme updated successfully", { toast: true });

          if (onComplete) {
            onComplete();
          }
        } else {
          const result = await createLoanScheme(
            transformedPayload as unknown as LoanSchemeFormData
          ).unwrap();
          logger.info("Loan scheme created successfully", { toast: true });

          const apiResult = result as SchemeApiResponse;
          const createdSchemeId =
            apiResult.identity ||
            apiResult.data?.identity ||
            apiResult.data?.id ||
            apiResult.data?.schemeId ||
            apiResult.id;

          if (createdSchemeId) {
            dispatch(setEditMode({ isEdit: true, schemeId: createdSchemeId }));
          }

          if (onComplete) {
            onComplete(createdSchemeId);
          }
        }

        if (onSave) {
          onSave();
        }

        window.dispatchEvent(new Event("refreshLoanSchemes"));
      } catch (error) {
        if (typeof error === "object" && error !== null) {
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
            `Failed to ${isEditMode ? "update" : "create"} loan scheme`;

          logger.error(errorMessage, { toast: true });
        } else {
          logger.error("An unexpected error occurred", { toast: true });
        }
      }
    },
    [
      isEditMode,
      localEditMode,
      currentSchemeId,
      createLoanScheme,
      updateLoanScheme,
      dispatch,
    ]
  );

  const handleReset = useCallback(() => {
    reset();
    setLocalEditMode(false);
    dispatch(setEditMode({ isEdit: false, schemeId: null }));
  }, [reset, dispatch]);

  // Load scheme data when in edit mode
  useEffect(() => {
    if (schemeData && isEditMode) {
      const rawData = schemeData as unknown as SchemeData;
      const data = rawData.data || rawData;

      // Update scheme name in Redux if available
      if (data.schemeName && currentSchemeId) {
        dispatch(
          setEditMode({
            isEdit: true,
            schemeId: currentSchemeId,
            schemeName: data.schemeName,
          })
        );
      }

      const formattedData = formatSchemeDataForForm(rawData);
      reset({ ...loanSchemeDefaultFormValues, ...formattedData });
    }
  }, [
    schemeData,
    isEditMode,
    formatSchemeDataForForm,
    reset,
    dispatch,
    currentSchemeId,
  ]);

  // Mark step as complete when scheme exists
  useEffect(() => {
    if (currentSchemeId) {
      try {
        const completedStepsStr = sessionStorage.getItem("loanCompletedSteps");
        const steps = completedStepsStr ? JSON.parse(completedStepsStr) : [];
        if (!steps.includes("create-loan-scheme")) {
          steps.push("create-loan-scheme");
          sessionStorage.setItem("loanCompletedSteps", JSON.stringify(steps));
          window.dispatchEvent(new CustomEvent("loanStepStatusChanged"));
        }
      } catch {
        // Ignore error
      }
    }
  }, [currentSchemeId]);

  // Initialize form with default values only once
  useEffect(() => {
    if (
      !formInitialized.current &&
      loanProductOptions.length > 0 &&
      !isEditMode &&
      !currentSchemeId
    ) {
      formInitialized.current = true;
      setValue("loanProductName", loanProductOptions[0]?.value || "");
      setValue("schemeTypeName", schemeTypeOptions[0]?.value || "");
      setValue("minPeriodTypeName", periodMinTypeOptions[0]?.value || "");
      setValue("periodTypeName", periodMaxTypeOptions[0]?.value || "");
      setValue("interestTypeName", interestTypeOptions[0]?.value || "");
      setValue(
        "penalInterestBaseName",
        penalInterestBaseOptions[0]?.value || ""
      );
      setValue("rebateBaseName", rebateBaseOptions[0]?.value || "");
    }
  }, [
    loanProductOptions,
    schemeTypeOptions,
    periodMinTypeOptions,
    periodMaxTypeOptions,
    interestTypeOptions,
    penalInterestBaseOptions,
    rebateBaseOptions,
    isEditMode,
    currentSchemeId,
    setValue,
  ]);

  // Handle edit events
  useEffect(() => {
    const handleEditEvent = (event: CustomEvent<CustomEventDetail>) => {
      const eventData = event.detail;
      setLocalEditMode(true);
      dispatch(setEditMode({ isEdit: true, schemeId: eventData.schemeId }));
    };

    window.addEventListener("editLoanScheme", handleEditEvent as EventListener);
    return () =>
      window.removeEventListener(
        "editLoanScheme",
        handleEditEvent as EventListener
      );
  }, [dispatch]);

  return {
    control,
    register,
    handleSubmit,
    reset,
    errors,
    watch,
    trigger,
    isEditMode,
    localEditMode,
    loanProductOptions,
    schemeTypeOptions,
    periodMinTypeOptions,
    periodMaxTypeOptions,
    interestTypeOptions,
    penalInterestBaseOptions,
    rebateBaseOptions,
    slabPeriodTypeOptions,
    watchMoratoriumInterestRequired,
    watchRebateApplicable,
    watchReverseInterestApplicable,
    watchPenalInterestApplicable,
    watchEmiApplicable,
    watchInterestType,
    onSubmit,
    handleReset,
    isCreating,
    isUpdating,
    isLoadingScheme,
    formState,
    hasBeenSaved: Boolean(currentSchemeId && schemeData),
  };
};
