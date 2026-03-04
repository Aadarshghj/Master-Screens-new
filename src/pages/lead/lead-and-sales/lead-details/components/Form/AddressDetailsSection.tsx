import React, { useCallback, useEffect, useState } from "react";
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
  type UseFormTrigger,
  Controller,
} from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { Plus, Minus } from "lucide-react";
import type {
  LeadDetailsFormData,
  ConfigOption,
} from "@/types/lead/lead-details.types";
import { InputWithSearch } from "@/components/ui/input-with-search";
import { logger } from "@/global/service";
import { useGetPincodeDetailsQuery } from "@/global/service/end-points/master/master";
import { generateDigipin } from "@/utils/location/digipin.utils";

const FORM_CONFIG = {
  MINIMUM_PINCODE_LENGTH: 6,
  MAXIMUM_PINCODE_LENGTH: 6,
} as const;

interface AddressDetailsSectionProps {
  control: Control<LeadDetailsFormData>;
  errors: FieldErrors<LeadDetailsFormData>;
  register: UseFormRegister<LeadDetailsFormData>;
  isLoading: boolean;
  readonly: boolean;
  addressTypeOptions: ConfigOption[];
  addressProofOptions: ConfigOption[];
  isLoadingAddressTypes: boolean;
  isLoadingAddressProofTypes: boolean;
  setValue: UseFormSetValue<LeadDetailsFormData>;
  watch: UseFormWatch<LeadDetailsFormData>;
  trigger: UseFormTrigger<LeadDetailsFormData>;
  isExpanded?: boolean;
  setIsExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
  resetTrigger?: number;
}

export const AddressDetailsSection: React.FC<AddressDetailsSectionProps> = ({
  control,
  errors,
  register,
  isLoading,
  readonly,
  addressTypeOptions,
  isLoadingAddressTypes,
  setValue,
  watch,
  trigger,
  isExpanded: externalIsExpanded,
  setIsExpanded: externalSetIsExpanded,
}) => {
  const watchedPincode = watch("pincode");

  const [shouldSearchPincode, setShouldSearchPincode] = useState(false);
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);

  const isExpanded = externalIsExpanded ?? internalIsExpanded;
  const setIsExpanded = externalSetIsExpanded ?? setInternalIsExpanded;

  const [pincodePostOffices, setPincodePostOffices] = useState<
    Array<{ officeName: string; identity: string }>
  >([]);

  const { data: locationData, isLoading: isLoadingLocation } =
    useGetPincodeDetailsQuery(watchedPincode, {
      skip:
        !shouldSearchPincode || !watchedPincode || watchedPincode.length !== 6,
    });

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

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
    } catch (error) {
      logger.error(error, { toast: true });
    }
  }, [watchedPincode]);

  useEffect(() => {
    if (locationData && !isLoadingLocation && shouldSearchPincode) {
      try {
        let location;

        if (Array.isArray(locationData) && locationData.length > 0) {
          location = locationData[0];
        } else if (locationData && typeof locationData === "object") {
          location = locationData;
        }

        if (!location) {
          logger.error("No location data found for this pincode", {
            toast: true,
            pushLog: false,
          });
          setShouldSearchPincode(false);
          return;
        }

        const stateDto = location.stateDto;
        const stateObj = location.state;
        const districtDto = location.districtDto;
        const districtObj = location.district;

        const state =
          stateDto?.state ||
          (typeof stateObj === "object" ? stateObj.state : stateObj) ||
          location.stateName ||
          "";

        const district =
          districtDto?.district ||
          (typeof districtObj === "object"
            ? districtObj.district
            : districtObj) ||
          location.districtName ||
          "";

        // Get coordinates
        const latitude = (location.latitude || location.lat || "") as
          | string
          | number;
        const longitude = (location.longitude ||
          location.lon ||
          location.lng ||
          "") as string | number;

        // Set values
        setValue("country", "India", { shouldValidate: true });
        setValue("state", state, { shouldValidate: true });
        setValue("district", district, { shouldValidate: true });

        if (latitude && longitude) {
          setValue("latitude", latitude.toString(), { shouldValidate: true });
          setValue("longitude", longitude.toString(), { shouldValidate: true });

          // Generate digipin
          try {
            const lat = parseFloat(latitude.toString());
            const lon = parseFloat(longitude.toString());

            if (!isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {
              const digPin = generateDigipin(lat, lon);
              setValue("digipin", digPin, { shouldValidate: true });
            }
          } catch (error) {
            setValue("digipin", "", { shouldValidate: true });
            logger.error(error, { toast: false });
          }
        }

        // Handle post offices
        const postOffices = location.postOffices || location.PostOffice;
        if (
          postOffices &&
          Array.isArray(postOffices) &&
          postOffices.length > 0
        ) {
          const postOfficesData = postOffices.map(
            (office: {
              officeName?: string;
              Name?: string;
              name?: string;
              identity: string;
            }) => ({
              officeName: office.officeName || office.Name || office.name || "",
              identity: office.identity,
            })
          );

          setPincodePostOffices(postOfficesData);

          if (postOfficesData.length > 0) {
            setValue("postOfficeId", postOfficesData[0].identity, {
              shouldValidate: true,
            });
          }
        } else {
          setPincodePostOffices([]);
          setValue("postOfficeId", "", { shouldValidate: true });
        }

        trigger(["state", "district", "postOfficeId"]);
        setShouldSearchPincode(false);
      } catch (error) {
        logger.error(error, { toast: true });
        setShouldSearchPincode(false);
      }
    }
  }, [locationData, isLoadingLocation, shouldSearchPincode, setValue, trigger]);

  const handlePincodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const pinCode = e.target.value;
      setShouldSearchPincode(false);
      // Clear fields when pincode is cleared
      if (pinCode.length === 0) {
        setValue("country", "India", { shouldValidate: true });
        setValue("state", "", { shouldValidate: true });
        setValue("district", "", { shouldValidate: true });
        setValue("city", "", { shouldValidate: true });
        setValue("postOfficeId", "", { shouldValidate: true });
        setValue("latitude", "", { shouldValidate: true });
        setValue("longitude", "", { shouldValidate: true });
        setValue("digipin", "", { shouldValidate: true });
      }
    },
    [setValue]
  );

  useEffect(() => {
    const watchedPostOfficeId = watch("postOfficeId");

    if (watchedPostOfficeId && pincodePostOffices.length > 0) {
      const postOfficeExists = pincodePostOffices.some(
        office => office.identity === watchedPostOfficeId
      );

      if (!postOfficeExists) {
        if (watchedPincode && watchedPincode.length === 6) {
          setShouldSearchPincode(true);
        }
      }
    }
  }, [watch("postOfficeId"), pincodePostOffices, watchedPincode]);

  useEffect(() => {
    const postOfficeId = watch("postOfficeId");

    if (
      watchedPincode &&
      watchedPincode.length === 6 &&
      postOfficeId &&
      pincodePostOffices.length === 0
    ) {
      setShouldSearchPincode(true);
    }
  }, [watchedPincode, watch("postOfficeId"), pincodePostOffices.length]);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2">
        <TitleHeader title="Address Details (Optional)" />
        <Button
          type="button"
          variant={isExpanded ? "circularGray" : "circularPrimary"}
          onClick={toggleExpand}
          disabled={isLoading || readonly}
        >
          {isExpanded ? (
            <Minus className="h-3 w-3 text-black" />
          ) : (
            <Plus className="h-3 w-3" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div>
          <Form.Row className="mt-4">
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Address Type" error={errors.addressType}>
                <Controller
                  name="addressType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || readonly || isLoadingAddressTypes}
                      placeholder="Select Option"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={addressTypeOptions}
                      loading={isLoadingAddressTypes}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={5} md={6} span={12}>
              <Form.Field
                label="House No/House Name/Door No"
                error={errors.houseNo}
              >
                <Input
                  {...register("houseNo")}
                  placeholder="Enter House No/House Name/Door No"
                  size="form"
                  variant="form"
                  disabled={isLoading || readonly}
                  textTransform="uppercase"
                  restriction="alphanumeric"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={6} span={12}>
              <Form.Field label="Street/Lane Name" error={errors.streetLane}>
                <Input
                  {...register("streetLane")}
                  placeholder="Street/Lane name"
                  size="form"
                  variant="form"
                  disabled={isLoading || readonly}
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row className="mt-4">
            <Form.Col lg={4} md={6} span={12}>
              <Form.Field label="Place Name" error={errors.placeName}>
                <Input
                  {...register("placeName")}
                  placeholder="Enter Place Name"
                  size="form"
                  variant="form"
                  disabled={isLoading || readonly}
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="PIN Code" error={errors?.pincode}>
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
                      onSearch={handlePincodeSearch}
                      isSearching={isLoadingLocation}
                      disabled={isLoading}
                      inputType="phone"
                      onChange={e => {
                        field.onChange(e);
                        handlePincodeChange(e);
                      }}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Country" error={errors.country}>
                <Input
                  {...register("country")}
                  type="text"
                  placeholder="Enter Country Name"
                  size="form"
                  variant="form"
                  disabled={isLoading || readonly}
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="State" error={errors.state}>
                <Input
                  {...register("state")}
                  type="text"
                  placeholder="Enter State Name"
                  size="form"
                  variant="form"
                  disabled={isLoading || readonly}
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="District" error={errors.district}>
                <Input
                  {...register("district")}
                  type="text"
                  placeholder="Enter District Name"
                  size="form"
                  variant="form"
                  disabled={isLoading || readonly}
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row className="mt-4">
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Post Officecc" error={errors?.postOfficeId}>
                <Controller
                  name="postOfficeId"
                  control={control}
                  render={({ field }) => {
                    const currentOptions = [
                      ...(field.value &&
                      !pincodePostOffices.some(
                        po => po.identity === field.value
                      )
                        ? [{ value: field.value, label: field.value }]
                        : []),
                      ...pincodePostOffices.map(
                        (office: { officeName: string; identity: string }) => ({
                          value: office.identity,
                          label: office.officeName,
                        })
                      ),
                      ...(pincodePostOffices.length === 0 && !field.value
                        ? [
                            {
                              value: "no-offices",
                              label:
                                "No post offices available for this pincode",
                              disabled: true,
                            },
                          ]
                        : []),
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
                        key={`post-office-${pincodePostOffices.length}-${field.value}`}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select Option"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={currentOptions}
                        disabled={isLoading || readonly}
                      />
                    );
                  }}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="City" error={errors.city}>
                <Input
                  {...register("city")}
                  placeholder="Enter City"
                  size="form"
                  variant="form"
                  disabled={isLoading || readonly}
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={6} span={12}>
              <Form.Field label="Landmark" error={errors.landmark}>
                <Input
                  {...register("landmark")}
                  placeholder="Enter Landmark"
                  size="form"
                  variant="form"
                  disabled={isLoading || readonly}
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            {/* <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Digi Pin" error={errors.digipin}>
                <Input
                  {...register("digipin")}
                  size="form"
                  variant="form"
                  disabled={true}
                />
              </Form.Field>
            </Form.Col> */}
            {/* <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Address Proof Type"
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
                        isLoading || readonly || isLoadingAddressProofTypes
                      }
                      placeholder="Select Proof Type"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={addressProofOptions}
                      loading={isLoadingAddressProofTypes}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col> */}
          </Form.Row>
          {/*
          <Form.Row className="mt-4">
            <Form.Col lg={4} md={6} span={12}>
              <div className="space-y-0.5">
                <Label className="text-xxs font-medium">Location</Label>
                <Flex gap={1}>
                  <Input
                    {...register("latitude")}
                    type="text"
                    placeholder="Latitude"
                    size="form"
                    variant="form"
                    disabled
                    className="flex-1"
                  />
                  <Input
                    {...register("longitude")}
                    type="text"
                    placeholder="Longitude"
                    size="form"
                    variant="form"
                    disabled
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="compact"
                    className="bg-primary text-card h-[28px] px-2"
                    title="Get current location"
                    disabled={isLoading || readonly}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </Flex>
              </div>
            </Form.Col>

            <Form.Col lg={2} md={4} span={12}>
              <Form.Field label="Upload Document">
                <FileUpload
                  onFileSelect={handleFileSelect}
                  disabled={isLoading || readonly}
                  returnBase64={false}
                  resetTrigger={resetTrigger}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row> */}
        </div>
      )}
    </div>
  );
};
