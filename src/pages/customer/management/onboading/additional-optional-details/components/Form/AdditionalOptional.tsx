import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Input,
  Form,
  Select,
  HeaderWrapper,
  Flex,
  Grid,
  Spinner,
} from "@/components";
import { InputWithSearch } from "@/components/ui/input-with-search/index";
import { useAppDispatch } from "@/hooks/store";
import { setIsReady } from "@/global/reducers/customer/additional.reducer";
import { logger } from "@/global/service/logger";
import type {
  AdditionalOptionalFormData,
  AdditionalOptionalFormProps,
  SaveAdditionalOptionalPayload,
} from "@/types/customer/additional.types";
import { additionalOptionalValidationSchema } from "@/global/validation/customer/additionalOptional-schema";
import { transformFormData } from "@/global/validation/customer/additionalOptional-schema";
import {
  useSaveAdditionalOptionalMutation,
  useGetAdditionalOptionalQuery,
  useGetSourceOfIncomeQuery,
  useGetNationalitiesQuery,
  useGetOccupationsQuery,
  useGetDesignationsQuery,
  useGetCanvassedTypesQuery,
  useGetReferralSourceQuery,
  useGetResidentialStatusesQuery,
  useGetPurposeQuery,
  useGetLanguagesQuery,
  useGetAssetTypesQuery,
  useGetEducationLevelsQuery,
  useGetCustomerGroupsQuery,
  useGetCustomerCategoriesQuery,
  useGetRiskCategoriesQuery,
  useSearchCanvasserQuery,
  useGetCanvasserByIdQuery,
  useGetAdditionalReferenceNamesQuery,
} from "@/global/service";
import { TitleHeader } from "@/components/ui";
import { RefreshCw, Save } from "lucide-react";
import { yesOrNoOPtions } from "@/const/common-options.const";
import { DEFAULT_FORM_VALUES } from "../../constants";
import { MoreDetailsSection } from "./MoreDetailsSection";
import { useDisableState } from "@/hooks/useDisableState";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { useFormDirtyState } from "@/hooks/useFormDirtyState";

export const AdditionalOptionalForm: React.FC<
  AdditionalOptionalFormProps & {
    onFormSubmit?: () => void;
  }
> = ({
  readOnly = false,
  customerIdentity,
  onFormSubmit,
  isView = false,
  handleSetConfirmationModalData,
  confirmationModalData,
}) => {
  const dispatch = useAppDispatch();
  const { handleUpdateState, handleResetState } = useDisableState({
    isView,
  });
  const { handleUpdateFormDirtyState, handleResetFormDirtyState } =
    useFormDirtyState({
      isView,
    });
  const {
    data: sourceOfIncomeOptions = [],
    isLoading: isLoadingSourceOfIncome,
  } = useGetSourceOfIncomeQuery();

  const { data: nationalityOptions = [], isLoading: isLoadingNationalities } =
    useGetNationalitiesQuery();

  const { data: occupationOptions = [], isLoading: isLoadingOccupation } =
    useGetOccupationsQuery();

  const { data: designationOptions = [], isLoading: isLoadingDesignation } =
    useGetDesignationsQuery();

  const {
    data: canvassedTypesOptions = [],
    isLoading: isLoadingCanvassedTypes,
  } = useGetCanvassedTypesQuery();

  const {
    data: referralSourceOptions = [],
    isLoading: isLoadingReferralSource,
  } = useGetReferralSourceQuery();

  const {
    data: residentialStatusOptions = [],
    isLoading: isLoadingResidentialStatuses,
  } = useGetResidentialStatusesQuery();

  const { data: purposeOptions = [], isLoading: isLoadingPurpose } =
    useGetPurposeQuery();

  const { data: languageOptions = [], isLoading: isLoadingLanguages } =
    useGetLanguagesQuery();

  const { data: assetTypeOptions = [], isLoading: isLoadingAssetTypes } =
    useGetAssetTypesQuery();

  const {
    data: educationLevelOptions = [],
    isLoading: isLoadingEducationLevels,
  } = useGetEducationLevelsQuery();

  const {
    data: customerGroupOptions = [],
    isLoading: isLoadingCustomerGroups,
  } = useGetCustomerGroupsQuery();

  const {
    data: customerCategoryOptions = [],
    isLoading: isLoadingCustomerCategories,
  } = useGetCustomerCategoriesQuery();

  const { data: riskCategoryOptions = [], isLoading: isLoadingRiskCategories } =
    useGetRiskCategoriesQuery();

  const [canvasserSearchTerm, setCanvasserSearchTerm] = useState<string>("");
  const [showCanvasserResults, setShowCanvasserResults] =
    useState<boolean>(false);
  const [selectedCanvasser, setSelectedCanvasser] = useState<{
    identity: string;
    name: string;
    code?: string;
  } | null>(null);
  const [shouldSearchCanvasser, setShouldSearchCanvasser] =
    useState<boolean>(false);

  const customerId = customerIdentity || "";

  const {
    data: existingData,
    isLoading: isLoadingExistingData,
    refetch,
  } = useGetAdditionalOptionalQuery(customerId, {
    skip: !customerId,
  });
  const annualIncome = existingData?.additional.employment?.annualIncome;
  useEffect(() => {
    if (!annualIncome || annualIncome === 0) {
      handleUpdateState(
        "Incomplete Step",
        "Please complete the current step before continuing."
      );
    } else {
      handleResetState();
    }
  }, [existingData]);
  const tenantIdentity = "1563455e-fb89-4049-9cbe-02148017e1e6";

  const { data: fieldConfig, isLoading: isLoadingFieldConfig } =
    useGetAdditionalReferenceNamesQuery(tenantIdentity, {
      skip: !tenantIdentity,
      refetchOnMountOrArgChange: true,
    });

  const moreDetailsConfig = useMemo(() => {
    return fieldConfig?.length ? fieldConfig : [];
  }, [fieldConfig]);

  const formDataFromAPI = useMemo(() => {
    if (!existingData) return null;

    const additional = existingData.additional;
    if (!additional) return null;

    const savedMoreDetails: Record<string, string> = {};
    if (
      additional.additionalReferenceValueDto &&
      Array.isArray(additional.additionalReferenceValueDto)
    ) {
      additional.additionalReferenceValueDto.forEach(item => {
        savedMoreDetails[item.referenceIdentity] = item.referenceValue || "";
      });
    }

    const mappedData = {
      occupation: additional.employment?.occupationId || "",
      designation: additional.employment?.designationId || "",
      sourceOfIncome: additional.employment?.incomeSourceId || "",
      annualIncome: additional.employment?.annualIncome?.toString() || "",
      monthlySalary: additional.employment?.monthlySalary?.toString() || "",
      employerDetails: additional.employment?.employer || "",

      referralSource: additional.referrals?.referralSourceId || "",
      canvassedType: additional.referrals?.canvassedTypeId || "",
      canvasserId: additional.referrals?.canvasserStaffId || "",

      educationLevel: additional.profileExtra?.educationLevelId || "",
      purpose: additional.profileExtra?.purposeId || "",

      assetDetails: additional.assets?.assetTypeId || "",
      ownAnyAssets: additional.assets?.ownsAsset
        ? ("yes" as const)
        : ("no" as const),
      hasHomeLoan: additional.assets?.hasHomeLoan
        ? ("yes" as const)
        : ("no" as const),
      homeLoanAmount: additional.assets?.homeLoanAmount?.toString() || "",
      homeLoanCompany: additional.assets?.homeLoanCompany?.toUpperCase() || "",

      nationality: additional.additionalInfoCustomerDto?.nationality || "",
      preferredLanguage:
        additional.additionalInfoCustomerDto?.preferredLanguageId || "",
      residentialStatus:
        additional.additionalInfoCustomerDto?.residentialStatusId || "",
      customerGroup:
        additional.additionalInfoCustomerDto?.customerGroupId || "",
      riskCategory: additional.additionalInfoCustomerDto?.riskCategory || "",
      customerCategory: additional.additionalInfoCustomerDto?.categoryId || "",

      moreDetails: savedMoreDetails,
    };

    return mappedData;
  }, [existingData]);

  const [saveAdditionalOptional, { isLoading }] =
    useSaveAdditionalOptionalMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors, isDirty, dirtyFields, touchedFields },
  } = useForm<AdditionalOptionalFormData>({
    resolver: yupResolver(additionalOptionalValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: formDataFromAPI
      ? transformFormData({ ...DEFAULT_FORM_VALUES, ...formDataFromAPI })
      : transformFormData(DEFAULT_FORM_VALUES),
  });

  const userTouched = Object.keys(touchedFields || {}).length > 0;
  useEffect(() => {
    const hasDirtyValues = Object.keys(dirtyFields || {}).length > 0;
    if (isDirty && hasDirtyValues && userTouched) {
      handleUpdateFormDirtyState();
    } else {
      handleResetFormDirtyState();
    }
  }, [isDirty, dirtyFields, userTouched]);
  const watchedValues = useWatch({
    name: ["ownAnyAssets", "hasHomeLoan", "canvassedType"],
    control,
  });
  const watchedAnnualIncome = watch("annualIncome");
  useEffect(() => {
    if (watchedAnnualIncome) {
      const annualIncome = Number(watchedAnnualIncome) || 0;
      const monthlyIncome = Math.round(annualIncome / 12).toString();
      setValue("monthlySalary", monthlyIncome);
    }
  }, [watchedAnnualIncome]);

  const [ownAnyAssets, hasHomeLoan, watchedCanvassedType] = watchedValues;

  // Get canvasser details when we have a canvasserStaffId from existing data
  const shouldFetchCanvasserDetails = useMemo(() => {
    return formDataFromAPI?.canvasserId && watchedCanvassedType;
  }, [formDataFromAPI?.canvasserId, watchedCanvassedType]);

  const { data: canvasserDetails } = useGetCanvasserByIdQuery(
    {
      canvassedTypeId: watchedCanvassedType || "",
      canvasserStaffId: formDataFromAPI?.canvasserId || "",
    },
    {
      skip: !shouldFetchCanvasserDetails,
    }
  );

  const {
    data: canvasserResults,
    isLoading: isSearchingCanvasser,
    error: canvasserSearchError,
  } = useSearchCanvasserQuery(
    {
      canvassedTypeId: watchedCanvassedType || "",
      canvasserName: canvasserSearchTerm,
    },
    {
      skip:
        !shouldSearchCanvasser ||
        !watchedCanvassedType ||
        !canvasserSearchTerm ||
        canvasserSearchTerm.length < 3,
    }
  );

  const canvasserIdLabel = useMemo(() => {
    if (!watchedCanvassedType || canvassedTypesOptions.length === 0) {
      return "Canvasser ID";
    }
    const selectedOption = canvassedTypesOptions.find(
      opt => opt.value === watchedCanvassedType
    );
    if (!selectedOption) {
      return "Canvasser ID";
    }
    const labelLC = selectedOption.label.toLowerCase();

    if (labelLC.includes("customer")) return "Customer";
    if (labelLC.includes("agent")) return "Agent";
    if (labelLC.includes("staff")) return "Staff";

    return "Canvasser ID";
  }, [watchedCanvassedType, canvassedTypesOptions]);

  const canvasserIdPlaceholder = useMemo(() => {
    return `Enter ${canvasserIdLabel.toLowerCase()}`;
  }, [canvasserIdLabel]);

  const handleCanvasserSearch = useCallback((searchTerm: string): void => {
    setCanvasserSearchTerm(searchTerm);
    setShowCanvasserResults(false);
    setShouldSearchCanvasser(false);
    if (searchTerm.length < 3) {
      setSelectedCanvasser(null);
    }
  }, []);

  const handleCanvasserSearchClick = useCallback((): void => {
    if (canvasserSearchTerm.length >= 3 && watchedCanvassedType) {
      setShouldSearchCanvasser(true);
      setShowCanvasserResults(true);
    }
  }, [canvasserSearchTerm, watchedCanvassedType]);

  const handleCanvasserSelect = useCallback(
    (option: {
      canvasserIdentity: string;
      canvasserName: string;
      canvasserCode?: string;
      [key: string]: unknown;
    }): void => {
      if (!option || !option.canvasserIdentity) {
        logger.error("Invalid canvasser data", { toast: true, pushLog: false });
        return;
      }

      const canvasserData = {
        identity: option.canvasserIdentity,
        name: option.canvasserName,
        code: option.canvasserCode,
      };

      setSelectedCanvasser(canvasserData);
      setValue("canvasserId", canvasserData.identity);
      setCanvasserSearchTerm("");
      setShowCanvasserResults(false);
      // Trigger validation to clear any errors
      trigger("canvasserId");
    },
    [setValue, trigger]
  );

  const handleClearCanvasser = useCallback((): void => {
    setSelectedCanvasser(null);
    setCanvasserSearchTerm("");
    setShowCanvasserResults(false);
    setShouldSearchCanvasser(false);
    setValue("canvasserId", "");
    // Trigger validation to clear any errors
    trigger("canvasserId");
  }, [setValue, trigger]);

  useEffect(() => {
    if (formDataFromAPI) {
      const transformedData = transformFormData({
        ...DEFAULT_FORM_VALUES,
        ...formDataFromAPI,
      });

      reset(transformedData);

      if (formDataFromAPI.canvasserId) {
        setSelectedCanvasser({
          identity: formDataFromAPI.canvasserId,
          name: formDataFromAPI.canvasserId,
          code: undefined,
        });
        setCanvasserSearchTerm(formDataFromAPI.canvasserId);
      }
    } else {
      const defaultData = transformFormData(DEFAULT_FORM_VALUES);
      reset(defaultData);
    }
  }, [formDataFromAPI, reset]);

  useEffect(() => {
    if (canvasserDetails && formDataFromAPI?.canvasserId) {
      const canvasser = Array.isArray(canvasserDetails)
        ? canvasserDetails[0]
        : canvasserDetails;

      if (canvasser) {
        setSelectedCanvasser({
          identity: canvasser.canvasserIdentity,
          name: canvasser.canvasserName,
          code: canvasser.canvasserCode,
        });
        setCanvasserSearchTerm(
          `${canvasser.canvasserName} - ${canvasser.canvasserCode}`
        );
      }
    }
  }, [canvasserDetails, formDataFromAPI?.canvasserId]);

  useEffect(() => {
    if (
      nationalityOptions.length > 0 &&
      !isLoadingNationalities &&
      !formDataFromAPI?.nationality
    ) {
      const defaultNationalityId = DEFAULT_FORM_VALUES.nationality;
      const hasValidOption = nationalityOptions.some(
        option => option.value === defaultNationalityId
      );

      if (hasValidOption) {
        setValue("nationality", defaultNationalityId);
      }
    }
  }, [
    languageOptions,
    isLoadingNationalities,
    formDataFromAPI?.nationality,
    setValue,
  ]);
  useEffect(() => {
    if (
      languageOptions.length > 0 &&
      !isLoadingLanguages &&
      !formDataFromAPI?.preferredLanguage
    ) {
      const defaultPrefferedLanguage = DEFAULT_FORM_VALUES.preferredLanguage;
      const hasValidOption = languageOptions.some(
        option => option.value === defaultPrefferedLanguage
      );

      if (hasValidOption) {
        setValue("preferredLanguage", defaultPrefferedLanguage);
      }
    }
  }, [
    languageOptions,
    isLoadingLanguages,
    formDataFromAPI?.preferredLanguage,
    setValue,
  ]);
  useEffect(() => {
    if (
      formDataFromAPI?.referralSource &&
      referralSourceOptions.length > 0 &&
      !isLoadingReferralSource
    ) {
      const hasValidOption = referralSourceOptions.some(
        option => option.value === formDataFromAPI.referralSource
      );

      if (hasValidOption) {
        setValue("referralSource", formDataFromAPI.referralSource);
      } else {
        // Don't set any value - let the user manually select
        // This prevents setting an invalid value that would cause issues
      }
    }
  }, [
    formDataFromAPI?.referralSource,
    referralSourceOptions,
    isLoadingReferralSource,
    setValue,
  ]);

  useEffect(() => {
    if (moreDetailsConfig && moreDetailsConfig.length > 0 && !formDataFromAPI) {
      const initialMoreDetails: Record<string, string> = {};

      moreDetailsConfig.forEach(field => {
        if (field.isActive) {
          let defaultValue = "";
          if (field.valueType === "NUMBER") {
            defaultValue = "0";
          } else if (field.valueType === "DATE") {
            defaultValue = "";
          } else {
            defaultValue = "";
          }

          initialMoreDetails[field.identity] = defaultValue;
        }
      });

      setValue("moreDetails", initialMoreDetails);
    }
  }, [moreDetailsConfig, formDataFromAPI, setValue]);

  const onSubmit = useCallback(
    async (data: AdditionalOptionalFormData) => {
      try {
        const validReferralSourceIds = referralSourceOptions.map(
          option => option.value
        );

        if (
          data.referralSource &&
          !validReferralSourceIds.includes(data.referralSource)
        ) {
          logger.error("Invalid referral source ID selected", { toast: true });
          return;
        }

        const additionalReferenceValueDto = Object.entries(
          data.moreDetails || {}
        ).map(([referenceIdentity, referenceValue]) => ({
          referenceIdentity,
          referenceValue: String(referenceValue),
        }));
        const payload: SaveAdditionalOptionalPayload = {
          additional: {
            employment: {
              annualIncome: parseFloat(data.annualIncome || "0"),
              monthlySalary: data.monthlySalary
                ? parseFloat(data.monthlySalary)
                : undefined,
              employer: data.employerDetails.toUpperCase() || undefined,
              designationId: data.designation,
              incomeSourceId: data.sourceOfIncome,
              occupationId: data.occupation,
            },
            referrals: {
              canvassedTypeId: data.canvassedType,
              canvasserStaffId: (data.canvasserId || null) as string | null,
              // canvasserStaffId:canvasserIdentity,

              referralSourceId: data.referralSource,
            },
            profileExtra: {
              educationLevelId: data.educationLevel || undefined,
              purposeId: data.purpose || undefined,
            },
            customerAsset: {
              assetTypeId:
                data.ownAnyAssets === "yes" ? data.assetDetails : undefined,
              ownsAsset: data.ownAnyAssets === "yes",
              hasHomeLoan: data.hasHomeLoan === "yes",
              homeLoanAmount:
                data.hasHomeLoan === "yes" && data.homeLoanAmount
                  ? parseFloat(data.homeLoanAmount)
                  : undefined,
              homeLoanCompany:
                data.hasHomeLoan === "yes" ? data.homeLoanCompany : undefined,
            },
            customer: {
              nationality: data.nationality,
              preferredLanguageId: data.preferredLanguage || undefined,
              residentialStatusId: data.residentialStatus,
              customerGroupId: data.customerGroup || undefined,
              riskCategory: data.riskCategory || undefined,
              categoryId: data.customerCategory || undefined,
            },
            additionalReferenceValueDto,
          },
        };

        const customerId = customerIdentity || "";
        await saveAdditionalOptional({ customerId, payload }).unwrap();
        dispatch(setIsReady(true));
        logger.info(
          `Additional & Optional information ${annualIncome && annualIncome > 0 ? "updated" : "saved"} successfully`,
          {
            toast: true,
          }
        );

        onFormSubmit?.();

        refetch();
      } catch (error) {
        const apiError = error as {
          data?: {
            message?: string;
            details?: Record<string, string>;
            errorCode?: string;
          };
          message?: string;
        };
        let errorMessage =
          "Failed to save additional information. Please try again.";

        if (apiError?.data?.details) {
          const validationErrors = Object.entries(apiError.data.details)
            .map(([field, message]) => `${field}: ${message}`)
            .join(", ");
          errorMessage = `Validation failed: ${validationErrors}`;
        } else if (apiError?.data?.message) {
          errorMessage = apiError.data.message;
        } else if (apiError?.data?.errorCode) {
          errorMessage = `${apiError.data.errorCode}: ${apiError.data.message || "Request validation failed"}`;
        } else if (apiError?.message) {
          errorMessage = apiError.message;
        }

        logger.error(errorMessage, { toast: true });
      }
    },
    [
      saveAdditionalOptional,
      dispatch,
      customerIdentity,
      refetch,
      referralSourceOptions,
      onFormSubmit,
    ]
  );

  const handleReset = useCallback(() => {
    reset(transformFormData(DEFAULT_FORM_VALUES));
  }, [reset]);
  useEffect(() => {
    if (
      !confirmationModalData?.doAction ||
      confirmationModalData?.feature !== "RESET"
    ) {
      return;
    }

    handleReset();
  }, [confirmationModalData]);
  if (!customerIdentity) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-muted-foreground mb-2">
          <Save className="h-6 w-6" />
        </div>
        <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
          Customer Identity Required
        </h3>
        <p className="text-muted-foreground text-xs">
          Please provide a customer identity to manage additional optional
          details.
        </p>
      </div>
    );
  }

  return (
    <article className="additional-optional-form-container">
      <Grid className="px-2">
        <Flex justify="between" align="center" className="mb-1 w-full">
          <HeaderWrapper>
            <TitleHeader title="Customer Additional & Optional Information" />
          </HeaderWrapper>
        </Flex>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row gap={6}>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Occupation"
                required
                disabled={isLoading || readOnly || isLoadingOccupation}
                error={errors.occupation}
              >
                <Controller
                  name="occupation"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || readOnly || isLoadingOccupation}
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={occupationOptions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Designation"
                required
                disabled={isLoading || readOnly || isLoadingDesignation}
                error={errors.designation}
              >
                <Controller
                  name="designation"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || readOnly || isLoadingDesignation}
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={designationOptions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Source of Income"
                required
                error={errors.sourceOfIncome}
              >
                <Controller
                  name="sourceOfIncome"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        isLoading || readOnly || isLoadingSourceOfIncome
                      }
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={sourceOfIncomeOptions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Annual Income"
                required
                error={errors.annualIncome}
              >
                <Input
                  {...register("annualIncome")}
                  type="number"
                  placeholder="Enter annual income"
                  size="form"
                  variant="form"
                  disabled={isLoading || readOnly}
                  restriction="numeric"
                  maxValue={100000000}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Monthly Salary" error={errors.monthlySalary}>
                <Input
                  {...register("monthlySalary")}
                  type="number"
                  placeholder="Enter monthly salary"
                  size="form"
                  variant="form"
                  disabled={isLoading || readOnly}
                  restriction="numeric"
                  maxValue={8333335}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row gap={6} className="mt-2">
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Referral Source"
                required
                error={errors.referralSource}
              >
                <Controller
                  name="referralSource"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={
                          isLoading || readOnly || isLoadingReferralSource
                        }
                        placeholder="Select"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={referralSourceOptions}
                        onBlur={() => field.onBlur()}
                      />
                    );
                  }}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Canvassed Type"
                required
                error={errors.canvassedType}
              >
                <Controller
                  name="canvassedType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        isLoading || readOnly || isLoadingCanvassedTypes
                      }
                      placeholder="Select Canvassed Type"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={canvassedTypesOptions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label={canvasserIdLabel}
                required
                error={errors.canvasserId}
              >
                <Controller
                  name="canvasserId"
                  control={control}
                  render={({ field }) => (
                    <InputWithSearch
                      {...field}
                      placeholder={canvasserIdPlaceholder}
                      size="form"
                      variant="form"
                      disabled={isLoading || readOnly}
                      className="uppercase"
                      inputType="alphanumeric"
                      restriction="alphanumeric"
                      value={
                        selectedCanvasser
                          ? selectedCanvasser.code
                            ? `${selectedCanvasser.name} - ${selectedCanvasser.code}`
                            : selectedCanvasser.name
                          : canvasserSearchTerm || ""
                      }
                      onChange={e => {
                        const value = e.target.value;
                        const expectedValue = selectedCanvasser
                          ? selectedCanvasser.code
                            ? `${selectedCanvasser.name} - ${selectedCanvasser.code}`
                            : selectedCanvasser.name
                          : "";

                        if (selectedCanvasser && value !== expectedValue) {
                          setSelectedCanvasser(null);
                          // setValue("canvasserId", "");
                          // Trigger validation to clear the error
                          trigger("canvasserId");
                        }
                        handleCanvasserSearch(value);
                        setValue("canvasserId", value);
                        // Trigger validation after setting the value
                        trigger("canvasserId");
                      }}
                      onDoubleClick={() => {
                        if (selectedCanvasser && !readOnly) {
                          handleClearCanvasser();
                        }
                      }}
                      onKeyDown={e => {
                        if (
                          e.key === "Escape" &&
                          selectedCanvasser &&
                          !readOnly
                        ) {
                          handleClearCanvasser();
                        }
                      }}
                      onBlur={() => {
                        // Trigger validation when user leaves the field
                        trigger("canvasserId");
                      }}
                      onSearch={handleCanvasserSearchClick}
                      isSearching={isSearchingCanvasser || false}
                      showDropdown={
                        showCanvasserResults && canvasserSearchTerm.length >= 3
                      }
                      dropdownOptions={(() => {
                        if (!canvasserResults) return [];
                        const results = Array.isArray(canvasserResults)
                          ? canvasserResults
                          : [];
                        return results.map(canvasser => ({
                          value: canvasser.canvasserIdentity,
                          label: `${canvasser.canvasserName} - ${canvasser.canvasserCode}`,
                          canvasserIdentity: canvasser.canvasserIdentity,
                          canvasserName: canvasser.canvasserName,
                          canvasserCode: canvasser.canvasserCode,
                        }));
                      })()}
                      onOptionSelect={
                        handleCanvasserSelect as (option: unknown) => void
                      }
                      dropdownLoading={isSearchingCanvasser}
                      dropdownError={
                        canvasserSearchError
                          ? "Error searching for canvassers. Please try again."
                          : undefined
                      }
                      noResultsText="No canvassers found for this search term."
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Employer Details"
                error={errors.employerDetails}
              >
                <Input
                  {...register("employerDetails")}
                  placeholder="Enter employer details"
                  size="form"
                  variant="form"
                  disabled={isLoading || readOnly}
                  className="uppercase"
                  restriction="alphanumeric"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Customer Group" error={errors.customerGroup}>
                <Controller
                  name="customerGroup"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        isLoading || readOnly || isLoadingCustomerGroups
                      }
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={customerGroupOptions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Risk Category"
                required
                error={errors.riskCategory}
              >
                <Controller
                  name="riskCategory"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        isLoading || readOnly || isLoadingRiskCategories
                      }
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={riskCategoryOptions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row gap={6} className="mt-2">
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Customer Category"
                required
                error={errors.customerCategory}
              >
                <Controller
                  name="customerCategory"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        isLoading || readOnly || isLoadingCustomerCategories
                      }
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={customerCategoryOptions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Nationality"
                required
                error={errors.nationality}
              >
                <Controller
                  name="nationality"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || readOnly || isLoadingNationalities}
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={nationalityOptions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Residential Status"
                required
                error={errors.residentialStatus}
              >
                <Controller
                  name="residentialStatus"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        isLoading || readOnly || isLoadingResidentialStatuses
                      }
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={residentialStatusOptions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Purpose" required error={errors.purpose}>
                <Controller
                  name="purpose"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || readOnly || isLoadingPurpose}
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={purposeOptions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Preferred Language"
                error={errors.preferredLanguage}
              >
                <Controller
                  name="preferredLanguage"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || readOnly || isLoadingLanguages}
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={languageOptions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Education Level" error={errors.educationLevel}>
                <Controller
                  name="educationLevel"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        isLoading || readOnly || isLoadingEducationLevels
                      }
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={educationLevelOptions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row gap={6} className="mt-2">
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Own Any Assets" error={errors.ownAnyAssets}>
                <Controller
                  name="ownAnyAssets"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || readOnly}
                      placeholder="Select option"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={yesOrNoOPtions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            {ownAnyAssets === "yes" && (
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Asset Details"
                  error={errors.assetDetails}
                  required
                >
                  <Controller
                    name="assetDetails"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading || readOnly || isLoadingAssetTypes}
                        placeholder="Select"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={assetTypeOptions}
                        onBlur={() => field.onBlur()}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>
            )}

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Home Loan Borrowed?"
                error={errors.hasHomeLoan}
              >
                <Controller
                  name="hasHomeLoan"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || readOnly}
                      placeholder="Select option"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={yesOrNoOPtions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            {hasHomeLoan === "yes" && (
              <>
                <Form.Col lg={2} md={6} span={12}>
                  <Form.Field
                    label="Home Loan Amount"
                    error={errors.homeLoanAmount}
                    required
                  >
                    <Input
                      {...register("homeLoanAmount")}
                      type="number"
                      placeholder="Enter loan amount"
                      size="form"
                      variant="form"
                      disabled={isLoading || readOnly}
                      restriction="numeric"
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={2} md={6} span={12}>
                  <Form.Field
                    label="Home Loan Company"
                    error={errors.homeLoanCompany}
                    required
                  >
                    <Input
                      {...register("homeLoanCompany")}
                      placeholder="Enter loan company"
                      size="form"
                      variant="form"
                      disabled={isLoading || readOnly}
                      className="uppercase"
                      restriction="alphanumeric"
                      autoCapitalize="words"
                    />
                  </Form.Field>
                </Form.Col>
              </>
            )}
          </Form.Row>

          <MoreDetailsSection
            control={control}
            errors={errors}
            register={register}
            moreDetailsConfig={moreDetailsConfig}
            isLoading={isLoading}
            readOnly={readOnly}
          />

          <div className="mt-2">
            <Flex.ActionGroup className="gap-6">
              <NeumorphicButton
                type="button"
                variant="secondary"
                size="secondary"
                onClick={() => {
                  handleSetConfirmationModalData?.({
                    cancelText: "CANCEL",
                    confirmText: "RESET",
                    feature: "RESET",
                    description:
                      "Are you sure you want to reset the form? All entered data will be cleared.",
                    title: "Reset Form Confirmation",
                    show: true,
                    doAction: null,
                  });
                }}
                disabled={isLoading || readOnly}
              >
                <RefreshCw width={12} />
                Reset
              </NeumorphicButton>
              <NeumorphicButton
                type="submit"
                variant="default"
                size="default"
                disabled={
                  isLoading ||
                  readOnly ||
                  isLoadingFieldConfig ||
                  isLoadingExistingData
                }
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner
                      variant="default"
                      size={12}
                      className="text-primary-foreground"
                    />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <Save width={12} />
                    Save Information
                  </>
                )}
              </NeumorphicButton>
            </Flex.ActionGroup>
          </div>
        </Form>
      </Grid>
    </article>
  );
};
