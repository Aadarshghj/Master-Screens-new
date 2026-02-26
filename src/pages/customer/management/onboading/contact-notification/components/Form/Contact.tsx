import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  Flex,
  Grid,
  Label,
  Select,
  Switch,
  HeaderWrapper,
  TitleHeader,
} from "@/components";

import {
  PlusCircle,
  Loader2,
  Check,
  RefreshCw,
  Save,
  CircleCheckBig,
} from "lucide-react";
import { OTPInput } from "@/components/ui/otp-field/input-otp";
import { MaskedInput } from "@/components/ui/masked-input";
import { logger } from "@/global/service";
import { toaster } from "@/components";
import {
  useSaveContactMutation,
  useGetContactTypesDetailedQuery,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useUpdateContactMutation,
} from "@/global/service/end-points/customer/contact";
import { contactValidationSchema } from "@/global/validation/customer/contact-validation-schema";
import type {
  ContactFormProps,
  ContactFormData,
  SaveContactRequest,
} from "@/types/customer/contact.types";
import type { APIError } from "@/types/api";
import {
  DEFAULT_CONTACT_VALUES,
  CONTACT_CONFIG,
  getContactPlaceholder,
  calculateTimerFromExpiry,
} from "../../constants/form.contants";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import CapsuleButton from "@/components/ui/capsule-button/capsule-button";
import { useFormDirtyState } from "@/hooks/useFormDirtyState";

const maskMobileNumber = (value: string): string => {
  if (!value || value.length < 4) return value;
  const last4 = value.slice(-4);
  const masked = "*".repeat(value.length - 4);
  return masked + last4;
};

const maskEmail = (value: string): string => {
  if (!value || !value.includes("@")) return value;
  const [localPart, domain] = value.split("@");
  if (localPart.length <= 2) return value;
  const maskedLocal =
    localPart[0] +
    "*".repeat(localPart.length - 2) +
    localPart[localPart.length - 1];
  return `${maskedLocal}@${domain}`;
};

const maskLandline = (value: string): string => {
  if (!value || value.length < 4) return value;
  const last4 = value.slice(-4);
  const masked = "*".repeat(value.length - 4);
  return masked + last4;
};

const getMaskedValue = (contactType: string, value: string): string => {
  switch (contactType?.toLowerCase()) {
    case "mobile":
    case "whatsapp":
      return maskMobileNumber(value);
    case "email":
      return maskEmail(value);
    case "landline":
      return maskLandline(value);
    default:
      return value;
  }
};

export const ContactNotificationForm: React.FC<
  ContactFormProps & {
    customerId?: string;
    onEditComplete?: () => void;
    isView?: boolean;
  }
> = ({
  onFormSubmit,
  initialData = {},
  readonly = false,
  customerId,
  onEditComplete,
  editForm = false,
  onCloseEdit,
  customerIdentity,
  isView = false,
  handleSetConfirmationModalData,
  confirmationModalData,
}) => {
  const {
    data: contactTypesData,
    isFetching: isContactTypesFetching,
    error: contactTypesError,
  } = useGetContactTypesDetailedQuery();
  const { handleUpdateFormDirtyState, handleResetFormDirtyState } =
    useFormDirtyState({
      isView,
    });
  const [saveContact, { isLoading: isSaving, error: saveContactError }] =
    useSaveContactMutation();
  const [updateContact, { isLoading: isUpdating, error: updateContactError }] =
    useUpdateContactMutation();
  const [sendOtp, { isLoading: isSendingOtp, error: sendOtpError }] =
    useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp, error: verifyOtpError }] =
    useVerifyOtpMutation();

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    getValues,
    trigger,
    formState: { errors, isDirty, dirtyFields, touchedFields },
  } = useForm({
    resolver: yupResolver(contactValidationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      ...DEFAULT_CONTACT_VALUES,
      ...initialData,
      isPrimary: Boolean(
        initialData.isPrimary ?? DEFAULT_CONTACT_VALUES.isPrimary
      ),
      isActive: Boolean(
        initialData.isActive ?? DEFAULT_CONTACT_VALUES.isActive
      ),
      isOptOutPromotionalNotification: Boolean(
        initialData.isOptOutPromotionalNotification ??
          DEFAULT_CONTACT_VALUES.isOptOutPromotionalNotification
      ),
    },
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
  const contactDetails = initialData.contactDetails;
  useEffect(() => {
    if (contactDetails) {
      const {
        isActive,
        isOptOutPromotionalNotification,
        isPrimary,
        contactType,
      } = initialData;
      const currentType = contactTypesData?.find(
        item => item.identity === contactType
      );
      setValue("contactType", currentType?.contactType.toLowerCase() ?? "");
      setValue("contactDetails", contactDetails);
      setValue("isActive", isActive);
      setValue(
        "isOptOutPromotionalNotification",
        isOptOutPromotionalNotification
      );
      setValue("isPrimary", isPrimary);
      setValue("contactTypeId", contactType ?? "");
      setEditingContactId(contactType ?? "");
    }
  }, [contactDetails]);

  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpRequestId, setOtpRequestId] = useState<string>("");
  const [timer, setTimer] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [resendCount, setResendCount] = useState<number>(0);
  const [isContactFocused, setIsContactFocused] = useState<boolean>(false);
  const [otpAttemptCount, setOtpAttemptCount] = useState<number>(0);

  const contactType = useWatch({
    control,
    name: "contactType",
    defaultValue: "mobile",
  });

  if (contactTypesError) {
    logger.error(contactTypesError, { toast: false });
  }
  if (saveContactError) {
    logger.error(saveContactError, { toast: false });
  }
  if (updateContactError) {
    logger.error(updateContactError, { toast: false });
  }
  if (sendOtpError) {
    logger.error(sendOtpError, { toast: false });
  }
  if (verifyOtpError) {
    logger.error(verifyOtpError, { toast: false });
  }

  useEffect(() => {
    if (Array.isArray(contactTypesData) && contactType) {
      const selected = contactTypesData.find(
        opt => opt.contactType?.toLowerCase() === contactType.toLowerCase()
      );
      if (selected) {
        setValue("contactTypeId", selected.identity, { shouldValidate: true });
      } else {
        setValue("contactTypeId", "", { shouldValidate: true });
      }
    }
  }, [contactType, contactTypesData, setValue]);
  useEffect(() => {
    if (initialData.contactId) {
      // setEditingContactId(initialData.contactId);
      reset({ ...DEFAULT_CONTACT_VALUES, ...initialData });

      if (initialData.isVerified) {
        setValue("isVerified", true);
      }
    } else {
      setEditingContactId(null);
    }
  }, [initialData, reset, setValue]);

  useEffect(() => {
    if (!editingContactId) {
      setValue("isActive", true);
    }
  }, [editingContactId, setValue]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmitError = useCallback((error: unknown): void => {
    const apiError = error as APIError;

    let errorMessage = "Failed to save contact";

    if (apiError?.data) {
      const errorData = apiError.data;

      if (errorData.details && typeof errorData.details === "object") {
        const detailMessages = Object.entries(errorData.details)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `Validation failed: ${detailMessages}`;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.errors) {
        errorMessage = Object.values(errorData.errors).join(", ");
      }
    } else if (apiError?.message) {
      errorMessage = apiError.message;
    }

    if (errorMessage.toLowerCase().includes("resource already exist")) {
      errorMessage =
        "Contact already exists. Please check if this contact is already added.";
    } else if (errorMessage.toLowerCase().includes("already exist")) {
      errorMessage =
        "This contact is already registered. Please use a different contact or edit the existing one.";
    } else if (
      errorMessage.toLowerCase().includes("active status must be specified")
    ) {
      errorMessage =
        "Please verify the contact by sending and verifying OTP before saving.";
    }

    toaster.error(errorMessage);
  }, []);

  const createSubmissionPayload = useCallback(
    (data: ContactFormData): SaveContactRequest => {
      if (!customerId) {
        throw new Error("Customer ID is required");
      }

      const isContactVerified = Boolean(data.isVerified);

      const payload = {
        customerId,
        ...(editingContactId && { contactId: editingContactId }),
        contactType: data.contactTypeId,
        contactDetails: data.contactDetails,
        isPrimary: Boolean(data.isPrimary),
        isActive: Boolean(data.isActive ?? true),
        isOptOutPromotionalNotification: Boolean(
          data.isOptOutPromotionalNotification
        ),
        isVerified: isContactVerified,
      };
      return payload;
    },
    [customerId, editingContactId]
  );

  const handleAddOrUpdateContact = useCallback(
    async (data: ContactFormData) => {
      try {
        const requiresVerification = ["mobile", "whatsapp"].includes(
          data.contactType?.toLowerCase() || ""
        );
        if (requiresVerification && !data.isVerified && otpAttemptCount < 2) {
          toaster.error(
            "Please verify the contact by sending and verifying OTP before saving."
          );
          return;
        }
        const payload = createSubmissionPayload(data);
        const contactTypeId = getValues().contactTypeId;
        if (editForm && customerIdentity && initialData?.contactIdentity) {
          const updatePayload = {
            contactType: contactTypeId,
            contactDetails: getValues().contactDetails,
            isPrimary: getValues().isPrimary ?? false,
            isActive: getValues().isActive ?? false,
            isVerified: getValues().isVerified ?? false,
            isOptOutPromotionalNotification:
              getValues().isOptOutPromotionalNotification ?? false,
          };
          const response = await updateContact({
            customerId: customerIdentity ?? "",
            contactId: initialData?.contactIdentity ?? "",
            payload: updatePayload,
          }).unwrap();
          onCloseEdit();
          const successMessage =
            response?.message || "Contact updated successfully!";
          toaster.success(successMessage);
          reset({
            ...DEFAULT_CONTACT_VALUES,
            isActive: true,
            contactTypeId: updatePayload.contactType,
          });
          setEditingContactId(null);

          onFormSubmit?.(data);
          onEditComplete?.();
        } else if (!editForm) {
          const response = await saveContact({
            customerId: customerId!,
            payload,
          }).unwrap();

          const successMessage =
            response?.message ||
            (editingContactId
              ? "Contact updated successfully!"
              : "Contact added successfully!");

          toaster.success(successMessage);

          reset({
            ...DEFAULT_CONTACT_VALUES,
            isActive: true,
            contactTypeId: payload.contactType,
          });
          setEditingContactId(null);

          onFormSubmit?.(data);
          onEditComplete?.();
        }
      } catch (error) {
        handleSubmitError(error);
      } finally {
        setIsVerified(false);
        setOtpAttemptCount(0);
        setCanResend(false);
      }
    },
    [
      createSubmissionPayload,
      saveContact,
      customerId,
      editingContactId,
      reset,
      onFormSubmit,
      onEditComplete,
      handleSubmitError,
    ]
  );

  const handleReset = useCallback(() => {
    reset({ ...DEFAULT_CONTACT_VALUES, isActive: true });
    setEditingContactId(null);
    setOtp("");
    setOtpSent(false);
    setOtpRequestId("");
    setTimer(0);
    setCanResend(false);
    setIsVerified(false);
    setResendCount(0);
    setIsContactFocused(false);
    setOtpAttemptCount(0);
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
  const handleSendOtp = useCallback(async () => {
    const currentValues = getValues();
    if (!currentValues.contactDetails) {
      logger.error("Please enter contact details first", { toast: true });
      return;
    }

    try {
      const response = await sendOtp({
        tenantId: CONTACT_CONFIG.TENANT_ID,
        branchCode: CONTACT_CONFIG.BRANCH_CODE,
        templateCatalogIdentity: CONTACT_CONFIG.TEMPLATE_CATALOG_IDENTITY,
        templateContentIdentity: CONTACT_CONFIG.TEMPLATE_CONTENT_IDENTITY,
        target: currentValues.contactDetails,
        customerIdentity: CONTACT_CONFIG.CUSTOMER_IDENTITY,
        length: CONTACT_CONFIG.OTP_LENGTH,
        ttlSeconds: CONTACT_CONFIG.OTP_TTL_SECONDS,
      }).unwrap();

      setOtpRequestId(response.requestId);
      setOtpAttemptCount(prev => prev + 1);

      if (otpSent) {
        setResendCount((resendCount || 0) + 1);
      }
      setOtpSent(true);

      const remainingSeconds = response.expiresAt
        ? calculateTimerFromExpiry(response.expiresAt)
        : CONTACT_CONFIG.OTP_FALLBACK_TIMER;

      setTimer(remainingSeconds);
      setCanResend(false);
      setIsVerified(false);

      logger.info("OTP sent successfully", { toast: true });
    } catch (error) {
      logger.error("Failed to sent OTP ", { toast: true });
      console.log(error);
      // handleSubmitError(error);
    }
  }, [getValues, sendOtp, otpSent, resendCount]);

  const handleVerifyOtp = useCallback(async () => {
    const currentOtp = otp;
    const currentOtpRequestId = otpRequestId;

    if (
      !currentOtp ||
      currentOtp.length < CONTACT_CONFIG.OTP_LENGTH ||
      !currentOtpRequestId
    ) {
      logger.error("OTP or request ID missing", { toast: true });
      return;
    }

    try {
      const payload = {
        requestId: currentOtpRequestId,
        otp: currentOtp.trim(),
      };

      const response = await verifyOtp(payload).unwrap();

      if (response.result === "INVALID") {
        setIsVerified(false);
        logger.error("Invalid OTP. Please try again.", { toast: true });
        return;
      }

      setIsVerified(true);
      setTimer(0);
      setCanResend(false);
      logger.info("OTP verified successfully", { toast: true });
    } catch (error) {
      setIsVerified(false);
      logger.error(error, { toast: true });
    } finally {
      setOtp("");
    }
  }, [verifyOtp, otp, otpRequestId]);

  const getDisabledFieldClassName = (isDisabled: boolean) => {
    return isDisabled ? "text-muted-foreground bg-muted/50" : "";
  };

  if (!customerId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-muted-foreground mb-2">
          <PlusCircle className="h-6 w-6" />
        </div>
        <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
          Customer Identity Required
        </h3>
        <p className="text-muted-foreground text-xs">
          Please provide a customer identity to manage contact details.
        </p>
      </div>
    );
  }

  return (
    <article>
      <Grid className="px-2">
        <Flex justify="between" align="center" className="mb-1 w-full">
          <HeaderWrapper>
            <TitleHeader title="Contact Preference" />
          </HeaderWrapper>
        </Flex>

        <Form
          onSubmit={handleSubmit(data => {
            const formData: ContactFormData = {
              contactType: data.contactType as "mobile" | "email" | "whatsapp",
              contactTypeId: data.contactTypeId || "",
              contactDetails: data.contactDetails || "",
              isPrimary: Boolean(data.isPrimary),
              isActive: Boolean(data.isActive ?? true),
              isOptOutPromotionalNotification: Boolean(
                data.isOptOutPromotionalNotification
              ),
              isVerified: Boolean(data.isVerified || isVerified),
            };
            handleAddOrUpdateContact(formData);
          })}
          className="space-y-0.5"
        >
          <Form.Row gap={6}>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Contact Type"
                required
                disabled={
                  isSaving || readonly || isContactTypesFetching || isUpdating
                }
                error={errors.contactType}
              >
                <Controller
                  name="contactType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        isSaving ||
                        readonly ||
                        isContactTypesFetching ||
                        isUpdating
                      }
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={
                        Array.isArray(contactTypesData)
                          ? contactTypesData.map(opt => ({
                              value: opt.contactType?.toLowerCase() || "",
                              label: opt.contactType || "",
                            }))
                          : [{ value: "mobile", label: "Mobile" }]
                      }
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Contact Detail"
                required
                error={errors.contactDetails}
              >
                <Controller
                  name="contactDetails"
                  control={control}
                  render={({ field }) => {
                    const handleContactChange = async (value: string) => {
                      // Only allow numbers for mobile contact type
                      let processedValue = value;
                      if (contactType?.toLowerCase() === "mobile") {
                        processedValue = value.replace(/[^0-9]/g, "");
                        // Limit to 10 digits for mobile numbers
                        processedValue = processedValue.slice(0, 10);
                      }

                      field.onChange(processedValue);

                      // Reset verification state when contact details change
                      if (processedValue !== field.value) {
                        setIsVerified(false);
                        setOtpSent(false);
                        setOtp("");
                        setOtpRequestId("");
                        setTimer(0);
                        setCanResend(false);
                        setOtpAttemptCount(0);
                        setValue("isVerified", false);
                      }

                      await trigger("contactDetails");
                      logger.info("Contact details changed", {
                        pushLog: false,
                      });
                    };
                    const displayValue = isContactFocused
                      ? field.value
                      : getMaskedValue(contactType, field.value || "");

                    logger.info("Display value calculated", {
                      pushLog: false,
                    });

                    return (
                      <MaskedInput
                        value={displayValue}
                        onChange={handleContactChange}
                        onFocus={() => setIsContactFocused(true)}
                        placeholder={getContactPlaceholder(contactType)}
                        size="form"
                        variant="form"
                        disabled={isSaving || readonly || isUpdating}
                        showToggle={false}
                        className={`${getDisabledFieldClassName(
                          isSaving || readonly || isUpdating
                        )} `}
                        onBlur={() => {
                          field.onBlur();
                          setIsContactFocused(false);
                        }}
                      />
                    );
                  }}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          {contactType &&
            ["mobile", "whatsapp"].includes(contactType.toLowerCase()) && (
              <Flex
                direction="col"
                gap={2}
                className="border-border rounded-lg border p-4"
              >
                <Label variant="title" className="text-xss font-medium">
                  Contact and Notification Preference
                </Label>
                <Flex align="center" gap={6} className="flex-wrap">
                  <NeumorphicButton
                    type="button"
                    variant="default"
                    size="default"
                    onClick={handleSendOtp}
                    disabled={
                      isSaving ||
                      otpAttemptCount > 2 ||
                      readonly ||
                      isUpdating ||
                      isSendingOtp ||
                      (otpSent && !canResend && !isVerified) ||
                      isVerified
                    }
                    className="flex-shrink-0"
                  >
                    {isSendingOtp ? (
                      <Loader2 width={12} />
                    ) : isVerified ? (
                      "Send OTP"
                    ) : otpSent && !canResend ? (
                      `Resend in ${timer}s`
                    ) : otpSent && canResend ? (
                      otpAttemptCount > 2 ? (
                        "Admin OTP"
                      ) : (
                        "Resend OTP"
                      )
                    ) : (
                      "Send OTP"
                    )}
                  </NeumorphicButton>
                  <OTPInput
                    length={CONTACT_CONFIG.OTP_LENGTH}
                    size="xs"
                    variant="form"
                    value={otp}
                    onChange={value => setOtp(value)}
                    disabled={
                      readonly ||
                      isSaving ||
                      isVerifyingOtp ||
                      isVerified ||
                      isUpdating
                    }
                    className="flex-shrink-0"
                  />
                  {isVerified ? (
                    <NeumorphicButton
                      type="button"
                      variant="default"
                      size="default"
                      onClick={() => {}}
                    >
                      <Check width={12} />
                      Verified
                    </NeumorphicButton>
                  ) : (
                    <CapsuleButton
                      onClick={handleVerifyOtp}
                      label="Verify OTP"
                      icon={CircleCheckBig}
                      disabled={
                        isSaving ||
                        readonly ||
                        isVerifyingOtp ||
                        !otp ||
                        otp.length < CONTACT_CONFIG.OTP_LENGTH ||
                        isUpdating
                      }
                    />
                  )}
                </Flex>
              </Flex>
            )}

          <Form.Row gap={2} className="mt-4">
            <Form.Col lg={2} md={6} span={12}>
              <Flex align="center" gap={3}>
                <Controller
                  name="isPrimary"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isPrimary"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSaving || readonly || isUpdating || !isView}
                    />
                  )}
                />
                <Label htmlFor="isPrimary">Set as Primary Contact</Label>
              </Flex>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12} className="ml-[15px]">
              <Flex align="center" gap={3}>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isActive"
                      checked={!editForm ? true : field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSaving || readonly || !editForm || isUpdating}
                    />
                  )}
                />
                <Label htmlFor="isActive">Active</Label>
              </Flex>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12} className="ml-[-13px]">
              <Flex align="center" gap={3}>
                <Controller
                  name="isOptOutPromotionalNotification"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isOptOutPromotionalNotification"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSaving || readonly || isUpdating}
                    />
                  )}
                />
                <Label htmlFor="isOptOutPromotionalNotification">
                  Opted out from promotional notification
                </Label>
              </Flex>
            </Form.Col>
          </Form.Row>

          <Flex justify="end" gap={6} className="mt-0.5">
            {!readonly && (
              <>
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
                  disabled={isSaving || isUpdating}
                >
                  <RefreshCw width={12} />
                  Reset
                </NeumorphicButton>
                <NeumorphicButton
                  type="submit"
                  variant="default"
                  size="default"
                  disabled={isSaving || isUpdating}
                >
                  {editForm ? (
                    <>
                      {isUpdating ? (
                        <>
                          <Loader2 width={12} />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save width={12} />
                          Update Contact
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {isSaving ? (
                        <>
                          <Loader2 width={12} className="mr-2 animate-spin" />
                          Saving..."
                        </>
                      ) : (
                        <>
                          <PlusCircle width={12} className="mr-2" />
                          Add Contact Details
                        </>
                      )}
                    </>
                  )}
                </NeumorphicButton>
              </>
            )}
          </Flex>
        </Form>
      </Grid>
    </article>
  );
};
