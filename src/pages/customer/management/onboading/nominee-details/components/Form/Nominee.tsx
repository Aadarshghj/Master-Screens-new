import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PlusCircle, RefreshCw, Save } from "lucide-react";
import {
  Switch,
  Label,
  Input,
  InputWithSearch,
  Form,
  Flex,
  Grid,
  Select,
  HeaderWrapper,
  TitleHeader,
} from "@/components";
import { Spinner } from "@/components/ui";
import {
  useCreateNomineeMutation,
  useUpdateNomineeMutation,
  useGetPincodeDetailsQuery,
  useGetNomineeRelationshipsQuery,
  useGetCustomerAddressQuery,
  useGetAddressOptionsQuery,
} from "@/global/service";
import { useDMSFileUpload } from "@/hooks/useDMSFileUpload";
import { DatePicker } from "@/components/ui/date-picker";
import { MaskedInput } from "@/components/ui/masked-input";
import { logger } from "@/global/service";
import {
  nomineeValidationSchema,
  transformFormData,
  validateForm,
} from "@/global/validation/customer/nominee-schema";
import type {
  NomineeFormData,
  NomineeFormProps,
} from "@/types/customer/nominee.types";
import { calculateAge } from "@/utils/age.utils";
import { getErrorMessage } from "@/utils/error.utils";
import { DEFAULT_FORM_VALUES } from "../../constants";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { useFormDirtyState } from "@/hooks/useFormDirtyState";
import type { Address } from "@/types/customer/address.types";
const FORM_CONFIG = {
  DEFAULT_TENANT_ID: 1,
  DEFAULT_BRANCH_ID: "00000000-0000-0000-0000-000000000001",
  DEFAULT_BRANCH_CODE: "MAIN",
  DEFAULT_POST_OFFICE_ID: "07a73782-5cdc-4df1-869e-6891494e4e34",
  DEFAULT_CREATED_BY: 1,
  DEFAULT_UPDATED_BY: 1,

  MINIMUM_AGE_FOR_MAJORITY: 18,
  MINIMUM_MOBILE_LENGTH: 10,
  MAXIMUM_MOBILE_LENGTH: 10,
  MINIMUM_PERCENTAGE_SHARE: 0,
  MAXIMUM_PERCENTAGE_SHARE: 100,
  MINIMUM_PINCODE_LENGTH: 6,
  MAXIMUM_PINCODE_LENGTH: 6,

  // Name validation
  MINIMUM_NAME_LENGTH: 2,
  MAXIMUM_NAME_LENGTH: 100,
  MINIMUM_GUARDIAN_NAME_LENGTH: 2,
  MAXIMUM_GUARDIAN_NAME_LENGTH: 100,

  // Address validation
  MINIMUM_ADDRESS_LENGTH: 5,
  MAXIMUM_ADDRESS_LENGTH: 200,
  MINIMUM_DOOR_NUMBER_LENGTH: 1,
  MAXIMUM_DOOR_NUMBER_LENGTH: 20,
  MINIMUM_LANDMARK_LENGTH: 2,
  MAXIMUM_LANDMARK_LENGTH: 100,
  MINIMUM_PLACE_NAME_LENGTH: 2,
  MAXIMUM_PLACE_NAME_LENGTH: 100,

  // Contact validation
  MINIMUM_EMAIL_LENGTH: 5,
  MAXIMUM_EMAIL_LENGTH: 100,

  // Location validation
  MINIMUM_LATITUDE: -90,
  MAXIMUM_LATITUDE: 90,
  MINIMUM_LONGITUDE: -180,
  MAXIMUM_LONGITUDE: 180,

  // Default country
  DEFAULT_COUNTRY: "India",

  // Digipin generation
} as const;

export const NomineeForm: React.FC<
  NomineeFormProps & {
    onFormSubmit?: () => void;
    onUnsavedChanges?: (hasChanges: boolean) => void;
    isView?: boolean;
  }
> = ({
  editingNominee = null,
  onCancelEdit,
  customerIdentity,
  existingNominees = [],
  onFormSubmit,
  onUnsavedChanges,
  isView = false,
  handleSetConfirmationModalData,
  confirmationModalData,
}) => {
  const [pincodePostOffices, setPincodePostOffices] = useState<
    Array<{ officeName: string; identity: string }>
  >([]);
  const [shouldSearchPincode, setShouldSearchPincode] = useState(false);

  const normalizeAddressTypeName = (name: string): string => {
    return name.toUpperCase().trim();
  };
  const { handleUpdateFormDirtyState, handleResetFormDirtyState } =
    useFormDirtyState({
      isView,
    });
  const getAddressTypeName = (
    addressTypeId: string,
    addressTypesData?: Address[]
  ): string => {
    const option = addressTypesData?.find(
      opt => opt.identity === addressTypeId
    );
    if (option) return option.addressTypeName || option.addressTypeName || "";
    return addressTypeId;
  };

  const customerId = customerIdentity;

  const [createNominee, { isLoading: isCreatingNominee }] =
    useCreateNomineeMutation();
  const [updateNominee, { isLoading: isUpdatingNominee }] =
    useUpdateNomineeMutation();
  const { data: relationships = [] } = useGetNomineeRelationshipsQuery();
  const { data: filteredAddressOptions } = useGetAddressOptionsQuery({
    active: true,
    context: "CUSTOMER_ONBOARDING",
  });
  const { data: customerAddressesData } = useGetCustomerAddressQuery(
    customerId || "",
    {
      skip: !customerId,
    }
  );

  const customerAddresses = useMemo(() => {
    if (!customerAddressesData) return [];
    if (Array.isArray(customerAddressesData)) return customerAddressesData;

    const dataWithStructure = customerAddressesData as {
      data?: unknown;
      addresses?: unknown;
      result?: unknown;
    };

    if (dataWithStructure.data && Array.isArray(dataWithStructure.data)) {
      return dataWithStructure.data;
    }
    if (
      dataWithStructure.addresses &&
      Array.isArray(dataWithStructure.addresses)
    ) {
      return dataWithStructure.addresses;
    }
    if (dataWithStructure.result && Array.isArray(dataWithStructure.result)) {
      return dataWithStructure.result;
    }
    return [];
  }, [customerAddressesData]);

  const selectOptions = useMemo(() => {
    return {
      relationships:
        relationships?.map(rel => ({
          value: rel.identity || rel.id.toString(),
          label: rel.relationship || "Unknown",
        })) || [],
      addressTypes:
        filteredAddressOptions?.addressTypes?.map(address => ({
          value: address.identity,
          label: address.addressTypeName,
        })) || [],
    };
  }, [relationships, filteredAddressOptions, existingNominees, editingNominee]);
  const permanentAddress = useMemo(() => {
    return customerAddresses.find(addr => {
      const typeName = getAddressTypeName(
        addr.addressType,
        filteredAddressOptions?.addressTypes
      );
      return normalizeAddressTypeName(typeName) === "PERMANENT";
    });
  }, [customerAddresses, filteredAddressOptions?.addressTypes]);

  const formDataFromEditing = useMemo(() => {
    if (!editingNominee) return null;
    return {
      fullName: editingNominee.fullName || "",
      relationship: editingNominee.relationship || "",
      dob: editingNominee.dob || "",
      contactNumber: editingNominee.contactNumber || "",
      percentageShare: editingNominee.percentageShare || 0,
      isMinor: editingNominee.isMinor || false,
      guardianName: editingNominee.guardianName || "",
      guardianDob: editingNominee.guardianDob || "",
      guardianEmail: editingNominee.guardianEmail || "",
      guardianContactNumber: editingNominee.guardianContactNumber || "",
      isSameAddress: editingNominee.isSameAddress || false,
      addressTypeId: editingNominee.addressTypeId || "",
      doorNumber: editingNominee.doorNumber || "",
      addressLine1: editingNominee.addressLine1 || "",
      landmark: editingNominee.landmark || "",
      placeName: editingNominee.placeName || "",
      city: editingNominee.city || "",
      district: editingNominee.district || "",
      state: editingNominee.state || "",
      country: editingNominee.country || "",
      pincode: editingNominee.pincode || "",
      postOfficeId: editingNominee.postOfficeId || "",
      latitude: editingNominee.latitude || "",
      longitude: editingNominee.longitude || "",
      digipin: editingNominee.digipin || "",
    };
  }, [editingNominee]);

  // Derived states from RTK Query loading states
  const isSubmitting = useMemo(
    () => isCreatingNominee || isUpdatingNominee,
    [isCreatingNominee, isUpdatingNominee]
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    trigger,
    formState: { errors, isDirty, dirtyFields, touchedFields },
  } = useForm<NomineeFormData>({
    resolver: yupResolver(nomineeValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: transformFormData(DEFAULT_FORM_VALUES),
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
    name: [
      "pincode",
      "isMinor",
      "isSameAddress",
      "dob",
      "guardianDob",
      "dmsFileData",
    ],
    control,
  });

  const [watchedPincode, , watchedIsSameAddress, watchedDob, , dmsFileData] =
    watchedValues;

  useEffect(() => {
    if (watchedIsSameAddress && permanentAddress) {
      setValue("doorNumber", permanentAddress.doorNumber || "", {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("addressLine1", permanentAddress.addressLine1 || "", {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue(
        "placeName",
        permanentAddress.placeName || permanentAddress.addressLine2 || "",
        {
          shouldValidate: false,
          shouldDirty: true,
        }
      );
      setValue("pincode", permanentAddress.pincode || "", {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("country", permanentAddress.country || "India", {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("state", permanentAddress.state || "", {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("district", permanentAddress.district || "", {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("city", permanentAddress.city || "", {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("landmark", permanentAddress.landmark || "", {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("postOfficeId", permanentAddress.postOffice || "", {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("latitude", permanentAddress.latitude?.toString() || "", {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("longitude", permanentAddress.longitude?.toString() || "", {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("digipin", permanentAddress.digipin || "", {
        shouldValidate: false,
        shouldDirty: true,
      });

      const permanentAddressTypeId = permanentAddress.addressType || "";
      setValue("addressTypeId", permanentAddressTypeId, {
        shouldValidate: false,
        shouldDirty: true,
      });
    } else if (!watchedIsSameAddress && !editingNominee) {
      setValue("doorNumber", "", { shouldValidate: false });
      setValue("addressLine1", "", { shouldValidate: false });
      setValue("placeName", "", { shouldValidate: false });
      setValue("pincode", "", { shouldValidate: false });
      setValue("city", "", { shouldValidate: false });
      setValue("landmark", "", { shouldValidate: false });
      setValue("postOfficeId", "", { shouldValidate: false });
      setValue("addressTypeId", "", { shouldValidate: false });
    }
  }, [watchedIsSameAddress, permanentAddress, setValue, editingNominee]);

  // Local state for file selection
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  // DMS File Upload Hook
  const { uploadFile } = useDMSFileUpload({
    module: "customer-onboarding",
    referenceId: customerId || "",
    documentCategory: "nominee-documents",
    documentType: "nominee-proof",
    onSuccess: fileData => {
      setValue("dmsFileData", fileData);
      // logger.info("Nominee document uploaded successfully", { toast: true });
    },
    onError: error => {
      logger.error(`Nominee document upload failed: ${error}`, { toast: true });
    },
  });

  const calculatedAge = useMemo(() => {
    if (!watchedDob) return 0;
    return calculateAge(watchedDob) ?? 0;
  }, [watchedDob]);

  const isMinorCalculated = useMemo(() => {
    return calculatedAge < FORM_CONFIG.MINIMUM_AGE_FOR_MAJORITY;
  }, [calculatedAge]);

  const isAgeMajor = calculatedAge >= FORM_CONFIG.MINIMUM_AGE_FOR_MAJORITY;
  const isAgeMinor = calculatedAge < FORM_CONFIG.MINIMUM_AGE_FOR_MAJORITY;

  // Handle age-based isMinor logic like Basic Information
  useEffect(() => {
    setValue("isMinor", isMinorCalculated);
    if (!isMinorCalculated) {
      // Clear guardian fields when not minor
      setValue("guardianName", "");
      setValue("guardianDob", "");
      setValue("guardianEmail", "");
      setValue("guardianContactNumber", "");
    }
  }, [calculatedAge, isMinorCalculated, setValue]);

  const { data: locationData, isLoading: isLoadingLocation } =
    useGetPincodeDetailsQuery(watchedPincode, {
      skip:
        !shouldSearchPincode || !watchedPincode || watchedPincode.length !== 6,
    });

  useEffect(() => {
    if (formDataFromEditing) {
      try {
        reset(formDataFromEditing);

        // If editing and has pincode, trigger pincode search to load post offices
        // This is needed to populate the post office dropdown
        if (
          formDataFromEditing.pincode &&
          formDataFromEditing.pincode.length === 6
        ) {
          setShouldSearchPincode(true);
          logger.info("Loading post offices for existing pincode...", {
            toast: false,
            pushLog: false,
          });
        }
      } catch (error) {
        logger.error(error, { toast: true });
      }
    }
  }, [formDataFromEditing, reset]);

  useEffect(() => {
    // Only process location data when user explicitly searches for pincode
    if (
      locationData &&
      !isLoadingLocation &&
      shouldSearchPincode &&
      watchedPincode &&
      watchedPincode.length === 6
    ) {
      try {
        const location = Array.isArray(locationData)
          ? locationData[0]
          : locationData;

        if (!location) {
          logger.error("No location data found for this pincode", {
            toast: true,
            pushLog: false,
          });
          setShouldSearchPincode(false);
          return;
        }

        // Use the new API response structure
        const newState = location?.stateName || "";
        const newDistrict = location?.districtName || "";
        // Try multiple possible field names for city
        const newCity =
          location?.cityName ||
          location?.city ||
          location?.officeName ||
          location?.placeName ||
          "";

        // Auto-fill location data from pincode API response
        setValue("country", "India", {
          shouldValidate: true,
          shouldDirty: true,
        });

        // Set location values using the API response structure
        // When editing, preserve existing data if API doesn't provide it
        if (newState) {
          setValue("state", newState, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
        if (newDistrict) {
          setValue("district", newDistrict, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
        // Only update city if we have a meaningful value from API
        // Don't overwrite existing city with empty value when editing
        if (newCity && newCity.trim() !== "") {
          setValue("city", newCity, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }

        // Set default latitude and longitude (API doesn't provide these)
        setValue("latitude", "28.6139", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("longitude", "77.209", {
          shouldValidate: true,
          shouldDirty: true,
        });

        // Trigger validation to ensure form updates
        trigger(["state", "district", "city"]);

        // Process post offices from the new API response structure
        if (
          location?.postOffices &&
          Array.isArray(location.postOffices) &&
          location.postOffices.length > 0
        ) {
          const postOfficesData = location.postOffices.map(
            (office: { officeName: string; identity: string }) => ({
              officeName: office.officeName,
              identity: office.identity,
            })
          );

          setPincodePostOffices(postOfficesData);

          // Set the first post office as default if available
          if (postOfficesData.length > 0) {
            setValue("postOfficeId", postOfficesData[0].identity, {
              shouldValidate: true,
              shouldDirty: true,
            });

            // Trigger validation to ensure form updates
            trigger("postOfficeId");
          }
        } else {
          // Clear any existing post office data
          setPincodePostOffices([]);
          setValue("postOfficeId", "", {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
        setShouldSearchPincode(false);
      } catch (error) {
        logger.error(error, { toast: true });
        setShouldSearchPincode(false);
      }
    }
  }, [
    locationData,
    isLoadingLocation,
    shouldSearchPincode,
    setValue,
    watchedPincode,
    trigger,
  ]);

  // Handle post office selection when editing (similar to Address form)
  useEffect(() => {
    if (editingNominee && pincodePostOffices.length > 0) {
      const targetPostOfficeId = editingNominee.postOfficeId;

      if (targetPostOfficeId) {
        // Check if the post office exists in the loaded data
        const postOfficeExists = pincodePostOffices.some(
          office => office.identity === targetPostOfficeId
        );

        if (postOfficeExists) {
          setValue("postOfficeId", targetPostOfficeId, {
            shouldValidate: true,
            shouldDirty: false,
          });
          logger.info("Post office restored for editing", {
            toast: false,
            pushLog: false,
          });
        }
      }
    }
  }, [editingNominee, pincodePostOffices, setValue]);

  // Error handler with retry logic
  const handleSubmitError = useCallback((error: unknown): void => {
    const errorMessage = getErrorMessage(error);
    logger.error(`Form submission failed: ${errorMessage}`, {
      toast: true,
      pushLog: false,
    });
  }, []);

  const onSubmit = useCallback(
    async (data: NomineeFormData) => {
      logger.info("Form submission started", { toast: false });

      try {
        if (!customerId) {
          logger.error("Customer ID is required to create/update nominee", {
            toast: true,
          });
          return;
        }
        if (data.isSameAddress && !permanentAddress) {
          logger.error(
            "No permanent address found. Please add a permanent address first before using 'Same as Permanent Address' option.",
            { toast: true }
          );
          return;
        }

        const validationResult = await validateForm(data);
        if (!validationResult.isValid) {
          const errorFields = Object.keys(validationResult.errors);
          logger.error(
            `Validation failed for fields: ${errorFields.join(", ")}`,
            { toast: true }
          );
          return;
        }

        // Upload file to DMS first if file exists
        let currentDmsFileData = dmsFileData;
        if (selectedFile && !dmsFileData) {
          logger.info("Uploading nominee document to DMS...", { toast: true });
          try {
            currentDmsFileData = await uploadFile(selectedFile);

            if (!currentDmsFileData) {
              logger.error("Failed to upload nominee document to DMS", {
                toast: true,
              });
              return;
            }
            setValue("dmsFileData", currentDmsFileData);
            logger.info("Document uploaded successfully", { toast: false });
          } catch (uploadError) {
            logger.error(uploadError, {
              toast: true,
            });
            return;
          }
        }

        const transformedData = transformFormData(data);

        // Add DMS file metadata if available
        const payloadWithFile = {
          ...transformedData,
          docRefId: currentDmsFileData?.fileName ?? null,
          filePath: currentDmsFileData?.filePath ?? null,
        };

        if (editingNominee) {
          // Update existing nominee
          logger.info("Updating nominee...", { toast: false });
          await updateNominee({
            customerId: customerId,
            nomineeId: editingNominee.nomineeIdentity,
            payload: payloadWithFile,
          }).unwrap();

          logger.info("Nominee updated successfully!", {
            toast: true,
          });
        } else {
          await createNominee({
            customerId: customerId,
            payload: payloadWithFile,
          }).unwrap();

          logger.info("Nominee created successfully!", {
            toast: true,
          });
        }

        // Reset form after successful submission
        reset(transformFormData(DEFAULT_FORM_VALUES));
        setValue("selectedFile", null);
        setValue("dmsFileData", null);

        // Clear file selection state
        setSelectedFile(null);
        setSelectedFileName("");
        setPincodePostOffices([]);
        setShouldSearchPincode(false);
        onFormSubmit?.();

        if (editingNominee && onCancelEdit) {
          onCancelEdit();
        }
      } catch (error) {
        handleSubmitError(error);
      }
    },
    [
      createNominee,
      updateNominee,
      customerId,
      reset,
      handleSubmitError,
      editingNominee,
      onCancelEdit,
      uploadFile,
      selectedFile,
      dmsFileData,
      setValue,
      onFormSubmit,
      permanentAddress,
    ]
  );
  const handleReset = useCallback((): void => {
    try {
      reset(transformFormData(DEFAULT_FORM_VALUES));
      setShouldSearchPincode(false);
      setPincodePostOffices([]);
      setValue("selectedFile", null);
      setValue("dmsFileData", null);

      setSelectedFile(null);
      setSelectedFileName("");

      // If editing, restore the original data instead of clearing
      if (editingNominee && formDataFromEditing) {
        reset(formDataFromEditing);
        // Restore post offices if pincode exists
        if (
          formDataFromEditing.pincode &&
          formDataFromEditing.pincode.length === 6
        ) {
          setShouldSearchPincode(true);
        }
      }
    } catch (error) {
      logger.error(error, { toast: true });
    }
  }, [reset, setValue, editingNominee, formDataFromEditing]);
  useEffect(() => {
    if (
      !confirmationModalData?.doAction ||
      confirmationModalData?.feature !== "RESET"
    ) {
      return;
    }

    handleReset();
  }, [confirmationModalData]);
  // Unsaved changes detection
  const hasUnsavedChanges = useMemo(() => {
    return isDirty && editingNominee !== null;
  }, [isDirty, editingNominee]);

  // Notify parent component about unsaved changes
  useEffect(() => {
    if (onUnsavedChanges) {
      onUnsavedChanges(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges, onUnsavedChanges]);

  const handlePincodeSearch = useCallback(() => {
    try {
      if (
        !watchedPincode ||
        watchedPincode.length !== FORM_CONFIG.MINIMUM_PINCODE_LENGTH
      ) {
        logger.error(
          `Please enter a valid ${FORM_CONFIG.MINIMUM_PINCODE_LENGTH}-digit pincode`,
          { toast: true, pushLog: false }
        );
        return;
      }

      setShouldSearchPincode(true);
      logger.info("Searching for location data and post offices...", {
        toast: false,
        pushLog: false,
      });
    } catch (error) {
      logger.error(error, { toast: true });
    }
  }, [watchedPincode]);

  // Debounced effect to clear search state when pincode changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (watchedPincode && watchedPincode.length < 6) {
        setShouldSearchPincode(false);
        // Don't clear post offices when in edit mode - preserve existing data
        if (!editingNominee) {
          setPincodePostOffices([]);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [watchedPincode, editingNominee]);

  const handleFileSelect = useCallback(
    (file: File, base64?: string) => {
      try {
        // Validate file size (1MB limit)
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 1) {
          logger.error("File size must be less than 1MB", { toast: true });
          return;
        }

        setValue("selectedFile", file);
        setSelectedFileName(file.name);
        setSelectedFile(file);
        // Store base64 data if needed for form submission
        if (base64) {
          // You can store base64 in form state if needed
          // setValue("addressProofFile", base64);
        }
        logger.info(`File selected: ${file.name}`, {
          toast: true,
          pushLog: false,
        });
      } catch (error) {
        logger.error(error, { toast: true });
      }
    },
    [setValue]
  );

  // Handle missing customer identity
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
          Please provide a customer identity to manage nominee details.
        </p>
      </div>
    );
  }

  return (
    <article className="nominee-form-container">
      <Grid className="px-2">
        <Flex justify="between" align="center" className="w-full">
          <HeaderWrapper>
            <TitleHeader
              title={
                editingNominee
                  ? "Edit Nominee Details"
                  : "Customer's Nominee Details"
              }
            />
          </HeaderWrapper>
        </Flex>

        <Form
          onSubmit={e => {
            handleSubmit(onSubmit)(e);
          }}
          className="space-y-3"
        >
          <Flex>
            <Label variant="title" className="text-blue-950">
              Basic Information
            </Label>
          </Flex>
          <Form.Row gap={4}>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Nominee's Full Name"
                required
                error={errors?.fullName}
              >
                <Input
                  {...register("fullName", {
                    onBlur: () => trigger("fullName"),
                  })}
                  type="text"
                  placeholder="Enter Nominee's full name"
                  size="form"
                  variant="form"
                  className="uppercase"
                  disabled={isSubmitting}
                  restriction="alphabetic"
                  maxLength={100}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Relationship"
                required
                error={errors?.relationship}
              >
                <Controller
                  name="relationship"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={value => {
                        field.onChange(value);
                        trigger("relationship");
                      }}
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={selectOptions.relationships}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Contact Number"
                required
                error={errors?.contactNumber}
              >
                <Controller
                  name="contactNumber"
                  control={control}
                  render={({ field }) => (
                    <MaskedInput
                      value={field.value}
                      onChange={value => {
                        // For contact number, we want to keep numeric input
                        // but filter out non-numeric characters and limit to 10 digits
                        const filteredValue = value
                          .replace(/[^0-9]/g, "")
                          .slice(0, 10);
                        field.onChange(filteredValue);
                        trigger("contactNumber");
                      }}
                      placeholder="Enter contact number"
                      size="form"
                      variant="form"
                      className="uppercase"
                      maxLength={10}
                      restriction="numeric"
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Percentage Share (%)"
                required
                error={errors?.percentageShare}
              >
                <Input
                  {...register("percentageShare", {
                    setValueAs: value => {
                      const num = parseFloat(value);
                      return isNaN(num) ? 0 : Math.max(0, num);
                    },
                    onBlur: () => trigger("percentageShare"),
                  })}
                  type="number"
                  placeholder="100"
                  size="form"
                  variant="form"
                  restriction="numeric"
                  disabled={isSubmitting}
                  maxValue={100}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Date of Birth" required error={errors?.dob}>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value || undefined}
                      onChange={(value: string) => {
                        field.onChange(value);
                        trigger("dob");
                      }}
                      placeholder="dd/mm/yyyy"
                      allowManualEntry={true}
                      size="form"
                      variant="form"
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
                {calculatedAge !== null && (
                  <Flex className="text-reset/70 justify-between py-1 text-[10px]">
                    Age: {calculatedAge}
                    <Label className="text-reset/70">
                      {isAgeMinor ? "Minor" : "Adult"}
                    </Label>
                  </Flex>
                )}
              </Form.Field>
            </Form.Col>
          </Form.Row>

          {/* Only show minor toggle and guardian fields if the person is actually a minor */}
          {isAgeMinor && (
            <Form.Row gap={4}>
              <Form.Col lg={1} md={6} span={12}>
                <Flex align="center" gap={2} className="mt-5 h-full">
                  <Controller
                    name="isMinor"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="isMinor"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isAgeMajor || (isAgeMinor && field.value)}
                      />
                    )}
                  />
                  <Label htmlFor="isMinor" className="text-xs font-medium">
                    Is Minor
                  </Label>
                </Flex>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Guardian Name"
                  required
                  error={errors?.guardianName}
                >
                  <Input
                    {...register("guardianName", {
                      onBlur: () => trigger("guardianName"),
                    })}
                    type="text"
                    placeholder="Enter Guardian's full name"
                    size="form"
                    variant="form"
                    className="uppercase"
                    restriction="alphabetic"
                    disabled={isSubmitting}
                    maxLength={100}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Guardian's Date of Birth"
                  required
                  error={errors?.guardianDob}
                >
                  <Controller
                    name="guardianDob"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value || undefined}
                        onChange={(value: string) => {
                          field.onChange(value);
                          trigger("guardianDob");
                        }}
                        placeholder="dd/mm/yyyy"
                        allowManualEntry={true}
                        size="form"
                        variant="form"
                        onBlur={() => field.onBlur()}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Guardian Email ID"
                  error={errors?.guardianEmail}
                >
                  <Input
                    {...register("guardianEmail", {
                      onBlur: () => trigger("guardianEmail"),
                    })}
                    type="email"
                    placeholder="Enter Email ID"
                    size="form"
                    variant="form"
                    disabled={isSubmitting}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Guardian Contact Number"
                  required
                  error={errors?.guardianContactNumber}
                >
                  <Controller
                    name="guardianContactNumber"
                    control={control}
                    render={({ field }) => (
                      <MaskedInput
                        value={field.value}
                        onChange={value => {
                          // For contact number, we want to keep numeric input
                          // but filter out non-numeric characters and limit to 10 digits
                          const filteredValue = value
                            .replace(/[^0-9]/g, "")
                            .slice(0, 10);
                          field.onChange(filteredValue);
                          trigger("guardianContactNumber");
                        }}
                        placeholder="Enter contact number"
                        size="form"
                        variant="form"
                        className="uppercase"
                        maxLength={10}
                        restriction="numeric"
                        onBlur={() => field.onBlur()}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>
          )}

          <div className="mt-4">
            <Flex>
              <Label variant="title" className="text-blue-950">
                Address Information
              </Label>
            </Flex>
          </div>

          <div className="mt-2 mb-6">
            <Flex align="center" gap={2}>
              <Controller
                name="isSameAddress"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="nomineeAddressSameAsCustomer"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label>Nominee Address same as Customer Permanent Address</Label>
            </Flex>
          </div>

          {!watchedIsSameAddress && (
            <fieldset>
              <Form.Row gap={4}>
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field
                    label="Address Type"
                    required={!watchedIsSameAddress}
                    error={errors?.addressTypeId}
                  >
                    <Controller
                      name="addressTypeId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={value => {
                            field.onChange(value);
                            trigger("addressTypeId");
                          }}
                          placeholder="Select"
                          size="form"
                          variant="form"
                          fullWidth={true}
                          itemVariant="form"
                          options={selectOptions.addressTypes}
                          onBlur={() => field.onBlur()}
                        />
                      )}
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field
                    label="House No/House Name/Door No"
                    required
                    error={errors?.doorNumber}
                  >
                    <Input
                      {...register("doorNumber", {
                        onBlur: () => trigger("doorNumber"),
                      })}
                      type="text"
                      placeholder="Enter House No/House Name/Door No"
                      size="form"
                      variant="form"
                      className="uppercase"
                      disabled={isSubmitting}
                      restriction="alphanumeric"
                      autoCapitalize="words"
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field
                    label="Street / Lane Name"
                    required
                    error={errors?.addressLine1}
                  >
                    <Input
                      {...register("addressLine1", {
                        onBlur: () => trigger("addressLine1"),
                      })}
                      type="text"
                      placeholder="Street/Lane Name"
                      size="form"
                      variant="form"
                      className="uppercase"
                      disabled={isSubmitting}
                      restriction="alphanumeric"
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field
                    label="Place Name"
                    required
                    error={errors?.placeName}
                  >
                    <Input
                      {...register("placeName", {
                        onBlur: () => trigger("placeName"),
                      })}
                      type="text"
                      placeholder="Place Name"
                      size="form"
                      variant="form"
                      className="uppercase"
                      restriction="alphabetic"
                      disabled={isSubmitting}
                    />
                  </Form.Field>
                </Form.Col>
              </Form.Row>

              <div className="mt-4">
                <Form.Row gap={4}>
                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field
                      label="PIN Code (for post offices)"
                      required
                      error={errors?.pincode}
                    >
                      <Controller
                        name="pincode"
                        control={control}
                        render={({ field }) => (
                          <InputWithSearch
                            {...field}
                            type="text"
                            placeholder="e.g. 600001"
                            size="form"
                            variant="form"
                            maxLength={6}
                            numerical={true}
                            onSearch={handlePincodeSearch}
                            isSearching={isLoadingLocation}
                            disabled={isSubmitting}
                            onBlur={() => trigger("pincode")}
                          />
                        )}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field label="Country">
                      <Input
                        {...register("country")}
                        type="text"
                        placeholder="Enter country name"
                        size="form"
                        variant="form"
                        className="uppercase"
                        disabled={true}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field label="State">
                      <Input
                        {...register("state")}
                        type="text"
                        placeholder="Enter state name"
                        size="form"
                        variant="form"
                        className="uppercase"
                        disabled={true}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field label="District">
                      <Input
                        {...register("district")}
                        type="text"
                        placeholder="Enter district name"
                        size="form"
                        variant="form"
                        className="uppercase"
                        disabled={true}
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={4} md={6} span={12}>
                    <Form.Field
                      label="Post Office"
                      required
                      error={errors?.postOfficeId}
                    >
                      <Controller
                        name="postOfficeId"
                        control={control}
                        render={({ field }) => {
                          // Create options array from pincode response
                          const allOptions = [
                            // Post offices from pincode response (primary source)
                            ...pincodePostOffices.map(
                              (office: {
                                officeName: string;
                                identity: string;
                              }) => ({
                                value: office.identity,
                                label: office.officeName,
                              })
                            ),
                            // Show message if no post offices found
                            ...(pincodePostOffices.length === 0
                              ? [
                                  {
                                    value: "no-offices",
                                    label:
                                      "No post offices available for this pincode",
                                    disabled: true,
                                  },
                                ]
                              : []),
                            // Loading state
                            ...(isLoadingLocation
                              ? [
                                  {
                                    value: "loading",
                                    label: "Loading...",
                                    disabled: true,
                                  },
                                ]
                              : []),
                          ];

                          return (
                            <Select
                              key={`post-office-${pincodePostOffices.length}`}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder="Select"
                              size="form"
                              variant="form"
                              fullWidth={true}
                              itemVariant="form"
                              options={
                                allOptions as Array<{
                                  value: string;
                                  label: string;
                                  disabled?: boolean;
                                }>
                              }
                              onBlur={() => field.onBlur()}
                            />
                          );
                        }}
                      />
                    </Form.Field>
                  </Form.Col>
                </Form.Row>
              </div>

              <div className="mt-4">
                <Form.Row gap={4}>
                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="City" required error={errors?.city}>
                      <Input
                        {...register("city")}
                        type="text"
                        placeholder="Enter city name"
                        size="form"
                        variant="form"
                        className="uppercase"
                        disabled={isSubmitting}
                        restriction="alphabetic"
                      />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field
                      label="Landmark"
                      error={errors?.landmark}
                      required
                    >
                      <Input
                        {...register("landmark", {
                          onBlur: () => trigger("landmark"),
                        })}
                        type="text"
                        placeholder="Enter Landmark"
                        size="form"
                        variant="form"
                        className="uppercase"
                        restriction="alphanumeric"
                        autoCapitalize="words"
                        disabled={isSubmitting}
                      />
                    </Form.Field>
                  </Form.Col>
                </Form.Row>
              </div>
            </fieldset>
          )}

          {!watchedIsSameAddress && (
            <Flex className="justify-between">
              <div className="flex flex-col">
                <Label className="text-foreground font-small text-xss mb-1 ml-2 block">
                  Upload Address Proof
                </Label>
                <NeumorphicButton
                  type="button"
                  variant="default"
                  size="default"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".jpg,.jpeg,.png,.pdf";
                    input.onchange = e => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleFileSelect(file);
                      }
                    };
                    input.click();
                  }}
                  disabled={isSubmitting}
                  fullWidth
                >
                  Choose File
                </NeumorphicButton>
                {selectedFileName ? (
                  <div className="text-status-success mt-1 text-[11px]">
                    {selectedFileName} (
                    {selectedFile &&
                      (selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                    MB)
                  </div>
                ) : (
                  <p className="text-muted-foreground text-nano mt-1">
                    Accepted format JPG,PNG,JPEG,PDF Max size: 1MB
                  </p>
                )}
              </div>
            </Flex>
          )}

          <Flex className="justify-end">
            <Flex.SectionGroup>
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-1">
                      <Spinner
                        variant="default"
                        size={12}
                        className="text-primary-foreground"
                      />
                      <span>
                        {editingNominee ? "Updating..." : "Adding..."}
                      </span>
                    </div>
                  ) : (
                    <>
                      {editingNominee ? (
                        <Save width={12} />
                      ) : (
                        <PlusCircle width={12} />
                      )}
                      {editingNominee
                        ? "Update Nominee Details"
                        : "Add Nominee Details"}
                    </>
                  )}
                </NeumorphicButton>
              </Flex.ActionGroup>
            </Flex.SectionGroup>
          </Flex>
        </Form>
      </Grid>
    </article>
  );
};
