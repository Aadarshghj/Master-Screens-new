import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Flex } from "@/components/ui/flex";
import { FormContainer } from "@/components/ui/form-container";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Form } from "@/components/ui/form";

import { logger } from "@/global/service";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import type {
  Address,
  DropdownOption,
  AddressType,
  SiteType,
} from "@/types/firm/firm-address.types";
import type { SaveAddressPayload } from "@/types/customer/address.types";
import { addressDefaultValues } from "../constants/form.constants";
import { addressDetailsValidationSchema } from "@/global/validation/firm/firmAddress.schema";
import { AddressForm } from "./Form/AddressForm";
import { AddressDetailsSection } from "./Form/AddressDetailsSection";
import {
  useGetSitePremiseQuery,
  useGetAddressTypesQuery,
  useLazyGetLocationByPincodeQuery,
  useSaveAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetCustomerAddressQuery,
} from "@/global/service/end-points/Firm/addressDetails";
import { useFirmOnboardState } from "@/hooks/useFirmOnboardState";
import { setCurrentStepSaved } from "@/global/reducers/firm/firmOnboarding.reducer";

// Helper function to map string to SiteType enum
const mapToSiteType = (value: string): SiteType => {
  const siteTypeMap: Record<string, SiteType> = {
    Rented: "Rented" as SiteType,
    Owned: "Owned" as SiteType,
    Leased: "Leased" as SiteType,
  };
  return siteTypeMap[value] || ("Rented" as SiteType);
};

interface AddressDetailsFormProps {
  readonly?: boolean;
  initialData?: Address;
  onSave?: (data: Address) => void;
  onCancel?: () => void;
}

interface AddressTypeApiItem {
  identity: string;
  addressTypeName: string;
}

interface AddressTypesApiResponse {
  addressTypes: AddressTypeApiItem[];
}

type ExtendedDropdownOption = DropdownOption & {
  identity: string;
  addressTypeName: string;
};

interface SiteTypeResponse {
  identity: string;
  premiseTypeName: string;
}

interface PostOffice {
  identity: string;
  officeName?: string;
  name?: string;
}

interface LocationResponse {
  stateName: string;
  districtName: string;
  postOffices: PostOffice[];
}

interface ApiAddress {
  addressType?: string;
  addressTypeName?: string;
  postOffice?: string;
  postOfficeName?: string;
  siteOrFactoryPremiseId?: string;
  siteType?: string;
  addressLine1?: string;
  streetLane?: string;
  doorNumber?: string;
  placeName?: string;
  addressLine2?: string;
  pincode?: string;
  pinCode?: string;
  country?: string;
  state?: string;
  district?: string;
  city?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  nameOfOwner?: string;
  relationshipWithFirm?: string;
  landlineNumber?: string;
  mobileNumber?: string;
  emailId?: string;
  addressId?: string;
  identity?: string;
  addressIdentity?: string;
  isPrimary?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  digipin?: string;
  digPin?: string;
}

export const AddressDetails: React.FC<AddressDetailsFormProps> = ({
  readonly = false,
  initialData,
  onSave,
}) => {
  const dispatch = useAppDispatch();
  const [isFetchingPinCode, setIsFetchingPinCode] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [postOfficeOptions, setPostOfficeOptions] = useState<
    ExtendedDropdownOption[]
  >([]);

  const { handleUpdateState, handleResetState } = useFirmOnboardState();

  const [postOfficeMap, setPostOfficeMap] = useState<Map<string, string>>(
    new Map()
  );
  const fetchedPincodesRef = useRef<Set<string>>(new Set());
  const lastLookedUpPinCodeRef = useRef<string | null>(null);

  const customerIdentity = useAppSelector(
    state => state.firmOnboarding?.customerId
  );

  // API hooks
  const [saveAddress, { isLoading: isSaving }] = useSaveAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  // Fetch customer addresses from API
  const { data: customerAddresses = [], refetch: refetchAddresses } =
    useGetCustomerAddressQuery(customerIdentity || "", {
      skip: !customerIdentity,
    });

  const { data: addressTypeData, isLoading: isLoadingAddressTypes } =
    useGetAddressTypesQuery();

  const addressTypeResponse: ExtendedDropdownOption[] = useMemo(() => {
    if (!addressTypeData) return [];

    if (Array.isArray(addressTypeData)) {
      return addressTypeData as ExtendedDropdownOption[];
    }

    const apiResponse = addressTypeData as AddressTypesApiResponse;

    if (!Array.isArray(apiResponse.addressTypes)) return [];

    return apiResponse.addressTypes.map(item => ({
      identity: item.identity,
      value: item.addressTypeName,
      label: item.addressTypeName,
      addressTypeName: item.addressTypeName,
    }));
  }, [addressTypeData]);

  const { data: siteTypeOptions = [], isLoading: isLoadingSiteTypes } =
    useGetSitePremiseQuery();
  const [getLocationByPincode] = useLazyGetLocationByPincodeQuery();

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<Address>({
    resolver: yupResolver(addressDetailsValidationSchema) as Resolver<Address>,
    mode: "onBlur" as const,
    defaultValues: initialData || (addressDefaultValues as Address),
  });

  const addressTypeOptions = useMemo<ExtendedDropdownOption[]>(() => {
    return (addressTypeResponse as ExtendedDropdownOption[]).map(item => ({
      identity: item.identity,
      addressTypeName: item.addressTypeName,
      value: item.value,
      label: item.label,
    }));
  }, [addressTypeResponse]);

  const siteTypeOptionsMapped = useMemo<ExtendedDropdownOption[]>(() => {
    if (!Array.isArray(siteTypeOptions)) return [];
    return siteTypeOptions.map(item => ({
      identity: (item as unknown as SiteTypeResponse).identity || "",
      addressTypeName:
        (item as unknown as SiteTypeResponse).premiseTypeName || "",
      value: (item as unknown as SiteTypeResponse).premiseTypeName || "",
      label: (item as unknown as SiteTypeResponse).premiseTypeName || "",
    }));
  }, [siteTypeOptions]);

  // Fetch location data based on PIN code
  const handlePinCodeLookup = useCallback(
    async (pinCode: string) => {
      if (!pinCode || pinCode.length !== 6) {
        logger.error("Please enter a valid 6-digit PIN code", {
          toast: true,
          pushLog: false,
        });
        return;
      }

      if (lastLookedUpPinCodeRef.current === pinCode) {
        return;
      }

      try {
        setIsFetchingPinCode(true);
        lastLookedUpPinCodeRef.current = pinCode;
        fetchedPincodesRef.current.add(pinCode);

        const locationResult = await getLocationByPincode(pinCode);
        const responseData = locationResult.data;

        if (Array.isArray(responseData) && responseData.length > 0) {
          const firstItem = responseData[0] as LocationResponse;
          const { stateName, districtName, postOffices } = firstItem;

          // Populate form fields
          setValue("country", "India", { shouldValidate: true });
          setValue("state", stateName || "", { shouldValidate: true });
          setValue("district", districtName || "", { shouldValidate: true });

          // Map post offices into dropdown options
          const options =
            postOffices?.map(po => ({
              identity: po.identity,
              addressTypeName: po.officeName || po.name || "",
              value: po.officeName || po.name || "",
              label: po.officeName || po.name || "",
            })) || [];

          setPostOfficeOptions(options);

          const newPostOfficeMap = new Map(postOfficeMap);
          postOffices?.forEach(po => {
            if (po.identity && (po.officeName || po.name)) {
              newPostOfficeMap.set(po.identity, po.officeName || po.name || "");
            }
          });
          setPostOfficeMap(newPostOfficeMap);

          if (options.length > 0) {
            setValue("postOffice", options[0].value || "", {
              shouldValidate: true,
            });
          }
        } else {
          logger.error("No location data found for this PIN code", {
            toast: true,
          });
          lastLookedUpPinCodeRef.current = null;
        }
      } catch {
        logger.error("Failed to fetch location data", { toast: true });
        lastLookedUpPinCodeRef.current = null;
      } finally {
        setIsFetchingPinCode(false);
      }
    },
    [getLocationByPincode, setValue, postOfficeMap]
  );

  // Get current location coordinates
  const handleFetchLocation = async () => {
    try {
      setIsFetchingLocation(true);

      if (!navigator.geolocation) {
        logger.error("Geolocation is not supported by your browser", {
          toast: true,
          pushLog: false,
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          setValue("latitude", position.coords.latitude.toString(), {
            shouldValidate: true,
          });
          setValue("longitude", position.coords.longitude.toString(), {
            shouldValidate: true,
          });
          logger.info("Location fetched successfully", {
            toast: true,
            pushLog: false,
          });
          setIsFetchingLocation(false);
        },
        () => {
          logger.error("Failed to get location", {
            toast: true,
          });
          setIsFetchingLocation(false);
        }
      );
    } catch {
      logger.error("Failed to fetch location", { toast: true });
      setIsFetchingLocation(false);
    }
  };

  const generateDigiPin = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${timestamp}-${random}`.substring(0, 14);
  };

  // Transform API response - map UUIDs to names
  const transformApiAddressToFormAddress = useCallback(
    (apiAddress: ApiAddress): Address => {
      let addressTypeName = "";
      if (apiAddress.addressType) {
        const foundAddressType = addressTypeOptions.find(
          opt =>
            (opt as ExtendedDropdownOption).identity === apiAddress.addressType
        );

        addressTypeName =
          (foundAddressType as ExtendedDropdownOption)?.addressTypeName ||
          foundAddressType?.label ||
          apiAddress.addressTypeName ||
          "";
      } else {
        addressTypeName = apiAddress.addressTypeName || "";
      }

      let postOfficeName = "";
      if (apiAddress.postOffice && typeof apiAddress.postOffice === "string") {
        if (
          apiAddress.postOffice.includes("-") &&
          apiAddress.postOffice.length > 20
        ) {
          postOfficeName =
            postOfficeMap.get(apiAddress.postOffice) ||
            apiAddress.postOfficeName ||
            "";
        } else {
          postOfficeName = apiAddress.postOffice;
        }
      } else {
        postOfficeName = apiAddress.postOfficeName || "";
      }

      let siteTypeValue = "";
      if (apiAddress.siteOrFactoryPremiseId) {
        const foundSiteType = siteTypeOptionsMapped.find(
          opt =>
            (opt as ExtendedDropdownOption).identity ===
            apiAddress.siteOrFactoryPremiseId
        );
        siteTypeValue =
          foundSiteType?.value ||
          (foundSiteType as ExtendedDropdownOption)?.addressTypeName ||
          apiAddress.siteOrFactoryPremiseId ||
          "";
      } else if (apiAddress.siteType) {
        const foundSiteType = siteTypeOptionsMapped.find(
          opt =>
            (opt as ExtendedDropdownOption).identity === apiAddress.siteType ||
            opt.value === apiAddress.siteType ||
            (opt as ExtendedDropdownOption).addressTypeName ===
              apiAddress.siteType
        );
        siteTypeValue =
          foundSiteType?.value ||
          (foundSiteType as ExtendedDropdownOption)?.addressTypeName ||
          apiAddress.siteType ||
          "";
      }

      const transformedAddress = {
        addressType: addressTypeName as AddressType, // Store the actual name, not the enum
        streetLaneName:
          apiAddress.addressLine1 ||
          apiAddress.streetLane ||
          apiAddress.doorNumber ||
          "",
        placeName: apiAddress.placeName || apiAddress.addressLine2 || "",
        pinCode: apiAddress.pincode || apiAddress.pinCode || "",
        country: apiAddress.country || "",
        state: apiAddress.state || "",
        district: apiAddress.district || "",
        postOffice: postOfficeName,
        city: apiAddress.city || "",
        landmark: apiAddress.landmark || "",
        latitude: apiAddress.latitude?.toString() || "",
        longitude: apiAddress.longitude?.toString() || "",
        siteType: mapToSiteType(siteTypeValue),
        ownerName: apiAddress.nameOfOwner || "",
        relationshipWithFirm: apiAddress.relationshipWithFirm || "",
        landlineNumber: apiAddress.landlineNumber || "",
        mobileNumber: apiAddress.mobileNumber || "",
        emailId: apiAddress.emailId || "",
        addressId:
          apiAddress.addressId ||
          apiAddress.identity ||
          apiAddress.addressIdentity ||
          "",
        isPrimary: apiAddress.isPrimary || false,
        isActive: apiAddress.isActive ?? true,
        createdAt: apiAddress.createdAt,
        updatedAt: apiAddress.updatedAt,
        digiPin: apiAddress.digipin || apiAddress.digPin || "",
      };

      return transformedAddress;
    },
    [addressTypeOptions, postOfficeMap, siteTypeOptionsMapped]
  );

  // Transform addresses from API to form format
  const savedAddresses = useMemo(() => {
    if (!Array.isArray(customerAddresses)) return [];
    return customerAddresses.map(transformApiAddressToFormAddress);
  }, [customerAddresses, transformApiAddressToFormAddress]);

  const usedAddressTypes = useMemo(() => {
    return new Set(
      savedAddresses.map(addr => addr.addressType).filter(Boolean)
    );
  }, [savedAddresses]);

  const currentAddressType = watch("addressType");

  const addressTypeOptionsWithDisabled = useMemo<
    ExtendedDropdownOption[]
  >(() => {
    return addressTypeOptions.map(option => {
      const addressType = option.value as AddressType;

      const isUsed = usedAddressTypes.has(addressType);
      const isCurrentEdit = addressType === currentAddressType;

      return {
        ...option,
        disabled: isUsed && !isCurrentEdit,
      };
    });
  }, [addressTypeOptions, usedAddressTypes, currentAddressType]);

  useEffect(() => {
    if (!Array.isArray(customerAddresses) || customerAddresses.length === 0)
      return;

    const fetchMissingPostOffices = async () => {
      const pincodesToFetch = new Set<string>();

      customerAddresses.forEach(addr => {
        const pincode = addr.pincode || addr.pinCode;
        const postOffice = addr.postOffice;

        if (
          pincode &&
          postOffice &&
          typeof postOffice === "string" &&
          postOffice.includes("-") &&
          postOffice.length > 20 &&
          !postOfficeMap.has(postOffice) &&
          !fetchedPincodesRef.current.has(pincode)
        ) {
          pincodesToFetch.add(pincode);
        }
      });

      // Fetch pincode data for missing post offices
      for (const pincode of pincodesToFetch) {
        fetchedPincodesRef.current.add(pincode);
        try {
          const locationResult = await getLocationByPincode(pincode);
          const responseData = locationResult.data;

          if (Array.isArray(responseData) && responseData.length > 0) {
            const firstItem = responseData[0] as LocationResponse;
            const postOffices = firstItem.postOffices;

            if (Array.isArray(postOffices)) {
              setPostOfficeMap(prevMap => {
                const newMap = new Map(prevMap);
                postOffices.forEach(po => {
                  if (po.identity && (po.officeName || po.name)) {
                    newMap.set(po.identity, po.officeName || po.name || "");
                  }
                });
                return newMap;
              });
            }
          }
        } catch {
          fetchedPincodesRef.current.delete(pincode);
        }
      }
    };

    fetchMissingPostOffices();
  }, [customerAddresses, postOfficeMap, getLocationByPincode]);

  const hasAddresses =
    Array.isArray(customerAddresses) && customerAddresses.length > 0;

  useEffect(() => {
    if (!hasAddresses) {
      handleUpdateState(
        "Incomplete Step",
        "Please Add at least One Address before continuing."
      );
      dispatch(setCurrentStepSaved(false));
    } else {
      handleResetState();
      dispatch(setCurrentStepSaved(true));
    }
  }, [hasAddresses, handleUpdateState, handleResetState, dispatch]);

  const onSubmit = handleSubmit(async formData => {
    try {
      if (!customerIdentity) {
        return logger.error("Customer identity not found", { toast: true });
      }

      // Ensure Digi Pin exists
      if (!formData.digiPin) {
        const newDigiPin = generateDigiPin();
        formData.digiPin = newDigiPin;
        setValue("digiPin", newDigiPin, { shouldValidate: false });
      }

      // Generic helper to safely extract identity from options
      const findIdentity = (
        options: ExtendedDropdownOption[],
        value: string
      ) => {
        const found = options.find(
          opt =>
            opt.value === value ||
            opt.addressTypeName === value ||
            opt.identity === value ||
            opt.label === value
        );
        return found?.identity || "";
      };

      const addressTypeId = findIdentity(
        addressTypeOptions,
        formData.addressType as string
      );
      const postOfficeId = findIdentity(
        postOfficeOptions,
        formData.postOffice as string
      );

      const {
        pinCode,
        streetLaneName,
        placeName,
        digiPin,
        latitude,
        longitude,
        ...rest
      } = formData;

      const payload: SaveAddressPayload = {
        addressType: addressTypeId,
        doorNumber: streetLaneName,
        addressLine1: streetLaneName,
        addressLine2: placeName,
        landmark: rest.landmark || "",
        placeName,
        city: rest.city || "",
        district: rest.district || "",
        state: rest.state || "",
        country: rest.country || "",
        pincode: parseInt(pinCode) || 0,
        postOfficeId,
        latitude: latitude ? parseFloat(latitude) : 0,
        longitude: longitude ? parseFloat(longitude) : 0,
        geoAccuracy: 0,
        addressProofType: "",
        isActive: rest.isActive ?? true,
        digipin: digiPin,

        isSameAsPermanent: false,
      };

      const isUpdate = Boolean(formData.addressId);

      if (isUpdate) {
        await updateAddress({
          customerId: customerIdentity,
          addressId: formData.addressId!,
          payload,
        }).unwrap();
      } else {
        await saveAddress({
          customerId: customerIdentity,
          payload,
        }).unwrap();
      }

      logger.info(`Address ${isUpdate ? "updated" : "saved"} successfully`, {
        toast: true,
        pushLog: false,
      });

      await refetchAddresses();
      onSave?.(formData);

      reset(addressDefaultValues as Address);
      lastLookedUpPinCodeRef.current = null;
      setPostOfficeOptions([]);
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
          ? String((error.data as { message: string }).message)
          : "Failed to save address details";
      logger.error(errorMessage, {
        toast: true,
      });
    }
  });

  // Handle delete with server API
  const handleDelete = async (addressId: string) => {
    try {
      if (!customerIdentity) {
        logger.error("Customer identity not found", { toast: true });
        return;
      }

      await deleteAddress({
        customerId: customerIdentity,
        addressId,
      }).unwrap();

      await refetchAddresses();

      logger.info("Address deleted successfully", {
        toast: true,
      });
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
          ? String((error.data as { message: string }).message)
          : "Failed to delete address";
      logger.error(errorMessage, {
        toast: true,
      });
    }
  };

  // Handle reset
  const handleReset = () => {
    reset(addressDefaultValues as Address);
    setPostOfficeOptions([]);
    lastLookedUpPinCodeRef.current = null;
    logger.info("Form reset successfully", {
      toast: true,
      pushLog: false,
    });
  };

  // Determine loading state
  const isLoading = isSaving || isUpdating;

  return (
    <article className="address-details-form-container">
      <FormContainer className="border-none">
        <Form onSubmit={onSubmit} className="border-none">
          <div className="grid grid-cols-12 gap-6">
            {/* Left: Address Form */}
            {!readonly && (
              <div className="col-span-12 lg:col-span-8">
                <AddressForm
                  control={control}
                  errors={errors}
                  register={register}
                  isLoading={isLoading}
                  readonly={readonly}
                  addressTypeOptions={addressTypeOptionsWithDisabled}
                  siteTypeOptions={siteTypeOptionsMapped}
                  postOfficeOptions={postOfficeOptions}
                  isLoadingAddressTypes={isLoadingAddressTypes}
                  isLoadingSiteTypes={isLoadingSiteTypes}
                  isFetchingPinCode={isFetchingPinCode}
                  isFetchingLocation={isFetchingLocation}
                  onPinCodeLookup={handlePinCodeLookup}
                  onFetchLocation={handleFetchLocation}
                  setValue={setValue}
                  watch={watch}
                />
              </div>
            )}
            <aside
              className={
                !readonly ? "col-span-12 h-screen lg:col-span-4" : "col-span-12"
              }
            >
              <AddressDetailsSection
                savedAddresses={savedAddresses}
                readonly={readonly}
                onEdit={async addressId => {
                  const addr = savedAddresses.find(
                    a => a.addressId === addressId
                  );
                  if (!addr)
                    return logger.error("Address not found", { toast: true });

                  reset(addr);

                  const { pinCode, postOffice } = addr;
                  if (!pinCode) {
                    logger.info("Loaded address into form for editing", {
                      pushLog: false,
                    });
                    return;
                  }

                  setValue("pinCode", pinCode, { shouldValidate: false });

                  if (pinCode.length === 6) {
                    lastLookedUpPinCodeRef.current = null;
                    await handlePinCodeLookup(pinCode);

                    // Wait a bit for post office options to be populated
                    setTimeout(() => {
                      if (postOffice) {
                        setValue("postOffice", postOffice, {
                          shouldValidate: false,
                        });
                      }
                    }, 100);
                  }

                  logger.info("Loaded address into form for editing", {
                    toast: true,
                    pushLog: false,
                  });
                }}
                onDelete={handleDelete}
              />
            </aside>
          </div>

          {/* Form Actions */}
          {!readonly && (
            <div className="mt-6">
              <Flex justify="center" align="center" gap={2}>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleReset}
                  disabled={isLoading || readonly}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  disabled={isLoading || readonly}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading
                    ? watch("addressId")
                      ? "Updating..."
                      : "Saving..."
                    : watch("addressId")
                      ? "Update Address"
                      : "Add Address Details"}
                </Button>
              </Flex>
            </div>
          )}
        </Form>
      </FormContainer>
    </article>
  );
};
