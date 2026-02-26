import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Label,
  Switch,
  Input,
  InputWithSearch,
  Form,
  Select,
  HeaderWrapper,
  Flex,
  Grid,
  type DropdownOption,
} from "@/components";
import { MaskedInput } from "@/components/ui/masked-input";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { setIsReady } from "@/global/reducers/customer/basicinfo.reducer";
import { logger } from "@/global/service/logger";
import type { BasicInfoFormData, BasicInfoFormProps, APIError } from "@/types";
import {
  basicInfoValidationSchema,
  validateField,
  transformFormData,
} from "@/global/validation/customer/basicinfo-schema";
import {
  useGetBasicInfoByIdQuery,
  useUpdateBasicInfoMutation,
  useGetGenderTypesQuery,
  useGetMaritalStatusTypesQuery,
  useGetTaxCategoryTypesQuery,
  useGetCustomerStatusTypesQuery,
  useSearchGuardianQuery,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGetKycQuery,
} from "@/global/service";
import { useGetSalutationTypesQuery } from "@/global/service/end-points/master/master";
import {
  TitleHeader,
  OTPInput,
  Spinner,
  ConfirmationModal,
} from "@/components/ui";
import { DatePicker } from "@/components/ui/date-picker";
import { CircleCheck, Save, RefreshCw, CircleCheckBig } from "lucide-react";
import {
  getAadhaarData,
  setAadhaarData,
  getCustomerCode,
  generateFullName,
  getCustomerBasicInfo,
  setCustomerBasicInfo,
  type CustomerBasicInfo,
} from "@/utils/storage.utils";
import { DEFAULT_FORM_VALUES } from "../../constants";
import {
  calculateAge,
  getGenderFromSalutation,
  getDisabledFieldClassName,
  isMarriedStatus,
  getSalutationFromGender,
} from "@/utils";
import { useDisableState } from "@/hooks/useDisableState";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import CapsuleButton from "@/components/ui/capsule-button/capsule-button";
import { documentCode } from "@/const/common-codes.const";
import { resetCustomerData } from "@/global/reducers/customer/customer-details.reducer";
import { useFormDirtyState } from "@/hooks/useFormDirtyState";
import { PrefillDetectedModal } from "../../../components/PrefillDetectedModal";
import { formatToYYYYMMDD } from "@/utils/format-date-to-DDMMYYYY.util";
import { setPrefillState } from "@/global/reducers/customer/prefill-kyc-data.reducer";

const FORM_CONFIG = {
  MINIMUM_AGE_FOR_MAJORITY: 18,
  OTP_LENGTH: 6,
} as const;

export const BasicInformationForm: React.FC<BasicInfoFormProps> = ({
  readOnly = false,
  onFormSubmit,
  initialData,
  customerIdentity,
  isView = false,
  mobileNumber = null,
  customerFirstName = null,
  customerMiddleName = null,
  customerLastName = null,
  handleSetConfirmationModalData,
  confirmationModalData,
}) => {
  const dispatch = useAppDispatch();
  const isPrefilled = useAppSelector(state => state.prefillKycData.isPrefilled);

  const { handleUpdateState, handleResetState } = useDisableState({
    isView,
  });
  const { handleUpdateFormDirtyState, handleResetFormDirtyState } =
    useFormDirtyState({
      isView,
    });
  const [otpRequestId, setOtpRequestId] = useState<string>("");
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [otpTimerInterval, setOtpTimerInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [isOtpVerifiedInSession, setIsOtpVerifiedInSession] =
    useState<boolean>(false);
  const [otpAttemptCount, setOtpAttemptCount] = useState<number>(0);

  const [guardianSearchTerm, setGuardianSearchTerm] = useState<string>("");
  const [showGuardianResults, setShowGuardianResults] =
    useState<boolean>(false);
  const [selectedGuardian, setSelectedGuardian] = useState<{
    identity: string;
    firstname: string;
    lastname: string;
  } | null>(null);
  const [shouldSearchGuardian, setShouldSearchGuardian] =
    useState<boolean>(false);

  const [originalMobileNumber, setOriginalMobileNumber] = useState<string>("");
  const [verifiedMobileNumber, setVerifiedMobileNumber] = useState<string>("");
  const [resendOtp, setResendOtp] = useState<boolean>(false);

  const [showPrefillModal, setShowPrefillModal] = useState(false);
  const [extractedData, setExtractedData] = useState<null | {
    contactNumbers: string[];
    name?: string;
    dob?: string;
    gender?: string;
  }>(null);

  const otpTimerDisplay = useMemo(() => {
    if (otpTimer <= 0) return 0;
    return otpTimer;
  }, [otpTimer]);
  const otpTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startOtpTimer = useCallback((seconds: number) => {
    setResendOtp(true);

    // Clear existing interval using ref
    if (otpTimerIntervalRef.current) {
      clearInterval(otpTimerIntervalRef.current);
    }

    setOtpTimer(seconds);
    const interval = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          otpTimerIntervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    otpTimerIntervalRef.current = interval;
  }, []);

  const stopOtpTimer = useCallback(() => {
    if (otpTimerInterval) {
      clearInterval(otpTimerInterval);
      setOtpTimerInterval(null);
    }
    setOtpTimer(0);
  }, [otpTimerInterval]);

  const [updateBasicInfo, { isLoading: isUpdating }] =
    useUpdateBasicInfoMutation();
  const { data: existingBasicInfo, refetch: refetchBasicInfo } =
    useGetBasicInfoByIdQuery(
      { customerId: customerIdentity ?? "" },
      { skip: !customerIdentity, refetchOnMountOrArgChange: true }
    );
  const { data: kycData } = useGetKycQuery(customerIdentity || "", {
    skip: !customerIdentity,
  });
  const isAadharUploaded = kycData?.kycDocuments.some(
    item => item.documentCode === documentCode.aadharCard
  );
  const firstName = existingBasicInfo?.basic.firstName;

  useEffect(() => {
    if (firstName?.length === 0) {
      handleUpdateState(
        "Incomplete Step",
        "Please complete the current step before continuing."
      );
    } else {
      handleResetState();
    }
  }, [existingBasicInfo]);

  const formDataFromAPI = useMemo(() => {
    const storedCustomerCode = getCustomerCode();

    if (!existingBasicInfo?.basic) {
      if (storedCustomerCode) {
        return {
          customerCode: storedCustomerCode,
          firstName: customerFirstName ?? "",
          lastName: customerLastName ?? "",
          middleName: customerMiddleName ?? "",
          aadharName: "",
          dob: "",
          gender: "",
          maritalStatus: "",
          taxCategory: "",
          salutation: "",
          isBusiness: false,
          isFirm: false,
          spouseName: "",
          fatherName: "",
          motherName: "",
          customerStatus: "",
          mobileNumber: mobileNumber ?? "",
          mobileOtp: "",
          guardian: "",
          crmReferenceId: "",
          otpVerified: false,
        };
      }
      return null;
    }

    const basic = existingBasicInfo.basic;
    return {
      customerCode: existingBasicInfo.customerCode || storedCustomerCode || "",
      firstName: customerFirstName ? customerFirstName : basic.firstName || "",
      lastName: customerLastName ? customerLastName : basic.lastName || "",
      middleName: customerMiddleName
        ? customerMiddleName
        : basic.middleName || "",
      aadharName: basic.aadharName || "",
      dob: basic.dob || "",
      gender: basic.gender || "",
      maritalStatus: basic.maritalStatus || "",
      taxCategory: basic.taxCategory || "",
      salutation: basic.salutation || "",
      isBusiness: basic.isBusiness || false,
      isFirm: basic.isFirm || false,
      spouseName: basic.spouseName || "",
      fatherName: basic.fatherName || "",
      motherName: basic.motherName || "",
      customerStatus: basic.customerStatus || "",
      mobileNumber: mobileNumber ? mobileNumber : basic.mobileNumber || "",
      mobileOtp: "", // Don't populate OTP field
      guardian: basic.guardian || "",
      crmReferenceId: basic.crmReferenceId || "",
      otpVerified: basic.otpVerified || false,
    };
  }, [existingBasicInfo]);

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  const { data: salutationOptions = [] } = useGetSalutationTypesQuery();

  const { data: genderOptions = [] } = useGetGenderTypesQuery();

  const { data: maritalStatusOptions = [] } = useGetMaritalStatusTypesQuery();

  const { data: taxCategoryOptions = [] } = useGetTaxCategoryTypesQuery();

  const { data: customerStatusOptions = [] } = useGetCustomerStatusTypesQuery();

  const {
    data: guardianResults,
    isLoading: isSearchingGuardian,
    error: guardianSearchError,
  } = useSearchGuardianQuery(
    { customerId: guardianSearchTerm },
    {
      skip:
        !shouldSearchGuardian ||
        !guardianSearchTerm ||
        guardianSearchTerm.length < 3,
    }
  );

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    trigger,
    setError,
    watch,
    formState: { errors, isDirty, dirtyFields, touchedFields },
  } = useForm<BasicInfoFormData>({
    resolver: yupResolver(basicInfoValidationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      ...(formDataFromAPI
        ? transformFormData({ ...DEFAULT_FORM_VALUES, ...formDataFromAPI })
        : initialData
          ? transformFormData({ ...DEFAULT_FORM_VALUES, ...initialData })
          : DEFAULT_FORM_VALUES),
    },
  });

  const handleMobileNumberChange = useCallback(
    (value: string) => {
      const digitsOnly = value.replace(/\D/g, "");
      setOtpInputEnable(false);
      const limitedDigits = digitsOnly.slice(0, 10);
      const apiVerifiedMobile = existingBasicInfo?.basic?.mobileNumber;
      const isApiOtpVerified = existingBasicInfo?.basic?.otpVerified;
      if (
        (verifiedMobileNumber && limitedDigits !== verifiedMobileNumber) ||
        (isApiOtpVerified &&
          apiVerifiedMobile &&
          limitedDigits !== apiVerifiedMobile)
      ) {
        setIsOtpVerifiedInSession(false);
        setValue("otpVerified", false);
        setOtpRequestId("");
        // setOtpRequestId("");

        setOtpTimer(0);
        if (otpTimerInterval) {
          clearInterval(otpTimerInterval);
          setOtpTimerInterval(null);
        }
        setOtpAttemptCount(0);
        setVerifiedMobileNumber("");
      }

      setOriginalMobileNumber(limitedDigits);
      setValue("mobileNumber", limitedDigits, { shouldValidate: true });
    },
    [setValue, verifiedMobileNumber, otpTimerInterval]
  );

  const handleMobileKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const char = e.key;

      if (
        !/[0-9]/.test(char) &&
        ![
          "Backspace",
          "Delete",
          "Tab",
          "Enter",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
        ].includes(char)
      ) {
        e.preventDefault();
      }
    },
    []
  );

  const handleMobilePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData("text");

      const digitsOnly = pastedText.replace(/\D/g, "");
      if (digitsOnly) {
        handleMobileNumberChange(digitsOnly);
      }
    },
    [handleMobileNumberChange]
  );

  const mobileOtpSent = useMemo(() => {
    return Boolean(otpRequestId);
  }, [otpRequestId]);

  const isOtpPermanentlyVerified = useMemo(() => {
    return Boolean(existingBasicInfo?.basic?.otpVerified);
  }, [existingBasicInfo?.basic?.otpVerified]);

  const watchedValues = useWatch({
    name: [
      "mobileOtp",
      "mobileNumber",
      "dob",
      "maritalStatus",
      "age",
      "customerStatus",
      "isBusiness",
      "isFirm",
      "isMinor",
    ],
    control,
  });

  const [
    mobileOtpValue,
    currentMobileNumber,
    dobValue,
    maritalStatus,
    currentAge,
    customerStatus,
  ] = watchedValues;

  const mobileVerified = useMemo(() => {
    const apiVerifiedMobile = existingBasicInfo?.basic?.mobileNumber;
    const isApiOtpVerified = existingBasicInfo?.basic?.otpVerified;

    if (
      isApiOtpVerified &&
      apiVerifiedMobile &&
      currentMobileNumber === apiVerifiedMobile
    ) {
      return true;
    }

    if (
      isOtpVerifiedInSession &&
      verifiedMobileNumber &&
      currentMobileNumber === verifiedMobileNumber
    ) {
      return true;
    }

    return Boolean(
      mobileOtpValue &&
        mobileOtpValue.length === FORM_CONFIG.OTP_LENGTH &&
        isOtpVerifiedInSession
    );
  }, [
    mobileOtpValue,
    isOtpVerifiedInSession,
    existingBasicInfo?.basic?.otpVerified,
    existingBasicInfo?.basic?.mobileNumber,
    currentMobileNumber,
  ]);

  useEffect(() => {
    if (formDataFromAPI) {
      const transformedData = transformFormData({
        ...DEFAULT_FORM_VALUES,
        ...formDataFromAPI,
      });
      reset(transformedData);

      if (formDataFromAPI.mobileNumber) {
        setOriginalMobileNumber(formDataFromAPI.mobileNumber);
        setVerifiedMobileNumber(formDataFromAPI.mobileNumber);
      }

      if (existingBasicInfo?.basic) {
        const fullName = generateFullName(
          formDataFromAPI.firstName,
          formDataFromAPI.middleName,
          formDataFromAPI.lastName
        );
        const customerBasicInfo: CustomerBasicInfo = {
          identity: customerIdentity ?? "",
          customerCode: formDataFromAPI.customerCode,
          status: existingBasicInfo.status || "",
          firstName: formDataFromAPI.firstName,
          middleName: formDataFromAPI.middleName,
          lastName: formDataFromAPI.lastName,
          fullName: fullName,
          aadharName: formDataFromAPI.aadharName,
          dob: formDataFromAPI.dob,
          gender: formDataFromAPI.gender,
          maritalStatus: formDataFromAPI.maritalStatus,
          taxCategory: formDataFromAPI.taxCategory,
          salutation: formDataFromAPI.salutation,
          branchId: existingBasicInfo.basic.branchId || "",
          crmReferenceId: formDataFromAPI.crmReferenceId,
          occupation: "",
          employer: "",
          annualIncome: 0,
          customerListTypeId: null,
          isBusiness: formDataFromAPI.isBusiness,
          isFirm: formDataFromAPI.isFirm,
          guardianCustomerId: formDataFromAPI.guardian || null,
          spouseName: formDataFromAPI.spouseName,
          fatherName: formDataFromAPI.fatherName,
          motherName: formDataFromAPI.motherName,
          isMinor: false,
          customerStatus: formDataFromAPI.customerStatus,
          visualScore: null,
          mobileNumber: formDataFromAPI.mobileNumber,
          aadharVaultId: "",
          otpVerified: formDataFromAPI.otpVerified || false,
        };
        if (!isView) {
          setCustomerBasicInfo(customerBasicInfo);
        }
      }
    }
  }, [formDataFromAPI, reset, existingBasicInfo, customerIdentity ?? ""]);

  const calculatedAge = useMemo(() => {
    if (!dobValue) return 0;
    return calculateAge(dobValue) ?? 0;
  }, [dobValue]);

  const isMinorCalculated = useMemo(() => {
    return calculatedAge < FORM_CONFIG.MINIMUM_AGE_FOR_MAJORITY;
  }, [calculatedAge]);

  const selectOptions = useMemo(() => {
    const filteredMaritalStatusOptions = isMinorCalculated
      ? maritalStatusOptions.filter(option =>
          option.label.toLowerCase().includes("single")
        )
      : maritalStatusOptions;

    const filteredCustomerStatusOptions = customerStatusOptions.filter(
      option => option.label === "ACTIVE"
    );

    const options = {
      salutation: salutationOptions,
      gender: genderOptions,
      maritalStatus: filteredMaritalStatusOptions,
      taxCategory: taxCategoryOptions,
      customerStatus: filteredCustomerStatusOptions,
    };

    return options;
  }, [
    salutationOptions,
    genderOptions,
    maritalStatusOptions,
    taxCategoryOptions,
    customerStatusOptions,
    isMinorCalculated,
  ]);

  useEffect(() => {
    setValue("age", calculatedAge);
    setValue("isMinor", isMinorCalculated);
    if (!isMinorCalculated) {
      setValue("guardian", "");
    }

    trigger(["age", "isMinor"]);
  }, [calculatedAge, isMinorCalculated, setValue, trigger]);

  useEffect(() => {
    if (customerStatusOptions.length > 0) {
      const activeStatus = customerStatusOptions.find(
        option => option.label === "ACTIVE"
      );
      if (activeStatus && !customerStatus) {
        setValue("customerStatus", activeStatus.value);
      }
    }
  }, [customerStatusOptions, setValue, customerStatus]);

  useEffect(() => {
    const apiVerifiedMobile = existingBasicInfo?.basic?.mobileNumber;
    const isApiOtpVerified = existingBasicInfo?.basic?.otpVerified;

    if (
      apiVerifiedMobile &&
      isApiOtpVerified &&
      currentMobileNumber &&
      currentMobileNumber !== apiVerifiedMobile
    ) {
      setIsOtpVerifiedInSession(false);
      setValue("otpVerified", false);
      setOtpRequestId("");
      // setOtpRequestId("");

      setOtpTimer(0);
      if (otpTimerInterval) {
        clearInterval(otpTimerInterval);
        setOtpTimerInterval(null);
      }
      setOtpAttemptCount(0);
      setVerifiedMobileNumber("");
    }
  }, [
    currentMobileNumber,
    existingBasicInfo?.basic?.mobileNumber,
    existingBasicInfo?.basic?.otpVerified,
    setValue,
    otpTimerInterval,
  ]);

  useEffect(() => {
    return () => {
      if (otpTimerInterval) {
        clearInterval(otpTimerInterval);
      }
    };
  }, [otpTimerInterval]);

  const handleSubmitError = useCallback((error: unknown): void => {
    const apiError = error as APIError;
    let errorMessage = "Failed to save customer information. Please try again.";

    if ((apiError?.data as Record<string, unknown>)?.details) {
      const validationErrors = Object.entries(
        (apiError.data as Record<string, unknown>).details as Record<
          string,
          unknown
        >
      )
        .map(([field, message]) => `${field}: ${message}`)
        .join(", ");
      errorMessage = `Validation failed: ${validationErrors}`;
    } else if (apiError?.data?.errors) {
      const validationErrors = Object.entries(apiError.data.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join(", ");
      errorMessage = `Validation errors: ${validationErrors}`;
    } else if (apiError?.data?.message) {
      errorMessage = ` ${apiError.data.message}`;
    } else if (apiError?.message) {
      errorMessage = `Error: ${apiError.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    logger.error(errorMessage, { toast: true, pushLog: false });
    throw new Error(errorMessage);
  }, []);
  const [showUnverifiedModal, setShowUnverifiedPopup] = useState(false);
  const isOtpVerified = watch("otpVerified");
  const handleCloseUnverifiedModal = () => {
    setShowUnverifiedPopup(false);
  };
  const handleOpenUnverifiedModal = () => {
    setShowUnverifiedPopup(true);
  };
  const onSubmit = useCallback(
    async (data: BasicInfoFormData) => {
      try {
        if (!mobileVerified && otpAttemptCount > 3) {
          handleOpenUnverifiedModal();
          return;
        }
        const updatedData = {
          ...data,
          aadharName: isAadharUploaded ? data.aadharName : "",
        };

        if (customerIdentity ?? "") {
          await updateBasicInfo({
            id: customerIdentity ?? "",
            data: updatedData,
          }).unwrap();
        } else {
          throw new Error(
            "Customer ID is required for updating basic information"
          );
        }

        if (onFormSubmit) {
          await onFormSubmit(updatedData);
        }

        if (data.aadharName && isAadharUploaded) {
          const existingAadhaarData = getAadhaarData();
          if (existingAadhaarData) {
            const updatedAadhaarData = {
              ...existingAadhaarData,
              aadhaarName: data.aadharName,
            };
            setAadhaarData(updatedAadhaarData);
          }
        }

        const fullName = generateFullName(
          data.firstName,
          data.middleName,
          data.lastName
        );
        const customerBasicInfo: CustomerBasicInfo = {
          identity: customerIdentity ?? "",
          customerCode: data.customerCode,
          status: existingBasicInfo?.status || "",
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          fullName: fullName,
          aadharName: data.aadharName,
          dob: data.dob,
          gender: data.gender,
          maritalStatus: data.maritalStatus,
          taxCategory: data.taxCategory,
          salutation: data.salutation,
          branchId: existingBasicInfo?.basic?.branchId || "",
          crmReferenceId: data.crmReferenceId,
          occupation: "",
          employer: "",
          annualIncome: 0,
          customerListTypeId: null,
          isBusiness: data.isBusiness,
          isFirm: data.isFirm,
          guardianCustomerId: data.guardian || null,
          spouseName: data.spouseName,
          fatherName: data.fatherName,
          motherName: data.motherName,
          isMinor: data.isMinor || false,
          customerStatus: data.customerStatus,
          visualScore: null,
          mobileNumber: data.mobileNumber,
          aadharVaultId: "",
          otpVerified: data.otpVerified || false,
        };
        if (!isView) {
          setCustomerBasicInfo(customerBasicInfo);
        }

        logger.info("Basic information updated successfully", { toast: true });

        await refetchBasicInfo();
        dispatch(resetCustomerData());
        dispatch(setIsReady(true));
      } catch (error) {
        handleSubmitError(error);
      }
    },
    [
      onFormSubmit,
      customerIdentity ?? "",
      updateBasicInfo,
      dispatch,
      handleSubmitError,
      existingBasicInfo?.basic?.mobileNumber,
      existingBasicInfo?.basic?.branchId,
      existingBasicInfo?.status,
      isOtpPermanentlyVerified,
      refetchBasicInfo,
      isOtpVerified,
    ]
  );
  const [otpInputEnable, setOtpInputEnable] = useState(false);

  const handleSendOTP = useCallback(async (): Promise<void> => {
    try {
      if (isOtpPermanentlyVerified && isOTPSendDisabled) {
        return;
      }

      const mobileNumber = originalMobileNumber || getValues("mobileNumber");
      if (!mobileNumber || mobileNumber.length !== 10) {
        logger.error("Please enter a valid 10-digit mobile number", {
          toast: true,
          pushLog: false,
        });
        return;
      }

      const otpPayload = {
        tenantId: 1, // Use tenantId as number 1 as per API requirement
        branchCode: "ID-001",
        templateCatalogIdentity: "74829315-9ff1-4055-94c8-beeddf4de7af",
        templateContentIdentity: "fae09f0a-8470-4000-9969-586667b2366e",
        target: `+91${mobileNumber}`,
        customerIdentity: 12345,
        length: FORM_CONFIG.OTP_LENGTH,
        ttlSeconds: 60,
      };

      const response = await sendOtp(
        otpPayload as unknown as Parameters<typeof sendOtp>[0]
      ).unwrap();

      setOtpRequestId(response.requestId);
      setOtpInputEnable(true);
      setOtpAttemptCount(prev => prev + 1);

      const expiresTime = new Date(response.expiresAt).getTime();
      const currentTime = new Date().getTime();
      const timeLeft = Math.max(
        0,
        Math.floor((expiresTime - currentTime) / 1000)
      );
      startOtpTimer(timeLeft);
    } catch (error) {
      const apiError = error as {
        data?: { message?: string; serviceCode?: string };
        message?: string;
      };
      let errorMessage = "Failed to send OTP. Please try again.";

      if (apiError?.data?.message) {
        errorMessage = apiError.data.message;
      } else if (apiError?.data?.serviceCode) {
        errorMessage = `${apiError.data.serviceCode}: ${apiError.data.message || "Service is currently down. Please try again later."}`;
      } else if (apiError?.message) {
        errorMessage = apiError.message;
      }

      logger.error(errorMessage, { toast: true, pushLog: false });
    }
  }, [
    getValues,
    sendOtp,
    isOtpPermanentlyVerified,
    startOtpTimer,
    originalMobileNumber,
  ]);

  const handleVerifyOTP = useCallback(async (): Promise<void> => {
    try {
      const otpCode = getValues("mobileOtp");
      if (!otpCode || otpCode.length !== FORM_CONFIG.OTP_LENGTH) {
        logger.error("Please enter a valid OTP", {
          toast: true,
          pushLog: false,
        });
        return;
      }

      if (!otpRequestId) {
        logger.error("No OTP request found. Please send OTP first.", {
          toast: true,
          pushLog: false,
        });
        return;
      }

      const response = await verifyOtp({
        requestId: otpRequestId,
        otp: otpCode,
      }).unwrap();

      if (response.result === "VERIFIED") {
        setIsOtpVerifiedInSession(true);
        setValue("otpVerified", true);
        setVerifiedMobileNumber(
          originalMobileNumber || getValues("mobileNumber")
        );
        setOtpInputEnable(false);
      } else {
        logger.error(`OTP verification failed. Result: ${response.result}`, {
          toast: true,
          pushLog: false,
        });
      }
    } catch (error) {
      const apiError = error as {
        data?: { message?: string; serviceCode?: string };
        message?: string;
      };
      let errorMessage = "Failed to verify OTP. Please try again.";

      if (apiError?.data?.message) {
        errorMessage = apiError.data.message;
      } else if (apiError?.data?.serviceCode) {
        errorMessage = `${apiError.data.serviceCode}: ${apiError.data.message || "Service is currently down. Please try again later."}`;
      } else if (apiError?.message) {
        errorMessage = apiError.message;
      }

      logger.error(errorMessage, { toast: true, pushLog: false });
    }
  }, [getValues, otpRequestId, verifyOtp, setValue, originalMobileNumber]);

  const handleReset = useCallback((): void => {
    reset(DEFAULT_FORM_VALUES);
    setOtpRequestId("");
    setOtpTimer(0);
    setOtpTimerInterval(null);
    setIsOtpVerifiedInSession(false);
    setOtpAttemptCount(0);
    setSelectedGuardian(null);
    setGuardianSearchTerm("");
    setShowGuardianResults(false);
    setShouldSearchGuardian(false);
    setOriginalMobileNumber("");
    setVerifiedMobileNumber("");
    stopOtpTimer();
  }, [reset, stopOtpTimer]);
  useEffect(() => {
    if (
      !confirmationModalData?.doAction ||
      confirmationModalData?.feature !== "RESET"
    ) {
      return;
    }

    handleReset();
  }, [confirmationModalData]);
  const validateFieldOptimized = useCallback(
    async (fieldName: keyof BasicInfoFormData) => {
      const result = await trigger(fieldName);
      if (!result) {
        const fieldError = await validateField(
          fieldName,
          getValues(fieldName),
          getValues()
        );
        if (fieldError) {
          setError(fieldName, { type: "manual", message: fieldError });
        }
      }
      return result;
    },
    [trigger, getValues, setError]
  );

  const handleGuardianSelect = useCallback(
    (guardian: DropdownOption): void => {
      if (!guardian || !guardian.identity) {
        logger.error("Invalid guardian data", { toast: true, pushLog: false });
        return;
      }

      const guardianData = guardian as DropdownOption & {
        identity: string;
        firstname: string;
        lastname: string;
      };

      setSelectedGuardian(guardianData);
      setValue("guardian", guardianData.identity);
      setGuardianSearchTerm("");
      setShowGuardianResults(false);

      validateFieldOptimized("guardian");
    },
    [setValue, validateFieldOptimized]
  );

  const handleGuardianSearch = useCallback((searchTerm: string): void => {
    setGuardianSearchTerm(searchTerm);
    setShowGuardianResults(false);
    setShouldSearchGuardian(false);
    if (searchTerm.length < 3) {
      setSelectedGuardian(null);
    }
  }, []);

  const handleGuardianSearchClick = useCallback((): void => {
    if (guardianSearchTerm.length >= 3) {
      setShouldSearchGuardian(true);
      setShowGuardianResults(true);
    }
  }, [guardianSearchTerm]);

  const handleClearGuardian = useCallback((): void => {
    setSelectedGuardian(null);
    setGuardianSearchTerm("");
    setShowGuardianResults(false);
    setShouldSearchGuardian(false);
    setValue("guardian", "");
  }, [setValue]);
  useEffect(() => {
    if (mobileVerified) {
      setValue("otpVerified", true);
      handleCloseUnverifiedModal();
    } else {
      setValue("otpVerified", false);
    }
  }, [mobileVerified]);

  const isOTPSendDisabled = useMemo(() => {
    const isValidMobile =
      originalMobileNumber && originalMobileNumber.length === 10;

    const isTimerRunning = mobileOtpSent && otpTimerDisplay > 0;

    const apiVerifiedMobile = existingBasicInfo?.basic?.mobileNumber;
    const isApiOtpVerified = existingBasicInfo?.basic?.otpVerified;
    const isPermanentlyVerifiedForCurrentMobile =
      isApiOtpVerified &&
      apiVerifiedMobile &&
      originalMobileNumber === apiVerifiedMobile;
    const isMobileNumberChanged =
      apiVerifiedMobile &&
      originalMobileNumber &&
      originalMobileNumber !== apiVerifiedMobile;

    return (
      !isValidMobile ||
      isTimerRunning ||
      (isPermanentlyVerifiedForCurrentMobile && !isMobileNumberChanged)
    );
  }, [
    originalMobileNumber,
    mobileOtpSent,
    otpTimerDisplay,
    existingBasicInfo?.basic?.mobileNumber,
    existingBasicInfo?.basic?.otpVerified,
  ]);

  const isMarried = useMemo(() => {
    return isMarriedStatus(maritalStatus, maritalStatusOptions);
  }, [maritalStatus, maritalStatusOptions]);

  const shouldShowSpouseName = useMemo(() => {
    return isMarried;
  }, [isMarried]);

  const handleBusinessToggle = useCallback(
    (checked: boolean) => {
      setValue("isBusiness", checked);
      if (checked) {
        setValue("isFirm", false);
      }

      // Get existing customer basic info from session storage
      const existingCustomerInfo = getCustomerBasicInfo();
      if (existingCustomerInfo) {
        const updatedCustomerInfo = {
          ...existingCustomerInfo,
          isBusiness: checked,
        };
        if (!isView) {
          setCustomerBasicInfo(updatedCustomerInfo);
        }
        logger.info(
          `isBusiness state updated to ${checked} in session storage`,
          { toast: false }
        );
      }
    },
    [setValue, getValues]
  );

  const getOtpButtonLabel = () => {
    if (isSendingOtp) return "Sending...";

    if (mobileOtpSent) {
      if (otpTimerDisplay > 0 && otpAttemptCount <= 2) {
        return `Resend in ${Math.floor(otpTimerDisplay / 60)}:${String(
          otpTimerDisplay % 60
        ).padStart(2, "0")}`;
      }

      if (otpAttemptCount > 2) return "Admin OTP";

      return "Resend OTP";
    }

    return resendOtp ? "Resend OTP" : "Send OTP";
  };
  const userTouched = Object.keys(touchedFields || {}).length > 0;
  useEffect(() => {
    const hasDirtyValues = Object.keys(dirtyFields || {}).length > 0;
    if (isDirty && hasDirtyValues && userTouched) {
      handleUpdateFormDirtyState();
    } else {
      handleResetFormDirtyState();
    }
  }, [isDirty, dirtyFields, userTouched]);

  useEffect(() => {
    if (existingBasicInfo?.basic && isPrefilled) return;

    const raw = sessionStorage.getItem("extracted_customer_data");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);

      if (!parsed?.name && !parsed?.dob && !parsed?.gender) return;
      setExtractedData(parsed);
      setShowPrefillModal(true);
    } catch {
      // ignore
    }
  }, [existingBasicInfo]);
  const applyExtractedData = useCallback(() => {
    if (!extractedData) return;
    dispatch(setPrefillState({ isPrefilled: true }));
    // NAME
    if (extractedData.name && !getValues("firstName")) {
      const parts = extractedData.name.trim().split(" ");
      setValue("firstName", parts[0] || "");
      setValue(
        "middleName",
        parts.length > 2 ? parts.slice(1, -1).join(" ") : ""
      );
      setValue("lastName", parts.length > 1 ? parts[parts.length - 1] : "");
    }

    // DOB
    if (extractedData.dob && !getValues("dob")) {
      setValue("dob", formatToYYYYMMDD(extractedData.dob));
    }

    // GENDER
    if (extractedData.gender && !getValues("gender")) {
      const genderOption = genderOptions.find(
        g => g.label.toUpperCase() === extractedData.gender?.toUpperCase()
      );
      if (genderOption) {
        setValue("gender", genderOption.value);
      }
    }
    // mobile
    const currentMobile = originalMobileNumber || getValues("mobileNumber");

    if (
      extractedData.contactNumbers?.[0] &&
      (!currentMobile || currentMobile.trim() === "")
    ) {
      setOriginalMobileNumber(extractedData.contactNumbers[0]);
      setValue("mobileNumber", extractedData.contactNumbers[0], {
        shouldDirty: true,
      });
    }
  }, [extractedData, genderOptions, getValues, setValue]);

  const handleAcceptPrefill = () => {
    applyExtractedData();
    setShowPrefillModal(false);
  };

  const handleRejectPrefill = () => {
    sessionStorage.removeItem("extracted_customer_data");
    setShowPrefillModal(false);
  };
  return (
    <article>
      {!readOnly && !isView && isPrefilled === false && (
        <PrefillDetectedModal
          open={showPrefillModal}
          onAccept={handleAcceptPrefill}
          onReject={handleRejectPrefill}
        />
      )}
      <ConfirmationModal
        isOpen={showUnverifiedModal}
        onConfirm={handleCloseUnverifiedModal}
        title="Mobile Number Unverified"
        message="Please verify your mobile number before submitting the form."
        confirmText="OK"
        type="warning"
        size="compact"
      />
      <Grid className="px-2">
        <Flex justify="between" align="center" className="mb-2 w-full">
          <HeaderWrapper>
            <TitleHeader title="Customer Basic Information" />
          </HeaderWrapper>
        </Flex>

        <Form
          onSubmit={async e => {
            setValue("age", calculatedAge);
            setValue("isMinor", isMinorCalculated);
            await trigger(["age", "isMinor"]);
            handleSubmit(onSubmit)(e);
          }}
        >
          <Form.Row>
            <Form.Col lg={1} md={6} span={12}>
              <Form.Field
                label="Salutation"
                error={errors.salutation}
                required
                disabled={readOnly}
              >
                <Controller
                  name="salutation"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={value => {
                        field.onChange(value);
                        const genderIdentity = getGenderFromSalutation(
                          value,
                          genderOptions,
                          salutationOptions
                        );
                        if (genderIdentity) {
                          setValue("gender", genderIdentity);
                        }
                      }}
                      disabled={readOnly}
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={selectOptions.salutation}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="First Name"
                error={errors.firstName}
                required
                disabled={readOnly}
              >
                <Input
                  {...register("firstName")}
                  placeholder="Enter First Name"
                  size="form"
                  variant="form"
                  disabled={readOnly || isUpdating}
                  className={`uppercase ${getDisabledFieldClassName(readOnly)}`}
                  inputType="letters"
                  restriction="alphabetic"
                  maxLength={100}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Middle Name"
                error={errors.middleName}
                disabled={readOnly}
              >
                <Input
                  {...register("middleName")}
                  placeholder="Enter Middle Name"
                  size="form"
                  variant="form"
                  disabled={readOnly || isUpdating}
                  className={`uppercase ${getDisabledFieldClassName(readOnly)}`}
                  inputType="letters"
                  restriction="alphabetic"
                  maxLength={100}
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Last Name"
                error={errors.lastName}
                disabled={readOnly}
                required
              >
                <Input
                  {...register("lastName")}
                  placeholder="Enter Last Name"
                  size="form"
                  variant="form"
                  disabled={readOnly || isUpdating}
                  className={`uppercase ${getDisabledFieldClassName(readOnly)}`}
                  inputType="letters"
                  restriction="alphabetic"
                  maxLength={100}
                />
              </Form.Field>
            </Form.Col>
            {isAadharUploaded && (
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Aadhaar Name" error={errors.aadharName}>
                  <Input
                    {...register("aadharName")}
                    placeholder="Enter Aadhaar Name"
                    size="form"
                    variant="form"
                    disabled={readOnly || isUpdating}
                    className={`uppercase ${getDisabledFieldClassName(readOnly)}`}
                    inputType="letters"
                    restriction="alphabetic"
                  />
                </Form.Field>
              </Form.Col>
            )}
          </Form.Row>

          <Form.Row>
            <Form.Col lg={1} md={6} span={12}>
              <Form.Field label="Gender" error={errors.gender} required>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      // onValueChange={field.onChange}
                      onValueChange={value => {
                        field.onChange(value);
                        const salutationIdentity = getSalutationFromGender(
                          value,
                          salutationOptions,
                          genderOptions
                        );
                        if (salutationIdentity) {
                          setValue("salutation", salutationIdentity);
                        }
                      }}
                      disabled={readOnly}
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={selectOptions.gender}
                      capitalize={true}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="DOB"
                error={errors.dob}
                required
                disabled={readOnly}
              >
                <div className="flex items-center">
                  <Controller
                    name="dob"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value || undefined}
                        onChange={(value: string) => {
                          field.onChange(value);
                          trigger?.("dob");
                        }}
                        onBlur={() => field.onBlur()}
                        disabled={readOnly}
                        placeholder="dd/mm/yyyy"
                        allowManualEntry={true}
                        size="form"
                        variant="form"
                      />
                    )}
                  />
                </div>
                <div className="text-muted-foreground mt-0.5 text-[11px]">
                  <Flex align="center" justify="between">
                    <div>
                      <span>
                        Age: {currentAge !== null ? currentAge : "--"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Controller
                        name="isMinor"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            size="xs"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={true}
                          />
                        )}
                      />
                      <span>Minor</span>
                    </div>
                  </Flex>
                </div>
              </Form.Field>
            </Form.Col>

            {isMinorCalculated && (
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Guardian Customer ID"
                  className=" mb-1"
                  required
                  error={errors.guardian}
                >
                  <InputWithSearch
                    {...register("guardian")}
                    placeholder="Search Guardian..."
                    size="form"
                    variant="form"
                    disabled={readOnly || isUpdating}
                    value={
                      selectedGuardian
                        ? `${selectedGuardian.firstname || ""} ${selectedGuardian.lastname || ""}`.trim()
                        : guardianSearchTerm || ""
                    }
                    inputType="alphanumeric"
                    onChange={e => {
                      const value = e.target.value;
                      const expectedValue = selectedGuardian
                        ? `${selectedGuardian.firstname || ""} ${selectedGuardian.lastname || ""}`.trim()
                        : "";

                      if (selectedGuardian && value !== expectedValue) {
                        setSelectedGuardian(null);
                        setValue("guardian", "");
                      }
                      handleGuardianSearch(value);
                      setValue("guardian", value);
                    }}
                    onDoubleClick={() => {
                      if (selectedGuardian && !readOnly) {
                        handleClearGuardian();
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === "Escape" && selectedGuardian && !readOnly) {
                        handleClearGuardian();
                      }
                    }}
                    onSearch={handleGuardianSearchClick}
                    isSearching={isSearchingGuardian || false}
                    showDropdown={
                      showGuardianResults && guardianSearchTerm.length >= 3
                    }
                    dropdownOptions={(() => {
                      if (!guardianResults) return [];
                      const results = Array.isArray(guardianResults)
                        ? guardianResults
                        : [guardianResults];
                      return results.map(guardian => ({
                        value: guardian.identity,
                        label: `${guardian.firstname} ${guardian.lastname}`,
                        ...guardian,
                      }));
                    })()}
                    onOptionSelect={handleGuardianSelect}
                    dropdownLoading={isSearchingGuardian}
                    dropdownError={
                      guardianSearchError
                        ? "Error searching for guardians. Please try again."
                        : undefined
                    }
                    noResultsText="No guardians found for this Customer ID."
                  />
                </Form.Field>
              </Form.Col>
            )}

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Marital Status"
                error={errors.maritalStatus}
                required
              >
                <Controller
                  name="maritalStatus"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={readOnly}
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={selectOptions.maritalStatus}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            {shouldShowSpouseName && (
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Spouse's Name"
                  error={errors.spouseName}
                  required
                  className={!isMarried ? "text-muted-foreground" : ""}
                >
                  <Input
                    {...register("spouseName")}
                    placeholder="Enter Spouse's Name"
                    size="form"
                    variant="form"
                    disabled={readOnly || !isMarried || isUpdating}
                    className={`uppercase ${getDisabledFieldClassName(readOnly || !isMarried)} ${
                      !isMarried || readOnly
                        ? "text-muted-foreground bg-muted/50"
                        : ""
                    }`}
                    inputType="letters"
                    restriction="alphabetic"
                    maxLength={100}
                  />
                  <div className="text-muted-foreground text-xss mt-1">
                    {/* {isMarried
                      ? "if marital status married"
                      : "Only applicable for married customers"} */}
                  </div>
                </Form.Field>
              </Form.Col>
            )}

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Father's Name"
                error={errors.fatherName}
                required
              >
                <Input
                  {...register("fatherName")}
                  placeholder="Enter Father's Name"
                  size="form"
                  variant="form"
                  disabled={readOnly || isUpdating}
                  className={`uppercase ${getDisabledFieldClassName(readOnly)}`}
                  inputType="letters"
                  restriction="alphabetic"
                  maxLength={100}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Mother's Name"
                error={errors.motherName}
                required
              >
                <Input
                  {...register("motherName")}
                  placeholder="Enter Mother's Name"
                  size="form"
                  variant="form"
                  disabled={readOnly || isUpdating}
                  className={`uppercase ${getDisabledFieldClassName(readOnly)}`}
                  inputType="letters"
                  restriction="alphabetic"
                  maxLength={100}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Tax Category"
                error={errors.taxCategory}
                required
              >
                <Controller
                  name="taxCategory"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={readOnly}
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={selectOptions.taxCategory}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            {/* <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="CRM Reference ID"
                error={errors.crmReferenceId}
              >
                <Input
                  {...register("crmReferenceId")}
                  placeholder="Enter CRM Reference ID"
                  size="form"
                  variant="form"
                  disabled={readOnly || isUpdating}
                  className={`uppercase ${getDisabledFieldClassName(readOnly)}`}
                  inputType="alphanumeric"
                />
              </Form.Field>
            </Form.Col> */}
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Mobile Number"
                error={errors.mobileNumber}
                required
              >
                <Controller
                  name="mobileNumber"
                  control={control}
                  render={({ field }) => (
                    <MaskedInput
                      value={originalMobileNumber}
                      onChange={value => {
                        field.onChange(value);
                        handleMobileNumberChange(value);
                      }}
                      onKeyPress={handleMobileKeyPress}
                      onPaste={handleMobilePaste}
                      placeholder="Enter Mobile Number"
                      size="form"
                      variant="form"
                      disabled={readOnly}
                      maxLength={10}
                      className={getDisabledFieldClassName(readOnly)}
                      restriction="numeric"
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            {!mobileVerified && (
              <Form.Col lg={6} md={6} span={12} className="mb-2">
                <Form.Field label="OTP" error={errors.mobileOtp}>
                  <Flex align="center" gap={2}>
                    {!readOnly && (
                      <NeumorphicButton
                        type="button"
                        variant="default"
                        size="default"
                        className="min-w-[80px]"
                        disabled={
                          isOTPSendDisabled ||
                          isSendingOtp ||
                          otpAttemptCount > 2
                        }
                        onClick={handleSendOTP}
                      >
                        {getOtpButtonLabel()}
                      </NeumorphicButton>
                    )}
                    {((mobileOtpSent && !readOnly && !mobileVerified) ||
                      (mobileOtpSent && otpInputEnable)) && (
                      <Controller
                        name="mobileOtp"
                        control={control}
                        render={({ field }) => (
                          <OTPInput
                            length={FORM_CONFIG.OTP_LENGTH}
                            onChange={field.onChange}
                            size="xs"
                            variant="form"
                            disabled={readOnly}
                          />
                        )}
                      />
                    )}
                    {mobileOtpValue?.length === FORM_CONFIG.OTP_LENGTH && (
                      <CapsuleButton
                        onClick={handleVerifyOTP}
                        label="Verify OTP"
                        icon={CircleCheckBig}
                        disabled={isVerifyingOtp}
                        className="min-w-[100px]"
                      />
                    )}
                  </Flex>
                </Form.Field>
              </Form.Col>
            )}
            {mobileVerified && (
              <Form.Col lg={3} md={6} span={12}>
                <Flex className="text-primary mt-5 items-center gap-2 text-[10px] font-semibold">
                  <CircleCheck className="text-status-success h-3 w-3" />
                  Mobile Number Verified
                </Flex>
              </Form.Col>
            )}
          </Form.Row>

          <Flex.SectionGroup className="mt-1">
            <Flex.ControlGroup>
              <Flex align="center" gap={2}>
                <Controller
                  name="isBusiness"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isBusiness"
                      checked={field.value}
                      onCheckedChange={val => {
                        field.onChange(val);
                        handleBusinessToggle(val);
                      }}
                      disabled={readOnly}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
                <Label htmlFor="isBusiness">is Business</Label>
              </Flex>
            </Flex.ControlGroup>

            <Flex.ActionGroup className="gap-6">
              <NeumorphicButton
                type="button"
                variant="secondary"
                size="secondary"
                className="bg-reset-button hover:bg-reset-button/80 text-white"
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
                disabled={readOnly}
              >
                <RefreshCw width={12} />
                Reset
              </NeumorphicButton>
              {!readOnly && (
                <NeumorphicButton
                  type="submit"
                  variant="default"
                  size="default"
                  disabled={isUpdating || readOnly}
                >
                  {isUpdating ? (
                    <Flex align="center" gap={2}>
                      <Spinner
                        variant="default"
                        size={16}
                        className="text-primary-foreground"
                      />
                      <span>Updating...</span>
                    </Flex>
                  ) : (
                    <>
                      <Save className="h-3 w-3" />
                      <span>Save Basic Information</span>
                    </>
                  )}
                </NeumorphicButton>
              )}
            </Flex.ActionGroup>
          </Flex.SectionGroup>
        </Form>
      </Grid>
    </article>
  );
};
