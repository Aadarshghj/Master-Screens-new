import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGlobalLoading } from "@/contexts/loading";
import {
  useForm,
  Controller,
  useWatch,
  type ControllerRenderProps,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PlusCircle, Search, CircleCheck, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import {
  Label,
  Switch,
  Form,
  Select,
  HeaderWrapper,
  Flex,
  Grid,
  TitleHeader,
} from "@/components";
import { useDMSFileUpload } from "@/hooks/useDMSFileUpload";
import { ConfirmationModal, Spinner } from "@/components/ui";
import { DatePicker } from "@/components/ui/date-picker";
import { useAppDispatch } from "@/hooks/store";
import { setIsReady } from "@/global/reducers/customer/kyc.reducer";
import { setCustomerIdentity } from "@/global/reducers/customer/customer-identity.reducer";
import { logger } from "@/global/service";
import {
  setPanData,
  setAadhaarData,
  getAadhaarData,
} from "@/utils/storage.utils";
import {
  useGetKycTypesQuery,
  useSubmitKycFormMutation,
  useUpdateKycFormMutation,
  useValidateKycMutation,
  useMaskAadharMutation,
  useVaultMaskMutation,
} from "@/global/service";
import type {
  KycFormData,
  KycDocumentFormProps,
  DocumentConfigKey,
  DocumentConfig,
} from "@/types";

import { kycValidationSchema } from "@/global/validation/customer/kyc-schema";
import { validateFile } from "@/utils/file.utils";
import { validateKYCFile } from "@/utils/kyc-file-validation";

import { MaskedInput } from "@/components/ui/masked-input";
import { SearchModal } from "../Modal/SearchModal";
import { getLatestDrivingLicenseDate } from "../../hooks/useDrivingLicenseDate";
import { parseDuplicateIdentifierError } from "@/utils/parseDuplicateIdentifierError.utils";
import { draftCode, pendingApproval } from "@/const/common-codes.const";
import CapsuleButton from "@/components/ui/capsule-button/capsule-button";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { setViewCustomerIdentity } from "@/global/reducers/customer/customer-identity-view.reducer";
import { useFormDirtyState } from "@/hooks/useFormDirtyState";

import {
  getDigilockerTxnId,
  saveDigilockerTxnId,
  clearDigilockerTxnId,
} from "@/utils/digilocker-session.utils";

import {
  useLazyGetDigilockerSessionUrlQuery,
  useLazyVerifyDigilockerStatusQuery,
} from "@/global/service/end-points/digilocker/digilocker.api";
import { useCustomerExtraction } from "@/hooks/useCustomerExtraction";
import { CustomerExtractionModal } from "@/components/ui/customerExtractionModal/CustomerExtractionModal";
import {
  doesIdMatch,
  saveExtractedCustomer,
} from "@/utils/extractedCustomerSession";
import { getMimeTypeFromFileName } from "@/utils/get-mime-type-from-file-name.util";
import { formatToDDMMYYYY } from "@/utils/format-date-to-DDMMYYYY.util";
import { setPrefillState } from "@/global/reducers/customer/prefill-kyc-data.reducer";

const defaultFormValues: KycFormData = {
  documentType: "AADHAAR",
  idNumber: "",
  placeOfIssue: "",
  issuingAuthority: "",
  validFrom: "",
  validTo: "",
  documentFile: null,
  aadharOtp: "",
  documentVerified: false,
  activeStatus: true,
  dateOfBirth: "",
  dateOfIssue: "",
  validUntil: "",
  selectedFileName: "",
  selectedFile: null,
  dmsFileData: null,
  originalIdNumber: "",
  maskedAadharResponse: null,
  vaultId: "",
  verifiedIdNumber: "",
};

const getDocumentTypeUuid = (
  documentType: string,
  kycTypes: { code?: string; identity?: string }[]
) => {
  const kycType = kycTypes.find(
    (type: { code?: string; identity?: string }) => type.code === documentType
  );
  return kycType?.identity || "91d51981-ee80-4430-92e1-586d568fb215";
};

const documentConfigs: Record<DocumentConfigKey, DocumentConfig> = {
  PAN: {
    label: "PAN Number",
    placeholder: "Enter PAN number",
    hasValidityDates: false,
    hasOtpSection: false,
    hasNameField: true,
    hasDobField: false,
    hasPlaceOfIssue: false,
    hasIssuingAuthority: false,
    maxLength: 10,
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  },
  AADHAAR: {
    label: "Aadhaar Number",
    placeholder: "XXXX XXXX XXXX",
    hasValidityDates: false,
    hasOtpSection: true,
    hasNameField: false,
    hasDobField: false,
    hasPlaceOfIssue: true,
    hasIssuingAuthority: true,
    maxLength: 12,
    pattern: /^[2-9][0-9]{11}$/,
  },
  PASSPORT: {
    label: "Passport Number",
    placeholder: "Enter passport number",
    hasValidityDates: true,
    hasOtpSection: false,
    hasNameField: true,
    hasDobField: true,
    hasPlaceOfIssue: true,
    hasIssuingAuthority: true,
    maxLength: 8,
    pattern: /^[A-Z][0-9]{7}$/,
  },
  DL: {
    label: "Driving License Number",
    placeholder: "Enter driving license number",
    hasValidityDates: true,
    hasOtpSection: false,
    hasNameField: true,
    hasDobField: true,
    hasPlaceOfIssue: true,
    hasIssuingAuthority: true,
    maxLength: 15,
    pattern: /^[A-Z]{2}[0-9]{2}\s?[0-9]{4}[0-9]{7}$/,
  },
  "VOTER ID": {
    label: "Voter ID",
    placeholder: "Enter Voter ID",
    hasValidityDates: false,
    hasOtpSection: false,
    hasNameField: true,
    hasDobField: false,
    hasPlaceOfIssue: false,
    hasIssuingAuthority: false,
    maxLength: 10,
    pattern: /^[A-Z]{3}[0-9]{7}$/,
  },
};
interface WarningProp {
  isOpen: boolean;
  title: string;
  message: string;
}
export const KycForm: React.FC<
  KycDocumentFormProps & { onFormSubmit?: () => void; isView?: boolean }
> = ({
  customerIdentity,
  onFormSubmit,
  isView = false,
  customerCreationMode,
  tableData,
  handleSetConfirmationModalData,
  confirmationModalData,
}) => {
  const dispatch = useAppDispatch();
  const [loadMasking, setLoadMasking] = useState(false);
  const { withLoading } = useGlobalLoading();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [documentWarning, setDocumentWarning] = useState<WarningProp | null>(
    null
  );
  const [, setExtractionVerified] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [digilockerCooldown, setDigilockerCooldown] = useState<number>(0);

  const { handleUpdateFormDirtyState, handleResetFormDirtyState } =
    useFormDirtyState({
      isView,
    });
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [duplicateData, setDuplicateData] = useState<{
    existingIdentity: string;
    customerCode: string;
    status: string;
  } | null>(null);
  const [digilockerRedirected, setDigilockerRedirected] = useState(false);
  const [isExtractionModalOpen, setIsExtractionModalOpen] = useState(false);
  const handleConfirm = () => {
    if (isView) {
      dispatch(
        setViewCustomerIdentity({
          identity: duplicateData?.existingIdentity ?? "",
          customerCode: duplicateData?.customerCode ?? "",
          status: duplicateData?.status || "",
        })
      );
    } else {
      dispatch(
        setCustomerIdentity({
          identity: duplicateData?.existingIdentity ?? "",
          customerCode: duplicateData?.customerCode ?? "",
          status: duplicateData?.status || "",
        })
      );
    }
    sessionStorage.removeItem("extracted_customer_data");
    reset(defaultFormValues);
    setConfirmationModal(false);
  };

  const formatCooldown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const secs = (seconds % 60).toString().padStart(2, "0");

    return `${minutes}:${secs}`;
  };

  const handleCancel = () => {
    setConfirmationModal(false);
  };
  const {
    data: kycDocData,
    isLoading: isDocLoading,
    isFetching: isDocFetching,
  } = useGetKycTypesQuery({ context: "CUSTOMER_ONBOARDING" });
  const documentTypes = kycDocData?.documentTypes ?? [];
  // const filteredDocumentTypes = documentTypes.filter(
  //   doc => !new Set(tableData?.map(item => item.idType)).has(doc.identity)
  // );

  const {
    extract,
    loading: isExtracting,
    error: extractError,
    data: extractedData,
    reset: resetExtraction,
  } = useCustomerExtraction();
  // const filteredDocumentTypes = useMemo(() => {
  //   return documentTypes;
  // }, [documentTypes]);

  const [submitKycForm, { isLoading: isKycFormSubmitting }] =
    useSubmitKycFormMutation();

  const [updateKycForm, { isLoading: isUpdateKycSubmitting }] =
    useUpdateKycFormMutation();

  const [validateKyc, { isLoading: isValidatingKyc }] =
    useValidateKycMutation();

  const [maskAadhar] = useMaskAadharMutation();
  const [vaultMask, { isLoading: isVaultMasking }] = useVaultMaskMutation();

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    getValues,
    trigger,
    formState: { errors, isDirty, dirtyFields, touchedFields },
    clearErrors,
  } = useForm<KycFormData>({
    resolver: yupResolver(kycValidationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      ...defaultFormValues,
      selectedFileName: "",
      selectedFile: null,
      dmsFileData: null,
      originalIdNumber: "",
      maskedAadharResponse: null,
      vaultId: "",
      verifiedIdNumber: "",
    },
  });
  const filteredDocumentTypes = useMemo(() => {
    if (!documentTypes || !tableData) return [];

    const usedIds = new Set(tableData.map(item => item.idType));

    return documentTypes.filter(doc => !usedIds.has(doc.identity));
  }, [documentTypes, tableData]);

  const currentDocumentType = watch("documentType");

  useEffect(() => {
    const nextValue = filteredDocumentTypes[0]?.code?.toUpperCase();

    if (!currentDocumentType && nextValue) {
      setValue("documentType", nextValue as KycFormData["documentType"]);
    }
  }, [currentDocumentType, filteredDocumentTypes, setValue]);

  const userTouched = Object.keys(touchedFields || {}).length > 0;
  useEffect(() => {
    if (isView) {
      handleResetFormDirtyState();
      return;
    }
    const hasDirtyValues = Object.keys(dirtyFields || {}).length > 0;
    if (isDirty && hasDirtyValues && userTouched) {
      handleUpdateFormDirtyState();
    } else {
      handleResetFormDirtyState();
    }
  }, [isDirty, dirtyFields, userTouched]);
  useEffect(() => {
    if (isSearchModalOpen) {
      reset(defaultFormValues);
      handleResetFormDirtyState();
    }
  }, [isSearchModalOpen]);

  const watchedValues = useWatch({
    name: [
      "selectedFileName",
      "selectedFile",
      "dmsFileData",
      "originalIdNumber",
      "maskedAadharResponse",
      "vaultId",
      "verifiedIdNumber",
    ],
    control,
  });

  const [
    selectedFileName,
    selectedFile,
    dmsFileData,
    originalIdNumber,
    maskedAadharResponse,
    vaultId,
    verifiedIdNumber,
  ] = watchedValues;

  const typedMaskedAadharResponse = maskedAadharResponse as {
    maskedAadhar: string;
    transactionId: string;
    masked_image?: string;
  } | null;

  const watchedDocumentType = watch("documentType");
  const watchedIdNumber = watch("idNumber");
  const watchedDateOfBirth = watch("dateOfBirth");

  const { uploadFile: uploadToDMS, isUploading: isDMSUploading } =
    useDMSFileUpload({
      module: "customer-onboarding",
      referenceId: customerIdentity || "temp-customer",
      documentCategory: "kyc-documents",
      documentType: watchedDocumentType.toLowerCase(),
      onSuccess: fileData => {
        setValue("dmsFileData", fileData);
        logger.info(
          `DMS file upload successful - FilePath: ${fileData.filePath}`
        );
      },
      onError: error => {
        logger.error(`DMS file upload failed - Error: ${error}`);
        toast.error(`File upload failed: ${error}`);
      },
      fileCategory: watchedDocumentType,
    });

  const isSubmitting =
    isKycFormSubmitting ||
    isUpdateKycSubmitting ||
    isVaultMasking ||
    isDMSUploading;

  const isDocumentVerified =
    watch("documentVerified") &&
    (watchedDocumentType === "PAN" ||
      watchedDocumentType === "DL" ||
      watchedDocumentType === "PASSPORT" ||
      watchedDocumentType === "VOTER ID");
  // const dob = getValues("dateOfBirth");
  const idNo = getValues("idNumber");
  // const maskedIdNo = getValues("maskedId");
  const docType = getValues("documentType");

  useEffect(() => {
    setValue("documentVerified", false);
  }, [idNo, docType]);

  const isPanFormatValid = useCallback(
    (value: string) => {
      if (watchedDocumentType !== "PAN" || !value) return false;
      const cleanValue = value.replace(/[^a-zA-Z0-9]/g, "");
      const panRegex = /^[A-Z]{5}\d{4}[A-Z]$/;
      return panRegex.test(cleanValue.toUpperCase());
    },
    [watchedDocumentType]
  );

  const handleIdNumberChange = useCallback(
    (value: string) => {
      const currentConfig =
        documentConfigs[watchedDocumentType as DocumentConfigKey];
      const maxLength = currentConfig?.maxLength || 20;

      let inputValue = value;

      if (watchedDocumentType === "AADHAAR") {
        const digitsOnly = value.replace(/\D/g, "");
        inputValue = digitsOnly.slice(0, 12);
        setValue("originalIdNumber", inputValue);
      } else {
        const cleanValue = value.replace(/[^a-zA-Z0-9]/g, "");
        inputValue = cleanValue.slice(0, maxLength);
        setValue("originalIdNumber", inputValue);
      }

      if (verifiedIdNumber && inputValue !== verifiedIdNumber) {
        setValue("documentVerified", false);
        setValue("verifiedIdNumber", "");
      }

      setValue("idNumber", inputValue, { shouldValidate: true });
    },
    [setValue, watchedDocumentType, verifiedIdNumber]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const char = e.key;

      if (watchedDocumentType === "AADHAAR") {
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
      } else {
        if (
          !/[a-zA-Z0-9]/.test(char) &&
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
      }
    },
    [watchedDocumentType]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData("text");

      if (watchedDocumentType === "AADHAAR") {
        const digitsOnly = pastedText.replace(/\D/g, "");
        if (digitsOnly) {
          handleIdNumberChange(digitsOnly);
        }
      } else {
        const cleanText = pastedText.replace(/[^a-zA-Z0-9]/g, "");
        if (cleanText) {
          handleIdNumberChange(cleanText);
        }
      }
    },
    [watchedDocumentType, handleIdNumberChange]
  );

  const handleCloseDocumentWarning = () => {
    setDocumentWarning(null);
  };

  const handleFileSelect = useCallback(
    async (file: File) => {
      try {
        const extracted = await withLoading(async () => {
          validateFile(file);
          validateKYCFile(file);

          setPendingFile(file);

          return await extract(file);
        }, "Extracting document details...");

        if (!extracted) {
          return;
        }

        const extractedId = extracted.documentNumber
          ? extracted.documentNumber.replace(/\s/g, "")
          : "";

        const enteredId = getValues("originalIdNumber");

        if (!doesIdMatch(enteredId, extractedId)) {
          setDocumentWarning({
            isOpen: true,
            title: "ID Mismatch",
            message:
              "Entered ID number does not match the uploaded document. Please upload the correct document.",
          });

          setPendingFile(null);
          resetExtraction();
          return;
        }

        setValue("documentFile", file, { shouldValidate: true });
        setValue("selectedFile", file);
        setValue("selectedFileName", file.name);
        setExtractionVerified(true);
        setIsExtractionModalOpen(true);

        toast.success("Document verified successfully");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Extraction failed"
        );
        resetExtraction();
        setPendingFile(null);
        setExtractionVerified(false);
      }
    },
    [
      withLoading,
      extract,
      extractedData,
      watchedDocumentType,
      getValues,
      setValue,
      resetExtraction,
    ]
  );

  const handleValidateKyc = useCallback(async () => {
    if (!originalIdNumber) {
      toast.error("Please enter a valid ID number");
      return;
    }

    if (watchedDocumentType === "PAN" && !isPanFormatValid(originalIdNumber)) {
      toast.error("Please enter a valid PAN number (format: AAAAANNNNA)");
      return;
    }

    if (watchedDocumentType === "DL" || watchedDocumentType === "PASSPORT") {
      const dobValue = watch("dateOfBirth");
      if (!dobValue) {
        toast.error(
          `Date of Birth is required for ${watchedDocumentType} verification`
        );
        return;
      }
    }

    const kycIdMap: Record<string, number> = {
      PAN: 2,
      DL: 3,
      PASSPORT: 4,
      "VOTER ID": 1,
    };

    const kycId = kycIdMap[watchedDocumentType];
    if (!kycId) return;

    try {
      const dobValue = watch("dateOfBirth");
      const formattedDob =
        (watchedDocumentType === "DL" || watchedDocumentType === "PASSPORT") &&
        dobValue
          ? new Date(dobValue).toISOString().split("T")[0]
          : undefined;

      const response = await validateKyc({
        idNumber: originalIdNumber,
        kycId: kycId,
        dob: formattedDob,
      }).unwrap();

      // Log the actual response for debugging
      logger.info(
        `KYC Validation Response for ${watchedDocumentType}: ${JSON.stringify(response)}`,
        { toast: false }
      );

      // More flexible validation - check multiple possible success indicators
      const isSuccess =
        (response.kycStatus === "SUCCESS" && response.status === "SUCCESS") ||
        response.success === true ||
        response.valid === true ||
        response.kycResult?.idStatus === "VALID" ||
        response.kycResult?.idStatus === "ACTIVE";

      if (isSuccess) {
        setValue("documentVerified", true);
        setValue("verifiedIdNumber", originalIdNumber); // Store the verified ID number
        const latestIssueDate = getLatestDrivingLicenseDate(
          response.kycResult?.allClassOfVehicle,
          "issueDate"
        );
        if (currentConfig.hasValidityDates && watchedDocumentType === "DL") {
          const latestExpiryDate = getLatestDrivingLicenseDate(
            response.kycResult?.allClassOfVehicle,
            "expiryDate"
          );

          setValue("validFrom", latestIssueDate?.toString() ?? null);
          setValue("validTo", latestExpiryDate?.toString() ?? null);
        }

        const configKey = watchedDocumentType as DocumentConfigKey;
        toast.success(
          `${documentConfigs[configKey].label} verified successfully!`
        );
      } else {
        // Log the failed response for debugging
        logger.info(
          `KYC Validation Failed for ${watchedDocumentType}: ${JSON.stringify(response)}`,
          { toast: false }
        );
        const errorMessage =
          response?.error?.message || "Document validation failed";
        toast.error(errorMessage);
      }
    } catch (error) {
      const apiError = error as {
        data?: {
          message?: string;
          details?: Record<string, string>;
          errorCode?: string;
        };
        message?: string;
      };
      let errorMessage = "An unexpected error occured. Please try again.";

      logger.info(`KYC Validation Error for ${watchedDocumentType}: ${error}`, {
        toast: false,
      });
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
  }, [
    originalIdNumber,
    watchedDocumentType,
    isPanFormatValid,
    validateKyc,
    setValue,
    watch,
  ]);

  const resetFormState = useCallback(() => {
    setValue("originalIdNumber", "");
    setValue("maskedAadharResponse", null);
    setValue("vaultId", "");
    setValue("verifiedIdNumber", "");
    setValue("selectedFileName", "");
    setValue("selectedFile", null);
    setValue("dmsFileData", null);
    setValue("documentVerified", false);
  }, [setValue]);
  let maskedAadhar = "";
  const onSubmit = useCallback(
    async (data: KycFormData) => {
      logger.info("KYC Form submission started", { toast: false });

      if (isSubmitting) return;
      await withLoading(async () => {
        logger.info("KYC  Form Submission started", { toast: false });

        try {
          if (data.documentType === "AADHAAR" && originalIdNumber) {
            try {
              const vaultResponse = await vaultMask({
                maskuid: originalIdNumber,
              }).unwrap();
              maskedAadhar = vaultResponse?.UidForDisplay || "";
              if (
                vaultResponse.Status === "success" &&
                vaultResponse.UidReferenceKey
              ) {
                const vaultId = vaultResponse.UidReferenceKey;
                setValue("vaultId", vaultId);
              } else {
                toast.error("Failed to get vault ID. Please try again.");
                return;
              }
            } catch {
              logger.error("Vault API error:", { toast: true });
              toast.error(
                "Failed to process Aadhaar number. Please try again."
              );
              reset(defaultFormValues);
              resetFormState();
              return;
            }
          }

          logger.info("Step 2: Starting DMS upload process", { toast: false });
          let currentDmsFileData = null;
          if (selectedFile) {
            logger.info("Starting DMS upload process...", { toast: false });

            // const uploadToastId = toast.loading("Uploading document to DMS...");
            try {
              const fileData = await uploadToDMS(selectedFile);

              if (!fileData) {
                logger.error("uploadToDMS returned null/undefined");
                toast.error("File upload failed");
                return;
              }

              currentDmsFileData = fileData;
              setValue("dmsFileData", fileData);
              // toast.success("Document uploaded successfully", {
              //   id: uploadToastId,
              // });
            } catch (error) {
              logger.error(`File upload error: ${error}`);
              toast.error("File upload failed");
              logger.error(`File upload error: ${error}`);
              reset(defaultFormValues);
              resetFormState();
              return;
            }
          } else {
            logger.info("No file selected for upload", { toast: false });
          }
          const requiresVerification = ["DL", "PAN", "VOTER ID"];
          if (
            requiresVerification.includes(data.documentType) &&
            !data.documentVerified
          ) {
            toast.error(
              `Please verify your ${data.documentType} document before submitting`
            );
            return;
          }
          if (
            data.documentType !== "AADHAAR" &&
            verifiedIdNumber &&
            data.idNumber !== verifiedIdNumber
          ) {
            toast.error(
              "Please verify the current ID number before submitting"
            );
            return;
          }

          logger.info("Constructing payload with DMS data", { toast: false });
          const updatedIdNumber =
            data.documentType === "AADHAAR"
              ? getValues("vaultId")
              : getValues("idNumber").toLocaleUpperCase();
          const updatedFileName =
            data.documentType === "AADHAAR"
              ? currentDmsFileData?.fileName
              : currentDmsFileData?.originalFileName ||
                dmsFileData?.originalFileName;
          const displayMaskId =
            data.documentType === "AADHAAR" ? maskedAadhar : "";
          const fileType = getMimeTypeFromFileName(
            currentDmsFileData?.fileName || dmsFileData?.fileName || ""
          );
          const payload = {
            idType: getDocumentTypeUuid(data.documentType, documentTypes),
            branchId: "5a97dec0-c7e8-4fc2-8ec9-11c9a680479a",
            idNumber: updatedIdNumber,
            placeOfIssue: data.placeOfIssue || "",
            issuingAuthority: data.issuingAuthority || "",
            maskedId: displayMaskId,
            validFrom: data.validFrom || "",
            validTo: data.validTo || "",
            isVerified: data.documentVerified,
            isActive: data.activeStatus,
            tenantId: "1563455e-fb89-4049-9cbe-02148017e1e6",
            branchCode: "BR01",
            documentRefId:
              currentDmsFileData?.fileName || dmsFileData?.fileName || "",
            filePath:
              currentDmsFileData?.filePath || dmsFileData?.filePath || "",
            fileName: updatedFileName,
            fileType: fileType,
          };

          if (data.documentType === "AADHAAR") {
            const existingAadhaarData = getAadhaarData();

            const aadhaarData = {
              documentType: "AADHAAR",
              idNumber: originalIdNumber || data.idNumber || "",
              maskedAadhaar: typedMaskedAadharResponse?.masked_image || "",
              vaultId: vaultId || "",
              aadhaarName: existingAadhaarData?.aadhaarName || "",
              submittedAt: new Date().toISOString(),
              customerId: customerIdentity || "",
              status: "PENDING", // Status is PENDING until OTP verification
              verified: false, // Will be updated to true after OTP verification
            };
            setAadhaarData(aadhaarData);
          }

          logger.info("DMS upload completed, now calling backend API", {
            toast: false,
          });
          logger.info("Final payload being sent to backend", { toast: false });

          let response;
          if (customerIdentity) {
            response = await updateKycForm({
              payload: payload,
              customerId: customerIdentity,
            }).unwrap();
          } else {
            response = await submitKycForm(payload).unwrap();
          }

          if (
            response &&
            typeof response === "object" &&
            "identity" in response
          ) {
            const responseData = response as {
              identity?: string;
              customerCode?: string;
              customerStatus?: string;
            };
            if (responseData.identity) {
              if (isView) {
                dispatch(
                  setViewCustomerIdentity({
                    identity: responseData?.identity ?? "",
                    customerCode: responseData?.customerCode ?? "",
                    status: responseData?.customerStatus || "",
                  })
                );
              } else {
                dispatch(
                  setCustomerIdentity({
                    identity: responseData.identity,
                    customerCode: responseData.customerCode || "",
                    status: responseData.customerStatus || "",
                  })
                );
              }
            }
          }

          if (data.documentType === "PAN" && data.documentVerified) {
            const panData = {
              documentType: "PAN",
              idNumber: originalIdNumber,
              submittedAt: new Date().toISOString(),
              customerId: response?.data?.identity || customerIdentity || "",
              status: "ACTIVE",
              verified: true,
            };
            setPanData(panData);
          }

          if (data.documentType === "AADHAAR" && data.documentVerified) {
            const existingAadhaarData = getAadhaarData();

            const updatedAadhaarData = {
              documentType: "AADHAAR",
              idNumber:
                originalIdNumber ||
                data.idNumber ||
                existingAadhaarData?.idNumber ||
                "",
              maskedAadhaar:
                typedMaskedAadharResponse?.masked_image ||
                existingAadhaarData?.maskedAadhaar ||
                "",
              vaultId: vaultId || existingAadhaarData?.vaultId || "",
              aadhaarName: existingAadhaarData?.aadhaarName || "",
              submittedAt:
                existingAadhaarData?.submittedAt || new Date().toISOString(),
              customerId:
                response?.data?.identity ||
                customerIdentity ||
                existingAadhaarData?.customerId ||
                "",
              status: "ACTIVE",
              verified: true,
            };
            setAadhaarData(updatedAadhaarData);
          }

          dispatch(setIsReady(true));

          reset(defaultFormValues);
          resetFormState();

          toast.success("KYC document added successfully!");

          // Call onFormSubmit callback if provided
          onFormSubmit?.();
        } catch (error: unknown) {
          const { isDuplicateError, existingDetails, existingIdentity } =
            parseDuplicateIdentifierError(error);
          if (isDuplicateError) {
            if (existingDetails.status === pendingApproval) {
              setDocumentWarning({
                isOpen: true,
                message:
                  "All customer onboarding steps have been completed; waiting for approval.",
                title: "Waiting for Approval",
              });
            } else if (existingDetails.status === draftCode) {
              setDuplicateData({
                existingIdentity,
                customerCode: existingDetails.customerCode,
                status: existingDetails.status,
              });
              setConfirmationModal(true);
            }
            return;
          }
          logger.error("KYC submission error:", { toast: false });
          const apiError = error as {
            data?: {
              errorCode?: string;
              message?: string;
              existingDetails?: {
                customerCode?: string;
              };
            };
            message?: string;
          };
          if (apiError?.data?.errorCode === "DUPLICATE_IDENTIFIER") {
            const baseMessage =
              apiError.data.message || "Customer already exists with this ID";
            const customerCode = apiError.data.existingDetails?.customerCode;
            const errorMessage = customerCode
              ? `${baseMessage} (Customer Code: ${customerCode})`
              : baseMessage;
            toast.error(errorMessage);
          } else if (apiError?.data?.message) {
            toast.error(apiError.data.message);
          } else if (apiError?.message) {
            toast.error(apiError.message);
          } else {
            toast.error("Failed to add KYC document. Please try again.");
          }
        }
      }, "Submitting KYC document...");
    },
    [
      submitKycForm,
      updateKycForm,
      dispatch,
      reset,
      resetFormState,
      isSubmitting,
      originalIdNumber,
      customerIdentity,
      documentTypes,
      maskedAadharResponse,
      typedMaskedAadharResponse,
      vaultMask,
      vaultId,
      verifiedIdNumber,
      dmsFileData,
      selectedFile,
      setValue,
      uploadToDMS,
      onFormSubmit,
      withLoading,
    ]
  );

  const currentConfig = useMemo(() => {
    const configKey = watchedDocumentType as DocumentConfigKey;
    return documentConfigs[configKey] || documentConfigs.PAN;
  }, [watchedDocumentType]);

  const showVerificationButton = useMemo(() => {
    return (
      (watchedDocumentType === "PAN" ||
        watchedDocumentType === "DL" ||
        watchedDocumentType === "VOTER ID") &&
      //  || watchedDocumentType === "PASSPORT"
      originalIdNumber
    );
  }, [watchedDocumentType, originalIdNumber]);

  const isVerifyButtonEnabled = useMemo(() => {
    if (watchedDocumentType === "PAN") {
      return isPanFormatValid(originalIdNumber);
    }
    if (watchedDocumentType === "DL") {
      const hasIdNumber = originalIdNumber || watchedIdNumber;
      const hasDob = watchedDateOfBirth;
      return hasIdNumber && hasIdNumber.length > 0 && hasDob;
    }
    if (watchedDocumentType === "PASSPORT") {
      const hasIdNumber = originalIdNumber || watchedIdNumber;
      const hasDob = watchedDateOfBirth;
      return hasIdNumber && hasIdNumber.length > 0 && hasDob;
    }
    if (watchedDocumentType === "VOTER ID") {
      const hasIdNumber = originalIdNumber || watchedIdNumber;
      return hasIdNumber && hasIdNumber.length > 0;
    }
    return false;
  }, [
    watchedDocumentType,
    originalIdNumber,
    watchedIdNumber,
    watchedDateOfBirth,
    isPanFormatValid,
  ]);
  const onDocumentChange = (
    value: string,
    field: ControllerRenderProps<KycFormData, "documentType">
  ) => {
    field.onChange(value);
    setValue("validFrom", "");
    setValue("validTo", "");
    setValue("idNumber", "");
    setValue("originalIdNumber", "");
    setValue("verifiedIdNumber", "");
    setValue("placeOfIssue", "");
    setValue("issuingAuthority", "");
    // setValue("nameOnDocument", "");
    setValue("documentVerified", false);
    if (watchedDocumentType === "DL" && value !== "DL") {
      setValue("dateOfBirth", "");
    }
    setValue("maskedAadharResponse", null);
    setValue("documentFile", null);
    setValue("selectedFileName", "");
    setValue("selectedFile", null);
    setValue("dmsFileData", null);
    clearErrors("idNumber");
    clearErrors("dateOfBirth");
    clearErrors("documentFile");
    clearErrors("validFrom");
    clearErrors("validTo");
    clearErrors("placeOfIssue");
    clearErrors("issuingAuthority");
    // clearErrors("nameOnDocument");
  };

  const [getDigilockerSessionUrl, { isFetching: isDigilockerLoading }] =
    useLazyGetDigilockerSessionUrlQuery();

  const [verifyDigilockerStatus, { isFetching: isDigilockerVerifying }] =
    useLazyVerifyDigilockerStatusQuery();

  const handleVerifyDigilocker = async () => {
    const txnId = getDigilockerTxnId();

    if (!txnId) {
      toast.error("Please complete DigiLocker verification first");
      return;
    }

    try {
      const response = await verifyDigilockerStatus({
        decentroTxnId: txnId,
        kycType: watchedDocumentType,
      }).unwrap();

      const isVerified =
        response.status === "SUCCESS" && !!response.aadhaarResponse?.data;

      if (isVerified) {
        setValue("documentVerified", true);
        setValue("verifiedIdNumber", "DIGILOCKER");
        clearDigilockerTxnId();
        setDigilockerCooldown(0);
        toast.success("Aadhaar verified successfully");
      } else {
        toast.error("DigiLocker data not found. Please complete verification.");
      }
    } catch {
      toast.error("Verification failed. Try again.");
    }
  };

  // const showOtherVerification = useMemo(() => {
  //   return (
  //     (watchedDocumentType === "PAN" ||
  //       watchedDocumentType === "DL" ||
  //       watchedDocumentType === "VOTER ID") &&
  //     !!originalIdNumber
  //   );
  // }, [watchedDocumentType, originalIdNumber]);

  useEffect(() => {
    clearDigilockerTxnId();
    setDigilockerCooldown(0);
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === "DIGILOCKER_CONSENT_COMPLETED"
      ) {
        setDigilockerRedirected(true);
        toast.success(
          "Please verify your Aadhaar to complete DigiLocker process"
        );
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleDigilockerClick = async () => {
    try {
      const response = await getDigilockerSessionUrl().unwrap();

      if (response.status !== "SUCCESS" || !response.data?.url) {
        toast.error("Failed to initiate DigiLocker");
        return;
      }
      saveDigilockerTxnId(response.decentroTxnId);
      setDigilockerCooldown(response.ttl ?? 300);

      const width = 600;
      const height = 820;

      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      window.open(
        response.data.url,
        "digilocker-popup",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // toast.success("Complete DigiLocker verification and return here");
    } catch {
      logger.error("DigiLocker session creation failed", { toast: false });
      toast.error("Unable to start DigiLocker");
    }
  };

  const showAadhaarVerification = useMemo(() => {
    return watchedDocumentType === "AADHAAR" && !!originalIdNumber;
  }, [watchedDocumentType, originalIdNumber]);

  // const showOtherVerification = useMemo(() => {
  //   return (
  //     (watchedDocumentType === "PAN" ||
  //       watchedDocumentType === "DL" ||
  //       watchedDocumentType === "VOTER ID") &&
  //     !!originalIdNumber
  //   );
  // }, [watchedDocumentType, originalIdNumber]);

  useEffect(() => {
    clearDigilockerTxnId();
    setDigilockerCooldown(0);
  }, []);

  useEffect(() => {
    if (digilockerCooldown <= 0) return;

    const interval = setInterval(() => {
      setDigilockerCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [digilockerCooldown]);

  const handleExtractionAccept = useCallback(
    async (data: typeof extractedData) => {
      if (!data) return;

      try {
        saveExtractedCustomer({
          name: data.name ?? "",
          dob: formatToDDMMYYYY(data.dob ?? "") ?? "",
          address: data.address ?? "",
          gender: data.gender ?? "",
          contactNumbers: data.contactNumbers ?? [],
          extractedFrom: data.extractedFrom ?? "",
        });
        dispatch(setPrefillState({ isPrefilled: false }));
        setIsExtractionModalOpen(false);
      } catch {
        logger.error("Extraction accept failed");
        toast.error("Unable to process document");

        resetExtraction();
        setPendingFile(null);
        setExtractionVerified(false);
      } finally {
        setLoadMasking(false);
      }
    },
    [watchedDocumentType, pendingFile, maskAadhar, setValue, resetExtraction]
  );
  const idNumber = watch("idNumber");

  useEffect(() => {
    if (digilockerCooldown === 0) {
      setDigilockerRedirected(false);
      clearDigilockerTxnId();
    }
  }, [digilockerCooldown]);

  const noIdNumber = !idNumber || idNumber.trim() === "";
  const handleReset = () => {
    reset(defaultFormValues);
    resetFormState();
    setValue("documentVerified", false);
    setValue("verifiedIdNumber", "");
    clearDigilockerTxnId();
    setDigilockerCooldown(0);
    setDigilockerRedirected(false);
  };
  useEffect(() => {
    if (
      !confirmationModalData?.doAction ||
      confirmationModalData?.feature !== "RESET"
    ) {
      return;
    }

    handleReset();
  }, [confirmationModalData]);

  return (
    <article>
      <ConfirmationModal
        isOpen={documentWarning?.isOpen ?? false}
        onConfirm={handleCloseDocumentWarning}
        title={documentWarning?.title ?? ""}
        message={documentWarning?.message ?? ""}
        confirmText="OK"
        type="warning"
        size="compact"
      />
      <ConfirmationModal
        isOpen={confirmationModal}
        onConfirm={handleConfirm}
        title="Customer Draft Exists"
        message="A pending draft with identical customer details was identified. Please choose whether to resume the draft or proceed with a new registration."
        confirmText="Continue"
        onCancel={handleCancel}
        type="warning"
        size="compact"
      />
      <Grid className="">
        <Flex justify="between" align="center" className="mb-1 w-full">
          <HeaderWrapper>
            <TitleHeader title="Customer KYC Document" />
          </HeaderWrapper>
          {!isView && !customerCreationMode && (
            <CapsuleButton
              onClick={() => setIsSearchModalOpen(true)}
              label="Search"
              icon={Search}
            />
          )}
        </Flex>

        <Form
          onSubmit={handleSubmit(data => {
            onSubmit(data);
          })}
        >
          <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Document Type"
                required
                error={errors.documentType}
              >
                <Controller
                  name="documentType"
                  control={control}
                  render={({ field }) => {
                    const isLoadingOptions = isDocLoading || isDocFetching;
                    const hasOptions =
                      Array.isArray(filteredDocumentTypes) &&
                      filteredDocumentTypes.length > 0;

                    // Auto-select first option only when real options are present and not loading
                    if (!isLoadingOptions && hasOptions && !field.value) {
                      const firstValue =
                        (filteredDocumentTypes[0] as { code?: string }).code ||
                        "";
                      if (firstValue) field.onChange(firstValue);
                    }

                    // Build options depending on state
                    const options = isLoadingOptions
                      ? [{ value: "loading", label: "Loading..." }]
                      : hasOptions
                        ? filteredDocumentTypes.map(type => ({
                            value: (type as { code?: string }).code || "",
                            label:
                              (type as { displayName?: string }).displayName ||
                              "",
                          }))
                        : [{ value: "no-data", label: "No data found" }];

                    // Choose value to avoid empty-string errors
                    const selectValue = isLoadingOptions
                      ? field.value || "loading"
                      : hasOptions
                        ? field.value
                        : "no-data";

                    return (
                      <Select
                        value={selectValue}
                        onValueChange={value => onDocumentChange(value, field)}
                        disabled={
                          !hasOptions || isSubmitting || isLoadingOptions
                        }
                        placeholder="Select"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={options}
                        onBlur={() => field.onBlur()}
                      />
                    );
                  }}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={6} span={12}>
              <Form.Field label="ID Number" required error={errors.idNumber}>
                {watchedDocumentType === "AADHAAR" ? (
                  <Controller
                    name="idNumber"
                    control={control}
                    render={({ field }) => (
                      <MaskedInput
                        value={watchedIdNumber}
                        onChange={value => {
                          field.onChange(value);
                          handleIdNumberChange(value);
                        }}
                        onKeyPress={handleKeyPress}
                        onPaste={handlePaste}
                        placeholder={currentConfig.placeholder}
                        size="form"
                        variant="form"
                        disabled={isSubmitting}
                        maxLength={currentConfig.maxLength}
                        disableCopyPaste
                        onBlur={() => field.onBlur()}
                      />
                    )}
                  />
                ) : (
                  <Controller
                    name="idNumber"
                    control={control}
                    render={({ field }) => (
                      <MaskedInput
                        value={field.value}
                        onChange={value => {
                          field.onChange(value);
                          handleIdNumberChange(value);
                        }}
                        placeholder={currentConfig.placeholder}
                        size="form"
                        variant="form"
                        disabled={isSubmitting}
                        className="uppercase"
                        maxLength={currentConfig.maxLength}
                        disableCopyPaste
                        onBlur={() => field.onBlur()}
                      />
                    )}
                  />
                )}
              </Form.Field>
            </Form.Col>

            {(watchedDocumentType === "DL" ||
              watchedDocumentType === "PASSPORT") && (
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Date of Birth"
                  required
                  error={errors.dateOfBirth}
                >
                  <DatePicker
                    value={watch("dateOfBirth") || undefined}
                    onChange={(value: string) => {
                      setValue("dateOfBirth", value);
                      trigger("dateOfBirth");
                    }}
                    disabled={isSubmitting}
                    placeholder="dd/mm/yyyy"
                    allowManualEntry={true}
                    size="form"
                    variant="form"
                    disableFutureDates={true}
                  />
                </Form.Field>
              </Form.Col>
            )}

            {/* Verify button - appears after Date of Birth for DL/PASSPORT, or after ID Number for PAN */}
            {showVerificationButton && (
              <Form.Col lg={1} md={6} span={12}>
                <Form.Field label="Verification">
                  {isDocumentVerified ? (
                    <div className="text-xss text-success flex items-center gap-1 py-1 font-medium">
                      <CircleCheck className="h-3 w-3" />
                      <span>Verified</span>
                    </div>
                  ) : (
                    <NeumorphicButton
                      type="button"
                      onClick={handleValidateKyc}
                      disabled={isValidatingKyc || !isVerifyButtonEnabled}
                      className="w-full"
                    >
                      {isValidatingKyc ? "Validating..." : "Verify"}
                    </NeumorphicButton>
                  )}
                </Form.Field>
              </Form.Col>
            )}
            {showAadhaarVerification && (
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Verification">
                  <Flex gap={2}>
                    <NeumorphicButton
                      type="button"
                      onClick={handleDigilockerClick}
                      disabled={
                        isDigilockerLoading ||
                        isSubmitting ||
                        digilockerCooldown > 0 ||
                        watch("documentVerified")
                      }
                    >
                      {digilockerCooldown > 0
                        ? `Retry in ${formatCooldown(digilockerCooldown)}`
                        : "DigiLocker"}
                    </NeumorphicButton>

                    {watch("documentVerified") ? (
                      <div className="text-xss text-success flex items-center gap-1">
                        <CircleCheck className="h-3 w-3" />
                        <span>Verified</span>
                      </div>
                    ) : (
                      <NeumorphicButton
                        type="button"
                        onClick={handleVerifyDigilocker}
                        disabled={
                          isDigilockerVerifying ||
                          isSubmitting ||
                          !digilockerRedirected
                        }
                      >
                        {isDigilockerVerifying ? "Checking..." : "Verify"}
                      </NeumorphicButton>
                    )}
                  </Flex>
                </Form.Field>
              </Form.Col>
            )}

            {currentConfig.hasValidityDates && (
              <>
                <Form.Col lg={2} md={6} span={12}>
                  <Form.Field
                    label="Valid From"
                    required
                    error={errors.validFrom}
                  >
                    <DatePicker
                      value={watch("validFrom") || undefined}
                      onChange={(value: string) => setValue("validFrom", value)}
                      // disabled={true}
                      disabled={isSubmitting || watchedDocumentType === "DL"}
                      placeholder="dd/mm/yyyy"
                      allowManualEntry={true}
                      size="form"
                      variant="form"
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={2} md={6} span={12}>
                  <Form.Field label="Valid To" required error={errors.validTo}>
                    <DatePicker
                      value={watch("validTo") || undefined}
                      onChange={(value: string) => setValue("validTo", value)}
                      disabled={isSubmitting || watchedDocumentType === "DL"}
                      placeholder="dd/mm/yyyy"
                      allowManualEntry={true}
                      size="form"
                      variant="form"
                      disableFutureDates={false}
                    />
                  </Form.Field>
                </Form.Col>
              </>
            )}

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Document File"
                required
                error={errors.documentFile}
              >
                <NeumorphicButton
                  disabled={isSubmitting || noIdNumber}
                  type="button"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".pdf,.jpg,.jpeg,.png,.tiff,.tif";
                    input.onchange = e => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleFileSelect(file);
                      }
                    };
                    input.click();
                  }}
                  className="mb-2"
                >
                  Choose File
                </NeumorphicButton>
                {selectedFileName ? (
                  <div className="text-status-success text-xss">
                    {selectedFileName} (
                    {selectedFile &&
                      (selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                    MB)
                  </div>
                ) : (
                  <p className="text-nano text-muted-foreground ml-3 text-center">
                    Accepted format JPG,PNG,JPEG,PDF Max size: 1MB
                  </p>
                )}
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Flex.SectionGroup className="mt-1">
            <Flex.ControlGroup>
              <Flex align="center" gap={2}>
                <Controller
                  name="documentVerified"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="documentVerified"
                      checked={field.value}
                      onCheckedChange={undefined}
                      disabled={true}
                    />
                  )}
                />
                <Label htmlFor="documentVerified">Document Verified</Label>
              </Flex>
            </Flex.ControlGroup>

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
                disabled={isSubmitting}
              >
                <RefreshCw width={12} />
                Reset
              </NeumorphicButton>

              <NeumorphicButton
                type="submit"
                variant="default"
                size="default"
                disabled={isSubmitting || loadMasking}
              >
                {isSubmitting ? (
                  <Spinner
                    variant="default"
                    size={12}
                    className="text-primary-foreground"
                  />
                ) : (
                  <PlusCircle width={12} />
                )}
                {isSubmitting ? "Adding KYC Document" : "Add KYC Document"}
              </NeumorphicButton>
            </Flex.ActionGroup>
          </Flex.SectionGroup>
        </Form>
      </Grid>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectCustomer={() => {}}
        defaultTab="Customer"
      />
      <CustomerExtractionModal
        open={isExtractionModalOpen}
        loading={isExtracting}
        error={extractError ?? undefined}
        data={extractedData}
        onClose={() => {
          setIsExtractionModalOpen(false);
          // resetExtraction();
        }}
        onAccept={handleExtractionAccept}
      />
    </article>
  );
};
