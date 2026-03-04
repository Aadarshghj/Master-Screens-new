import { useState, useCallback, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PlusCircle, RotateCcw, CircleCheck } from "lucide-react";
import type { FieldErrors } from "react-hook-form";

import toast from "react-hot-toast";
import {
  Button,
  Input,
  Select,
  Switch,
  Form,
  Grid,
  Flex,
  HeaderWrapper,
  TitleHeader,
  Label,
} from "@/components";
// import { formatDocumentNumber } from "@/utils/form.utils";
import { logger } from "@/global/service";
import {
  firmDocumentSchema,
  type FirmDocumentFormData,
} from "@/global/validation/firm/firmDocument.schema";
import { defaultDocumentValues } from "../../constants/form.constants";
import { FileUpload } from "@/components/shared/file-upload/FileUpload";
import { useGetDocumentTypesUsageForFirmQuery } from "@/global/service/end-points/master/master";
import { useGetFirmByIdQuery } from "@/global/service/end-points/Firm/firmDetails";
import { useDMSFileUpload } from "@/hooks/useDMSFileUpload";
import { useUploadKycDocumentMutation } from "@/global/service/end-points/master/firm-master";
import { useMaskAadharMutation } from "@/global/service/end-points/customer/kyc";
import { useValidateKycMutation } from "@/global/service";
import { validateFile, convertFileToBase64 } from "@/utils/file.utils";
import { validateKYCFile } from "@/utils/kyc-file-validation";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { useAppSelector } from "@/hooks/store";

interface KYCDocumentFormProps {
  firmIdentity?: string;
  customerId?: string;
  onFormSubmit?: () => void;
  onDocumentUploaded?: () => void;
}

export default function KYCDocumentForm({
  customerId,
  onFormSubmit,
  onDocumentUploaded,
}: KYCDocumentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maskedImageUrl, setMaskedImageUrl] = useState("");
  const [loadMasking, setLoadMasking] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isDocumentVerified, setIsDocumentVerified] = useState(false);

  const resetRef = useRef(false);

  // Fetch document types for firm registration
  const { data: documentTypesData = [], isLoading: isLoadingDocumentTypes } =
    useGetDocumentTypesUsageForFirmQuery();

  const [maskAadhar] = useMaskAadharMutation();

  const { uploadFile } = useDMSFileUpload({
    module: "FIRM",
    referenceId: customerId || "",
    documentCategory: "KYC",
    documentType: "KYC_DOCUMENT",
    maskedFile: maskedImageUrl,
    onSuccess: () => {},
  });

  const firmStatus = useAppSelector(state => state.firmOnboarding.firmStatus);

  const [uploadKycDocument] = useUploadKycDocumentMutation();

  // Fetch firm data to get firm type
  const { data: firmData } = useGetFirmByIdQuery(customerId || "", {
    skip: !customerId,
  });

  const documentTypeOptions = documentTypesData.map(item => ({
    value: item.code || item.identity || "",
    label: item.displayName || item.code || item.identity || "",
  }));

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FirmDocumentFormData>({
    resolver: yupResolver(
      firmDocumentSchema
    ) as unknown as Resolver<FirmDocumentFormData>,
    mode: "onBlur",
    defaultValues: {
      ...defaultDocumentValues,
      firmType: firmData?.firmName || "",
    },
  });

  // Update firmType when firmData loads
  useEffect(() => {
    if (firmData?.firmName) {
      setValue("firmType", firmData.firmName);
    }
  }, [firmData, setValue]);

  const watchedDocumentType = watch("documentType");
  const watchedIdNumber = watch("idNumber");

  const isAadhaarType = useCallback((type?: string) => {
    if (!type) return false;
    const t = type.toUpperCase();
    return t === "AADHAAR" || t === "ADH" || t === "ADHAR";
  }, []);
  // const { getValues: rhfGetValues } = {} as any as ReturnType<typeof useForm>;

  const handleFileSelect = useCallback(
    async (file: File) => {
      const toastId = toast.loading("Processing document...");

      try {
        validateFile(file);
        const validationResult = validateKYCFile(file);
        if (!validationResult.isValid) {
          throw new Error(validationResult.errors[0]);
        }

        setValue("documentFile", file, { shouldValidate: true });

        const currentDocType = getValues
          ? getValues("documentType")
          : watchedDocumentType;

        if (isAadhaarType(currentDocType)) {
          setLoadMasking(true);

          const base64String = await convertFileToBase64(file);
          const imageFormat = file.type === "application/pdf" ? "pdf" : "jpeg";

          const maskedResponse = await maskAadhar({
            aadhar_image: base64String,
            image_format: imageFormat,
          }).unwrap();

          if (
            maskedResponse.msg !== "SUCCESS" ||
            !maskedResponse.aadhaar_masked
          ) {
            throw new Error("Aadhaar masking failed");
          }

          let masked = maskedResponse.response_image || "";
          if (typeof masked === "string" && masked.startsWith("data:")) {
            const commaIdx = masked.indexOf(",");
            if (commaIdx >= 0) masked = masked.slice(commaIdx + 1);
          }

          setMaskedImageUrl(masked);
          logger.info("Aadhaar masked image received", { toast: false });
          setLoadMasking(false);

          toast.success("Aadhaar processed successfully", { id: toastId });
          return;
        }

        toast.success("Document processed successfully", { id: toastId });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "File processing failed",
          { id: toastId }
        );
        setValue("documentFile", null);
        setMaskedImageUrl("");
        setLoadMasking(false);
      }
    },
    [setValue, getValues, watchedDocumentType, isAadhaarType, maskAadhar]
  );

  const [validateKyc, { isLoading: isValidatingKyc }] =
    useValidateKycMutation();

  const isPanFormatValid = useCallback(
    (value: string) => {
      if (watchedDocumentType !== "PAN" || !value) return false;
      const cleanValue = value.replace(/[^a-zA-Z0-9]/g, "");
      const panRegex = /^[A-Z]{5}\d{4}[A-Z]$/;
      return panRegex.test(cleanValue.toUpperCase());
    },
    [watchedDocumentType]
  );

  const handleValidateKyc = useCallback(async () => {
    const idNumber = watchedIdNumber?.trim();

    if (!idNumber) {
      toast.error("Please enter a valid ID number");
      return;
    }

    if (watchedDocumentType === "PAN" && !isPanFormatValid(idNumber)) {
      toast.error("Please enter a valid PAN number (format: AAAAANNNNA)");
      return;
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
      const response = await validateKyc({
        idNumber,
        kycId,
      }).unwrap();

      logger.info(
        `Firm KYC Validation Response for ${watchedDocumentType}: ${JSON.stringify(
          response
        )}`,
        { toast: false }
      );

      const isSuccess =
        (response.kycStatus === "SUCCESS" && response.status === "SUCCESS") ||
        response.success === true ||
        response.valid === true ||
        response.kycResult?.idStatus === "VALID" ||
        response.kycResult?.idStatus === "ACTIVE";

      if (isSuccess) {
        setIsDocumentVerified(true);
        toast.success(`${watchedDocumentType} verified successfully!`);
      } else {
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

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (apiError?.data?.details) {
        const validationErrors = Object.entries(apiError.data.details)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `Validation failed: ${validationErrors}`;
      } else if (apiError?.data?.message) {
        errorMessage = apiError.data.message;
      } else if (apiError?.data?.errorCode) {
        errorMessage = `${apiError.data.errorCode}: ${
          apiError.data.message || "Request validation failed"
        }`;
      } else if (apiError?.message) {
        errorMessage = apiError.message;
      }

      logger.error(errorMessage, { toast: true });
    }
  }, [watchedIdNumber, watchedDocumentType, isPanFormatValid, validateKyc]);

  const onSubmit = async (data: FirmDocumentFormData) => {
    if (!customerId) {
      logger.error("Customer ID is required", { toast: true });
      return;
    }

    if (!data.documentFile) {
      logger.error("Document file is required", { toast: true });
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload file using DMS hook
      const fileData = await uploadFile(data.documentFile as File);

      if (!fileData) {
        throw new Error("File upload failed");
      }

      // Create masked ID
      const maskedId =
        data.idNumber.length > 4
          ? "X".repeat(data.idNumber.length - 4) + data.idNumber.slice(-4)
          : data.idNumber;

      const selectedDoc = documentTypesData.find(
        item =>
          item.code === data.documentType || item.identity === data.documentType
      );

      if (!selectedDoc?.identity) {
        toast.error("Invalid document type selected");
        logger.error("Invalid document type selected", { toast: true });
        return;
      }

      const documentTypeIdentity = selectedDoc?.identity;

      // Save KYC document metadata
      const documentData = {
        maskedId,
        idType: documentTypeIdentity,
        idNumber: data.idNumber,
        placeOfIssue: "India",
        issuingAuthority: "Govt. of India",
        validFrom: new Date().toISOString().split("T")[0],
        validTo: "2030-12-31",
        isVerified: isDocumentVerified,
        isActive: data.isActive,
        branchId: "5a97dec0-c7e8-4fc2-8ec9-11c9a680479a",
        tenantId: "1563455e-fb89-4049-9cbe-02148017e1e6",
        branchCode: "BR001",
        documentRefId:
          (fileData as { documentRefId?: string })?.documentRefId ||
          `DOC-REF-${Date.now()}`,
        filePath:
          (fileData as { filePath?: string; path?: string })?.filePath ||
          (fileData as { filePath?: string; path?: string })?.path ||
          "",
        fileName:
          (fileData as { fileName?: string })?.fileName ||
          (data.documentFile as File)?.name ||
          "",
        fileType: (data.documentFile as File)?.type || "",
      };

      // Save KYC document to database
      await uploadKycDocument({
        customerId: customerId!,
        documentData,
      }).unwrap();

      logger.info("Document uploaded successfully!", { toast: false });

      // Trigger table refresh
      onDocumentUploaded?.();

      handleReset();
      onFormSubmit?.();
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to upload document";
      logger.error(errorMessage, { toast: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormErrors = <T extends Record<string, unknown>>(
    formErrors: FieldErrors<T>
  ) => {
    try {
      const keys = Object.keys(formErrors || {});
      if (keys.length === 0) return;
      const messages = keys
        .map(k => {
          const err = formErrors[k];
          return err?.message || `${k} is invalid`;
        })
        .join("; ");

      logger.error(`Form validation failed: ${messages}`, { toast: false });
      toast.error(messages || "Form validation failed");
    } catch {
      logger.error("Error while handling form errors", { toast: false });
    }
  };

  const handleReset = useCallback(() => {
    resetRef.current = true;
    reset({
      ...defaultDocumentValues,
      firmType: firmData?.firmName || "",
    });
    setMaskedImageUrl("");
    setLoadMasking(false);
    setIsDocumentVerified(false);
    setResetTrigger(prev => prev + 1);
  }, [firmData?.firmName, reset]);

  const getPlaceholder = () => {
    switch (watchedDocumentType) {
      case "PAN":
        return "ABCDE1234F";
      case "FIRM_PAN":
        return "ABCDE1234F";
      case "ADH":
        return "1234-5678-9012";
      case "DL":
        return "DL-1420110012345";
      case "EID":
        return "ABC1234567";
      case "GST_PROP":
        return "GST123456789";
      default:
        return "Enter ID Number";
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const documentConfigs = {
    PAN: { maxLength: 10, pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ },
    AADHAAR: { maxLength: 12, pattern: /^[2-9][0-9]{11}$/ },
    PASSPORT: { maxLength: 8, pattern: /^[A-Z][0-9]{7}$/ },
    DL: { maxLength: 15, pattern: /^[A-Z]{2}[0-9]{13}$/ },
    "VOTER ID": { maxLength: 10, pattern: /^[A-Z]{3}[0-9]{7}$/ },
  };

  const handleIdNumberChange = useCallback(
    (value: string, onChange: (val: string) => void) => {
      const currentConfig =
        documentConfigs[watchedDocumentType as keyof typeof documentConfigs];

      const maxLength = currentConfig?.maxLength || 20;

      let inputValue = value;

      if (watchedDocumentType === "AADHAAR") {
        const digitsOnly = value.replace(/\D/g, "");
        inputValue = digitsOnly.slice(0, 12);
      } else {
        const cleanValue = value.replace(/[^a-zA-Z0-9]/g, "");
        inputValue = cleanValue.slice(0, maxLength);
      }

      onChange(inputValue);
      setIsDocumentVerified(false);
    },
    [documentConfigs, watchedDocumentType]
  );

  const showVerificationButton =
    watchedDocumentType === "PAN" ||
    watchedDocumentType === "DL" ||
    watchedDocumentType === "VOTER ID";

  const isVerifyButtonEnabled = (() => {
    if (!showVerificationButton) return false;
    if (watchedDocumentType === "PAN") {
      return isPanFormatValid(watchedIdNumber || "");
    }
    return !!watchedIdNumber && watchedIdNumber.trim().length > 0;
  })();

  const isPendingApproval = firmStatus === "PENDING_APPROVAL";

  return (
    <article>
      <Grid className="px-2">
        <Flex justify="between" align="center" className="w-full">
          <HeaderWrapper>
            <TitleHeader title="KYC Document Upload" />
          </HeaderWrapper>
        </Flex>

        <Form
          onSubmit={handleSubmit(onSubmit, handleFormErrors)}
          className="space-y-0.5"
        >
          <Form.Row gap={6}>
            <Form.Col span={12} className="bg-muted/20 p-4">
              <Grid gap={2}>
                <Form.Row gap={6}>
                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="Document Type" required>
                      <Controller
                        name="documentType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value: string) => {
                              field.onChange(value);
                              setValue("idNumber", "");
                              setValue("documentFile", null);
                              setMaskedImageUrl("");
                              setLoadMasking(false);
                              setIsDocumentVerified(false);
                              setResetTrigger(prev => prev + 1);
                            }}
                            options={documentTypeOptions}
                            loading={isLoadingDocumentTypes}
                            placeholder="Select Document Type"
                            disabled={
                              isSubmitting ||
                              isLoadingDocumentTypes ||
                              isPendingApproval
                            }
                            size="form"
                            variant="form"
                            fullWidth={true}
                            itemVariant="form"
                          />
                        )}
                      />
                      <Form.Error
                        error={
                          errors.documentType as unknown as
                            | { type: string; message: string }
                            | undefined
                        }
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="ID Number" required>
                      <Controller
                        name="idNumber"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            placeholder={getPlaceholder()}
                            size="form"
                            variant="form"
                            disabled={isSubmitting || isPendingApproval}
                            className="uppercase"
                            onChange={e => {
                              handleIdNumberChange(
                                e.target.value,
                                field.onChange
                              );
                            }}
                          />
                        )}
                      />

                      <Form.Error
                        error={
                          errors.idNumber as unknown as
                            | { type: string; message: string }
                            | undefined
                        }
                      />
                    </Form.Field>
                  </Form.Col>
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

                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field label="Upload Document Proof" required>
                      <FileUpload
                        onFileSelect={handleFileSelect}
                        disabled={
                          isSubmitting || loadMasking || isPendingApproval
                        }
                        returnBase64={false}
                        resetTrigger={resetTrigger}
                      />
                      {loadMasking && (
                        <p className="text-muted-foreground mt-0.5 text-[9px]">
                          Processing and masking document...
                        </p>
                      )}
                      {!loadMasking && (
                        <p className="text-muted-foreground mt-0.5 text-[9px]">
                          Accepted formats: JPG, PNG, JPEG, PDF &nbsp; &nbsp;
                          Max size: 2MB
                        </p>
                      )}
                      <Form.Error
                        error={
                          errors.documentFile as unknown as
                            | { type: string; message: string }
                            | undefined
                        }
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={1} md={6} span={12} className="h-full">
                    <Flex.ControlGroup className="h-full">
                      <Flex align="center" gap={2} className="mb-7 ml-5">
                        <Controller
                          name="isActive"
                          control={control}
                          render={({ field }) => (
                            <Switch
                              id="isActive"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isSubmitting || isPendingApproval}
                            />
                          )}
                        />
                        <Label htmlFor="isActive">Active</Label>
                      </Flex>
                    </Flex.ControlGroup>
                  </Form.Col>
                </Form.Row>
              </Grid>
            </Form.Col>
          </Form.Row>

          <Flex justify="end" gap={3} className="mt-1">
            <Button
              type="button"
              variant="reset"
              onClick={handleReset}
              disabled={isSubmitting || isPendingApproval}
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting || loadMasking || isPendingApproval}
            >
              <PlusCircle className="h-3 w-3" />
              {isSubmitting ? "Adding..." : "Add Document"}
            </Button>
          </Flex>
        </Form>
      </Grid>
    </article>
  );
}
