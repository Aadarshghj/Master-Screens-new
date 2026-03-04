import React, { useState, useCallback, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Flex,
  Form,
  Grid,
  HeaderWrapper,
  Input,
  InputWithSearch,
  Label,
  Select,
  Spinner,
  Switch,
  TitleHeader,
} from "@/components";
import { CheckCircle, XCircle, Save } from "lucide-react";
import { logger } from "@/global/service";
import { bankDetailsValidationSchema } from "@/global/validation/firm/firmBankDetails.schema";
import { bankDetailsDefaultValues } from "../../constants/form.constants";
import type { BankDetails, ConfigOption } from "@/types/firm/firm-bankDetails";

// Additional interfaces for API responses
interface AccountTypeItem {
  identity?: string;
  id?: string | number;
  value?: string;
  accountType?: string;
  name?: string;
  label?: string;
}

interface AccountStatusItem {
  identity?: string;
  id?: string | number;
  value?: string;
  name?: string;
  status?: string;
  label?: string;
}

interface IfscResponse {
  bankName?: string;
  branchName?: string;
}

interface BankVerificationResponse {
  status?: string;
  accountStatus?: string;
  message?: string;
  accountHolderName?: string;
  holderName?: string;
  name?: string;
  beneficiaryName?: string;
}

import {
  useGetFirmAccountTypesQuery,
  useGetFirmAccountStatusesQuery,
  useVerifyFirmBankAccountMutation,
  useVerifyFirmUpiIdMutation,
  useLazyGetFirmIfscDataQuery,
} from "@/global/service/end-points/master/firm-master";
import {
  useCreateFirmBankAccountMutation,
  useGetFirmBankAccountsQuery,
} from "@/global/service/end-points/Firm/firmDetails";
import { useAppSelector } from "@/hooks/store";
import { FileUpload } from "@/components/shared/file-upload/FileUpload";
import { toUpperSafe } from "@/utils";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import VerificationStatus from "@/components/ui/verification-status/verification-status";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { useFormDirtyState } from "@/hooks/useFormDirtyState";

interface BankDetailsFormProps {
  readonly?: boolean;
  onFormSubmit?: () => void;
  onSaveSuccess?: () => void;
  firmId?: string;
  customerId?: string;
  hasExistingAccounts?: boolean;
}

export const BankDetailsForm: React.FC<BankDetailsFormProps> = ({
  readonly = false,
  onFormSubmit,
  onSaveSuccess,
  hasExistingAccounts = false,
  customerId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [accountVerified, setAccountVerified] = useState<boolean | null>(null);
  const [verifiedAccountHolderName, setVerifiedAccountHolderName] = useState<
    string | null
  >(null);
  const [upiVerified, setUpiVerified] = useState<boolean | null>(null);
  const [fileUploadKey, setFileUploadKey] = useState(0);
  const [rawAccountNumber, setRawAccountNumber] = useState("");
  const [, setRawVerifyAccountNumber] = useState<string>("");
  const [pennyDropAttempted, setPennyDropAttempted] = useState(false);
  const { handleUpdateFormDirtyState, handleResetFormDirtyState } =
    useFormDirtyState({ isView: false });
  // Live masking function - shows only last 4 digits, masks rest with 'x'
  const maskAccountNumber = (value: string): string => {
    if (!value || value.length <= 4) return value;
    const lastFour = value.slice(-4);
    const maskedPart = "x".repeat(value.length - 4);
    return maskedPart + lastFour;
  };

  // Get customer ID from Redux store
  const customerIdFromStore = useAppSelector(
    state => state.firmOnboarding?.customerId
  );

  // Bank verification mutations
  const [verifyBankAccount, { isLoading: isBankVerifying }] =
    useVerifyFirmBankAccountMutation();

  const [verifyUpiId] = useVerifyFirmUpiIdMutation();
  const [getIfscData] = useLazyGetFirmIfscDataQuery();
  const [createBankAccount] = useCreateFirmBankAccountMutation();

  // Validate customer ID is UUID format
  const isValidUUID = (id: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // Fetch existing bank accounts - use associated person's customer UUID
  const customerIdToUse = customerId || customerIdFromStore;

  // Use customerIdToUse directly since firmData is not available
  const validCustomerId =
    customerIdToUse &&
    customerIdToUse !== "undefined" &&
    customerIdToUse !== "null" &&
    typeof customerIdToUse === "string" &&
    isValidUUID(customerIdToUse)
      ? customerIdToUse
      : null;
  console.log(validCustomerId, "validCustomerId");

  const { refetch: refetchBankAccounts } = useGetFirmBankAccountsQuery(
    validCustomerId || "",
    {
      skip: !validCustomerId || validCustomerId === "undefined",
      refetchOnMountOrArgChange: true,
    }
  );

  const handleIfscSearch = async () => {
    const ifscValue = getValues("ifsc");

    if (ifscValue && ifscValue.length >= 11) {
      try {
        const result = await getIfscData(ifscValue).unwrap();
        const ifscResult = result as IfscResponse;

        setValue("bankName", ifscResult.bankName || "");
        setValue("branchName", ifscResult.branchName || "");
        logger.info("Bank details auto-filled from IFSC", { toast: true });
      } catch {
        logger.error("IFSC code not found", { toast: true });
      }
    } else {
      logger.error("Please enter a valid IFSC code (11 characters)", {
        toast: true,
      });
    }
  };

  // Fetch master data
  const { data: accountTypesData = [] } = useGetFirmAccountTypesQuery();
  const { data: accountStatusesData = [] } = useGetFirmAccountStatusesQuery();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    getValues,
    formState: { errors, dirtyFields, isDirty, touchedFields },
    watch,
  } = useForm<BankDetails>({
    resolver: yupResolver(
      bankDetailsValidationSchema
    ) as unknown as Resolver<BankDetails>,
    mode: "onBlur",
    defaultValues: bankDetailsDefaultValues,
  });

  useEffect(() => {
    if (!hasExistingAccounts) {
      setValue("primary", true);
    }
  }, [hasExistingAccounts, setValue]);

  const accountTypeOptions: ConfigOption[] = (accountTypesData || []).map(
    (item: AccountTypeItem) => ({
      value: item.identity || String(item.id) || item.value || "",
      label: item.accountType || item.name || item.label || "",
    })
  );

  const accountStatusOptions: ConfigOption[] = (accountStatusesData || []).map(
    (item: AccountStatusItem) => ({
      value: item.identity || String(item.id) || item.value || "",
      label: item.name || item.status || item.label || "",
    })
  );

  // Set default values when options are loaded
  React.useEffect(() => {
    if (accountTypeOptions.length > 0 && !getValues("accountType")) {
      setValue("accountType", accountTypeOptions[0].value);
    }
    if (accountStatusOptions.length > 0 && !getValues("accountStatus")) {
      setValue("accountStatus", accountStatusOptions[0].value);
    }
  }, [accountTypeOptions, accountStatusOptions, setValue, getValues]);

  const onSubmit = handleSubmit(async data => {
    try {
      setIsLoading(true);

      // use the customerIdToUse already defined in component scope
      const validCustomerId =
        customerIdToUse &&
        customerIdToUse !== "undefined" &&
        customerIdToUse !== "null" &&
        isValidUUID(customerIdToUse)
          ? customerIdToUse
          : null;

      if (!validCustomerId) {
        logger.error(
          "Valid Customer ID is required. Please complete firm details first.",
          { toast: true }
        );
        return;
      }

      const payload = {
        bankName: data.bankName,
        ifscCode: data.ifsc,
        accountNumber: rawAccountNumber || data.accountNumber,
        upiId: data.upiId || undefined,
        accountType: data.accountType,
        accountStatus: data.accountStatus,
        accountHolderName: data.accountHolderName,
        branchName: data.branchName,
        isActive: data.active !== true,
        isPrimary: data.primary || false,
        upiVerified: upiVerified || false,
        pdStatus: accountVerified ? "VERIFIED" : "PENDING",
        pdTxnId: accountVerified ? `TXN${Date.now()}` : undefined,
        customerCode: validCustomerId,
        ...(data.bankProof && {
          bankProofDocumentRefId:
            parseInt(`${Date.now()}`.replace(/[^\d]/g, "")) || undefined,
          bankProofFilePath: `CUSTOMERS/2025/11/13/ACCOUNT/${Date.now()}-proof.pdf`,
        }),
      };

      // await the mutation
      await createBankAccount({
        customerId: validCustomerId,
        bankData: payload,
      }).unwrap();

      logger.info("Bank details saved successfully", { toast: true });

      // Reset form state
      reset(bankDetailsDefaultValues);
      setAccountVerified(null);
      setVerifiedAccountHolderName(null);
      setUpiVerified(null);
      setFileUploadKey(prev => prev + 1);
      setRawAccountNumber("");
      setRawVerifyAccountNumber("");
      setPennyDropAttempted(false);

      // Refetch to refresh
      try {
        await refetchBankAccounts();
      } catch (refetchError) {
        console.error("Refetch error:", refetchError);
      }

      if (onSaveSuccess) {
        onSaveSuccess();
      }

      if (onFormSubmit) {
        onFormSubmit();
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to save bank details";

      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as FetchBaseQueryError;

        if (err.data && typeof err.data === "object" && "message" in err.data) {
          errorMessage = String((err.data as { message?: string })?.message);
        }
      }

      logger.error(errorMessage, { toast: true });
    } finally {
      setIsLoading(false);
    }
  });

  const handleFileSelect = useCallback(
    (file: File) => {
      setValue("bankProof", file, { shouldValidate: true });
    },
    [setValue]
  );

  const handlePennyDropVerification = async () => {
    setPennyDropAttempted(true);
    try {
      setIsLoading(true);
      const formValues = getValues();
      const bankData = {
        accountNumber: rawAccountNumber,
        ifsc: formValues.ifsc,
      };

      const result = (await verifyBankAccount(
        bankData
      ).unwrap()) as BankVerificationResponse;

      // Handle response like customer
      if (result.status === "success" && result.accountStatus === "valid") {
        setAccountVerified(true);
        const holderName =
          result.accountHolderName ||
          result.holderName ||
          result.name ||
          result.beneficiaryName ||
          "Account Holder";
        setVerifiedAccountHolderName(holderName);
        logger.info(result.message || "Account verified successfully", {
          toast: true,
        });
      } else {
        setAccountVerified(false);
        setVerifiedAccountHolderName(null);
        logger.error(result.message || "Account verification failed", {
          toast: true,
        });
      }
    } catch (error: unknown) {
      setAccountVerified(false);
      setVerifiedAccountHolderName(null);

      // Handle specific error cases
      const errorData = (
        error as {
          data?: { status?: string; message?: string };
          status?: number;
        }
      )?.data;
      if (
        (error as { status?: number })?.status === 503 ||
        errorData?.status === "unavailable"
      ) {
        logger.error(
          "Verification service is temporarily unavailable. Please try again later.",
          { toast: true }
        );
      } else {
        const errorMessage =
          errorData?.message || "Account verification failed";
        logger.error(errorMessage, { toast: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpiVerification = async () => {
    try {
      setIsLoading(true);
      const formValues = getValues();

      if (!formValues.upiId || !formValues.upiId.trim()) {
        logger.error("Please enter a valid UPI ID", { toast: true });
        return;
      }

      const upiData = { upiId: formValues.upiId };

      const result = await verifyUpiId(upiData).unwrap();

      if (result.isVerified) {
        setUpiVerified(true);
        logger.info(result.message || "UPI ID verified successfully", {
          toast: true,
        });
      } else {
        setUpiVerified(false);
        logger.error(result.message || "UPI ID verification failed", {
          toast: true,
        });
      }
    } catch {
      setUpiVerified(false);
      logger.error("UPI ID verification failed", { toast: true });
    } finally {
      setIsLoading(false);
    }
  };

  const watchedUpi = watch("upiId");
  const watchedAccountNumber = watch("accountNumber");
  const watchedVerifyAccountNumber = watch("verifyAccountNumber");

  useEffect(() => {
    setUpiVerified(null);
  }, [watchedUpi]);

  useEffect(() => {
    setAccountVerified(null);
    setPennyDropAttempted(false);
  }, [watchedAccountNumber, watchedVerifyAccountNumber]);

  const watchedValues = useWatch({
    name: ["ifsc", "accountNumber", "upiId", "bankName", "branchName"],
    control,
  });
  const userTouched = Object.keys(touchedFields || {}).length > 0;
  const hasDirtyValues = Object.keys(dirtyFields || {}).length > 0;

  useEffect(() => {
    if (readonly) return;

    if (isDirty && hasDirtyValues && userTouched) {
      handleUpdateFormDirtyState();
    } else {
      handleResetFormDirtyState();
    }
  }, [isDirty, dirtyFields, userTouched, readonly]);

  const [watchedIfsc] = watchedValues;
  return (
    <article>
      <Grid>
        <HeaderWrapper>
          <TitleHeader title="Bank Details" />
        </HeaderWrapper>
        {!validCustomerId ? (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-yellow-800">
              Please complete firm details first to add bank accounts.
            </p>
          </div>
        ) : (
          <Form onSubmit={onSubmit}>
            <Form.Row>
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="Account Number" required>
                  <Flex gap={2}>
                    <Input
                      type="text"
                      placeholder="Enter Account Number"
                      size="form"
                      variant="form"
                      readOnly={readonly}
                      disabled={isLoading}
                      onPaste={e => e.preventDefault()}
                      value={maskAccountNumber(rawAccountNumber)}
                      onChange={e => {
                        const value = e.target.value;
                        // Handle deletion (backspace)
                        if (
                          value.length <
                          maskAccountNumber(rawAccountNumber).length
                        ) {
                          const newLength =
                            rawAccountNumber.length -
                            (maskAccountNumber(rawAccountNumber).length -
                              value.length);
                          const newRawValue = rawAccountNumber.substring(
                            0,
                            Math.max(0, newLength)
                          );
                          setRawAccountNumber(newRawValue);
                          setValue("accountNumber", newRawValue, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                        } else {
                          // Extract only numeric characters that were added
                          const maskedValue =
                            maskAccountNumber(rawAccountNumber);
                          const newChars = value
                            .substring(maskedValue.length)
                            .replace(/[^0-9]/g, "");
                          if (newChars) {
                            const updatedValue = rawAccountNumber + newChars;
                            setRawAccountNumber(updatedValue);
                            setValue("accountNumber", updatedValue, {
                              shouldValidate: true,
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                          }
                        }
                      }}
                    />
                  </Flex>
                  <Form.Error error={errors.accountNumber} />
                </Form.Field>
              </Form.Col>
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="Verify Account Number" required>
                  <Flex gap={2}>
                    <Input
                      {...register("verifyAccountNumber")}
                      type="text"
                      placeholder="Verify Account Number "
                      size="form"
                      variant="form"
                      disabled={isLoading}
                      onPaste={e => e.preventDefault()}
                      readOnly={readonly}
                    />
                  </Flex>
                  <Form.Error error={errors.verifyAccountNumber} />
                </Form.Field>
              </Form.Col>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="IFSC" required>
                  <Flex gap={2}>
                    <InputWithSearch
                      {...register("ifsc", {
                        onChange: e => {
                          const upperValue = e.target.value.toUpperCase();
                          setValue("ifsc", upperValue);
                        },
                      })}
                      type="text"
                      placeholder="Enter IFSC Code"
                      size="form"
                      variant="form"
                      disabled={isLoading}
                      onSearch={handleIfscSearch}
                      restriction="alphanumeric"
                      readOnly={readonly}
                    />
                  </Flex>
                  <Form.Error error={errors.ifsc} />
                </Form.Field>
              </Form.Col>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Bank Name" required>
                  <Flex gap={2}>
                    <Input
                      {...register("bankName")}
                      type="text"
                      placeholder="Auto-filled from IFSC"
                      size="form"
                      variant="form"
                      disabled={true}
                      readOnly={readonly}
                    />
                  </Flex>
                  <Form.Error error={errors.bankName} />
                </Form.Field>
              </Form.Col>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Branch Name" required>
                  <Flex gap={2}>
                    <Input
                      {...register("branchName")}
                      type="text"
                      placeholder="Auto-filled from IFSC"
                      size="form"
                      variant="form"
                      disabled={true}
                      readOnly={true}
                    />
                  </Flex>
                  <Form.Error error={errors.branchName} />
                </Form.Field>
              </Form.Col>
            </Form.Row>
            <Form.Row>
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="Account Holder Name" required>
                  <Flex gap={2}>
                    <Input
                      {...register("accountHolderName", {
                        setValueAs: toUpperSafe,
                      })}
                      type="text"
                      placeholder="Enter Account Holder's Name"
                      size="form"
                      variant="form"
                      disabled={isLoading}
                      restriction="alphabetic"
                      className="uppercase"
                      readOnly={readonly}
                    />
                  </Flex>
                  <Form.Error error={errors.accountHolderName} />
                </Form.Field>
              </Form.Col>
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="Account Type">
                  <Controller
                    name="accountType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                        placeholder="Select Account Type"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={accountTypeOptions}
                      />
                    )}
                  />
                  <Form.Error error={errors.accountType} />
                </Form.Field>
              </Form.Col>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="UPI ID">
                  <Flex gap={2}>
                    <Input
                      {...register("upiId")}
                      type="text"
                      placeholder="eg. username@uoi"
                      size="form"
                      variant="form"
                      disabled={isLoading}
                    />
                  </Flex>
                  <Form.Error error={errors.upiId} />
                </Form.Field>
              </Form.Col>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Account Status" required>
                  <Controller
                    name="accountStatus"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                        placeholder="Select Status"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={accountStatusOptions}
                      />
                    )}
                  />
                  <Form.Error error={errors.accountStatus} />
                </Form.Field>
              </Form.Col>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Bank Proof" required>
                  <FileUpload
                    key={fileUploadKey}
                    onFileSelect={handleFileSelect}
                    disabled={isLoading}
                    returnBase64={false}
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>
            <Form.Row>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Penny Drop Verification" required>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <NeumorphicButton
                        type="button"
                        variant="default"
                        size="default"
                        disabled={
                          !rawAccountNumber ||
                          !watchedIfsc ||
                          isLoading ||
                          readonly ||
                          isBankVerifying
                        }
                        onClick={handlePennyDropVerification}
                      >
                        {isBankVerifying ? "Verifying..." : "Verify Account"}
                      </NeumorphicButton>

                      {isBankVerifying && (
                        <div className="text-muted-foreground flex items-center">
                          <Spinner
                            variant="default"
                            size={12}
                            className="mr-1"
                          />
                          <span className="text-[10px] font-medium">
                            Verifying...
                          </span>
                        </div>
                      )}

                      {!isBankVerifying && accountVerified !== undefined && (
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
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="UPI ID Verification">
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="default"
                      disabled={isLoading || readonly}
                      onClick={handleUpiVerification}
                    >
                      UPI Verify
                    </Button>

                    {upiVerified && (
                      <div
                        className="flex items-center"
                        style={{ color: "#4B7EFE" }}
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        <span className="text-[10px] font-medium">Valid!</span>
                      </div>
                    )}

                    {upiVerified === false && (
                      <div
                        className="flex items-center"
                        style={{ color: "#EF4444" }}
                      >
                        <XCircle className="mr-1 h-3 w-3" />
                        <span className="text-[10px] font-medium">
                          Invalid!
                        </span>
                      </div>
                    )}
                  </div>
                </Form.Field>
              </Form.Col>
              <Form.Col lg={3} md={6} span={12} className="h-full">
                <Flex.ControlGroup className="h-full">
                  <Flex align="center" gap={2}>
                    <Controller
                      name="primary"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="primary"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={
                            readonly || isLoading || !hasExistingAccounts
                          }
                        />
                      )}
                    />
                    <Label htmlFor="primary" className="cursor-pointer">
                      Primary
                    </Label>
                  </Flex>
                  <Flex align="center" gap={2}>
                    <Controller
                      name="active"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="active"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={readonly || isLoading}
                        />
                      )}
                    />
                    <Label htmlFor="active">Active</Label>
                  </Flex>
                </Flex.ControlGroup>
              </Form.Col>
            </Form.Row>

            {/* Form Actions */}
            <div className="mt-8">
              <Flex.ActionGroup>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    disabled={isLoading || readonly}
                    onClick={() => {
                      reset(bankDetailsDefaultValues);
                      setAccountVerified(null);
                      setVerifiedAccountHolderName(null);
                      setUpiVerified(null);
                      setFileUploadKey(prev => prev + 1);
                      setRawAccountNumber("");
                      setRawVerifyAccountNumber("");
                      setPennyDropAttempted(false);
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    disabled={isLoading || readonly || !pennyDropAttempted}
                  >
                    <Save className="mr-1 h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Bank Details"}
                  </Button>
                </div>
              </Flex.ActionGroup>
            </div>
          </Form>
        )}
      </Grid>
    </article>
  );
};
