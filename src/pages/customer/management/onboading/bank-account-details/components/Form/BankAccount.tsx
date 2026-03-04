import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller, useWatch, type Resolver } from "react-hook-form";
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
  Spinner,
} from "@/components";
import { useAppDispatch } from "@/hooks/store";
import { useDMSFileUpload } from "@/hooks/useDMSFileUpload";
import { setIsReady } from "@/global/reducers/customer/bank.reducer";
import { logger } from "@/global/service/logger";
import type {
  BankAccountFormData,
  BankAccountFormProps,
  CreateBankAccountRequest,
  DuplicateAccountError,
} from "@/types/customer/bank.types";
import { bankAccountValidationSchema } from "@/global/validation/customer/bankAccount-schema";
import { transformFormData } from "@/global/validation/customer/bankAccount-schema";
import {
  useCreateBankAccountMutation,
  useVerifyBankAccountMutation,
  useVerifyUpiIdMutation,
  useLazyGetIfscDetailsQuery,
  useGetAccountTypesQuery,
  useGetAccountStatusesQuery,
  useGetBankAccountsQuery,
  useLazyCheckDuplicateBankAccountQuery,
} from "@/global/service";
import { ConfirmationModal, TitleHeader } from "@/components/ui";
import { PlusCircle, RefreshCw, XCircle } from "lucide-react";
import { MaskedInput } from "@/components/ui/masked-input";
import { FormContainer } from "@/components/ui/form-container";
import { DEFAULT_FORM_VALUES } from "../../constants";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import VerificationStatus from "@/components/ui/verification-status/verification-status";
import { useFormDirtyState } from "@/hooks/useFormDirtyState";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const BankAccountDetailsForm: React.FC<
  BankAccountFormProps & {
    onFormSubmit?: () => void;
    isView?: boolean;
  }
> = ({
  readonly = false,
  onSuccess,
  customerIdentity,
  onFormSubmit,
  isView = false,
  handleSetConfirmationModalData,
  confirmationModalData,
}) => {
  const dispatch = useAppDispatch();
  const [createBankAccount, { isLoading, reset: resetCreateBankAccount }] =
    useCreateBankAccountMutation();

  // File upload and UI state moved to useForm
  const [, setIfscVerified] = useState(false);
  const { handleUpdateFormDirtyState, handleResetFormDirtyState } =
    useFormDirtyState({
      isView,
    });
  const [
    verifyBankAccount,
    {
      data: bankVerificationData,
      isLoading: isBankVerifying,
      reset: resetBankVerification,
    },
  ] = useVerifyBankAccountMutation();

  const [
    verifyUpiId,
    {
      data: upiVerificationData,
      isLoading: isUpiVerifying,
      reset: resetUpiVerification,
    },
  ] = useVerifyUpiIdMutation();
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const accountVerified = bankVerificationData?.isVerified ?? null;
  const upiVerified = upiVerificationData?.isVerified ?? false;
  const verifiedAccountHolderName = bankVerificationData?.accountHolderName;

  const [getIFSCDetails, { isLoading: isIFSCLoading }] =
    useLazyGetIfscDetailsQuery();

  const { data: accountTypeOptions = [] } = useGetAccountTypesQuery();

  const { data: accountStatusOptions = [] } = useGetAccountStatusesQuery();

  // Get refetch function for bank accounts to trigger table refresh
  const { data: bankAccounts = [], refetch: refetchBankAccounts } =
    useGetBankAccountsQuery(customerIdentity || "", {
      skip: !customerIdentity,
    });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isDirty, dirtyFields, touchedFields },
  } = useForm<BankAccountFormData>({
    resolver: yupResolver(
      bankAccountValidationSchema
    ) as Resolver<BankAccountFormData>,
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: transformFormData(DEFAULT_FORM_VALUES),
  });
  const userTouched = Object.keys(touchedFields || {}).length > 0;
  useEffect(() => {
    const hasDirtyValues = Object.keys(dirtyFields || {}).length > 0;
    if ((isDirty && hasDirtyValues && userTouched) || selectedFileName) {
      handleUpdateFormDirtyState();
    } else {
      handleResetFormDirtyState();
    }
  }, [isDirty, dirtyFields, userTouched, selectedFileName]);
  useEffect(() => {
    if (accountVerified === null) return;
    setValue("pdStatus", accountVerified ? "VERIFIED" : "PENDING", {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [accountVerified]);
  const watchedValues = useWatch({
    name: [
      "ifsc",
      "accountNumber",
      "dmsFileData",
      "upiId",
      "bankName",
      "branchName",
    ],
    control,
  });

  const [
    watchedIfsc,
    watchedAccountNumber,
    dmsFileData,
    watchedUpiId,
    watchedBankName,
    watchedBranch,
  ] = watchedValues;

  // Local state for file selection
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // DMS File Upload Hook
  const { uploadFile } = useDMSFileUpload({
    module: "customer-onboarding",
    referenceId: customerIdentity || "",
    documentCategory: "bank-documents",
    documentType: "bank-proof",
    onSuccess: fileData => {
      setValue("dmsFileData", fileData);
      // logger.info("Bank document uploaded successfully", { toast: true });
    },
    onError: error => {
      logger.error(`Bank document upload failed: ${error}`, { toast: true });
    },
  });

  const handleIFSCSearch = useCallback(async () => {
    if (!watchedIfsc || watchedIfsc.length < 11) {
      logger.error("Please enter a valid 11-character IFSC code", {
        toast: true,
      });
      return;
    }
    try {
      const result = await getIFSCDetails(watchedIfsc.toUpperCase()).unwrap();
      if (result && result.isActive) {
        setValue("bankName", result.bankName, { shouldValidate: true });
        setValue("branchName", result.branchName, { shouldValidate: true });
        setIfscVerified(true);
        logger.info("IFSC details fetched successfully", { toast: true });
      } else {
        logger.error("IFSC code is not active or invalid", { toast: true });
        setIfscVerified(false);
        setValue("bankName", "");
        setValue("branchName", "");
      }
    } catch (error) {
      // Check if it's a 404 error (IFSC not found)
      const errorObj = error as Record<string, unknown>;
      if (errorObj?.status && errorObj.status === 404) {
        logger.error(
          "IFSC code not found. Please verify the code and try again.",
          {
            toast: true,
          }
        );
      } else {
        logger.error("Failed to fetch IFSC details. Please try again.", {
          toast: true,
        });
      }
      setIfscVerified(false);
      setValue("bankName", "");
      setValue("branchName", "");
    }
  }, [watchedIfsc, getIFSCDetails, setValue]);

  const handleAccountVerification = useCallback(async () => {
    if (!watchedAccountNumber || !watchedIfsc) return;

    try {
      const result = await verifyBankAccount({
        accountNumber: watchedAccountNumber,
        ifsc: watchedIfsc,
      }).unwrap();

      // Check the response status and handle accordingly
      if (result.isVerified) {
        // Show success message for successful verification
        logger.info(result.message || "Account verified successfully", {
          toast: true,
        });
      } else {
        // Show error message for failed verification
        logger.error(result.message || "Account verification failed", {
          toast: true,
        });
      }
    } catch (error) {
      logger.error(error, { toast: true });
    }
  }, [watchedAccountNumber, watchedIfsc, verifyBankAccount]);
  const handleUpiVerification = useCallback(async () => {
    if (!watchedUpiId) return;

    try {
      const result = await verifyUpiId({
        upiId: watchedUpiId,
      }).unwrap();
      // Check the response status and handle accordingly
      if (!result.isVerified) {
        // Show error message for failed verification
        logger.error(result.message || "UPI verification failed", {
          toast: true,
        });
      } else if (result.isVerified) {
        // Show success message for successful verification
        logger.info(result.message || "UPI verified successfully", {
          toast: true,
        });
      } else {
        // Handle other statuses or fallback
        logger.info(result.message || "UPI verification completed", {
          toast: true,
        });
      }
    } catch (error) {
      logger.error(error, { toast: true });
    }
  }, [watchedUpiId, verifyUpiId]);

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validate file size (1MB limit)
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 1) {
        logger.error("File size must be less than 1MB", { toast: true });
        return;
      }

      setValue("documentFile", file, { shouldValidate: true });
      setSelectedFileName(file.name);
      setSelectedFile(file);
    },
    [setValue]
  );

  // Reset verification data when account details change
  // Note: Removed this effect as it was clearing successful verification data
  // React.useEffect(() => {
  //   if (bankVerificationData) {
  //     resetBankVerification();
  //   }
  // }, [
  //   watchedAccountNumber,
  //   watchedIfsc,
  //   resetBankVerification,
  //   bankVerificationData,
  // ]);

  // Reset UPI verification data when UPI ID changes
  // React.useEffect(() => {
  //   if (upiVerificationData) {
  //     resetUpiVerification();
  //   }
  // }, [watchedUpiId, resetUpiVerification, upiVerificationData]);

  React.useEffect(() => {
    setIfscVerified(false);
  }, [watchedIfsc]);

  // Error handling utility function
  const getErrorMessage = useCallback((error: unknown): string => {
    if (!error) return "An unknown error occurred";

    const errorObj = error as Record<string, unknown>;

    // Check if it's a serialized error
    if (errorObj?.name === "SerializedError") {
      return "Network connection failed. Please check your internet connection.";
    }

    // Check if it's an axios error with data
    if (errorObj?.data) {
      const data = errorObj.data as Record<string, unknown>;
      if (data?.message) {
        return String(data.message);
      }
    }

    // Check if it's an axios error with status
    if (typeof errorObj?.status === "number") {
      const status = errorObj.status as number;
      if (status >= 500) {
        return "Server error. Please try again later.";
      }
      if (status === 401) {
        return "Authentication failed. Please log in again.";
      }
      if (status === 403) {
        return "You don't have permission to perform this action.";
      }
      if (status === 404) {
        return "The requested resource was not found.";
      }
      if (status === 422) {
        return "Invalid data provided. Please check your input.";
      }
    }

    // Network errors
    if (errorObj?.status === "FETCH_ERROR") {
      return "Network connection failed. Please check your internet connection.";
    }

    // Default error message
    const message = errorObj?.message as string;
    return message || "An unexpected error occurred. Please try again.";
  }, []);
  const [triggerDuplicateCheck] = useLazyCheckDuplicateBankAccountQuery();
  const [continueToSubmit, setContinueToSubmit] = useState(false);
  const [showDuplicateAccountWarning, setShowDuplicateAccountWarning] =
    useState(false);

  const onSubmit = useCallback(
    async (data: BankAccountFormData) => {
      try {
        // Validate customer identity
        if (!customerIdentity && !data.customerCode) {
          logger.error("Customer identity is required", { toast: true });
          return;
        }

        // Ensure we have a valid customer ID
        const validCustomerId = data.customerCode || customerIdentity;
        if (!validCustomerId) {
          logger.error("Valid customer identity is required", { toast: true });
          return;
        }

        // Upload file to DMS first if file exists
        let currentDmsFileData = dmsFileData;
        if (data.documentFile instanceof File && !dmsFileData) {
          logger.info("Uploading bank document to DMS...", { toast: false });
          currentDmsFileData = await uploadFile(data.documentFile);

          if (!currentDmsFileData) {
            logger.error("Failed to upload bank document to DMS", {
              toast: true,
            });
            return;
          }
          setValue("dmsFileData", currentDmsFileData);
        }

        const payload: CreateBankAccountRequest = {
          bankName: data.bankName,
          ifscCode: data.ifsc,
          accountNumber: data.accountNumber,
          upiId: data.upiId?.toUpperCase() || undefined,
          accountType: data.accountType,
          accountStatus: data.accountStatus,
          accountHolderName: data.accountHolderName?.toUpperCase(),
          branchName: data.branchName,
          isActive: bankAccounts.length === 0 ? true : data.activeStatus,
          isPrimary: bankAccounts.length === 0 ? true : data.isPrimary,
          upiVerified: upiVerified || false,
          pdStatus: data.pdStatus || null,
          pdTxnId: accountVerified ? `TXN${Date.now()}` : undefined,
          // createdBy: 1001,
          // updatedBy: 1001,
          customerCode: validCustomerId,
          // Add DMS file metadata if available
          ...(currentDmsFileData && {
            bankProofDocumentRefId:
              parseInt(currentDmsFileData.fileName.replace(/[^\d]/g, "")) ||
              undefined,
            bankProofFilePath: currentDmsFileData.filePath,
            // fileName: currentDmsFileData.originalFileName,
            // fileType: currentDmsFileData.originalFileType,
          }),
        };

        if (!continueToSubmit) {
          try {
            await triggerDuplicateCheck({
              accountNumber: payload.accountNumber,
            }).unwrap();
          } catch (error: DuplicateAccountError | unknown) {
            const err = error as FetchBaseQueryError & {
              data?: DuplicateAccountError;
            };

            if (err.status === 409) {
              setShowDuplicateAccountWarning(true);
              setContinueToSubmit(true);
            }
            return;
          }
        }

        const result = await createBankAccount({
          customerId: validCustomerId,
          payload,
          // Remove file from payload - now using DMS metadata
          // file: data.documentFile instanceof File ? data.documentFile : undefined,
        }).unwrap();
        dispatch(setIsReady(true));
        logger.info("Bank account created successfully", { toast: true });
        reset(transformFormData(DEFAULT_FORM_VALUES));
        setIfscVerified(false);
        resetBankVerification();
        resetUpiVerification();
        resetCreateBankAccount(); // Reset error state
        setValue("dmsFileData", null); // Reset DMS file data
        setSelectedFile(null);
        setSelectedFileName(null);
        setShowDuplicateAccountWarning(false);
        setContinueToSubmit(false);
        // Refetch bank accounts to update the table
        refetchBankAccounts();

        if (onSuccess) {
          onSuccess(result.data);
        }

        // Mark step as completed on successful submission
        onFormSubmit?.();
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        logger.error(errorMessage, { toast: true });
        setShowDuplicateAccountWarning(false);
        setContinueToSubmit(false);
        // Don't reset form on error, let user retry
      }
    },
    [
      createBankAccount,
      dispatch,
      reset,
      onSuccess,
      upiVerified,
      accountVerified,
      resetBankVerification,
      resetUpiVerification,
      resetCreateBankAccount,
      customerIdentity,
      getErrorMessage,
      refetchBankAccounts,
      uploadFile,
      dmsFileData,
      onFormSubmit,
      setValue,
    ]
  );

  const handleReset = useCallback(() => {
    reset(transformFormData(DEFAULT_FORM_VALUES));
    setIfscVerified(false);
    resetBankVerification();
    resetUpiVerification();
    resetCreateBankAccount();
    setValue("dmsFileData", null); // Reset DMS file data
  }, [
    reset,
    resetBankVerification,
    resetUpiVerification,
    resetCreateBankAccount,
    setValue,
  ]);
  useEffect(() => {
    if (
      !confirmationModalData?.doAction ||
      confirmationModalData?.feature !== "RESET"
    ) {
      return;
    }

    handleReset();
  }, [confirmationModalData]);
  const handleCloseDuplicateWarning = () => {
    setShowDuplicateAccountWarning(false);
    setContinueToSubmit(false);
    reset(transformFormData(DEFAULT_FORM_VALUES));
    setIfscVerified(false);
    resetBankVerification();
    resetUpiVerification();
    resetCreateBankAccount();
    setValue("dmsFileData", null);
  };
  const continueToSubmitBank = () => {
    handleSubmit(onSubmit)();
    setShowDuplicateAccountWarning(false);
  };
  // Handle missing customer identity
  if (!customerIdentity) {
    return (
      <article className="bank-account-form-container">
        <FormContainer className="px-2">
          <Flex justify="between" align="center" className="mb-1 w-full">
            <HeaderWrapper>
              <TitleHeader title="Bank Account " />
            </HeaderWrapper>
          </Flex>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-muted-foreground mb-2">
              <XCircle className="h-6 w-6" />
            </div>
            <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
              Customer Identity Required
            </h3>
            <p className="text-muted-foreground text-xs">
              Please provide a customer identity to add bank account details.
            </p>
          </div>
        </FormContainer>
      </article>
    );
  }

  return (
    <article className="bank-account-form-container">
      <FormContainer className="px-2">
        <Flex justify="between" align="center" className="mb-1 w-full">
          <HeaderWrapper>
            <TitleHeader title="Customer Bank Account Details" />
          </HeaderWrapper>
        </Flex>

        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-0.5">
          <ConfirmationModal
            isOpen={showDuplicateAccountWarning}
            onConfirm={continueToSubmitBank}
            title="Duplicate Bank Account"
            message="This account already exists. Continue?"
            confirmText="Continue to submit"
            cancelText="Close"
            onCancel={handleCloseDuplicateWarning}
            type="warning"
            size="compact"
          />
          <Form.Row gap={6}>
            <Form.Col lg={2} md={4} span={12}>
              <Form.Field
                label="Account Number"
                required
                disabled={isLoading || readonly}
                error={errors.accountNumber}
              >
                <Controller
                  name="accountNumber"
                  control={control}
                  render={({ field }) => (
                    <MaskedInput
                      value={field.value}
                      onChange={value => {
                        const numericValue = value.replace(/[^0-9]/g, "");
                        // Limit to maximum 18 digits
                        const limitedValue = numericValue.slice(0, 18);
                        field.onChange(limitedValue);
                      }}
                      placeholder="Enter Account Number"
                      size="form"
                      variant="form"
                      disabled={isLoading || readonly}
                      onBlur={() => field.onBlur()}
                      // onTrigger={() => trigger("verifyAccountNumber")}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={4} span={12}>
              <Form.Field
                label="Verify Account Number"
                required
                disabled={isLoading || readonly}
                error={errors.verifyAccountNumber}
              >
                <Input
                  {...register("verifyAccountNumber")}
                  placeholder="Verify Account Number"
                  size="form"
                  variant="form"
                  disabled={isLoading || readonly}
                  restriction="numeric"
                  maxLength={18}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={4} span={12}>
              <Form.Field label="IFSC" required error={errors.ifsc}>
                <InputWithSearch
                  {...register("ifsc", {
                    onChange: e => {
                      // Remove special characters and keep only alphanumeric
                      const alphanumericValue = e.target.value.replace(
                        /[^A-Za-z0-9]/g,
                        ""
                      );
                      const upperValue = alphanumericValue.toUpperCase();
                      const limitedValue = upperValue.slice(0, 11);
                      setValue("ifsc", limitedValue);
                      setIfscVerified(false);
                    },
                  })}
                  placeholder="Enter IFSC Code"
                  size="form"
                  variant="form"
                  disabled={isLoading || readonly}
                  isSearching={isIFSCLoading}
                  onSearch={handleIFSCSearch}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Bank Name" required error={errors.bankName}>
                <Input
                  {...register("bankName")}
                  placeholder="Bank name"
                  size="form"
                  variant="form"
                  disabled={true}
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Branch Name"
                required
                error={errors.branchName}
              >
                <Input
                  {...register("branchName")}
                  placeholder="Enter Branch Name"
                  size="form"
                  variant="form"
                  disabled={true}
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row gap={6}>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Account Holder Name"
                required
                error={errors.accountHolderName}
              >
                <Input
                  {...register("accountHolderName")}
                  placeholder="Enter Account Holder's Name"
                  size="form"
                  variant="form"
                  disabled={isLoading || readonly}
                  className="uppercase"
                  restriction="alphabetic"
                  maxLength={100}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Account Type"
                required
                error={errors.accountType}
              >
                <Controller
                  name="accountType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      // disabled={isLoading || readonly}
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={accountTypeOptions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={6} span={12}>
              <Form.Field label="UPI ID " error={errors.upiId}>
                <Input
                  {...register("upiId", {
                    onChange: e => {
                      const upiValue = e.target.value.replace(
                        /[^a-zA-Z0-9@._-]/g,
                        ""
                      );
                      setValue("upiId", upiValue);
                    },
                  })}
                  placeholder="eg. username@upi"
                  size="form"
                  variant="form"
                  disabled={isLoading || readonly}
                  className="uppercase"
                  onKeyDown={e => {
                    const char = e.key;

                    const allowedChars = /^[a-zA-Z0-9@._-]$/;

                    const allowedControls = [
                      "Backspace",
                      "Delete",
                      "Tab",
                      "Enter",
                      "ArrowLeft",
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowDown",
                    ];

                    if (
                      !allowedChars.test(char) &&
                      !allowedControls.includes(char)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Account Status"
                required
                error={errors.accountStatus}
              >
                <Controller
                  name="accountStatus"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || readonly}
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={accountStatusOptions}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={4} span={12}>
              <Form.Field
                label="Bank Proof"
                required
                error={errors.documentFile}
              >
                <NeumorphicButton
                  type="button"
                  variant="default"
                  size="default"
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
                  disabled={isLoading || readonly}
                  fullWidth
                >
                  Choose File
                </NeumorphicButton>

                {selectedFileName ? (
                  <div className="text-status-success mt-1 text-[9px]">
                    {selectedFileName} (
                    {selectedFile &&
                      (selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                    MB)
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-1  text-[9px]">
                    Accepted formats: JPG, PNG, JPEG, PDF &nbsp; &nbsp; Max
                    size: 1MB
                  </p>
                )}
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row gap={6}>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Penny Drop Verification"
                required
                error={errors.pdStatus}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <NeumorphicButton
                      type="button"
                      variant="default"
                      size="default"
                      disabled={
                        !watchedAccountNumber ||
                        !watchedIfsc ||
                        !watchedBankName ||
                        !watchedBranch ||
                        isLoading ||
                        readonly ||
                        isBankVerifying ||
                        !!accountVerified
                      }
                      onClick={handleAccountVerification}
                    >
                      {isBankVerifying ? "Verifying..." : "Verify Account"}
                    </NeumorphicButton>

                    {isBankVerifying && (
                      <div className="text-muted-foreground flex items-center">
                        <Spinner variant="default" size={12} className="mr-1" />
                        <span className="text-[10px] font-medium">
                          Verifying...
                        </span>
                      </div>
                    )}

                    {!isBankVerifying && bankVerificationData && (
                      <VerificationStatus verified={accountVerified} />
                    )}
                  </div>

                  {accountVerified && verifiedAccountHolderName && (
                    <p className="text-status-success text-[11px] font-medium">
                      {verifiedAccountHolderName}
                    </p>
                  )}
                </div>
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="UPI ID Verification">
                <div className="flex items-center gap-3 ">
                  <NeumorphicButton
                    type="button"
                    variant="default"
                    size="default"
                    disabled={
                      !watchedUpiId ||
                      isLoading ||
                      readonly ||
                      isUpiVerifying ||
                      upiVerified
                    }
                    onClick={handleUpiVerification}
                  >
                    UPI Verify
                  </NeumorphicButton>
                  {upiVerificationData && (
                    <VerificationStatus
                      labelVerified="Valid!"
                      labelDenied="Invalid!"
                      verified={upiVerified}
                    />
                  )}
                </div>
              </Form.Field>
            </Form.Col>

            <Form.Col lg={1} md={6} span={12}>
              <Flex align="center" gap={2} className="mt-4">
                <Controller
                  name="isPrimary"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isPrimary"
                      checked={bankAccounts.length === 0 ? true : field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading || readonly}
                    />
                  )}
                />
                <Label htmlFor="isPrimary">Primary </Label>
              </Flex>
            </Form.Col>
            <Form.Col lg={1} md={6} span={12} className="mt-4">
              <Flex align="center" gap={2}>
                <Controller
                  name="activeStatus"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="activeStatus"
                      checked={bankAccounts.length === 0 ? true : field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading || readonly}
                    />
                  )}
                />
                <Label htmlFor="activeStatus"> Active</Label>
              </Flex>
            </Form.Col>
          </Form.Row>

          <div className="mt-0.5">
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
                disabled={isLoading || readonly}
              >
                <RefreshCw width={12} />
                Reset
              </NeumorphicButton>
              <NeumorphicButton
                type="submit"
                variant="default"
                size="default"
                disabled={isLoading || readonly || !customerIdentity}
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
                    <PlusCircle width={12} />
                    Add Bank Account
                  </>
                )}
              </NeumorphicButton>
            </Flex.ActionGroup>
          </div>
        </Form>
      </FormContainer>
    </article>
  );
};
