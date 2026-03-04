import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller, useWatch, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Input,
  Form,
  Flex,
  Grid,
  Label,
  Select,
  Switch,
  ConfirmationModal,
  InputWithSearch,
  Spinner,
} from "@/components/ui";
import { Edit, Trash2, PlusCircle, RefreshCw, Save, Eye } from "lucide-react";
import { useAppDispatch } from "@/hooks/store";
import { setIsReady } from "@/global/reducers/customer/address.reducer";
import {
  useSaveAddressMutation,
  useSaveAddressPermanentTrueMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetAddressOptionsQuery,
  useGetCustomerAddressQuery,
  useGetCustomerAllDetailsQuery,
} from "@/global/service";
import { useDMSFileUpload } from "@/hooks/useDMSFileUpload";
import {
  addressValidationSchema,
  transformFormData,
} from "@/global/validation/customer/address-schema";
import { logger } from "@/global/service";
import { generateDigipin } from "@/utils/location/digipin.utils";
import type {
  AddressFormProps,
  AddressFormData,
  AddressCaptureResponse,
  SaveAddressPayload,
  UploadedDocument,
  PostOfficeData,
  Address,
} from "@/types/customer/address.types";
import type { APIError } from "@/types/api";
import {
  useGetPincodeDetailsQuery,
  useGetAddressProofTypesQuery,
} from "@/global/service/end-points/master/master";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import {
  DEFAULT_ADDRESS_VALUES,
  ADDRESS_CONFIG,
  ADDRESS_TYPE,
} from "../../constants/form.constants";
import { useDisableState } from "@/hooks/useDisableState";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { useFormDirtyState } from "@/hooks/useFormDirtyState";
import { useFileViewer } from "@/hooks/useFileViewer";
import PhotoAndDocumentGallery from "@/components/ui/photo-gallery/PhotoGalleryModal";
import {
  clearExtractedCustomer,
  getExtractedCustomer,
} from "@/utils/extractedCustomerSession";

const normalizeAddressTypeName = (name: string): string => {
  return name.toUpperCase().trim();
};

const getAddressTypeId = (
  typeName: string,
  optionsData?: Address[]
): string => {
  const normalized = normalizeAddressTypeName(typeName);
  const option = optionsData?.find(
    opt => normalizeAddressTypeName(opt.addressTypeName) === normalized
  );
  return option?.identity || "";
};

const getAddressTypeName = (
  addressTypeId: string,
  optionsData?: Array<{ identity: string; addressTypeName: string }>
): string => {
  const option = optionsData?.find(opt => opt.identity === addressTypeId);
  if (option) return option.addressTypeName;

  const typeByName = optionsData?.find(
    opt =>
      normalizeAddressTypeName(opt.addressTypeName) ===
      normalizeAddressTypeName(addressTypeId)
  );
  return typeByName?.addressTypeName || addressTypeId;
};

// Removed validateFormConfig function as FORM_CONFIG is no longer used

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const AddressDetailsForm: React.FC<
  AddressFormProps & {
    customerId?: string;
    onUnsavedChanges?: (hasChanges: boolean) => void;
  }
> = ({
  onFormSubmit,
  readOnly = false,
  customerId: customIdProp,
  customerIdentity,
  onUnsavedChanges,
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
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const customerId = customIdProp || customerIdentity || "";

  const {
    data: savedAddressesData,
    isLoading: isAddressesLoading,
    isSuccess,
    refetch: refetchAddresses,
  } = useGetCustomerAddressQuery(customerId, {
    skip: !customerId,
  });

  const { data: customerAllDetails } = useGetCustomerAllDetailsQuery(
    { customerId: customerId },
    {
      skip: !customerId,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    const isCommunicationAddress = savedAddressesData?.some(
      item => item.addressType === ADDRESS_TYPE.COMMUNICATION
    );

    if (savedAddressesData?.length === 0) {
      handleUpdateState(
        "Incomplete Step",
        "Please complete the current step before continuing."
      );
    } else if (!isCommunicationAddress) {
      handleUpdateState(
        "Incomplete Step",
        "Please add a communication address before continuing."
      );
    } else {
      handleResetState();
    }
  }, [savedAddressesData, handleResetState, handleUpdateState]);

  const savedAddresses = useMemo((): AddressCaptureResponse[] => {
    if (!savedAddressesData) return [];
    if (Array.isArray(savedAddressesData)) {
      return savedAddressesData;
    }

    const dataWithStructure = savedAddressesData as {
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
  }, [savedAddressesData]);

  const { data: filteredAddressOptions, isFetching: isOptionsFetching } =
    useGetAddressOptionsQuery({
      active: true,
      context: "CUSTOMER_ONBOARDING",
    });

  const optionsData = useMemo(() => {
    if (!filteredAddressOptions) return [];
    return filteredAddressOptions.addressTypes;
  }, [filteredAddressOptions]);

  const { data: proofTypesData } = useGetAddressProofTypesQuery();

  const permanentAddress = useMemo(() => {
    return savedAddresses.find(addr => {
      const typeName = getAddressTypeName(addr.addressType, optionsData);
      return normalizeAddressTypeName(typeName) === "PERMANENT";
    });
  }, [savedAddresses, optionsData]);

  const {
    handleSubmit,
    control,
    register,
    setValue,
    reset,
    getValues,
    trigger,
    formState: { errors, isDirty, dirtyFields, touchedFields },
  } = useForm<AddressFormData>({
    resolver: yupResolver(addressValidationSchema) as Resolver<AddressFormData>,
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: transformFormData(DEFAULT_ADDRESS_VALUES),
  });

  const userTouched = Object.keys(touchedFields || {}).length > 0;
  useEffect(() => {
    const hasDirtyValues = Object.keys(dirtyFields || {}).length > 0;
    if ((isDirty && hasDirtyValues && userTouched) || selectedFileName) {
      handleUpdateFormDirtyState();
    } else {
      handleResetFormDirtyState();
    }
  }, [
    isDirty,
    dirtyFields,
    userTouched,
    selectedFileName,
    handleUpdateFormDirtyState,
    handleResetFormDirtyState,
  ]);

  const watchedValues = useWatch({
    name: [
      "dmsFileData",
      "selectedPostOfficeId",
      "triggerPinCodeSearch",
      "pinCode",
      "addressType",
      "addressProofType",
      "isCommunicationSame",
    ],
    control,
  });

  const [
    dmsFileData,
    selectedPostOfficeId,
    triggerPinCodeSearch,
    currentPinCode,
    addressType,
    addressProofType,
    isCommunicationSame,
  ] = watchedValues;

  const parseExtractedAddress = (raw: string) => {
    if (!raw) return null;

    const pincodeMatch = raw.match(/\b\d{6}\b/);

    const parts = raw
      .replace(pincodeMatch?.[0] ?? "", "")
      .split(",")
      .map(p => p.trim())
      .filter(Boolean);

    return {
      houseNo: parts[0] ?? "",
      streetLane: parts[1] ?? "",
      placeName: parts[2] ?? "",
      city: parts[3] ?? "",
      district: parts[4] ?? "",
      state: parts[5] ?? "",
      pincode: pincodeMatch?.[0] ?? "",
      country: "India",
    };
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const isBusiness = customerAllDetails?.isBusiness;

  const selectOptions = useMemo(() => {
    let filteredAddressTypes: Address[] = [];

    if (editingAddressId) {
      const currentAddress = savedAddresses.find(
        addr =>
          addr.addressIdentity === editingAddressId ||
          addr.identity === editingAddressId ||
          addr.id === editingAddressId ||
          addr.addressId === editingAddressId
      );

      if (currentAddress && optionsData) {
        const currentAddressType = optionsData.find(
          opt => opt.identity === currentAddress.addressType
        );
        if (currentAddressType) {
          filteredAddressTypes = [currentAddressType];
        }
      }
    } else {
      // For new addresses, exclude already used address types
      const usedAddressTypeIds =
        savedAddresses.length > 0
          ? savedAddresses.map(addr => addr.addressType)
          : [];

      filteredAddressTypes =
        optionsData?.filter(opt => {
          const addressTypeId = opt.identity;
          const isUsed = usedAddressTypeIds.includes(addressTypeId);
          if (isUsed) return false;

          const name = opt.addressTypeName.toUpperCase();

          if (!isBusiness) {
            if (name === "BUSINESS" || name === "OFFICE") {
              return false;
            }
          }

          return true;
        }) || [];
    }

    const options = {
      addressTypes: filteredAddressTypes.map(opt => ({
        value: opt.addressTypeName,
        label: opt.addressTypeName,
      })),
      proofTypes:
        proofTypesData?.map(opt => ({
          value: opt.identity || String(opt.id),
          label: opt.name,
        })) || [],
    };

    return { options, filteredAddressTypes };
  }, [
    optionsData,
    proofTypesData,
    savedAddresses,
    editingAddressId,
    isBusiness,
  ]);

  // Auto-select first available address type for new addresses
  useEffect(() => {
    if (!editingAddressId && selectOptions.filteredAddressTypes.length > 0) {
      const firstAvailableType =
        selectOptions.filteredAddressTypes[0].addressTypeName;
      setValue("addressType", firstAvailableType, { shouldValidate: false });
    }
  }, [
    selectOptions.filteredAddressTypes,
    editingAddressId,
    addressType,
    setValue,
    isSuccess,
  ]);

  const {
    data: pinCodeData,
    error: pinCodeError,
    isFetching: isPinCodeFetching,
  } = useGetPincodeDetailsQuery(currentPinCode, {
    skip:
      !triggerPinCodeSearch || !currentPinCode || currentPinCode.length !== 6,
  });
  type ApiError = {
    data: {
      message: string;
    };
  };
  const isApiError = (error: unknown): error is ApiError => {
    return (
      typeof error === "object" &&
      error !== null &&
      "data" in error &&
      typeof (error as { data?: unknown }).data === "object" &&
      error.data !== null &&
      "message" in (error as { data: { message?: unknown } }).data &&
      typeof (error as { data: { message: unknown } }).data.message === "string"
    );
  };

  const pincodeFieldError = isApiError(pinCodeError)
    ? { type: "manual", message: pinCodeError.data.message }
    : undefined;

  const postOfficesData = useMemo(() => {
    if (!currentPinCode) {
      return [];
    }
    if (pinCodeData && Array.isArray(pinCodeData) && pinCodeData[0]) {
      const locationData = pinCodeData[0] as {
        postOffices?: PostOfficeData[];
        PostOffice?: PostOfficeData[];
      };
      const postOffices = locationData.postOffices || locationData.PostOffice;
      if (postOffices && Array.isArray(postOffices)) {
        return postOffices;
      }
    }
    return [];
  }, [pinCodeData, currentPinCode]);

  const [saveAddress, { isLoading: isSaving }] = useSaveAddressMutation();
  const [, { isLoading: isSavingPermanent }] =
    useSaveAddressPermanentTrueMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const isSubmitting = useMemo(() => {
    return isSaving || isSavingPermanent || isUpdating || isFormSubmitting;
  }, [isSaving, isSavingPermanent, isUpdating, isFormSubmitting]);

  // Process PIN code data
  useEffect(() => {
    if (pinCodeData) {
      let locationData: Record<string, unknown> | null = null;

      if (Array.isArray(pinCodeData) && pinCodeData.length > 0) {
        locationData = pinCodeData[0] as Record<string, unknown>;
      } else if (pinCodeData && typeof pinCodeData === "object") {
        locationData = pinCodeData as unknown as Record<string, unknown>;
      }

      if (locationData) {
        const stateDto = locationData.stateDto as
          | { state?: string }
          | undefined;
        const stateObj = locationData.state as
          | { state?: string }
          | string
          | undefined;
        const districtDto = locationData.districtDto as
          | { district?: string }
          | undefined;
        const districtObj = locationData.district as
          | { district?: string }
          | string
          | undefined;
        // const citiesDto = locationData.citiesDto as
        //   | { city?: string }
        //   | undefined;
        // const cityObj = locationData.city as
        //   | { city?: string }
        //   | string
        //   | undefined;

        const state =
          stateDto?.state ||
          (typeof stateObj === "object" ? stateObj.state : stateObj) ||
          (locationData.stateName as string) ||
          "";

        const district =
          districtDto?.district ||
          (typeof districtObj === "object"
            ? districtObj.district
            : districtObj) ||
          (locationData.districtName as string) ||
          "";

        // const city =
        //   citiesDto?.city ||
        //   (typeof cityObj === "object" ? cityObj.city : cityObj) ||
        //   (locationData.cityName as string) ||
        //   (locationData.officeName as string) ||
        //   "";

        const latitude = (locationData.latitude || locationData.lat || "") as
          | string
          | number;
        const longitude = (locationData.longitude ||
          locationData.lon ||
          locationData.lng ||
          "") as string | number;

        if (state || district) {
          setValue("country", "India", { shouldValidate: true });
          setValue("state", state, { shouldValidate: true });
          setValue("district", district, { shouldValidate: true });
          // Don't auto-populate city from PIN code - let user enter manually

          if (latitude && longitude) {
            setValue("latitude", latitude.toString(), { shouldValidate: true });
            setValue("longitude", longitude.toString(), {
              shouldValidate: true,
            });
            setValue(
              "coordinates",
              {
                latitude: parseFloat(latitude.toString()),
                longitude: parseFloat(longitude.toString()),
              },
              { shouldValidate: true }
            );

            try {
              const lat = parseFloat(latitude.toString());
              const lon = parseFloat(longitude.toString());

              // Only generate digipin if coordinates are valid
              if (!isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {
                const digPin = generateDigipin(lat, lon);
                setValue("digPin", digPin, { shouldValidate: true });
              } else {
                // Set empty digipin if coordinates are invalid
                setValue("digPin", "", { shouldValidate: true });
              }
            } catch (error) {
              // Silently set empty digipin on error - don't block form submission
              setValue("digPin", "", { shouldValidate: true });
              logger.error(error, { toast: false });
            }
          }
        }
      }
    }
  }, [pinCodeData, setValue]);

  useEffect(() => {
    if (postOfficesData && postOfficesData.length > 0) {
      const firstPostOffice = postOfficesData[0];
      const postOfficeIdentity = firstPostOffice.identity;

      if (postOfficeIdentity) {
        setValue("postOfficeId", postOfficeIdentity, {
          shouldValidate: true,
        });
        setValue("selectedPostOfficeId", postOfficeIdentity);
      }
    }
  }, [postOfficesData, setValue]);

  useEffect(() => {
    const selectedAddressType = optionsData?.find(
      opt => opt.addressTypeName === addressType
    );
    if (selectedAddressType) {
      setValue("addressTypeId", selectedAddressType.identity, {
        shouldValidate: true,
      });
    }
  }, [addressType, optionsData, setValue]);

  useEffect(() => {
    const selectedProofType = proofTypesData?.find(
      opt => (opt.identity || String(opt.id)) === addressProofType
    );
    if (selectedProofType) {
      setValue(
        "addressProofTypeId",
        selectedProofType.identity || String(selectedProofType.id),
        {
          shouldValidate: true,
        }
      );
    }
  }, [addressProofType, proofTypesData, setValue]);

  // Handle form population when editing (similar to AdditionalOptional pattern)
  useEffect(() => {
    if (editingAddressId && savedAddresses.length > 0) {
      const addressToEdit = savedAddresses.find(
        addr =>
          addr.addressIdentity === editingAddressId ||
          addr.identity === editingAddressId ||
          addr.id === editingAddressId ||
          addr.addressId === editingAddressId
      );

      if (addressToEdit) {
        // Get address type name
        const addressTypeName = getAddressTypeName(
          addressToEdit.addressType,
          optionsData
        );

        // Handle proof type matching
        let addressProofTypeName = "";
        let addressProofTypeId = "";

        if (addressToEdit.addressProofType && proofTypesData) {
          // Match by identity (the UUID from addressProofType field)
          const proofType = proofTypesData.find(
            proof => proof.identity === addressToEdit.addressProofType
          );

          if (proofType) {
            addressProofTypeName = proofType.name;
            addressProofTypeId =
              proofType.identity || addressToEdit.addressProofType;
          } else {
            // Fallback to the original value
            addressProofTypeName = addressToEdit.addressProofType;
            addressProofTypeId = addressToEdit.addressProofType;
          }
        }

        // Create existing documents array for validation
        const existingDocuments: UploadedDocument[] = [];
        if (addressToEdit.documentRefId && addressToEdit.filePath) {
          const documentEntry = {
            name: addressToEdit.documentRefId,
            id: addressToEdit.documentRefId,
            uploadDate: new Date().toISOString(),
            documentType: addressProofTypeName || "Address Proof",
            idNumber: "",
            validFrom: "",
            validTo: "",
            verified: "false",
            document: addressToEdit.documentRefId,
            status: "uploaded",
          };
          existingDocuments.push(documentEntry);
        }

        // Create form data
        const formData = transformFormData({
          addressType: addressTypeName,
          addressTypeId: addressToEdit.addressType,
          houseNo: addressToEdit.doorNumber || "",
          streetLane: addressToEdit.addressLine1 || "",
          placeName:
            addressToEdit.placeName || addressToEdit.addressLine2 || "",
          pinCode: addressToEdit.pincode || "",
          country: addressToEdit.country || "India",
          state: addressToEdit.state || "",
          district: addressToEdit.district || "",
          postOfficeId:
            addressToEdit.postOffice || addressToEdit.postOfficeId || "",
          city: addressToEdit.city || "",
          landmark: addressToEdit.landmark || "",
          digPin: addressToEdit.digipin || "",
          latitude: addressToEdit.latitude?.toString() || "",
          longitude: addressToEdit.longitude?.toString() || "",
          // Use the identity (UUID) for the Select component value
          addressProofType: addressProofTypeId,
          addressProofTypeId: addressProofTypeId,
          uploadedDocuments: existingDocuments,
          coordinates: {
            latitude: addressToEdit.latitude || 0,
            longitude: addressToEdit.longitude || 0,
          },
          isEnabled: addressToEdit.isActive ?? true,
          isCommunicationSame: false,
        });

        reset(formData);

        // Set selectedPostOfficeId separately to ensure it's properly set
        if (addressToEdit.postOffice || addressToEdit.postOfficeId) {
          setValue(
            "selectedPostOfficeId",
            addressToEdit.postOffice || addressToEdit.postOfficeId || ""
          );

          // Trigger PIN code search to load post office data for the dropdown
          if (addressToEdit.pincode && addressToEdit.pincode.length === 6) {
            setValue("triggerPinCodeSearch", true);
          }
        }

        // Set file-related values if document exists
        if (addressToEdit.documentRefId && addressToEdit.filePath) {
          const existingFileData = {
            fileName: addressToEdit.documentRefId,
            filePath: addressToEdit.filePath,
            originalFileName: addressToEdit.documentRefId,
            originalFileType: addressToEdit.documentRefId.endsWith(".pdf")
              ? "application/pdf"
              : "image/jpeg",
            preSignedUrl: "",
          };

          setValue("dmsFileData", existingFileData);

          const placeholderFile = new File(
            ["existing-file"],
            addressToEdit.documentRefId,
            {
              type: existingFileData.originalFileType,
            }
          );
          Object.defineProperty(placeholderFile, "size", {
            value: 1024,
            writable: false,
          });

          setValue("selectedFile", placeholderFile);
          setSelectedFile(placeholderFile);
          setSelectedFileName(addressToEdit.documentRefId);
        }
      }
    }
  }, [
    editingAddressId,
    savedAddresses,
    proofTypesData,
    optionsData,
    reset,
    setValue,
  ]);

  // Handle proof type matching when proofTypesData loads after edit
  useEffect(() => {
    if (editingAddressId && proofTypesData) {
      // Find the address being edited
      const addressToEdit = savedAddresses.find(
        addr =>
          addr.addressIdentity === editingAddressId ||
          addr.identity === editingAddressId ||
          addr.id === editingAddressId ||
          addr.addressId === editingAddressId
      );

      if (addressToEdit && addressToEdit.addressProofType) {
        const selectedProofType = proofTypesData.find(
          opt => opt.identity === addressToEdit.addressProofType
        );

        if (selectedProofType) {
          // Use the identity (UUID) for the Select component value
          setValue("addressProofType", selectedProofType.identity, {
            shouldValidate: false,
            shouldDirty: false,
          });
          setValue("addressProofTypeId", selectedProofType.identity, {
            shouldValidate: false,
            shouldDirty: false,
          });
        }
      }
    }
  }, [editingAddressId, proofTypesData, savedAddresses, setValue]);

  // Handle post office selection when post office data is loaded during edit
  useEffect(() => {
    if (editingAddressId && postOfficesData && postOfficesData.length > 0) {
      // Find the address being edited
      const addressToEdit = savedAddresses.find(
        addr =>
          addr.addressIdentity === editingAddressId ||
          addr.identity === editingAddressId ||
          addr.id === editingAddressId ||
          addr.addressId === editingAddressId
      );

      if (
        addressToEdit &&
        (addressToEdit.postOffice || addressToEdit.postOfficeId)
      ) {
        const targetPostOfficeId =
          addressToEdit.postOffice || addressToEdit.postOfficeId;

        // Check if the post office exists in the loaded data
        const postOfficeExists = postOfficesData.some(
          office => office.identity === targetPostOfficeId
        );

        if (postOfficeExists) {
          setValue("selectedPostOfficeId", targetPostOfficeId || "");
        }
      }
    }
  }, [editingAddressId, postOfficesData, savedAddresses, setValue]);

  const handleEditAddress = useCallback((address: AddressCaptureResponse) => {
    const addressId =
      address.addressIdentity ||
      address.identity ||
      address.id ||
      address.addressId;

    if (!addressId) {
      logger.error("Cannot edit address: No valid ID found", { toast: true });
      return;
    }

    setEditingAddressId(addressId);
  }, []);

  const handleDeleteAddress = useCallback((addressId: string) => {
    if (!addressId) {
      logger.error("No address ID provided for deletion", { toast: true });
      return;
    }
    setAddressToDelete(addressId);
    setShowDeleteModal(true);
  }, []);

  const confirmDeleteAddress = useCallback(async () => {
    if (!addressToDelete) return;

    try {
      await deleteAddress({ customerId, addressId: addressToDelete }).unwrap();
      logger.info("Address deleted successfully!", { toast: true });

      // Force refetch and wait for it to complete
      await refetchAddresses();

      // Clear editing state if we're deleting the currently edited address
      if (editingAddressId === addressToDelete) {
        setEditingAddressId(null);
        reset(transformFormData(DEFAULT_ADDRESS_VALUES));
      }

      // Force a small delay to ensure state updates are processed
      setTimeout(() => {
        // Additional refetch to ensure UI is updated
        refetchAddresses();
      }, 100);
    } catch (error) {
      const err = error as APIError;
      const errorMessage =
        err?.data?.message || err?.message || "Failed to delete address";
      logger.error(errorMessage, { toast: true });
    } finally {
      setShowDeleteModal(false);
      setAddressToDelete(null);
    }
  }, [
    addressToDelete,
    customerId,
    deleteAddress,
    editingAddressId,
    reset,
    refetchAddresses,
  ]);

  const cancelDeleteAddress = useCallback(() => {
    setShowDeleteModal(false);
    setAddressToDelete(null);
  }, []);

  const handlePinCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const pinCode = e.target.value;
      setValue("triggerPinCodeSearch", false);
      // Don't clear fields when in edit mode - preserve existing data
      if (pinCode.length === 0 && !editingAddressId) {
        setValue("country", "India", { shouldValidate: true });
        setValue("state", "", { shouldValidate: true });
        setValue("district", "", { shouldValidate: true });
        setValue("city", "", { shouldValidate: true });
        setValue("postOfficeId", "", { shouldValidate: true });
        setValue("latitude", "", { shouldValidate: true });
        setValue("longitude", "", { shouldValidate: true });
        setValue(
          "coordinates",
          { latitude: 0, longitude: 0 },
          { shouldValidate: true }
        );
        setValue("digPin", "", { shouldValidate: true });
      }
    },
    [setValue, editingAddressId]
  );

  const handlePinCodeSearch = useCallback(() => {
    if (currentPinCode && currentPinCode.length === 6) {
      setValue("triggerPinCodeSearch", true);
    }
  }, [currentPinCode, setValue]);

  const currentAddressProofType = addressProofType;

  const { uploadFile } = useDMSFileUpload({
    module: "customer-onboarding",
    referenceId: customerId,
    documentCategory: "address-documents",
    documentType: currentAddressProofType || "address-proof",
    onSuccess: fileData => {
      setValue("dmsFileData", fileData);
    },
    onError: error => {
      logger.error(`Address document upload failed: ${error}`, { toast: true });
    },
  });

  const handleFileSelection = useCallback(
    (file: File) => {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 1) {
        logger.error("File size must be less than 1MB", { toast: true });
        return;
      }

      setValue("selectedFile", file);
      setSelectedFileName(file.name);
      setSelectedFile(file);
      const newDocument: UploadedDocument = {
        file: file,
        name: file.name,
        id: `${Date.now()}-${file.name}`,
        uploadDate: new Date().toISOString(),
        users: customerId,
        documentType: currentAddressProofType || "",
        idNumber: "",
        validFrom: "",
        validTo: "",
        verified: "Pending",
        document: "",
        status: "Active",
      };
      setValue("uploadedDocuments", [newDocument], {
        shouldValidate: true,
      });
    },
    [setValue, customerId, currentAddressProofType]
  );
  const handleSwitchChange = useCallback(
    (checked: boolean) => {
      setValue("isCommunicationSame", checked, { shouldValidate: false });

      const communicationTypeId = getAddressTypeId(
        "COMMUNICATION",
        optionsData
      );
      const communicationType = optionsData?.find(
        opt => normalizeAddressTypeName(opt.addressTypeName) === "COMMUNICATION"
      );

      setValue(
        "addressType",
        communicationType?.addressTypeName || "COMMUNICATION",
        {
          shouldValidate: false,
        }
      );
      setValue("addressTypeId", communicationTypeId, {
        shouldValidate: false,
      });

      if (checked) {
        // Force refetch to get the latest permanent address
        refetchAddresses();

        // Use a small delay to ensure state is updated
        setTimeout(() => {
          const latestPermanentAddress = savedAddresses.find(addr => {
            const typeName = getAddressTypeName(addr.addressType, optionsData);
            return normalizeAddressTypeName(typeName) === "PERMANENT";
          });

          if (!latestPermanentAddress) {
            logger.error(
              "No permanent address found. Please add a permanent address first.",
              { toast: true }
            );
            setValue("isCommunicationSame", false, { shouldValidate: false });
            return;
          }

          // Auto-fill with permanent address details
          setValue("houseNo", latestPermanentAddress.doorNumber || "", {
            shouldValidate: false,
          });
          setValue("streetLane", latestPermanentAddress.addressLine1 || "", {
            shouldValidate: false,
          });
          setValue(
            "placeName",
            latestPermanentAddress.placeName ||
              latestPermanentAddress.addressLine2 ||
              "",
            { shouldValidate: false }
          );
          setValue("pinCode", latestPermanentAddress.pincode || "", {
            shouldValidate: false,
          });
          setValue("triggerPinCodeSearch", true);
          setValue("country", latestPermanentAddress.country || "India", {
            shouldValidate: false,
          });
          setValue("state", latestPermanentAddress.state || "", {
            shouldValidate: false,
          });
          setValue("district", latestPermanentAddress.district || "", {
            shouldValidate: false,
          });
          const postOfficeId = latestPermanentAddress.postOffice || "";
          setValue("postOfficeId", postOfficeId, { shouldValidate: false });
          setValue("selectedPostOfficeId", postOfficeId);
          setValue("city", latestPermanentAddress.city || "", {
            shouldValidate: false,
          });
          setValue("landmark", latestPermanentAddress.landmark || "", {
            shouldValidate: false,
          });
          setValue("digPin", latestPermanentAddress.digipin || "", {
            shouldValidate: false,
          });
          setValue(
            "latitude",
            latestPermanentAddress.latitude?.toString() || "",
            {
              shouldValidate: false,
            }
          );
          setValue(
            "longitude",
            latestPermanentAddress.longitude?.toString() || "",
            {
              shouldValidate: false,
            }
          );
          setValue(
            "coordinates",
            {
              latitude: latestPermanentAddress.latitude || 0,
              longitude: latestPermanentAddress.longitude || 0,
            },
            { shouldValidate: false }
          );
          // Clear document requirement when same as permanent
          setValue("uploadedDocuments", [], { shouldValidate: false });
          setValue("selectedFile", null);
          setValue("dmsFileData", null);
        }, 100);
      } else if (!checked) {
        // Clear fields when unchecked
        setValue("houseNo", "", { shouldValidate: false });
        setValue("streetLane", "", { shouldValidate: false });
        setValue("placeName", "", { shouldValidate: false });
        setValue("pinCode", "", { shouldValidate: false });
        setValue("country", "India", { shouldValidate: false });
        setValue("state", "", { shouldValidate: false });
        setValue("district", "", { shouldValidate: false });
        setValue("postOfficeId", "", { shouldValidate: false });
        setValue("selectedPostOfficeId", "");
        setValue("city", "", { shouldValidate: false });
        setValue("landmark", "", { shouldValidate: false });
        setValue("digPin", "", { shouldValidate: false });
        setValue("latitude", "", { shouldValidate: false });
        setValue("longitude", "", { shouldValidate: false });
        setValue(
          "coordinates",
          { latitude: 0, longitude: 0 },
          { shouldValidate: false }
        );
        // Reset document requirement when toggle is off
        setValue("uploadedDocuments", [], { shouldValidate: false });
        setValue("selectedFile", null);
        setValue("dmsFileData", null);
      }
    },
    [setValue, savedAddresses, optionsData, refetchAddresses] // Updated dependencies
  );

  const createSubmissionPayload = useCallback(
    (data: AddressFormData): SaveAddressPayload => {
      // Removed validateFormConfig call as FORM_CONFIG is no longer used

      const transformedData = transformFormData(data);
      const permanentTypeId = getAddressTypeId("PERMANENT", optionsData);

      return {
        addressType: transformedData.addressTypeId || permanentTypeId,
        doorNumber: (transformedData.houseNo || "").toUpperCase(),
        addressLine1: (transformedData.streetLane || "").toUpperCase(),
        addressLine2: (transformedData.placeName || "").toUpperCase(),
        landmark: (transformedData.landmark || "").toUpperCase(),
        placeName: (transformedData.placeName || "").toUpperCase(),
        city: (transformedData.city || "").toUpperCase(),
        district: (transformedData.district || "").toUpperCase(),
        state: (transformedData.state || "").toUpperCase(),
        country: (transformedData.country || "India").toUpperCase(),
        pincode: parseInt(transformedData.pinCode) || 0,
        postOfficeId:
          selectedPostOfficeId || transformedData.postOfficeId || "",
        latitude: parseFloat(transformedData.latitude) || 0,
        longitude: parseFloat(transformedData.longitude) || 0,
        geoAccuracy: 5.0,
        addressProofType: transformedData.addressProofTypeId || "",
        isActive: true,
        digipin: transformedData.digPin || "",
        isSameAsPermanent: transformedData.isCommunicationSame || false,
      };
    },
    [selectedPostOfficeId, optionsData]
  );

  const handleSubmitError = useCallback((error: unknown): void => {
    const apiError = error as APIError;
    const errorMessage =
      apiError?.data?.message ||
      apiError?.message ||
      "Failed to save address. Please try again.";
    logger.error(errorMessage, { toast: true });
  }, []);

  const checkAddressTypeExists = useCallback(
    (addressType: string, addressTypeId?: string): boolean => {
      if (!savedAddresses || savedAddresses.length === 0) return false;

      const normalizedInputType = normalizeAddressTypeName(addressType);

      return savedAddresses.some(addr => {
        const savedTypeName = getAddressTypeName(addr.addressType, optionsData);
        const normalizedSavedType = normalizeAddressTypeName(savedTypeName);

        // Check by normalized name
        if (normalizedSavedType === normalizedInputType) return true;

        // Check by ID if provided
        if (addressTypeId && addr.addressType === addressTypeId) return true;

        return false;
      });
    },
    [savedAddresses, optionsData]
  );

  const handleReset = useCallback(() => {
    const resetData = transformFormData(DEFAULT_ADDRESS_VALUES);
    if (selectOptions.filteredAddressTypes.length > 0) {
      resetData.addressType =
        selectOptions.filteredAddressTypes[0].addressTypeName;
    }
    reset(resetData);
    setValue("triggerPinCodeSearch", false);
    setEditingAddressId(null);
    setValue("selectedFile", null);
    setValue("dmsFileData", null);
    setValue("selectedPostOfficeId", "");
    setSelectedFile(null);
    setSelectedFileName(null);

    // Force refetch to ensure UI is in sync
    refetchAddresses();
  }, [reset, selectOptions, setValue, refetchAddresses]);

  // Unsaved changes detection
  const hasUnsavedChanges = useMemo(() => {
    return isDirty && editingAddressId !== null;
  }, [isDirty, editingAddressId]);

  // Notify parent component about unsaved changes
  useEffect(() => {
    if (onUnsavedChanges) {
      onUnsavedChanges(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges, onUnsavedChanges]);

  const onSubmit = useCallback(
    async (data: AddressFormData) => {
      // Prevent multiple submissions
      if (isSubmitting || isFormSubmitting) {
        logger.error("Please wait, submission in progress...", { toast: true });
        return;
      }

      // Debounce: prevent rapid clicks (minimum 2 seconds between submissions)
      const now = Date.now();
      if (now - lastSubmitTime < 2000) {
        logger.error("Please wait before submitting again...", { toast: true });
        return;
      }
      setLastSubmitTime(now);

      // Set local submitting state immediately
      setIsFormSubmitting(true);

      try {
        const isValid = await trigger();

        if (!isValid) {
          logger.error("Please fill in all required fields", { toast: true });
          setIsFormSubmitting(false);
          return;
        }
        if (!editingAddressId) {
          const addressTypeExists = checkAddressTypeExists(
            data.addressType,
            data.addressTypeId
          );
          if (addressTypeExists) {
            logger.error(
              `${data.addressType} address already exists. Please choose a different address type or edit the existing one.`,
              {
                toast: true,
              }
            );
            setIsFormSubmitting(false);
            return;
          }
        }

        if (
          !data.isCommunicationSame &&
          normalizeAddressTypeName(data.addressType) !== "PERMANENT" &&
          !selectedFile &&
          !dmsFileData
        ) {
          logger.error("Please upload a document file", { toast: true });
          setIsFormSubmitting(false);
          return;
        }
        // 1. Upload file to DMS if file is selected (only for new files, not existing ones)
        let currentDmsFileData = dmsFileData;
        // if (!data.isCommunicationSame && selectedFile && !dmsFileData) {
        if (
          !data.isCommunicationSame &&
          normalizeAddressTypeName(data.addressType) !== "PERMANENT" &&
          selectedFile &&
          !dmsFileData
        ) {
          logger.info("Uploading file to DMS...", { toast: false });
          currentDmsFileData = await uploadFile(selectedFile);
          if (!currentDmsFileData) {
            logger.error("Failed to upload file to DMS", { toast: true });
            return;
          }
          setValue("dmsFileData", currentDmsFileData);
        } else if (editingAddressId && dmsFileData) {
          // For edit mode, use existing file data
          logger.info("Using existing file data for edit", { toast: false });
          currentDmsFileData = dmsFileData;
        }

        // 2. Create payload
        let payload = createSubmissionPayload(data);

        // 3. Make API call (saveAddress or updateAddress)
        const updatedPayload = {
          addressType: payload.addressType,
          doorNumber: payload.doorNumber,
          addressLine1: payload.addressLine1,
          addressLine2: payload.addressLine2,
          landmark: payload.landmark,
          placeName: payload.placeName,
          city: payload.city,
          district: payload.district,
          state: payload.state,
          country: payload.country,
          pincode: payload.pincode,
          postOfficeId: payload.postOfficeId,
          latitude: payload.latitude,
          longitude: payload.longitude,
          geoAccuracy: payload.geoAccuracy,
          addressProofType: payload.addressProofType,
          isActive: payload.isActive,
          digipin: payload.digipin,
          isSameAsPermanent: payload.isSameAsPermanent,
        };
        if (editingAddressId) {
          // Include DMS file data in payload for updates
          const payloadWithFile = currentDmsFileData
            ? {
                ...updatedPayload,
                documentRefId: currentDmsFileData.fileName,
                filePath: currentDmsFileData.filePath,
                // fileName: currentDmsFileData.originalFileName,
                // fileType: currentDmsFileData.originalFileType,
              }
            : updatedPayload;

          await updateAddress({
            customerId,
            addressId: editingAddressId,
            payload: payloadWithFile,
          }).unwrap();

          logger.info("Address updated successfully!", { toast: true });
          setEditingAddressId(null);
          await refetchAddresses();
          handleReset();
        } else {
          const communicationTypeId = getAddressTypeId(
            "COMMUNICATION",
            optionsData
          );

          if (
            data.isCommunicationSame &&
            normalizeAddressTypeName(data.addressType) === "COMMUNICATION" &&
            permanentAddress
          ) {
            payload = {
              ...payload,
              addressType: communicationTypeId,
              // if (
              //   data.isCommunicationSame &&
              //   data.addressType === "COMMUNICATION" &&
              //   permanentAddress
              // ) {
              //   payload = {
              //     ...payload,
              //     addressType: ADDRESS_TYPE_IDS.COMMUNICATION,
              doorNumber: (permanentAddress.doorNumber || "123").toUpperCase(),
              addressLine1: (
                permanentAddress.addressLine1 || "Main Street"
              ).toUpperCase(),
              addressLine2: (
                permanentAddress.addressLine2 || "Area"
              ).toUpperCase(),
              placeName: (permanentAddress.placeName || "Area").toUpperCase(),
              pincode: permanentAddress.pincode
                ? parseInt(permanentAddress.pincode)
                : ADDRESS_CONFIG.DEFAULT_PINCODE,
              country: (
                permanentAddress.country || ADDRESS_CONFIG.DEFAULT_COUNTRY
              ).toUpperCase(),
              state: (
                permanentAddress.state || ADDRESS_CONFIG.DEFAULT_STATE
              ).toUpperCase(),
              district: (
                permanentAddress.district || ADDRESS_CONFIG.DEFAULT_DISTRICT
              ).toUpperCase(),
              city: (
                permanentAddress.city || ADDRESS_CONFIG.DEFAULT_CITY
              ).toUpperCase(),
              landmark: (permanentAddress.landmark || "").toUpperCase(),
              postOfficeId: permanentAddress.postOffice || "",
              isActive: true,
              digipin: permanentAddress.digipin || "",
              latitude:
                permanentAddress.latitude || ADDRESS_CONFIG.DEFAULT_LATITUDE,
              longitude:
                permanentAddress.longitude || ADDRESS_CONFIG.DEFAULT_LONGITUDE,
              geoAccuracy:
                permanentAddress.geoAccuracy ||
                ADDRESS_CONFIG.DEFAULT_GEO_ACCURACY,
              addressProofType: permanentAddress.addressProofType ?? "",
            };
            const updatedPayload = {
              addressType: payload.addressType,
              doorNumber: payload.doorNumber,
              addressLine1: payload.addressLine1,
              addressLine2: payload.addressLine2,
              landmark: payload.landmark,
              placeName: payload.placeName,
              city: payload.city,
              district: payload.district,
              state: payload.state,
              country: payload.country,
              pincode: payload.pincode,
              postOfficeId: payload.postOfficeId,
              latitude: payload.latitude,
              longitude: payload.longitude,
              geoAccuracy: payload.geoAccuracy,
              addressProofType: payload.addressProofType,
              isActive: payload.isActive,
              digipin: payload.digipin,
              isSameAsPermanent: payload.isSameAsPermanent,
            };

            // Include file metadata. Prefer newly uploaded DMS data; otherwise reuse from permanent address

            const payloadWithFile = currentDmsFileData
              ? {
                  ...updatedPayload,
                  documentRefId: currentDmsFileData.fileName,
                  filePath: currentDmsFileData.filePath,
                  // fileName: currentDmsFileData.originalFileName,
                  // fileType: currentDmsFileData.originalFileType,
                }
              : permanentAddress &&
                  permanentAddress.documentRefId &&
                  permanentAddress.filePath
                ? {
                    ...updatedPayload,
                    documentRefId: permanentAddress.documentRefId,
                    filePath: permanentAddress.filePath,
                  }
                : updatedPayload;

            await saveAddress({
              customerId,
              payload: payloadWithFile,
            }).unwrap();
          } else {
            // Include DMS file data in payload for new addresses
            const payloadWithFile = currentDmsFileData
              ? {
                  ...updatedPayload,
                  documentRefId: currentDmsFileData.fileName,
                  filePath: currentDmsFileData.filePath,
                  // fileName: currentDmsFileData.originalFileName,
                  // fileType: currentDmsFileData.originalFileType,
                }
              : updatedPayload;

            await saveAddress({
              customerId,
              payload: payloadWithFile,
            }).unwrap();
          }
          logger.info("Address saved successfully!", { toast: true });
          await refetchAddresses();
        }

        // 3. Show API success message (already done above)
        // 4. Refetch addresses (already done above)

        // 5. Call onFormSubmit AFTER successful API call
        if (onFormSubmit) {
          await onFormSubmit(data);
        }

        // 6. Show step completion message
        // "Address Details step completed successfully!" (handled by onFormSubmit)

        // Only dispatch setIsReady for new addresses, not when editing
        if (!editingAddressId) {
          dispatch(setIsReady(true));
        }

        // Call the same reset functionality as the reset button
        handleReset();
      } catch (error) {
        handleSubmitError(error);
      } finally {
        // Always reset the local submitting state
        setIsFormSubmitting(false);
      }
    },
    [
      trigger,
      createSubmissionPayload,
      onFormSubmit,
      editingAddressId,
      updateAddress,
      customerId,
      selectedFile,
      dmsFileData,
      uploadFile,
      optionsData,
      permanentAddress,
      saveAddress,
      dispatch,
      handleSubmitError,
      refetchAddresses,
      checkAddressTypeExists,
      handleReset,
      setValue,
      isSubmitting,
      isFormSubmitting,
      lastSubmitTime,
    ]
  );
  const [photoGalleryOpen, setphotoGalleryOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressCaptureResponse | null>(null);

  const { viewDocument, documentUrl } = useFileViewer();
  const handleViewDocument = useCallback(
    (document: AddressCaptureResponse) => {
      viewDocument(document?.filePath ?? "");
      setphotoGalleryOpen(true);
    },
    [savedAddressesData]
  );
  const renderAddressPreview = (
    address: AddressCaptureResponse,
    index: number
  ): React.ReactElement | null => {
    if (!address || typeof address !== "object") {
      return (
        <section
          key={index}
          className="border-border bg-status-error-background mb-1 rounded-lg border p-2"
        >
          <p className="text-status-error text-[10px]">Invalid address data</p>
        </section>
      );
    }
    const addressTypeName = getAddressTypeName(
      address.addressType,
      optionsData
    );
    const addressId =
      address.addressIdentity ||
      address.identity ||
      address.id ||
      address.addressId;

    const addressDocuments: UploadedDocument[] = [];

    return (
      <section
        key={index}
        className=" border-border bg-primary/10 mb-0.5 w-full rounded-lg border p-2.5"
      >
        <div className=" flex items-start justify-between">
          <Label className="text-reset/90 text-xs font-semibold">
            {toTitleCase(addressTypeName)} Address
          </Label>
          {!readOnly && (
            <div className="flex gap-2">
              <NeumorphicButton
                variant="outline"
                className="w-fit rounded-md px-3 py-0 "
                // onClick={() => handleEditAddress(address)}
                onClick={() => {
                  setSelectedAddress(address);
                  handleSetConfirmationModalData?.({
                    cancelText: "CANCEL",
                    confirmText: "EDIT",
                    feature: "EDIT",
                    description:
                      "Are you sure you want to edit this record? Any unsaved changes may be lost.",
                    title: "Edit Confirmation",
                    show: true,
                    doAction: null,
                  });
                }}
              >
                <Edit width={12} className="text-blue-300" />
              </NeumorphicButton>
              <NeumorphicButton
                variant="outline"
                className="w-fit rounded-md px-3 py-0 "
                onClick={() => {
                  if (addressId) {
                    handleDeleteAddress(addressId);
                  }
                }}
              >
                <Trash2 className="text-error h-3 w-3" />
              </NeumorphicButton>
            </div>
          )}
          {readOnly && address.filePath && (
            <div className="flex gap-2">
              <NeumorphicButton
                variant="outline"
                className="w-fit rounded-md px-3 py-0 "
                onClick={() => handleViewDocument(address)}
              >
                <Eye width={12} className="text-blue-300" />
              </NeumorphicButton>
            </div>
          )}
        </div>

        {/* Address content */}
        <div className="text-reset/80 space-y-0.5 text-[10px]">
          <p className="break-words whitespace-normal">
            {address.doorNumber || ""}
            {address.doorNumber && address.addressLine1 ? ", " : ""}
            {address.addressLine1 || ""}
            {(address.landmark && `, ${address.landmark}`) || ""}
          </p>
          <p className="break-words whitespace-normal">
            {address.placeName || address.addressLine2 || ""}
          </p>
          <p className="break-words whitespace-normal">
            {address.city || ""}
            {address.city && address.district ? ", " : ""}
            {address.district || ""}
            {address.district && address.state ? ", " : ""}
            {address.state || ""}
          </p>

          <p className="break-words whitespace-normal">
            {address.country || ""}
          </p>
          <p className="break-words whitespace-normal uppercase">
            {address.pincode + ", "}
            {address.postOfficeName || ""}
          </p>
          {address.digipin && <p>DigiPin: {address.digipin}</p>}

          {addressDocuments.length > 0 && (
            <p className="bg-success text-success mt-0.5 rounded px-2 py-1 text-[9px] font-medium">
              Attachments: {addressDocuments.length} file(s)
            </p>
          )}
        </div>
      </section>
    );
  };
  const handleCloseGallery = () => {
    viewDocument("");
    setphotoGalleryOpen(false);
  };

  useEffect(() => {
    if (editingAddressId) return;

    const extracted = getExtractedCustomer();
    if (!extracted?.address) return;

    const parsed = parseExtractedAddress(extracted.address);
    if (!parsed) return;

    const currentValues = getValues();

    if (!currentValues.houseNo && parsed.houseNo) {
      setValue("houseNo", parsed.houseNo, { shouldDirty: false });
    }

    if (!currentValues.streetLane && parsed.streetLane) {
      setValue("streetLane", parsed.streetLane, { shouldDirty: false });
    }

    if (!currentValues.placeName && parsed.placeName) {
      setValue("placeName", parsed.placeName, { shouldDirty: false });
    }

    if (!currentValues.city && parsed.city) {
      setValue("city", parsed.city, { shouldDirty: false });
    }

    if (!currentValues.district && parsed.district) {
      setValue("district", parsed.district, { shouldDirty: false });
    }

    if (!currentValues.state && parsed.state) {
      setValue("state", parsed.state, { shouldDirty: false });
    }

    if (!currentValues.country) {
      setValue("country", "India", { shouldDirty: false });
    }

    if (!currentValues.pinCode && parsed.pincode) {
      setValue("pinCode", parsed.pincode, { shouldDirty: false });
      setValue("triggerPinCodeSearch", true, { shouldDirty: false });
    }

    logger.info("Address prefilled from extracted document", { toast: false });

    clearExtractedCustomer();
  }, [editingAddressId, setValue, getValues]);
  useEffect(() => {
    if (!confirmationModalData?.doAction) return;

    switch (confirmationModalData.feature) {
      case "RESET":
        handleReset();
        break;
      case "EDIT":
        if (selectedAddress) handleEditAddress(selectedAddress);
        break;
      default:
        break;
    }
  }, [confirmationModalData]);
  return (
    <article>
      <PhotoAndDocumentGallery
        title="Address Details"
        fileType="DOC"
        imageUrl={documentUrl}
        isOpen={photoGalleryOpen && documentUrl !== null}
        onClose={handleCloseGallery}
      />
      <Grid className="px-2">
        <Flex justify="between" align="center" className="w-full">
          <HeaderWrapper>
            <TitleHeader title="Customer Address Details" />
          </HeaderWrapper>
        </Flex>

        <section className="flex flex-col-reverse items-start gap-4 lg:flex-row">
          {!readOnly && (
            <section className="w-full flex-1">
              <Form onSubmit={handleSubmit(onSubmit)} className="space-y-0.5">
                <Form.Row gap={6}>
                  <Form.Col span={12} className="bg-muted/20 ">
                    <Grid gap={2}>
                      <Form.Row gap={6}>
                        <Form.Col lg={5} md={6} span={12}>
                          <Form.Field
                            label="Address Type"
                            required
                            error={errors.addressType}
                          >
                            <Controller
                              name="addressType"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  disabled={
                                    isSubmitting ||
                                    readOnly ||
                                    isOptionsFetching
                                  }
                                  placeholder="Select"
                                  size="form"
                                  variant="form"
                                  fullWidth={true}
                                  itemVariant="form"
                                  options={selectOptions.options.addressTypes}
                                  capitalize={true}
                                  onBlur={() => field.onBlur()}
                                />
                              )}
                            />
                          </Form.Field>
                        </Form.Col>
                        {normalizeAddressTypeName(addressType) ===
                          "COMMUNICATION" && (
                          <Form.Col lg={3} md={6} span={12}>
                            <Form.Field error={errors.isCommunicationSame}>
                              <Flex
                                align="center"
                                gap={2}
                                className="h-full pt-4"
                              >
                                <Controller
                                  name="isCommunicationSame"
                                  control={control}
                                  render={({ field }) => (
                                    <Switch
                                      id="isCommunicationSame"
                                      checked={field.value}
                                      onCheckedChange={handleSwitchChange}
                                      disabled={isSubmitting || readOnly}
                                    />
                                  )}
                                />
                                <Label
                                  htmlFor="isCommunicationSame"
                                  className="text-xss leading-tight"
                                >
                                  <span className="block">
                                    Communication address same as Permanent
                                    address
                                  </span>
                                </Label>
                              </Flex>
                            </Form.Field>
                          </Form.Col>
                        )}
                        <Form.Col
                          lg={addressType === "COMMUNICATION" ? 4 : 7}
                          md={6}
                          span={12}
                        >
                          <Form.Field
                            label="House No/House Name/Door No"
                            required
                            disabled={
                              isSubmitting || readOnly || isCommunicationSame
                            }
                            error={errors.houseNo}
                          >
                            <Input
                              {...register("houseNo")}
                              type="text"
                              placeholder="Enter House No/House Name/Door No"
                              size="form"
                              variant="form"
                              disabled={
                                isSubmitting || readOnly || isCommunicationSame
                              }
                              className="uppercase"
                              restriction="alphanumeric"
                              autoCapitalize="words"
                              maxLength={100}
                            />
                          </Form.Field>
                        </Form.Col>
                      </Form.Row>

                      <Form.Row gap={6}>
                        <Form.Col lg={6} md={6} span={12}>
                          <Form.Field
                            label="Street / Lane Name"
                            required
                            disabled={
                              isSubmitting || readOnly || isCommunicationSame
                            }
                            error={errors.streetLane}
                          >
                            <Input
                              {...register("streetLane")}
                              type="text"
                              placeholder="Enter Street / Lane Name"
                              size="form"
                              variant="form"
                              maxLength={100}
                              disabled={
                                isSubmitting || readOnly || isCommunicationSame
                              }
                              className="uppercase"
                              restriction="alphanumeric"
                              autoCapitalize="words"
                            />
                          </Form.Field>
                        </Form.Col>
                        <Form.Col lg={6} md={6} span={12}>
                          <Form.Field
                            label="Place Name"
                            required
                            disabled={
                              isSubmitting || readOnly || isCommunicationSame
                            }
                            error={errors.placeName}
                          >
                            <Input
                              {...register("placeName")}
                              type="text"
                              placeholder="Enter Place Name"
                              size="form"
                              variant="form"
                              maxLength={100}
                              disabled={
                                isSubmitting || readOnly || isCommunicationSame
                              }
                              className="uppercase"
                              restriction="custom"
                              allowedChars="a-zA-Z "
                              autoCapitalize="words"
                            />
                          </Form.Field>
                        </Form.Col>
                      </Form.Row>

                      <Form.Row gap={6}>
                        <Form.Col lg={3} md={6} span={12}>
                          <Form.Field
                            label="PIN Code"
                            required
                            disabled={
                              isSubmitting || readOnly || isCommunicationSame
                            }
                            error={errors.pinCode || pincodeFieldError}
                          >
                            <Controller
                              name="pinCode"
                              control={control}
                              render={({ field }) => (
                                <InputWithSearch
                                  {...field}
                                  type="text"
                                  placeholder="e.g. 600001"
                                  size="form"
                                  variant="form"
                                  maxLength={6}
                                  onSearch={handlePinCodeSearch}
                                  isSearching={isPinCodeFetching}
                                  disabled={
                                    isSubmitting ||
                                    readOnly ||
                                    isCommunicationSame
                                  }
                                  inputType="phone"
                                  onChange={e => {
                                    field.onChange(e);
                                    handlePinCodeChange(e);
                                  }}
                                />
                              )}
                            />
                          </Form.Field>
                        </Form.Col>
                        <Form.Col lg={3} md={6} span={12}>
                          <Form.Field
                            label="Country"
                            required
                            disabled={true}
                            error={errors.country}
                          >
                            <Input
                              {...register("country")}
                              type="text"
                              placeholder="Read-only"
                              size="form"
                              variant="form"
                              maxLength={50}
                              disabled={true}
                              className="bg-muted/50 text-muted-foreground uppercase"
                              restriction="alphabetic"
                              autoCapitalize="words"
                            />
                          </Form.Field>
                        </Form.Col>
                        <Form.Col lg={3} md={6} span={12}>
                          <Form.Field
                            label="State"
                            required
                            disabled={true}
                            error={errors.state}
                          >
                            <Input
                              {...register("state")}
                              type="text"
                              placeholder="Read-only"
                              size="form"
                              variant="form"
                              maxLength={50}
                              disabled={true}
                              className="bg-muted/50 text-muted-foreground uppercase"
                              restriction="alphabetic"
                              autoCapitalize="words"
                            />
                          </Form.Field>
                        </Form.Col>
                        <Form.Col lg={3} md={6} span={12}>
                          <Form.Field
                            label="District"
                            required
                            disabled={true}
                            error={errors.district}
                          >
                            <Input
                              {...register("district")}
                              type="text"
                              placeholder="Read-only"
                              size="form"
                              variant="form"
                              maxLength={50}
                              disabled={true}
                              className="bg-muted/50 text-muted-foreground uppercase"
                              restriction="alphabetic"
                              autoCapitalize="words"
                            />
                          </Form.Field>
                        </Form.Col>
                      </Form.Row>

                      <Form.Row gap={6}>
                        <Form.Col lg={3} md={6} span={12}>
                          <Form.Field
                            label="Post Office"
                            required
                            disabled={
                              isSubmitting ||
                              readOnly ||
                              isPinCodeFetching ||
                              isCommunicationSame
                            }
                            error={errors.postOfficeId}
                          >
                            <Controller
                              name="postOfficeId"
                              control={control}
                              render={({ field }) => {
                                const currentOptions = [
                                  ...(field.value &&
                                  !postOfficesData?.some(
                                    po => po.identity === field.value
                                  )
                                    ? [
                                        {
                                          value: field.value,
                                          label: field.value,
                                        },
                                      ]
                                    : []),
                                  ...(postOfficesData
                                    ?.map((postOffice, index) => {
                                      const name =
                                        postOffice.Name ||
                                        postOffice.name ||
                                        postOffice.officeName ||
                                        `Post Office ${index + 1}`;
                                      return {
                                        value:
                                          postOffice.identity || `po-${index}`,
                                        label: name,
                                      };
                                    })
                                    .filter(option => option.value) || []),
                                ];

                                return (
                                  <Select
                                    value={field.value}
                                    onValueChange={selectedIdentity => {
                                      field.onChange(selectedIdentity);
                                      setValue(
                                        "selectedPostOfficeId",
                                        selectedIdentity
                                      );
                                    }}
                                    disabled={
                                      isSubmitting ||
                                      readOnly ||
                                      isPinCodeFetching ||
                                      isCommunicationSame
                                    }
                                    placeholder="Select"
                                    size="form"
                                    variant="form"
                                    fullWidth={true}
                                    itemVariant="form"
                                    options={currentOptions}
                                    capitalize={true}
                                    onBlur={() => field.onBlur()}
                                  />
                                );
                              }}
                            />
                          </Form.Field>
                        </Form.Col>
                        <Form.Col lg={3} md={6} span={12}>
                          <Form.Field
                            label="City"
                            required
                            disabled={
                              isSubmitting || readOnly || isCommunicationSame
                            }
                            error={errors.city}
                          >
                            <Input
                              {...register("city")}
                              type="text"
                              placeholder="Enter City"
                              size="form"
                              variant="form"
                              maxLength={100}
                              disabled={
                                isSubmitting || readOnly || isCommunicationSame
                              }
                              className="uppercase"
                              restriction="alphabetic"
                              autoCapitalize="words"
                            />
                          </Form.Field>
                        </Form.Col>
                        <Form.Col lg={6} md={6} span={12}>
                          <Form.Field
                            label="Landmark"
                            disabled={
                              isSubmitting || readOnly || isCommunicationSame
                            }
                            error={errors.landmark}
                            required
                          >
                            <Input
                              {...register("landmark")}
                              type="text"
                              placeholder="Enter Landmark"
                              size="form"
                              variant="form"
                              maxLength={100}
                              disabled={
                                isSubmitting || readOnly || isCommunicationSame
                              }
                              className="uppercase"
                              restriction="alphanumeric"
                              autoCapitalize="words"
                            />
                          </Form.Field>
                        </Form.Col>
                      </Form.Row>

                      <Form.Row gap={6}>
                        {!isCommunicationSame &&
                          normalizeAddressTypeName(addressType) !==
                            "PERMANENT" && (
                            <Form.Col lg={4} md={6} span={12}>
                              <Form.Field
                                label="Address Proof Type"
                                required
                                error={errors.addressProofType}
                              >
                                <Controller
                                  name="addressProofType"
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                      disabled={
                                        isSubmitting ||
                                        readOnly ||
                                        isCommunicationSame
                                      }
                                      placeholder="Select"
                                      size="form"
                                      variant="form"
                                      fullWidth={true}
                                      itemVariant="form"
                                      options={selectOptions.options.proofTypes}
                                      capitalize={true}
                                      onBlur={() => field.onBlur()}
                                    />
                                  )}
                                />
                              </Form.Field>
                            </Form.Col>
                          )}
                        {!isCommunicationSame &&
                          normalizeAddressTypeName(addressType) !==
                            "PERMANENT" && (
                            <Form.Col lg={4} md={6} span={12}>
                              <Form.Field
                                label="Upload Document"
                                required={!isCommunicationSame}
                              >
                                <>
                                  {isCommunicationSame ? (
                                    <div className="text-muted-foreground bg-muted text-xss rounded-md p-3">
                                      No document upload required when
                                      communication address is same as permanent
                                      address
                                    </div>
                                  ) : (
                                    <div className="space-y-0.5">
                                      <NeumorphicButton
                                        type="button"
                                        onClick={() => {
                                          const input =
                                            document.createElement("input");
                                          input.type = "file";
                                          input.accept = ".jpg,.jpeg,.png,.pdf";
                                          input.onchange = e => {
                                            const file = (
                                              e.target as HTMLInputElement
                                            ).files?.[0];
                                            if (file) {
                                              handleFileSelection(file);
                                            }
                                          };
                                          input.click();
                                        }}
                                        disabled={
                                          isSubmitting ||
                                          readOnly ||
                                          isCommunicationSame
                                        }
                                        fullWidth
                                      >
                                        {editingAddressId && dmsFileData
                                          ? "Replace File"
                                          : "Choose File"}
                                      </NeumorphicButton>
                                      {selectedFileName ? (
                                        <div className="text-status-success text-xss mt-1">
                                          {selectedFileName}
                                          {editingAddressId && dmsFileData ? (
                                            <span className="text-muted-foreground ml-1">
                                              (Existing file)
                                            </span>
                                          ) : (
                                            selectedFile && (
                                              <span>
                                                (
                                                {(
                                                  selectedFile.size /
                                                  1024 /
                                                  1024
                                                ).toFixed(2)}{" "}
                                                MB)
                                              </span>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-xss text-muted-foreground mt-1">
                                          Accepted format JPG,PNG,JPEG,PDF Max
                                          size: 1MB
                                        </p>
                                      )}
                                    </div>
                                  )}
                                  {errors.uploadedDocuments && (
                                    <div className="text-status-error text-xs">
                                      {Array.isArray(errors.uploadedDocuments)
                                        ? errors.uploadedDocuments[0]?.message
                                        : errors.uploadedDocuments.message}
                                    </div>
                                  )}
                                </>
                              </Form.Field>
                            </Form.Col>
                          )}
                      </Form.Row>

                      {/* Show Upload Document for all address types */}
                      {/* {!isCommunicationSame && ( */}

                      {isPinCodeFetching && (
                        <Form.Row gap={6}>
                          <Form.Col span={12}>
                            <Flex
                              align="center"
                              className="text-primary text-xs"
                            >
                              <span>Loading location data...</span>
                            </Flex>
                          </Form.Col>
                        </Form.Row>
                      )}
                    </Grid>
                  </Form.Col>
                </Form.Row>

                <Flex justify="end" gap={6} className="mt-1">
                  {!readOnly && (
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
                          <div className="flex items-center gap-2">
                            <Spinner
                              variant="default"
                              size={12}
                              className="text-primary-foreground"
                            />
                            <span>
                              {editingAddressId ? "Updating..." : "Saving..."}
                            </span>
                          </div>
                        ) : editingAddressId ? (
                          <>
                            <Save width={12} />
                            Update Address
                          </>
                        ) : (
                          <>
                            <PlusCircle width={12} />
                            Add Address Details
                          </>
                        )}
                      </NeumorphicButton>
                    </>
                  )}
                </Flex>
              </Form>
            </section>
          )}

          <section className="w-full flex-shrink-0 lg:w-90 ">
            <section className="max-h-[700px] space-y-2 ">
              {isAddressesLoading ? (
                <div className="border-border bg-muted/10 flex h-full flex-col items-center justify-center rounded-lg border p-4">
                  <Spinner
                    variant="default"
                    size={16}
                    className="text-primary mb-1"
                  />
                  <span className="text-muted-foreground text-[10px] font-medium">
                    Loading addresses...
                  </span>
                </div>
              ) : !Array.isArray(savedAddresses) ||
                savedAddresses.length === 0 ? (
                <div className="border-border bg-muted/10 flex h-[470px] flex-col items-center justify-center rounded-lg border p-4">
                  <span className="text-muted-foreground text-[10px] font-medium">
                    No address available.
                  </span>
                  <span className="text-muted-foreground text-[10px] font-medium">
                    Add or verify the address to continue.
                  </span>
                  {!Array.isArray(savedAddresses) && (
                    <span className="text-status-error mt-1 text-xs">
                      Error: Invalid address data format
                    </span>
                  )}
                </div>
              ) : (
                <div className="border-border bg-muted/10 flex h-fit flex-col gap-2 overflow-y-auto rounded-xs border p-2 shadow-md">
                  {savedAddresses
                    .map((address, index) => {
                      if (!address || typeof address !== "object") {
                        return null;
                      }
                      return renderAddressPreview(address, index);
                    })
                    .filter(Boolean)}
                </div>
              )}
            </section>
          </section>
        </section>
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteAddress}
        onCancel={cancelDeleteAddress}
        title="Delete"
        message="Are you Sure you want to delete this address? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </article>
  );
};
