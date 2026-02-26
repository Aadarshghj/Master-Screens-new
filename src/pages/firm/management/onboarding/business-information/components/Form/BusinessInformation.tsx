import React, { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import type { FieldError } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "@/hooks/store";
import {
  setCurrentStepSaved,
  setFirmOnboardState,
} from "@/global/reducers/firm/firmOnboarding.reducer";
import { Flex } from "@/components/ui/flex";
import { FormContainer } from "@/components/ui/form-container";
import { Button } from "@/components/ui/button";
import { Save, Plus, Minus, CircleCheckBig, CircleX } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { logger } from "@/global/service";
import { businessInformationValidationSchema } from "@/global/validation/firm/firmBusinessInfo.schema";
import { businessInformationDefaultValues } from "../../constants/form.constants";
import { InputWithSearch } from "@/components/ui/input-with-search";
import { OTPModal } from "@/components/ui/otp-modal";
import {
  useGetSeasonalityQuery,
  useGetSectoralPerformancesQuery,
  useGetFirmSourceOfIncomeQuery,
  useSendFirmOtpMutation,
  useVerifyFirmOtpMutation,
} from "@/global/service/end-points/master/firm-master";
import {
  useGetBusinessInfoByFirmIdQuery,
  useSaveBusinessInfoMutation,
  useUpdateBusinessInfoMutation,
} from "@/global/service/end-points/Firm/BusinessDetails";
import type { BusinessInfoResponse } from "@/global/service/end-points/Firm/BusinessDetails";
import type {
  FirmSourceOfIncomeResponse,
  SeasonalityResponse,
  SectoralPerformanceResponse,
} from "@/global/service/end-points/master/firm-master";

import type {
  BusinessInformation,
  ConfigOption,
  OtherSourceIncome,
  Seasonality,
  SectorPerformance,
  UtilitiesAvailability,
} from "@/types/firm/firm-businessInfo";

import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { toUpperSafe } from "@/utils";
import { useFormDirtyState } from "@/hooks/useFormDirtyState";
import { DatePicker } from "@/components";

interface BusinessInformationFormProps {
  readonly?: boolean;
  onFormSubmit?: () => void;
  onSaveSuccess?: () => void;
  firmId?: string;
  onSendOtp?: (mobileNumber: string) => Promise<void>;
  onVerifyOtp?: (otp: string) => Promise<void>;
  onVerifyEmail?: () => Promise<void>;
  onSaveBusinessInfo?: (data: BusinessInformation) => Promise<void>;
  seasonalityOptions?: ConfigOption[];
  sectorPerformanceOptions?: ConfigOption[];
  otherSourceIncomeOptions?: ConfigOption[];
  existingBusinessInfo?: BusinessInfoResponse | null;
  isLoadingData?: boolean;
}

export const BusinessInformationForm: React.FC<
  BusinessInformationFormProps
> = ({
  readonly = false,
  onFormSubmit,
  onSaveSuccess,
  firmId: propFirmId,

  existingBusinessInfo: propExistingBusinessInfo,
  isLoadingData = false,
}) => {
  const { firmId: urlFirmId } = useParams<{ firmId: string }>();
  const firmId = propFirmId || urlFirmId;
  const dispatch = useAppDispatch();

  const [isEmailVerifying] = useState(false);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<
    "none" | "verified" | "denied"
  >("none");

  const [isMobileVerifying, setIsMobileVerifying] = useState(false);
  const [mobileVerificationStatus, setMobileVerificationStatus] = useState<
    "none" | "verified" | "denied"
  >("none");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [, setIsSaved] = useState(false);

  const { handleUpdateFormDirtyState, handleResetFormDirtyState } =
    useFormDirtyState({ isView: false });

  // Timer effect for OTP countdown
  useEffect(() => {
    if (otpTimer > 0) {
      timerRef.current = setTimeout(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && !canResendOtp) {
      setCanResendOtp(true);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [otpTimer, canResendOtp]);

  // Start timer when OTP is sent
  const startOtpTimer = () => {
    setOtpTimer(60); // 1 minute
    setCanResendOtp(false);
  };

  const [isSaving] = useState(false);
  const [isSendingOtp] = useState(false);
  const [isVerifyingOtp] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  const {
    data: fetchedBusinessInfo,

    error: fetchError,
  } = useGetBusinessInfoByFirmIdQuery(
    {
      customerIdentity: firmId || "",
    },
    {
      skip: !firmId,
    }
  );

  // Use fetched data or prop data
  const existingBusinessInfo =
    fetchedBusinessInfo ?? propExistingBusinessInfo ?? null;

  // Initialize the hooks
  const [sendOtp] = useSendFirmOtpMutation();
  const [verifyOtp] = useVerifyFirmOtpMutation();
  const [saveBusinessInfo] = useSaveBusinessInfoMutation();
  const [updateBusinessInfo] = useUpdateBusinessInfoMutation();

  // Fetch master data using RTK Query
  const { data: seasonalityData = [], isLoading: isLoadingSeasonality } =
    useGetSeasonalityQuery();
  const {
    data: sectorPerformanceData = [],
    isLoading: isLoadingSectorPerformance,
  } = useGetSectoralPerformancesQuery();
  const { data: sourceOfIncomeData = [], isLoading: isLoadingSourceOfIncome } =
    useGetFirmSourceOfIncomeQuery();

  const otherSourceIncomeOptions: ConfigOption[] = sourceOfIncomeData.map(
    (item: FirmSourceOfIncomeResponse) => ({
      value: item.identity,
      label: item.name,
      identity: item.identity,
    })
  );

  type SeasonalityOptionSource = SeasonalityResponse & {
    season?: string | null;
  };

  const seasonalityOptions: ConfigOption[] = seasonalityData.map(item => {
    const typedItem = item as SeasonalityOptionSource;
    return {
      value: item.identity,
      label: typedItem.season ?? item.name ?? "",
      identity: item.identity,
    };
  });

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    register,
    setValue,
    trigger,
    formState: { errors, isDirty },
  } = useForm<BusinessInformation>({
    resolver: yupResolver(
      businessInformationValidationSchema
    ) as unknown as Resolver<BusinessInformation>,
    mode: "onBlur",
    defaultValues: businessInformationDefaultValues,
  });

  // const watchedValues = useWatch({ control });

  useEffect(() => {
    if (isDirty) {
      handleUpdateFormDirtyState();
      dispatch(setCurrentStepSaved(false));
    } else {
      handleResetFormDirtyState();
    }
  }, [
    isDirty,
    handleUpdateFormDirtyState,
    handleResetFormDirtyState,
    dispatch,
  ]);

  type SectorPerformanceOptionSource = SectoralPerformanceResponse & {
    sectorName?: string | null;
  };

  const sectorPerformanceOptions: ConfigOption[] = sectorPerformanceData.map(
    item => {
      const typedItem = item as SectorPerformanceOptionSource;
      return {
        value: item.identity,
        label: typedItem.sectorName ?? item.name ?? "",
        identity: item.identity,
      };
    }
  );

  const isLoading = isSaving || isLoadingData;
  const isEditMode = !!propExistingBusinessInfo;

  // Set default values for dropdowns when options load
  useEffect(() => {
    if (
      otherSourceIncomeOptions.length > 0 &&
      !control._formValues?.otherSourceIncome
    ) {
      setValue(
        "otherSourceIncome",
        otherSourceIncomeOptions[0].value as OtherSourceIncome
      );
    }
    if (seasonalityOptions.length > 0 && !control._formValues?.seasonality) {
      setValue("seasonality", seasonalityOptions[0].value as Seasonality);
    }
    if (
      sectorPerformanceOptions.length > 0 &&
      !control._formValues?.sectorPerformance
    ) {
      setValue(
        "sectorPerformance",
        sectorPerformanceOptions[0].value as SectorPerformance
      );
    }
  }, [
    otherSourceIncomeOptions,
    seasonalityOptions,
    sectorPerformanceOptions,
    setValue,
    control._formValues,
  ]);

  useEffect(() => {
    const emp = getValues("noOfEmployees");
    if (emp) {
      setValue("noOfEmployees", emp, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }

    const branches = getValues("noOfBranchesOffices");
    if (branches) {
      setValue("noOfBranchesOffices", branches, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [setValue, getValues]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "profitabilityData",
  });

  const yearsInOperationValue = useWatch({
    control,
    name: "yearsInOperation",
  });

  const maxAllowedFields = Math.min(parseInt(yearsInOperationValue) || 0, 5);

  const mapEmployeesToOption = (
    val: number | string | undefined | null
  ): string => {
    const n = Number(val);
    if (isNaN(n)) return "";
    if (n <= 10) return "1-10";
    if (n <= 50) return "11-50";
    if (n <= 100) return "51-100";
    if (n <= 500) return "101-500";
    return "500+";
  };

  const mapBranchesToOption = (
    val: number | string | undefined | null
  ): string => {
    const n = Number(val);
    if (isNaN(n)) return "";
    if (n === 1) return "1";
    if (n >= 2 && n <= 5) return "2-5";
    if (n >= 6 && n <= 10) return "6-10";
    if (n >= 11 && n <= 25) return "11-25";
    return "25+";
  };

  // Handle fetch error gracefully
  useEffect(() => {
    if (fetchError && "status" in fetchError && fetchError.status === 400) {
      // Don't show error for new firms without business info
      return;
    }
  }, [fetchError]);

  useEffect(() => {
    if (!existingBusinessInfo?.natureOfBusiness) {
      dispatch(
        setFirmOnboardState({
          disableNext: true,
          disableReason:
            "Please complete the Business Details before continuing.",
          title: "Incomplete Step",
        })
      );
    } else {
      dispatch(
        setFirmOnboardState({
          disableNext: false,
          disableReason: null,
          title: null,
        })
      );
    }
  }, [existingBusinessInfo]);

  // Load existing data when available
  useEffect(() => {
    if (existingBusinessInfo) {
      const formData: BusinessInformation = {
        natureOfBusiness: existingBusinessInfo.natureOfBusiness || "",
        yearsInOperation:
          existingBusinessInfo.yearsInOperation?.toString() || "",
        annualTurnover: existingBusinessInfo.annualTurnover?.toString() || "",
        noOfEmployees: mapEmployeesToOption(existingBusinessInfo.noOfEmployees),
        noOfBranchesOffices: mapBranchesToOption(
          existingBusinessInfo.noOfBranchesOffices
        ),
        dateOfIncorporation: existingBusinessInfo.dateOfIncorporation || "",
        authorizedCapital:
          existingBusinessInfo.authorizedCapital?.toString() || "",
        issuedCapital: existingBusinessInfo.issuedCapital?.toString() || "",
        paidUpCapital: existingBusinessInfo.paidUpCapital?.toString() || "",
        netWorth: existingBusinessInfo.netWorth?.toString() || "",
        website: existingBusinessInfo.website || "",
        businessEmail: existingBusinessInfo.businessEmail || "",
        mobileNumber: existingBusinessInfo.contactNumber || "",
        customerConcentration:
          existingBusinessInfo.customerConcentrationPercent?.toString() || "",
        otherSourceIncome:
          (existingBusinessInfo.otherSourceIncome?.toString() as OtherSourceIncome) ||
          null,
        seasonality: (existingBusinessInfo.seasonality as Seasonality) || null,
        sectorPerformance:
          (existingBusinessInfo.sectorPerformance as SectorPerformance) || null,
        capacityUtilization:
          existingBusinessInfo.capacityUtilizationPercent?.toString() || "",
        productClassification:
          existingBusinessInfo.productDiversification || "",
        utilitiesAvailability: existingBusinessInfo.utilitiesAvailability
          ? typeof existingBusinessInfo.utilitiesAvailability === "string"
            ? (existingBusinessInfo.utilitiesAvailability
                .split(", ")
                .filter(Boolean) as UtilitiesAvailability[])
            : existingBusinessInfo.utilitiesAvailability
          : [],
        businessDescription: existingBusinessInfo.businessDescription || "",
        profitabilityData:
          existingBusinessInfo.profitabilityLast5Years?.map(item => ({
            year: item.year.toString(),
            amount: item.amount.toString(),
          })) || [],
      };

      reset(formData, { keepDirty: false });
      setIsSaved(true);

      dispatch(setCurrentStepSaved(true));
      reset(getValues(), {
        keepValues: true,
      });

      handleResetFormDirtyState();
      dispatch(
        setFirmOnboardState({
          disableNext: false,
          disableReason: null,
          title: null,
        })
      );

      onFormSubmit?.();
      onSaveSuccess?.();
      setEmailVerificationStatus(
        existingBusinessInfo.isEmailVerified ? "verified" : "none"
      );
      // Always require mobile OTP verification on load; do not auto-mark verified
      setMobileVerificationStatus("none");
    }
  }, [existingBusinessInfo?.identity, existingBusinessInfo, reset, dispatch]);

  const handleVerifyEmail = async () => {
    // Real email verification not wired; prevent auto-verify without backend confirmation
    logger.error(
      "Email verification via OTP is not completed. Please implement backend verification before marking as verified.",
      { toast: true }
    );
    setEmailVerificationStatus("none");
  };

  const handleSendOtp = async () => {
    const mobileNumber = control._formValues?.mobileNumber;
    if (!mobileNumber || mobileNumber.length !== 10) {
      logger.error("Please enter a valid 10-digit mobile number", {
        toast: true,
      });
      return;
    }

    try {
      setIsMobileVerifying(true);

      const otpPayload = {
        tenantId: 1,
        branchCode: "ID-001",
        templateCatalogIdentity: "74829315-9ff1-4055-94c8-beeddf4de7af",
        templateContentIdentity: "fae09f0a-8470-4000-9969-586667b2366e",
        target: `+91${mobileNumber}`,
        customerIdentity: 12345,
        length: 6,
        ttlSeconds: 300,
      };

      const response = await sendOtp(otpPayload).unwrap();

      // Store the request ID and OTP code for verification
      if (response?.requestId) {
        setOtpRequestId(response.requestId);
      }

      // Note: OTP code is not returned in response for security reasons
      // Users must enter the OTP they receive via SMS/email

      logger.info("OTP sent successfully to your mobile number", {
        toast: true,
      });
      setIsOtpModalOpen(true);
      startOtpTimer();
    } catch {
      logger.error("Failed to send OTP. Please try again.", { toast: true });
    } finally {
      setIsMobileVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpValue;

    if (!otpRequestId) {
      logger.error("No OTP request found. Please send OTP again.", {
        toast: true,
      });
      return;
    }

    if (!otp || otp.length !== 6) {
      logger.error("Please enter a valid 6-digit OTP.", { toast: true });
      return;
    }

    try {
      const trimmedOtp = otp.trim();
      if (!/^\d{6}$/.test(trimmedOtp)) {
        logger.error("Invalid OTP format. Please enter 6 digits only.", {
          toast: true,
        });
        return;
      }

      const res = await verifyOtp({
        requestId: otpRequestId,
        code: trimmedOtp,
      }).unwrap();

      // SUCCESS CASE
      if (res.result === "VERIFIED") {
        setMobileVerificationStatus("verified");
        setIsOtpModalOpen(false);
        setOtpTimer(0);
        setCanResendOtp(true);

        logger.info("Mobile number verified successfully", { toast: true });
        return;
      }

      setMobileVerificationStatus("denied");
      logger.error("Invalid OTP. Please try again.", { toast: true });
    } catch {
      setMobileVerificationStatus("denied");
      logger.error("Something went wrong. Try again.", { toast: true });
    }
  };

  const handleAddProfitability = () => {
    if (fields.length < maxAllowedFields) {
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear - fields.length;
      append({ year: nextYear.toString(), amount: "" });
    }
  };

  const handleRemoveProfitability = (index: number) => {
    remove(index);
  };

  const onSubmit = handleSubmit(
    async data => {
      if (!firmId) {
        logger.error("Firm ID is required to save business information", {
          toast: true,
        });
        return;
      }

      try {
        if (isEditMode) {
          await updateBusinessInfo({
            firmId,
            data,
          }).unwrap();

          logger.info("Business information updated successfully", {
            toast: true,
          });
        } else {
          await saveBusinessInfo({
            firmId,
            businessData: data,
          }).unwrap();

          logger.info("Business information saved successfully", {
            toast: true,
          });
        }

        dispatch(setCurrentStepSaved(true));
        dispatch(
          setFirmOnboardState({
            disableNext: false,
            disableReason: null,
            title: null,
          })
        );

        onFormSubmit?.();
        onSaveSuccess?.();
      } catch (error) {
        dispatch(setCurrentStepSaved(false));
        setIsSaved(false);

        let errorMessage =
          "Failed to save business information. Please try again.";

        if (error && typeof error === "object" && "status" in error) {
          const status = error.status as number;
          if (status === 503) {
            errorMessage =
              "Service is temporarily unavailable. Please try again in a few minutes.";
          } else if (status >= 500) {
            errorMessage =
              "Server error occurred. Please contact support if the issue persists.";
          } else if (status === 400 && "data" in error) {
            const data = error.data;

            if (data && typeof data === "object" && "message" in data) {
              errorMessage = String((data as { message: unknown }).message);
            }
          }
        }

        logger.error(errorMessage, { toast: true });
      }
    },
    () => {
      dispatch(
        setFirmOnboardState({
          disableNext: true,
          disableReason:
            "Please fix validation errors before moving to the next step.",
          title: "Form Errors",
        })
      );

      logger.error("Please fix the form errors before submitting", {
        toast: true,
      });
    }
  );

  const handleReset = () => {
    if (readonly) return;
    setShowResetConfirmation(true);
  };

  const confirmReset = () => {
    reset(businessInformationDefaultValues);
    setEmailVerificationStatus("none");
    setMobileVerificationStatus("none");
    setIsSaved(false);
    dispatch(setCurrentStepSaved(false));
    dispatch(
      setFirmOnboardState({
        disableNext: true,
        disableReason:
          "Please complete and save Business Information before continuing.",
        title: "Incomplete Step",
      })
    );

    setShowResetConfirmation(false);
  };

  return (
    <article className="business-information-form-container">
      <TitleHeader className="mb-5 ml-5" title="Business Information" />
      <ConfirmationModal
        isOpen={showResetConfirmation}
        onConfirm={confirmReset}
        onCancel={() => setShowResetConfirmation(false)}
        title="Reset Form"
        message="This will reset the entire form completely. Are you sure you want to continue?"
        confirmText="Reset"
        cancelText="Cancel"
        type="warning"
        size="compact"
      />
      <FormContainer>
        <div className={readonly ? "pointer-events-none opacity-70" : ""}>
          <Form onSubmit={onSubmit}>
            {/* Basic Information Section */}
            <div className="mt-4">
              <Form.Row>
                {/* Name of Business */}
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field
                    label="Nature of Business"
                    required
                    error={errors.natureOfBusiness}
                  >
                    <Input
                      {...register("natureOfBusiness", {
                        setValueAs: toUpperSafe,
                      })}
                      placeholder="Describe nature of business"
                      disabled={readonly || isLoading}
                      size="form"
                      variant="form"
                      restriction="alphabetic"
                      className="uppercase"
                    />
                  </Form.Field>
                </Form.Col>

                {/* Years in Operation */}
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field
                    label="Years in Operation"
                    required
                    error={errors.yearsInOperation}
                  >
                    <Input
                      {...register("yearsInOperation")}
                      type="text"
                      placeholder="Enter years"
                      disabled={readonly || isLoading}
                      size="form"
                      variant="form"
                      restriction="numeric"
                    />
                  </Form.Field>
                </Form.Col>

                {/* Annual Turnover */}
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field
                    label="Annual Turnover (Rs.)"
                    error={errors.annualTurnover}
                  >
                    <Input
                      {...register("annualTurnover")}
                      type="text"
                      placeholder="Enter annual turnover"
                      disabled={readonly || isLoading}
                      size="form"
                      variant="form"
                      onInput={e => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                      }}
                      restriction="numeric"
                    />
                  </Form.Field>
                </Form.Col>

                {/* No of Employees */}
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field
                    label="No.of Employees"
                    error={errors.noOfEmployees}
                  >
                    <Controller
                      control={control}
                      name="noOfEmployees"
                      render={({ field }) => (
                        <Select
                          key={field.value || "employees"}
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                          placeholder="Select number of employees"
                          disabled={readonly || isLoading}
                          size="form"
                          variant="form"
                          fullWidth={true}
                          itemVariant="form"
                          options={[
                            { value: "1-10", label: "1-10" },
                            { value: "11-50", label: "11-50" },
                            { value: "51-100", label: "51-100" },
                            { value: "101-500", label: "101-500" },
                            { value: "500+", label: "More than 500" },
                          ]}
                          onBlur={() => field.onBlur()}
                        />
                      )}
                    />
                  </Form.Field>
                </Form.Col>
              </Form.Row>

              <Form.Row className="mt-4">
                {/* No of Branches/Offices */}
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field
                    label="No.of Branches/Offices"
                    error={errors.noOfBranchesOffices}
                  >
                    <Controller
                      control={control}
                      name="noOfBranchesOffices"
                      render={({ field }) => (
                        <Select
                          key={field.value || "branches"}
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                          placeholder="Select number of branches"
                          disabled={readonly || isLoading}
                          size="form"
                          variant="form"
                          fullWidth={true}
                          itemVariant="form"
                          options={[
                            { value: "1", label: "1" },
                            { value: "2-5", label: "2-5" },
                            { value: "6-10", label: "6-10" },
                            { value: "11-25", label: "11-25" },
                            { value: "25+", label: "More than 25" },
                          ]}
                          onBlur={() => field.onBlur()}
                        />
                      )}
                    />
                  </Form.Field>
                </Form.Col>

                {/* Date of Incorporation */}
                <Form.Col lg={2} md={6} span={12}>
                  <Form.Field
                    label="Date of Incorporation"
                    required
                    error={errors.dateOfIncorporation}
                  >
                    <Controller
                      name="dateOfIncorporation"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value || undefined}
                          onChange={(value: string) => {
                            field.onChange(value);
                            trigger?.("dateOfIncorporation");
                          }}
                          onBlur={() => field.onBlur()}
                          placeholder="dd/mm/yyyy"
                          allowManualEntry={true}
                          size="form"
                          variant="form"
                          max={new Date().toISOString().split("T")[0]}
                          disabled={readonly || isLoading}
                          disableFutureDates={false}
                        />
                      )}
                    />
                  </Form.Field>
                </Form.Col>

                {/* Authorized Capital */}
                <Form.Col lg={2} md={5} span={12}>
                  <Form.Field
                    label="Authorized Capital (Rs.)"
                    error={errors.authorizedCapital}
                  >
                    <Input
                      {...register("authorizedCapital")}
                      type="text"
                      placeholder="Enter authorized capital"
                      disabled={readonly || isLoading}
                      size="form"
                      variant="form"
                      onInput={e => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                      }}
                      restriction="numeric"
                    />
                  </Form.Field>
                </Form.Col>

                {/* Issued Capital */}
                <Form.Col lg={2} md={6} span={12}>
                  <Form.Field
                    label="Issued Capital (Rs.)"
                    error={errors.issuedCapital}
                  >
                    <Input
                      {...register("issuedCapital")}
                      type="text"
                      placeholder="Enter issued capital"
                      disabled={readonly || isLoading}
                      size="form"
                      variant="form"
                      onInput={e => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                      }}
                      restriction="numeric"
                    />
                  </Form.Field>
                </Form.Col>

                {/* Paid-up Capital */}
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field
                    label="Paid-up Capital (Rs.)"
                    error={errors.paidUpCapital}
                  >
                    <Input
                      {...register("paidUpCapital")}
                      type="text"
                      placeholder="Enter paid-up capital"
                      disabled={readonly || isLoading}
                      size="form"
                      variant="form"
                      onInput={e => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                      }}
                      restriction="numeric"
                    />
                  </Form.Field>
                </Form.Col>
              </Form.Row>

              <Form.Row className="mt-4">
                {/* Net Worth */}
                <Form.Col lg={2} md={6} span={12}>
                  <Form.Field label="Net Worth" error={errors.netWorth}>
                    <Input
                      {...register("netWorth")}
                      type="text"
                      placeholder="enter net worth"
                      disabled={readonly || isLoading}
                      size="form"
                      variant="form"
                      onInput={e => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                      }}
                      restriction="numeric"
                    />
                  </Form.Field>
                </Form.Col>

                {/* Website */}
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="website" error={errors.website}>
                    <InputWithSearch
                      {...register("website")}
                      type="url"
                      placeholder="www.website.com"
                      disabled={readonly || isLoading}
                      size="form"
                      variant="form"
                      className="placeholder:normal-case"
                    />
                  </Form.Field>
                </Form.Col>

                {/* Business Email */}
                <Form.Col lg={4} md={6} span={12}>
                  <Form.Field
                    label="Business Email"
                    error={errors.businessEmail}
                  >
                    <div className="flex items-center gap-2">
                      <Input
                        {...register("businessEmail")}
                        type="email"
                        placeholder="Enter business email"
                        disabled={readonly || isLoading}
                        className="flex-1"
                        size="form"
                        variant="form"
                      />
                      <Button
                        type="button"
                        variant="primary"
                        size="compact"
                        onClick={handleVerifyEmail}
                        disabled={readonly || isLoading || isEmailVerifying}
                        className="gap-2"
                      >
                        <CircleCheckBig className="h-4 w-4" />
                        {isEmailVerifying ? "Verifying..." : "Verify Email"}
                      </Button>
                      {emailVerificationStatus === "verified" && (
                        <span className="ml-2 flex items-center gap-1 text-xs text-blue-600">
                          <CircleCheckBig className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      )}
                      {emailVerificationStatus === "denied" && (
                        <span className="ml-2 flex items-center gap-1 text-xs text-red-600">
                          <CircleX className="h-3.5 w-3.5" />
                          Denied
                        </span>
                      )}
                    </div>
                  </Form.Field>
                </Form.Col>

                {/* Mobile Number */}
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="Mobile Number" error={errors.mobileNumber}>
                    <div className="flex items-center gap-2">
                      <Input
                        {...register("mobileNumber")}
                        type="tel"
                        placeholder="Enter mobile number"
                        disabled={readonly || isLoading}
                        className="flex-1"
                        maxLength={10}
                        size="form"
                        variant="form"
                        onInput={e => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          setMobileVerificationStatus("none");
                        }}
                        restriction="numeric"
                      />
                      <Button
                        type="button"
                        variant="primary"
                        size="compact"
                        onClick={handleSendOtp}
                        disabled={
                          readonly ||
                          isLoading ||
                          isMobileVerifying ||
                          isSendingOtp ||
                          mobileVerificationStatus === "verified"
                        }
                      >
                        {isMobileVerifying || isSendingOtp
                          ? "Sending..."
                          : "Send OTP"}
                      </Button>
                      {mobileVerificationStatus === "verified" && (
                        <span className="ml-2 flex items-center gap-1 text-xs text-blue-600">
                          <CircleCheckBig className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      )}
                      {mobileVerificationStatus === "denied" && (
                        <span className="ml-2 flex items-center gap-1 text-xs text-red-600">
                          <CircleX className="h-3.5 w-3.5" />
                          Denied
                        </span>
                      )}
                    </div>
                  </Form.Field>
                </Form.Col>
              </Form.Row>

              <Form.Row className="mt-4">
                {/* Customer Concentration */}
                <Form.Col lg={2} md={3} span={12}>
                  <Form.Field
                    label="Customer Concentration (%)"
                    error={errors.customerConcentration}
                  >
                    <Input
                      {...register("customerConcentration")}
                      type="text"
                      placeholder="Enter percentage"
                      disabled={readonly || isLoading}
                      size="form"
                      variant="form"
                      onInput={e => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9.]/g,
                          ""
                        );
                      }}
                    />
                  </Form.Field>
                </Form.Col>

                {/* Other Source Income */}
                <Form.Col lg={3} md={4} span={12}>
                  <Form.Field
                    label="Other Source Income"
                    error={errors.otherSourceIncome}
                  >
                    <Controller
                      control={control}
                      name="otherSourceIncome"
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ""}
                          onValueChange={val => field.onChange(val)}
                          options={otherSourceIncomeOptions}
                          placeholder="Select"
                          disabled={
                            readonly || isLoading || isLoadingSourceOfIncome
                          }
                          loading={isLoadingSourceOfIncome}
                          size="form"
                          variant="form"
                          fullWidth={true}
                          itemVariant="form"
                          onBlur={() => field.onBlur()}
                        />
                      )}
                    />
                  </Form.Field>
                </Form.Col>

                {/* Seasonality */}
                <Form.Col lg={2} md={6} span={12}>
                  <Form.Field label="Seasonality" error={errors.seasonality}>
                    <Controller
                      control={control}
                      name="seasonality"
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ""}
                          onValueChange={val => field.onChange(val)}
                          options={seasonalityOptions}
                          placeholder="Select"
                          disabled={
                            readonly || isLoading || isLoadingSeasonality
                          }
                          loading={isLoadingSeasonality}
                          size="form"
                          variant="form"
                          fullWidth={true}
                          itemVariant="form"
                          onBlur={() => field.onBlur()}
                        />
                      )}
                    />
                  </Form.Field>
                </Form.Col>

                {/* Sector Performance */}
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field
                    label="Sector Performance"
                    error={errors.sectorPerformance}
                  >
                    <Controller
                      control={control}
                      name="sectorPerformance"
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ""}
                          onValueChange={val => field.onChange(val)}
                          options={sectorPerformanceOptions}
                          placeholder="Select"
                          disabled={
                            readonly || isLoading || isLoadingSectorPerformance
                          }
                          loading={isLoadingSectorPerformance}
                          size="form"
                          variant="form"
                          fullWidth={true}
                          itemVariant="form"
                          onBlur={() => field.onBlur()}
                        />
                      )}
                    />
                  </Form.Field>
                </Form.Col>

                {/* Capacity Utilization (%) */}
                <Form.Col lg={2} md={6} span={12}>
                  <Form.Field
                    label="Capacity Utilization (%)"
                    error={errors.capacityUtilization}
                  >
                    <Input
                      {...register("capacityUtilization")}
                      type="text"
                      placeholder="Enter percentage"
                      disabled={readonly || isLoading}
                      size="form"
                      variant="form"
                      onInput={e => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9.]/g,
                          ""
                        );
                      }}
                      restriction="numeric"
                    />
                  </Form.Field>
                </Form.Col>
              </Form.Row>

              {/* Three-column row for large fields */}
              <Form.Row className="mt-6">
                {/* Product Classification */}
                <Form.Col lg={4} md={12} span={12}>
                  <Form.Field
                    label="Product Diversification"
                    required
                    error={errors.productClassification}
                  >
                    <Textarea
                      {...register("productClassification", {
                        setValueAs: toUpperSafe,
                      })}
                      disabled={readonly || isLoading}
                      rows={4}
                      className="h-24 resize-y text-xs uppercase md:resize-none"
                    />
                  </Form.Field>
                </Form.Col>

                {/* Utilities Availability */}
                <Form.Col lg={4} md={12} span={12}>
                  <Form.Field
                    label="Utilities Availability"
                    error={
                      errors.utilitiesAvailability as FieldError | undefined
                    }
                  >
                    <Textarea
                      {...register("utilitiesAvailability", {
                        setValueAs: toUpperSafe,
                      })}
                      disabled={readonly || isLoading}
                      rows={3}
                      className="h-24 resize-y text-xs uppercase md:resize-none"
                    />
                  </Form.Field>
                </Form.Col>

                {/* Business Description */}
                <Form.Col lg={4} md={12} span={12}>
                  <Form.Field
                    label="Business Description"
                    error={errors.businessDescription}
                  >
                    <Textarea
                      {...register("businessDescription", {
                        setValueAs: toUpperSafe,
                      })}
                      disabled={readonly || isLoading}
                      rows={4}
                      className="h-24 resize-y text-xs uppercase md:resize-none"
                    />
                  </Form.Field>
                </Form.Col>
              </Form.Row>
            </div>

            {/* Profitability Data Section */}
            <div className="mt-6 max-w-3xl">
              {errors.profitabilityData &&
                typeof errors.profitabilityData === "object" &&
                "message" in errors.profitabilityData && (
                  <p className="mb-4 text-sm text-red-600">
                    {String(
                      (errors.profitabilityData as { message?: string })
                        ?.message
                    )}
                  </p>
                )}

              <div className="flex items-start gap-3">
                <div className="grid flex-1 grid-cols-[1fr_1fr] gap-0 overflow-hidden rounded-md border border-gray-300">
                  {/* Header Row */}
                  <div className="border-r border-gray-300 bg-blue-50 px-3 py-2">
                    <span className="text-xs text-gray-600">
                      Profitability last 5 years
                    </span>
                  </div>
                  <div className="border-gray-300 bg-blue-50 px-3 py-2">
                    <span className="text-xs text-gray-600"></span>
                  </div>

                  {/* Data Rows */}
                  {fields.map((field, index) => (
                    <React.Fragment key={field.id}>
                      <div className="border-t border-r border-gray-300 bg-white px-3 py-2">
                        <Input
                          {...register(
                            `profitabilityData.${index}.year` as const
                          )}
                          placeholder="Year"
                          disabled={true}
                          readOnly={true}
                          className="h-auto w-full border-0 bg-gray-50 px-0 py-0 text-xs focus:ring-0 focus:outline-none"
                        />
                        {errors.profitabilityData?.[index]?.year && (
                          <p className="mt-0.5 text-xs text-red-600">
                            {String(
                              (
                                errors.profitabilityData[index]?.year as {
                                  message?: string;
                                }
                              )?.message
                            )}
                          </p>
                        )}
                      </div>

                      <div className="border-t border-gray-300 bg-white px-3 py-2">
                        <Input
                          {...register(
                            `profitabilityData.${index}.amount` as const
                          )}
                          type="text"
                          placeholder="1000000"
                          disabled={readonly || isLoading}
                          className="h-auto w-full border-0 bg-transparent px-0 py-0 text-xs focus:ring-0 focus:outline-none"
                        />
                        {errors.profitabilityData?.[index]?.amount && (
                          <p className="mt-0.5 text-xs text-red-600">
                            {String(
                              (
                                errors.profitabilityData[index]?.amount as {
                                  message?: string;
                                }
                              )?.message
                            )}
                          </p>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                {/* Action Buttons Outside Table */}
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    onClick={handleAddProfitability}
                    disabled={
                      readonly ||
                      isLoading ||
                      fields.length >= maxAllowedFields ||
                      maxAllowedFields === 0
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 p-0 text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleRemoveProfitability(fields.length - 1)}
                    disabled={readonly || isLoading || fields.length === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-blue-100 p-0 text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8">
              <Flex.ActionGroup>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    disabled={isLoading || readonly}
                    onClick={handleReset}
                  >
                    Reset
                  </Button>

                  <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    disabled={isLoading || readonly}
                    onClick={() => {}}
                  >
                    <Save className="mr-1 h-4 w-4" />
                    {isLoading
                      ? "Saving..."
                      : isEditMode
                        ? "Update Business Info"
                        : "Save Business Info"}
                  </Button>
                </div>
              </Flex.ActionGroup>
            </div>
          </Form>
        </div>
      </FormContainer>

      {/* OTP Modal */}
      <OTPModal
        isOpen={isOtpModalOpen}
        onClose={() => {
          setIsOtpModalOpen(false);
          setOtpValue("");
          setOtpTimer(0);
          setCanResendOtp(true);
        }}
        mobileNumber={control._formValues?.mobileNumber}
        otpValue={otpValue}
        onOtpChange={setOtpValue}
        onVerify={handleVerifyOtp}
        onResend={() => {
          setOtpValue("");
          handleSendOtp();
        }}
        isVerifying={isVerifyingOtp}
        isSending={isSendingOtp}
        canResend={canResendOtp}
        timer={otpTimer}
      />
    </article>
  );
};
