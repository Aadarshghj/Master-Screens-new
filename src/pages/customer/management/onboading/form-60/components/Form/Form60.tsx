import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAppDispatch, useAppSelector } from "@/hooks/store";

import {
  Grid,
  Flex,
  Select,
  Input,
  Label,
  Form,
  Textarea,
  Spinner,
} from "@/components/ui";
import { Save, Download, Eye, Upload } from "lucide-react";
import {
  useCreateForm60Mutation,
  useUpdateForm60Mutation,
  useGetForm60ByIdQuery,
  useGetSourceOfIncomeQuery,
  useGetCustomerAllDetailsQuery,
  useDownloadForm60Mutation,
  usePreviewForm60Mutation,
  useUploadForm60Mutation,
  logger,
  useGetDocumentMasterQuery,
} from "@/global/service";
import { useDMSFileUpload } from "@/hooks/useDMSFileUpload";
import { DatePicker } from "@/components/ui/date-picker";
import { MaskedInput } from "@/components/ui/masked-input";
import type { DMSFileData } from "@/hooks/useDMSFileUpload";
import type { Form60FormData, Form60FormProps } from "@/types";
import {
  form60ValidationSchema,
  transformFormData,
  // getCurrentIncomeLabel as getCurrentIncomeLabelFromSchema,
} from "@/global/validation/customer/form60-schema";
import { DEFAULT_FORM_VALUES } from "../../constants/form.constants";
import {
  setForm60Identity,
  clearForm60Identity,
} from "@/global/reducers/customer/form60-identity.reducer";
import { getDocumentAuthorityByCode } from "@/const/document-authority.const";
import PhotoAndDocumentGallery from "@/components/ui/photo-gallery/PhotoGalleryModal";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

const FORM_CONFIG = {
  DEFAULT_BRANCH_CODE: "BR001",
  DEFAULT_FORM_FILE_ID: 1,
  DEFAULT_CREATED_BY: 1001,
  TRANSACTION_MODES: ["BANK", "CASH", "ONLINE"] as const,
} as const;

export const Form60Form: React.FC<
  Form60FormProps & {
    onFormSubmit?: () => void;
  }
> = ({
  readonly = false,
  form60Id,
  customerIdentity,
  onFormSubmit,
  form60Identity,
}) => {
  const dispatch = useAppDispatch();
  const [photoGalleryOpen, setphotoGalleryOpen] = useState(false);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const customerId = customerIdentity ? parseInt(customerIdentity, 10) : 0;
  const customerIdForApi = customerIdentity || "";
  const validCustomerId = isNaN(customerId) ? 0 : customerId;

  const storedForm60Id = useAppSelector(
    state => state.form60Identity?.form60Id
  );
  const storedCustomerId = useAppSelector(
    state => state.form60Identity?.customerId
  );
  const [createForm60, { isLoading: isCreatingForm60 }] =
    useCreateForm60Mutation();
  const [updateForm60, { isLoading: isUpdatingForm60 }] =
    useUpdateForm60Mutation();

  const [downloadForm60, { isLoading: isDownloadingForm60 }] =
    useDownloadForm60Mutation();
  const [previewForm60, { isLoading: isPreviewingForm60 }] =
    usePreviewForm60Mutation();
  const [uploadForm60, { isLoading: isUploadingForm60 }] =
    useUploadForm60Mutation();

  const { uploadFile: uploadToDMS, isUploading: isDMSUploading } =
    useDMSFileUpload({
      module: "customer-onboarding",
      referenceId: customerIdForApi,
      documentCategory: "form-60",
      documentType: "signed-form60",
      onSuccess: () => {
        logger.info("Form60 document uploaded to DMS successfully", {
          toast: true,
        });
      },
    });

  const [, setIsSubmissionSuccessful] = useState(false);

  const [isPreviewSuccessful, setIsPreviewSuccessful] = useState(false);
  const [isDownloadSuccessful, setIsDownloadSuccessful] = useState(false);

  const [, setUploadedFile] = useState<File | null>(null);
  const [dmsFileData, setDmsFileData] = useState<DMSFileData | null>(null);

  const effectiveForm60Id = storedForm60Id || form60Id || form60Identity;

  const {
    data: existingForm60,
    isLoading: isLoadingForm60,
    refetch: refetchForm60,
  } = useGetForm60ByIdQuery(
    {
      customerId: customerIdForApi,
    },
    { skip: !customerIdForApi }
  );
  const { data: documentTypes = [] } = useGetDocumentMasterQuery();

  useEffect(() => {
    setIsSubmissionSuccessful(false);
  }, [existingForm60, customerIdentity]);

  const { data: customerAllDetails } = useGetCustomerAllDetailsQuery(
    { customerId: customerIdForApi },
    {
      skip: !customerIdForApi,
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: sourceOfIncomeOptions = [] } = useGetSourceOfIncomeQuery();

  const filteredDocumentTypes = useMemo(() => {
    return documentTypes || [];
  }, [documentTypes]);

  const identityDocumentTypes = useMemo(() => {
    return documentTypes?.filter(doc => doc.isIdentityProof) || [];
  }, [documentTypes]);

  const addressDocumentTypes = useMemo(() => {
    return documentTypes?.filter(doc => doc.isAddressProof) || [];
  }, [documentTypes]);

  const transformedSourceOfIncomeOptions = useMemo(() => {
    return sourceOfIncomeOptions || [];
  }, [sourceOfIncomeOptions]);

  const getBranchIdentity = useMemo(() => {
    return (
      customerAllDetails?.branchId || "5a97dec0-c7e8-4fc2-8ec9-11c9a680479a"
    );
  }, [customerAllDetails?.branchId]);

  const defaultFormValues = useMemo(() => {
    // Don't calculate defaultFormValues if required data is not available
    if (
      !customerAllDetails ||
      !transformedSourceOfIncomeOptions.length
      // || !filteredDocumentTypes.length
    ) {
      return null;
    }

    const primaryAddress = customerAllDetails?.addresses?.[0];

    const primaryContact =
      customerAllDetails?.contactResponseDtos?.find(
        (contact: { isPrimary?: boolean }) => contact.isPrimary
      ) || customerAllDetails?.contactResponseDtos?.[0];

    // Find mobile contact specifically
    const mobileContact = customerAllDetails?.contactResponseDtos?.find(
      (contact: { contactType?: string }) =>
        contact.contactType?.toLowerCase() === "mobile" ||
        contact.contactType?.toLowerCase() === "phone"
    );
    // Get source of income identity from employment data
    const getSourceOfIncomeIdentity = () => {
      try {
        const incomeSourceId =
          customerAllDetails?.additionalInfo?.employment?.incomeSourceId;

        if (!incomeSourceId) {
          // Fallback to first option if no income source in data
          return transformedSourceOfIncomeOptions[0]?.value || "";
        }

        return incomeSourceId;
      } catch (error) {
        logger.error(error, { toast: false });
        return transformedSourceOfIncomeOptions[0]?.value || "";
      }
    };

    // Get annual income from employment data
    const getAnnualIncome = () => {
      try {
        const annualIncome =
          customerAllDetails?.additionalInfo?.employment?.annualIncome;
        return annualIncome ? annualIncome.toString() : "0";
      } catch (error) {
        logger.error(error, { toast: false });
        return "0";
      }
    };

    // Get mobile number from session storage first
    const getMobileFromSession = () => {
      try {
        const sessionData = sessionStorage.getItem("customerBasicInfo");
        if (sessionData) {
          const parsedData = JSON.parse(sessionData);
          logger.info("Session storage data found", { pushLog: false });
          logger.info(
            `Mobile number from session: ${parsedData.mobileNumber}`,
            { pushLog: false }
          );
          return parsedData.mobileNumber || "";
        }
      } catch {
        logger.error("Error parsing session storage data", { toast: false });
      }
      return "";
    };

    // Extract Aadhaar masked ID from KYC documents
    const getAadhaarMaskedId = () => {
      try {
        const kycDocuments =
          customerAllDetails?.customerKycResponseDto?.kycDocuments;

        if (!kycDocuments || !Array.isArray(kycDocuments)) {
          return "";
        }

        // Find the Aadhaar document
        // You may need to check the actual UUID for Aadhaar type in your system
        // Common Aadhaar type codes: "AADHAAR", "ADH", or check by idType UUID
        const aadhaarDoc = kycDocuments.find(
          (doc: { idType?: string; maskedId?: string }) => {
            // You might need to replace this with the actual Aadhaar idType UUID
            // For now, we'll check if maskedId exists and looks like Aadhaar format
            return doc.maskedId && doc.maskedId.includes("X");
          }
        );

        if (aadhaarDoc && aadhaarDoc.maskedId) {
          logger.info(`Aadhaar masked ID found: ${aadhaarDoc.maskedId}`, {
            pushLog: false,
          });
          return aadhaarDoc.maskedId;
        }

        return "";
      } catch (error) {
        logger.error(error, { toast: false });
        return "";
      }
    };
    return transformFormData({
      ...DEFAULT_FORM_VALUES,
      customerId: validCustomerId,
      branchId: customerAllDetails?.branchCode || "BR001", // Use branchCode from allDetails
      // customerName:
      //   customerAllDetails?.displayName ||
      //   (customerAllDetails?.firstName && customerAllDetails?.lastName
      //     ? `${customerAllDetails.firstName} ${customerAllDetails.middleName || ""} ${customerAllDetails.lastName}`.trim()
      //     : ""),
      customerName:
        customerAllDetails?.displayName ||
        (customerAllDetails?.firstName
          ? `${customerAllDetails.firstName} ${customerAllDetails.middleName || ""} ${customerAllDetails.lastName || ""}`.trim()
          : ""),
      dateOfBirth: customerAllDetails?.dob || "",
      fatherName: customerAllDetails?.fatherName || "JACOB",
      mobileNumber: (() => {
        const sessionMobile = getMobileFromSession();
        const mobileContactValue = mobileContact?.contactDetails;
        const customerMobile = customerAllDetails?.mobileNumber;
        const primaryContactValue = primaryContact?.contactDetails;

        const finalMobile =
          sessionMobile ||
          mobileContactValue ||
          customerMobile ||
          primaryContactValue ||
          "";

        return finalMobile;
      })(),

      flatRoomNo: primaryAddress?.doorNumber || "",
      roadStreetLane: primaryAddress?.addressLine1 || "",
      areaLocality: primaryAddress?.addressLine2 || "",
      townCity: primaryAddress?.placeName || primaryAddress?.city || "",
      district: primaryAddress?.district || "",
      state: primaryAddress?.state || "",
      pinCode: primaryAddress?.pincode || "",

      // sourceOfIncome: transformedSourceOfIncomeOptions[0]?.value || "",
      maskedAdhar: getAadhaarMaskedId(),
      sourceOfIncome: getSourceOfIncomeIdentity(),
      agriculturalIncome: getAnnualIncome(),
      // pidDocumentCode: filteredDocumentTypes[0]?.code || "",
      // addDocumentCode: filteredDocumentTypes[0]?.code || "",
    });
  }, [validCustomerId, customerAllDetails, transformedSourceOfIncomeOptions]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Form60FormData>({
    resolver: yupResolver(form60ValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: transformFormData(
      defaultFormValues || {
        ...DEFAULT_FORM_VALUES,
        customerId: validCustomerId,
      }
    ),
  });

  const watchedValues = useWatch({
    name: [
      "pidDocumentCode",
      "addDocumentCode",
      "sourceOfIncome",
      "dateOfBirth",
      "transactionDate",
      "panCardApplicationDate",
    ],
    control,
  });

  const [
    watchedPidDocumentCode,
    watchedAddDocumentCode,
    sourceOfIncome,
    dateOfBirth,
    transactionDate,
    panCardApplicationDate,
  ] = watchedValues;

  // Helper to check if source of income is agricultural
  const isAgriculturalIncome = useMemo(() => {
    if (!sourceOfIncome) return false;

    const selectedSource = transformedSourceOfIncomeOptions.find(
      option => option.value === sourceOfIncome
    );

    if (!selectedSource) return false;

    const sourceName = selectedSource.label.toLowerCase();
    return (
      sourceName.includes("agricultural") ||
      sourceName.includes("agriculture") ||
      sourceName.includes("agri")
    );
  }, [sourceOfIncome, transformedSourceOfIncomeOptions]);

  // Get dynamic label for income field
  const incomeFieldLabel = useMemo(() => {
    return isAgriculturalIncome
      ? "Agricultural Income (Rs.)"
      : "Other than Agricultural Income (Rs.)";
  }, [isAgriculturalIncome]);
  const incomeFieldName = isAgriculturalIncome
    ? "agriculturalIncome"
    : "otherIncome";

  const getMaxLengthForCode = (code?: string): number => {
    switch ((code || "").toUpperCase()) {
      case "PAN":
        return 10; // AAAAA9999A
      case "ADH":
        return 12; // 12 digits
      case "DL":
        return 20; // reasonable upper bound for DL
      case "EID":
        return 16; // voter id typical 10-16
      case "RID":
        return 20; // ration card varies
      default:
        return 20;
    }
  };

  const sanitizeByCode = (code: string | undefined, value: string): string => {
    const upperCode = (code || "").toUpperCase();
    if (upperCode === "ADH") {
      return value.replace(/\D/g, "").slice(0, 12);
    }
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const maxLen = getMaxLengthForCode(upperCode);
    return cleaned.slice(0, maxLen);
  };

  const isPanFormatValid = (value: string): boolean => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value);
  };

  useEffect(() => {
    if (watchedPidDocumentCode) {
      const authorityData = getDocumentAuthorityByCode(watchedPidDocumentCode);
      if (authorityData) {
        const authorityName = authorityData.issuingAuthorityName;
        setValue("pidIssuingAuthority", authorityName, {
          shouldValidate: true,
        });
      }
    }
  }, [watchedPidDocumentCode, setValue]);

  useEffect(() => {
    if (watchedAddDocumentCode) {
      const authorityData = getDocumentAuthorityByCode(watchedAddDocumentCode);
      if (authorityData) {
        const authorityName = authorityData.issuingAuthorityName;
        setValue("addIssuingAuthority", authorityName, {
          shouldValidate: true,
        });
      }
    }
  }, [watchedAddDocumentCode, setValue]);

  const isSubmitting = isCreatingForm60 || isUpdatingForm60;

  // Track if form has been initialized to prevent resetting after user input
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  useEffect(() => {
    if (storedCustomerId && storedCustomerId !== customerIdForApi) {
      dispatch(clearForm60Identity());
      setIsPreviewSuccessful(false);
      setIsDownloadSuccessful(false);
      setIsFormInitialized(false); // Reset form initialization flag for new customer
    }
  }, [customerIdForApi, storedCustomerId, dispatch]);

  // Reset form initialization when customer or source options change
  useEffect(() => {
    setIsFormInitialized(false);
  }, [customerIdForApi, transformedSourceOfIncomeOptions.length]);

  // Update form values when customerAllDetails changes (for income source and amount)
  useEffect(() => {
    if (
      !customerAllDetails ||
      !transformedSourceOfIncomeOptions.length ||
      !isFormInitialized
    ) {
      return;
    }

    const incomeSourceId =
      customerAllDetails?.additionalInfo?.employment?.incomeSourceId;
    const annualIncome =
      customerAllDetails?.additionalInfo?.employment?.annualIncome;

    if (incomeSourceId) {
      setValue("sourceOfIncome", incomeSourceId);
    }
    if (annualIncome) {
      setValue(incomeFieldName, annualIncome.toString());
    }
  }, [
    customerAllDetails?.additionalInfo?.employment,
    transformedSourceOfIncomeOptions.length,
    isFormInitialized,
    setValue,
    customerAllDetails,
  ]);

  useEffect(() => {
    // Only proceed if we have the required data and haven't initialized yet
    if (!defaultFormValues || isFormInitialized) {
      return;
    }

    // Ensure sourceOfIncomeOptions is loaded before initializing
    if (!transformedSourceOfIncomeOptions.length) {
      return;
    }

    if (existingForm60 && !isLoadingForm60) {
      const formData = {
        ...defaultFormValues, // This contains all the read-only customer details
        transactionAmount: existingForm60.transactionAmount || "",
        transactionDate: existingForm60.transactionDate || "",
        modeOfTransaction: existingForm60.modeOfTransaction || "",
        numberOfPersons: existingForm60.numberOfPersons || "",
        agriculturalIncome: existingForm60.agriculturalIncome || "",
        otherIncome: existingForm60.otherIncome ?? 0,
        taxableIncome: existingForm60.taxableIncome || "",
        // nonTaxableIncome: existingForm60.nonTaxableIncome || "",
        panCardApplicationDate: existingForm60.panCardApplicationDate || "",
        panCardApplicationAckNo: existingForm60.panCardApplicationAckNo || "",
        pidDocumentId: existingForm60.pidDocumentId || "",
        pidDocumentNo: existingForm60.pidDocumentNo || "",
        pidIssuingAuthority: existingForm60.pidIssuingAuthority || "",
        addDocumentId: existingForm60.addDocumentId || "",
        addDocumentNo: existingForm60.addDocumentNo || "",
        addIssuingAuthority: existingForm60.addIssuingAuthority || "",
        submissionDate: existingForm60.submissionDate || "",
        formFileId: existingForm60.formFileId || "",
        telephoneNumber: existingForm60.telephoneNumber || "",
        floorNumber: existingForm60.floorNumber || "",
        nameOfPremises: existingForm60.nameOfPremises || "",
        maskedAdhar: existingForm60.maskedAdhar || "",
        customerId: validCustomerId,
        createdBy: FORM_CONFIG.DEFAULT_CREATED_BY,
        identity: existingForm60.identity ?? "",
      } as Form60FormData;

      reset(formData);
      setIsFormInitialized(true);
    } else if (!existingForm60 && !isLoadingForm60) {
      reset(defaultFormValues);
      setIsFormInitialized(true);
    }
  }, [
    existingForm60,
    isLoadingForm60,
    defaultFormValues,
    validCustomerId,
    reset,
    effectiveForm60Id,
    isFormInitialized,
    transformedSourceOfIncomeOptions,
  ]);

  const handleDownloadForm60 = useCallback(async () => {
    if (!effectiveForm60Id || !customerIdForApi) {
      logger.error("Form60 ID or Customer ID not available for download", {
        toast: true,
        pushLog: false,
      });
      return;
    }

    try {
      const blob = await downloadForm60({
        customerId: customerIdForApi,
        form60Id: effectiveForm60Id.toString(),
      }).unwrap();

      if (!blob || !(blob instanceof Blob)) {
        throw new Error("Invalid blob response from server");
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Form60_${customerIdForApi}_${effectiveForm60Id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      logger.info("Form60 downloaded successfully", {
        toast: true,
        pushLog: false,
      });

      setIsDownloadSuccessful(true);
    } catch (error: unknown) {
      const apiError = error as {
        data?: {
          message?: string;
          serviceCode?: string;
          status?: string;
        };
        message?: string;
        status?: number;
      };

      logger.info("Parsed API Error", { pushLog: false });

      if (
        apiError?.data?.serviceCode === "MONO-001" &&
        apiError?.data?.status === "unavailable"
      ) {
        logger.error(
          apiError.data.message ||
            "Service is currently down. Please try again later.",
          {
            toast: true,
            pushLog: false,
          }
        );
      } else if (apiError?.data?.message) {
        logger.error(apiError.data.message, { toast: true, pushLog: false });
      } else if (apiError?.message) {
        logger.error(apiError.message, { toast: true, pushLog: false });
      } else {
        logger.error("Failed to download Form60", {
          toast: true,
          pushLog: false,
        });
      }
    }
  }, [downloadForm60, effectiveForm60Id, customerIdForApi]);

  const handlePreviewForm60 = useCallback(async () => {
    if (!effectiveForm60Id || !customerIdForApi) {
      logger.error("Form60 ID or Customer ID not available for preview", {
        toast: true,
        pushLog: false,
      });
      return;
    }

    try {
      const blob = await previewForm60({
        customerId: customerIdForApi,
        form60Id: effectiveForm60Id.toString(),
      }).unwrap();

      if (!blob || !(blob instanceof Blob)) {
        throw new Error("Invalid blob response from server");
      }

      const url = window.URL.createObjectURL(blob);
      setDocUrl(url);
      setphotoGalleryOpen(true);
      // const previewWindow = window.open(url, "_blank");
      // if (previewWindow) {
      //   previewWindow.focus();
      // }

      logger.info("Form60 preview opened successfully", {
        toast: true,
        pushLog: false,
      });

      setIsPreviewSuccessful(true);
    } catch (error: unknown) {
      const apiError = error as {
        data?: {
          message?: string;
          serviceCode?: string;
          status?: string;
        };
        message?: string;
        status?: number;
      };

      logger.info("Parsed Preview API Error", { pushLog: false });

      if (
        apiError?.data?.serviceCode === "MONO-001" &&
        apiError?.data?.status === "unavailable"
      ) {
        logger.error(
          apiError.data.message ||
            "Service is currently down. Please try again later.",
          {
            toast: true,
            pushLog: false,
          }
        );
      } else if (apiError?.data?.message) {
        logger.error(apiError.data.message, { toast: true, pushLog: false });
      } else if (apiError?.message) {
        logger.error(apiError.message, { toast: true, pushLog: false });
      } else {
        logger.error("Failed to preview Form60", {
          toast: true,
          pushLog: false,
        });
      }
    }
  }, [previewForm60, effectiveForm60Id, customerIdForApi]);

  const handleUploadForm60 = useCallback(
    async (dmsFileData: DMSFileData) => {
      if (!effectiveForm60Id || !customerIdForApi) {
        logger.error("Form60 ID or Customer ID not available for upload", {
          toast: true,
          pushLog: false,
        });
        return;
      }

      if (!dmsFileData) {
        logger.error("DMS file data not available for upload", {
          toast: true,
          pushLog: false,
        });
        return;
      }

      try {
        await uploadForm60({
          customerId: customerIdForApi,
          form60Id: effectiveForm60Id.toString(),
          docRefId: dmsFileData.fileName || "",
          fileName: dmsFileData.originalFileName || "",
          filePath: dmsFileData.filePath || "",
        }).unwrap();

        logger.info("Form60 uploaded successfully", {
          toast: true,
          pushLog: false,
        });
      } catch (error: unknown) {
        const apiError = error as {
          data?: {
            message?: string;
            serviceCode?: string;
            status?: string;
          };
          message?: string;
        };

        if (
          apiError?.data?.serviceCode === "MONO-001" &&
          apiError?.data?.status === "unavailable"
        ) {
          logger.error(
            apiError.data.message ||
              "Service is currently down. Please try again later.",
            {
              toast: true,
              pushLog: false,
            }
          );
        } else if (apiError?.data?.message) {
          logger.error(apiError.data.message, { toast: true, pushLog: false });
        } else if (apiError?.message) {
          logger.error(apiError.message, { toast: true, pushLog: false });
        } else {
          logger.error("Failed to upload Form60", {
            toast: true,
            pushLog: false,
          });
        }
      }
    },
    [uploadForm60, effectiveForm60Id, customerIdForApi]
  );

  const handleFileInputChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (file.type !== "application/pdf") {
          logger.error("Please select a PDF file", {
            toast: true,
            pushLog: false,
          });
          return;
        }

        if (file.size > 10 * 1024 * 1024) {
          logger.error("File size should not exceed 10MB", {
            toast: true,
            pushLog: false,
          });
          return;
        }

        try {
          logger.info("Uploading file to DMS...", { toast: false });
          const dmsFileData = await uploadToDMS(file);

          if (!dmsFileData) {
            logger.error("Failed to upload file to DMS", { toast: true });
            return;
          }

          setDmsFileData(dmsFileData);
          setUploadedFile(file);

          await handleUploadForm60(dmsFileData);

          logger.info(
            "File uploaded successfully to both DMS and Form60 system",
            {
              toast: true,
            }
          );
        } catch (error) {
          logger.error(error, { toast: true });
        }
      }
    },
    [handleUploadForm60, uploadToDMS]
  );

  // Add these handlers after the existing useEffect hooks
  const handlePidDocumentCodeChange = useCallback(
    (value: string) => {
      const selectedDoc = identityDocumentTypes.find(doc => doc.code === value);
      if (selectedDoc) {
        setValue("pidDocumentCode", value);
        setValue("pidDocumentId", selectedDoc.identity);

        // Set issuing authority if available
        const authorityData = getDocumentAuthorityByCode(value);
        if (authorityData) {
          setValue("pidIssuingAuthority", authorityData.issuingAuthorityName, {
            shouldValidate: true,
          });
        }
      }
    },
    [identityDocumentTypes, setValue]
  );

  const handleAddDocumentCodeChange = useCallback(
    (value: string) => {
      const selectedDoc = addressDocumentTypes.find(doc => doc.code === value);
      if (selectedDoc) {
        setValue("addDocumentCode", value);
        setValue("addDocumentId", selectedDoc.identity);

        // Set issuing authority if available
        const authorityData = getDocumentAuthorityByCode(value);
        if (authorityData) {
          setValue("addIssuingAuthority", authorityData.issuingAuthorityName, {
            shouldValidate: true,
          });
        }
      }
    },
    [addressDocumentTypes, setValue]
  );

  const onSubmit = useCallback(
    async (data: Form60FormData) => {
      try {
        if (Object.keys(errors).length > 0) {
          logger.error("Please fix all validation errors before submitting", {
            toast: true,
            pushLog: false,
          });
          return;
        }

        const currentDmsFileData = dmsFileData;

        const dataWithBranchIdentity = {
          ...data,
          branchId: getBranchIdentity, // Use branch identity (UUID) instead of branch code
          docRefId: currentDmsFileData?.fileName || "", // docRefId maps to fileName from DMS
          fileName: currentDmsFileData?.originalFileName || "", // fileName maps to originalFileName
          filePath: currentDmsFileData?.filePath || "", // filePath maps to filePath
        };
        const transformedData = transformFormData(dataWithBranchIdentity);

        const hasExistingForm60 =
          existingForm60 || (storedForm60Id && storedForm60Id !== "0");
        if (hasExistingForm60) {
          await updateForm60({
            customerId: customerIdForApi,
            form60Id: form60Identity ?? "",
            payload: transformedData,
          }).unwrap();

          logger.info("Form 60 updated successfully", {
            toast: true,
            pushLog: false,
          });
        } else {
          const response = await createForm60({
            customerId: customerIdForApi,
            payload: transformedData,
          }).unwrap();

          logger.info("Form 60 created successfully", {
            toast: true,
            pushLog: false,
          });

          logger.info("Form60 Creation Response", { pushLog: false });
          const form60Identity = (response as { identity?: string })?.identity;
          logger.info("Extracted Form60 Identity", { pushLog: false });

          if (form60Identity) {
            dispatch(
              setForm60Identity({
                form60Id: form60Identity,
                customerId: customerIdForApi,
                status: "CREATED",
              })
            );

            sessionStorage.setItem("form60Identity", form60Identity);
            logger.info("Stored in sessionStorage", { pushLog: false });

            setTimeout(() => {
              refetchForm60();
            }, 100); // Small delay to ensure the data is available
          }
        }

        setIsSubmissionSuccessful(true);

        setIsPreviewSuccessful(false);
        setIsDownloadSuccessful(false);

        onFormSubmit?.();
      } catch (error: unknown) {
        const apiError = error as {
          data?: { message?: string };
          message?: string;
        };
        if (apiError?.data?.message) {
          logger.error(apiError.data.message, { toast: true, pushLog: false });
        } else if (apiError?.message) {
          logger.error(apiError.message, { toast: true, pushLog: false });
        } else {
          logger.error("Failed to submit Form 60", {
            toast: true,
            pushLog: false,
          });
        }
      }
    },
    [
      customerIdForApi,
      updateForm60,
      createForm60,
      getBranchIdentity,
      refetchForm60,
      dispatch,
      errors,
      onFormSubmit,
      dmsFileData,
      effectiveForm60Id,
      existingForm60,
      storedForm60Id,
    ]
  );

  return (
    <article>
      <PhotoAndDocumentGallery
        title="Form60"
        fileType="DOC"
        imageUrl={docUrl}
        isOpen={photoGalleryOpen && docUrl !== null}
        onClose={() => setphotoGalleryOpen(false)}
      />
      <Grid className="px-2">
        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <fieldset>
            <Flex>
              <Label variant="title" className="text-blue-950">
                Form 60 Details
              </Label>
            </Flex>

            <Form.Row gap={6}>
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Branch Code"
                  className="text-muted-foreground"
                  required
                  disabled={true}
                  error={errors.branchId}
                >
                  <Input
                    {...register("branchId")}
                    value={customerAllDetails?.branchCode || "BR001"}
                    type="text"
                    placeholder="Loading branch code..."
                    size="form"
                    variant="form"
                    readOnly={true}
                    disabled={true}
                    className="bg-form-disabled"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Customer Name"
                  className="text-muted-foreground"
                  required
                  disabled={true}
                  error={errors.customerName}
                >
                  <Input
                    {...register("customerName")}
                    type="text"
                    placeholder=""
                    size="form"
                    variant="form"
                    className="bg-form-disabled uppercase"
                    readOnly={true}
                    disabled={true}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Date of Birth"
                  required
                  className="text-muted-foreground"
                  disabled={true}
                  error={errors.dateOfBirth}
                >
                  <DatePicker
                    value={dateOfBirth || undefined}
                    onChange={(value: string) => setValue("dateOfBirth", value)}
                    placeholder="dd/mm/yyyy"
                    allowManualEntry={true}
                    disabled={true}
                    variant="form"
                    size="form"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Father's Name"
                  className="text-muted-foreground"
                  required
                  disabled={true}
                  error={errors.fatherName}
                >
                  <Input
                    {...register("fatherName")}
                    type="text"
                    placeholder=""
                    size="form"
                    variant="form"
                    className="bg-form-disabled uppercase"
                    readOnly={true}
                    disabled={true}
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>
          </fieldset>

          <fieldset>
            <Flex className="mb-0.5">
              <Label variant="title" className="text-blue-950">
                Address Information
              </Label>
            </Flex>

            <Form.Row gap={6}>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Flat/room No."
                  className="text-muted-foreground"
                  disabled={true}
                  error={errors.flatRoomNo}
                  required
                >
                  <Input
                    {...register("flatRoomNo")}
                    type="text"
                    placeholder="Enter flat/room number"
                    size="form"
                    variant="form"
                    className="bg-form-disabled uppercase"
                    readOnly={true}
                    disabled={true}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Road/Street/Lane"
                  className="text-muted-foreground"
                  disabled={true}
                  required
                  error={errors.roadStreetLane}
                >
                  <Input
                    {...register("roadStreetLane")}
                    type="text"
                    placeholder="Enter road/street/lane"
                    size="form"
                    variant="form"
                    className="bg-form-disabled uppercase"
                    readOnly={true}
                    disabled={true}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Area/Locality"
                  className="text-muted-foreground"
                  disabled={true}
                  required
                  error={errors.areaLocality}
                >
                  <Input
                    {...register("areaLocality")}
                    type="text"
                    placeholder="Enter area/locality"
                    size="form"
                    variant="form"
                    className="bg-form-disabled uppercase"
                    readOnly={true}
                    disabled={true}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Town/City"
                  className="text-muted-foreground"
                  disabled={true}
                  required
                  error={errors.townCity}
                >
                  <Input
                    {...register("townCity")}
                    type="text"
                    placeholder="Enter town/city"
                    size="form"
                    variant="form"
                    className="bg-form-disabled uppercase"
                    readOnly={true}
                    disabled={true}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="District"
                  className="text-muted-foreground"
                  disabled={true}
                  required
                  error={errors.district}
                >
                  <Input
                    {...register("district")}
                    type="text"
                    placeholder="Enter district"
                    size="form"
                    variant="form"
                    className="bg-form-disabled uppercase"
                    readOnly={true}
                    disabled={true}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="State"
                  className="text-muted-foreground"
                  disabled={true}
                  required
                  error={errors.state}
                >
                  <Input
                    {...register("state")}
                    type="text"
                    placeholder="Enter state"
                    size="form"
                    variant="form"
                    className="bg-form-disabled uppercase"
                    readOnly={true}
                    disabled={true}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="PIN Code"
                  className="text-muted-foreground"
                  disabled={true}
                  required
                  error={errors.pinCode}
                >
                  <Input
                    {...register("pinCode")}
                    type="text"
                    placeholder="e.g. 600001"
                    size="form"
                    variant="form"
                    className="bg-form-disabled"
                    readOnly={true}
                    disabled={true}
                    restriction="numeric"
                    maxLength={6}
                  />
                </Form.Field>
              </Form.Col>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Mobile Number"
                  className="text-muted-foreground"
                  disabled={true}
                  required
                  error={errors.mobileNumber}
                >
                  <Controller
                    name="mobileNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter mobile number"
                        size="form"
                        variant="form"
                        className="bg-form-disabled"
                        readOnly={true}
                        disabled={true}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Aadhar Number "
                  className="text-muted-foreground"
                  disabled={true}
                  error={errors.maskedAdhar}
                >
                  <Controller
                    name="maskedAdhar"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Aadhar Number "
                        size="form"
                        variant="form"
                        className="bg-form-disabled"
                        readOnly={true}
                        disabled={true}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>
          </fieldset>

          <fieldset>
            <Flex className="mb-0.5">
              <Label variant="title" className="text-blue-950">
                Income Details
              </Label>
            </Flex>

            <Form.Row gap={6}>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Source of Income"
                  required
                  disabled={true}
                  error={errors.sourceOfIncome}
                >
                  <Controller
                    name="sourceOfIncome"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select"
                        size="form"
                        variant="form"
                        fullWidth
                        disabled={true}
                        className="bg-form-disabled"
                        // options={transformedSourceOfIncomeOptions}
                        options={transformedSourceOfIncomeOptions}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label={incomeFieldLabel}
                  disabled={true}
                  className="text-muted-foreground"
                  error={errors?.[incomeFieldName]}
                >
                  <Input
                    {...register(incomeFieldName, {
                      setValueAs: value => parseFloat(value) || 0,
                    })}
                    type="text"
                    placeholder={`Enter ${incomeFieldLabel.replace(" (Rs.)", "").toLowerCase()}`}
                    size="form"
                    variant="form"
                    readOnly={readonly}
                    disabled={true}
                    restriction="numeric"
                    className="bg-form-disabled"
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>
          </fieldset>

          <fieldset>
            <Flex className="mb-0.5">
              <Label variant="title" className="text-blue-950">
                Additional Details
              </Label>
            </Flex>

            <Form.Row gap={6}>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Mode of transaction"
                  error={errors.modeOfTransaction}
                >
                  <Controller
                    name="modeOfTransaction"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={readonly}
                        placeholder="Select"
                        size="form"
                        variant="form"
                        fullWidth
                        options={[
                          { value: "BANK", label: "Bank" },
                          { value: "CASH", label: "Cash" },
                          { value: "ONLINE", label: "Online" },
                        ]}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Amount of transaction"
                  required
                  error={errors.transactionAmount}
                >
                  <Input
                    {...register("transactionAmount", {
                      setValueAs: value => parseFloat(value) || 0,
                    })}
                    type="text"
                    placeholder="Enter transaction amount"
                    size="form"
                    variant="form"
                    readOnly={readonly}
                    disabled={isSubmitting}
                    restriction="numeric"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Date of Transaction"
                  className="text-muted-foreground"
                  disabled={true}
                  required
                  error={errors.transactionDate}
                >
                  <DatePicker
                    value={transactionDate || undefined}
                    onChange={(value: string) =>
                      setValue("transactionDate", value)
                    }
                    placeholder="dd/mm/yyyy"
                    allowManualEntry={true}
                    disabled={true}
                    variant="form"
                    size="form"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Number of persons involved in transaction"
                  error={errors.numberOfPersons}
                >
                  <Input
                    {...register("numberOfPersons", {
                      setValueAs: value => parseInt(value) || 1,
                    })}
                    type="text"
                    placeholder="Enter number of persons involved"
                    size="form"
                    variant="form"
                    readOnly={readonly}
                    disabled={isSubmitting}
                    restriction="numeric"
                    maxLength={2}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Income chargeable to tax (Rs.)"
                  error={errors.taxableIncome}
                >
                  <Input
                    {...register("taxableIncome", {
                      setValueAs: value => parseFloat(value) || 0,
                    })}
                    type="text"
                    placeholder="Enter taxable income amount"
                    size="form"
                    variant="form"
                    readOnly={readonly}
                    disabled={isSubmitting}
                    restriction="numeric"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="PAN Card Application Date"
                  error={errors.panCardApplicationDate}
                >
                  <DatePicker
                    value={panCardApplicationDate || undefined}
                    onChange={(value: string) =>
                      setValue("panCardApplicationDate", value)
                    }
                    placeholder="dd/mm/yyyy"
                    allowManualEntry={true}
                    disabled={readonly}
                    variant="form"
                    size="form"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={12} span={12}>
                <Form.Field
                  label="PAN Card Application Acknowledgment"
                  error={errors.panCardApplicationAckNo}
                >
                  <Input
                    {...register("panCardApplicationAckNo")}
                    type="text"
                    placeholder="Enter PAN acknowledgment number"
                    size="form"
                    variant="form"
                    readOnly={readonly}
                    disabled={isSubmitting}
                    restriction="alphanumeric"
                    className="uppercase"
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>
          </fieldset>

          <fieldset>
            <Flex className="mb-0.5">
              <Label variant="title" className="text-blue-950">
                Identity Support Document
              </Label>
            </Flex>

            <Form.Row gap={6}>
              <Form.Col lg={4} md={6} span={12}>
                <Form.Field
                  label="Document Code for Identity Support"
                  error={errors.pidDocumentCode}
                >
                  <Controller
                    name="pidDocumentCode"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        // onValueChange={field.onChange}
                        onValueChange={handlePidDocumentCodeChange}
                        disabled={readonly}
                        placeholder="Select"
                        size="form"
                        variant="form"
                        fullWidth
                        options={filteredDocumentTypes.map(docType => ({
                          value: docType.code,
                          label: docType.displayName,
                        }))}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={4} md={6} span={12}>
                <Form.Field
                  label="Document Number for Identity Support"
                  error={errors.pidDocumentNo}
                >
                  <Controller
                    name="pidDocumentNo"
                    control={control}
                    rules={{
                      validate: value => {
                        const code = (
                          watchedPidDocumentCode || ""
                        ).toUpperCase();
                        if (!value) return true;
                        if (code === "PAN") {
                          return (
                            isPanFormatValid(value) ||
                            "Invalid PAN format (e.g., ABCDE1234F)"
                          );
                        }
                        if (code === "ADH") {
                          return (
                            /^(\d{12})$/.test(value) ||
                            "Aadhaar must be 12 digits"
                          );
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <MaskedInput
                        value={field.value || ""}
                        onChange={val => {
                          const sanitized = sanitizeByCode(
                            watchedPidDocumentCode,
                            val
                          );
                          field.onChange(sanitized);
                        }}
                        placeholder="Enter identity document number"
                        size="form"
                        variant="form"
                        className="uppercase"
                        disabled={readonly}
                        maxLength={getMaxLengthForCode(watchedPidDocumentCode)}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={4} md={12} span={12}>
                <Form.Field
                  error={errors.pidIssuingAuthority}
                  label="Name and Address of the Authority Issuing the Document (Identity)"
                >
                  <Controller
                    name="pidIssuingAuthority"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Enter authority name and address"
                        rows={3}
                        size="form"
                        variant="form"
                        readOnly={readonly}
                        className="text-[10px] placeholder:text-xs"
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>
          </fieldset>

          <fieldset>
            <Flex className="mb-0.5">
              <Label variant="title" className="text-blue-950">
                Address Support Document
              </Label>
            </Flex>

            <Form.Row gap={6}>
              <Form.Col lg={4} md={6} span={12}>
                <Form.Field
                  label="Document Code for Address Support"
                  error={errors.addDocumentCode}
                >
                  <Controller
                    name="addDocumentCode"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={handleAddDocumentCodeChange}
                        disabled={readonly}
                        placeholder="Select"
                        size="form"
                        variant="form"
                        fullWidth
                        options={filteredDocumentTypes.map(docType => ({
                          value: docType.code,
                          label: docType.displayName,
                        }))}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={4} md={6} span={12}>
                <Form.Field
                  label="Document Number for Address Support"
                  error={errors.addDocumentNo}
                >
                  <Controller
                    name="addDocumentNo"
                    control={control}
                    rules={{
                      validate: value => {
                        const code = (
                          watchedAddDocumentCode || ""
                        ).toUpperCase();
                        if (!value) return true;
                        if (code === "PAN") {
                          return (
                            isPanFormatValid(value) ||
                            "Invalid PAN format (e.g., ABCDE1234F)"
                          );
                        }
                        if (code === "ADH") {
                          return (
                            /^(\d{12})$/.test(value) ||
                            "Aadhaar must be 12 digits"
                          );
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <MaskedInput
                        value={field.value || ""}
                        onChange={val => {
                          const sanitized = sanitizeByCode(
                            watchedAddDocumentCode,
                            val
                          );
                          field.onChange(sanitized);
                        }}
                        placeholder="Enter address document number"
                        size="form"
                        variant="form"
                        className="uppercase"
                        disabled={readonly}
                        maxLength={getMaxLengthForCode(watchedAddDocumentCode)}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={4} md={12} span={12}>
                <Form.Field
                  error={errors.addIssuingAuthority}
                  label="Name and Address of the Authority Issuing the Document (Address)"
                >
                  <Controller
                    name="addIssuingAuthority"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Enter authority name and address"
                        rows={3}
                        size="form"
                        variant="form"
                        readOnly={readonly}
                        className="text-[10px] placeholder:text-xs"
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>
          </fieldset>

          <div className="mt-0.5">
            <Flex justify="end" gap={2}>
              {/* Save/Update button */}
              {!readonly && (
                <NeumorphicButton
                  type="submit"
                  variant="default"
                  size="default"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
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
                      Save Form 60
                    </>
                  )}
                </NeumorphicButton>
              )}
            </Flex>
          </div>
        </Form>

        {effectiveForm60Id && (
          <div className="bg-panel-light mt-2 mb-2 rounded-[10px] p-4 sm:p-6">
            <Flex
              justify="between"
              align="center"
              direction="col"
              gap={4}
              className="sm:flex-row sm:gap-0"
            >
              <Label className="text-muted-dark text-center text-sm leading-[23px] sm:text-left">
                Check and update Form 60 Details
              </Label>
              <Flex gap={2} className="w-auto  flex-wrap gap-2">
                <NeumorphicButton
                  type="submit"
                  variant="default"
                  size="default"
                  onClick={handlePreviewForm60}
                  disabled={isPreviewingForm60}
                  className="bg-button-primary-dark text-white disabled:opacity-50"
                >
                  {isPreviewingForm60 ? (
                    <div className="flex items-center gap-2">
                      <Spinner variant="default" size={16} />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <>
                      <Eye className="mr-2 h-[14.37px] w-[14.37px]" />
                      <span className="hidden sm:inline">Preview Form 60</span>
                      <span className="sm:hidden">Preview</span>
                    </>
                  )}
                </NeumorphicButton>
                <NeumorphicButton
                  type="submit"
                  variant="default"
                  size="default"
                  onClick={handleDownloadForm60}
                  disabled={isDownloadingForm60 || !isPreviewSuccessful}
                  className="bg-button-secondary-muted disabled:opacity-50"
                >
                  {isDownloadingForm60 ? (
                    <div className="flex items-center gap-2">
                      <Spinner variant="default" size={16} />
                      <span>Downloading...</span>
                    </div>
                  ) : (
                    <>
                      <Download width={12} />
                      <span>Download</span>
                    </>
                  )}
                </NeumorphicButton>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
                    disabled={
                      isUploadingForm60 ||
                      isDMSUploading ||
                      !isDownloadSuccessful
                    }
                  />
                  <NeumorphicButton
                    variant="default"
                    size="default"
                    disabled={
                      isUploadingForm60 ||
                      isDMSUploading ||
                      !isDownloadSuccessful
                    }
                  >
                    {isUploadingForm60 || isDMSUploading ? (
                      <div className="flex items-center gap-2">
                        <Spinner variant="default" size={12} />
                        <span>
                          {isDMSUploading
                            ? "Uploading to DMS..."
                            : "Uploading..."}
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload width={12} />
                        <span className="hidden sm:inline">
                          Upload Form 60 with Customer Signature
                        </span>
                        <span className="sm:hidden">Upload</span>
                      </>
                    )}
                  </NeumorphicButton>
                </div>
              </Flex>
            </Flex>
          </div>
        )}
      </Grid>
    </article>
  );
};
