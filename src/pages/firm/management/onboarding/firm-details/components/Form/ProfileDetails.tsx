import React, { useState, useEffect } from "react";
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
  Controller,
  type UseFormSetValue,
  type UseFormGetValues,
  useWatch,
  type UseFormTrigger,
} from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputWithSearch } from "@/components/ui/input-with-search";
import { Select } from "@/components/ui/select";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import type {
  FirmProfile,
  ConfigOption,
} from "@/types/firm/firm-details.types";
import { Search } from "lucide-react";
import { FirmSearchModal } from "../Modal/FirmSearch";
import {
  useSearchCanvasserQuery,
  useGetCanvasserByIdQuery,
} from "@/global/service/end-points/customer/canvasser";
import CapsuleButton from "@/components/ui/capsule-button/capsule-button";
import { DatePicker } from "@/components";

interface ProfileDetailProps {
  control: Control<FirmProfile>;
  errors: FieldErrors<FirmProfile>;
  register: UseFormRegister<FirmProfile>;
  setValue: UseFormSetValue<FirmProfile>;
  getValues: UseFormGetValues<FirmProfile>;
  trigger: UseFormTrigger<FirmProfile>;
  isLoading: boolean;
  readonly: boolean;
  firmTypeOptions: ConfigOption[];
  productCategoryOptions: ConfigOption[];
  canvassedTypeOptions: ConfigOption[];
  isLoadingFirmTypes: boolean;
  isLoadingProductCategories: boolean;
  isLoadingCannelmentTypes: boolean;
  onSearchCanvasser?: (canvasserStaffId: string) => void;
  onFirmSelected?: (ids?: {
    customerIdentity?: string;
    firmIdentity?: string;
    status?: string;
  }) => void;
}

export const ProfileDetail: React.FC<ProfileDetailProps> = ({
  control,
  errors,
  register,
  setValue,
  getValues,
  isLoading,
  readonly,
  firmTypeOptions,
  productCategoryOptions,
  canvassedTypeOptions,
  isLoadingFirmTypes,
  isLoadingProductCategories,
  isLoadingCannelmentTypes,
  onFirmSelected,
  trigger,
}) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [canvassorDisplayValue, setCanvassorDisplayValue] = useState("");
  const [, setSelectedCanvassorId] = useState("");

  // Watch the values at the top level (where hooks are allowed)
  const canvassedType = useWatch({ control, name: "canvassedType" });
  const canvasserIdentity = useWatch({ control, name: "canvasserIdentity" });

  const { data: canvasserByIdData } = useGetCanvasserByIdQuery(
    {
      canvassedTypeId: canvassedType || "",
      canvasserStaffId: canvasserIdentity || "",
    },
    {
      skip: !canvassedType || !canvasserIdentity,
    }
  );

  const { data: canvasserData } = useSearchCanvasserQuery(
    {
      canvassedTypeId: canvassedType || "",
      canvasserName:
        canvassorDisplayValue ||
        (canvasserIdentity ? canvasserIdentity.toString() : ""),
    },
    {
      skip: !canvassedType || canvassorDisplayValue.length < 2,
    }
  );

  // Transform data for dropdown
  const dropdownOptions =
    canvasserData?.map(canvasser => ({
      value: canvasser.canvasserIdentity,
      label: `${canvasser.canvasserCode} - ${canvasser.canvasserName}`,
    })) || [];

  useEffect(() => {
    if (
      productCategoryOptions.length > 0 &&
      !getValues("productIndustryCategory")
    ) {
      setValue("productIndustryCategory", productCategoryOptions[0].value, {
        shouldDirty: false,
      });
    }
  }, [productCategoryOptions, setValue, getValues]);

  // Ensure canvassed type gets a default when options load (same pattern as product category)
  useEffect(() => {
    if (canvassedTypeOptions.length > 0 && !canvassedType) {
      setValue(
        "canvassedType",
        canvassedTypeOptions[0].value as FirmProfile["canvassedType"],
        {
          shouldDirty: false,
          shouldValidate: false,
        }
      );
    }
  }, [canvassedTypeOptions, canvassedType, setValue]);

  // Sync display value with form value when component loads with existing data
  useEffect(() => {
    const currentCanvassorId = getValues("canvasserIdentity");
    if (currentCanvassorId && canvasserData) {
      const matchingCanvasser = canvasserData.find(
        canvasser => canvasser.canvasserIdentity === currentCanvassorId
      );
      if (matchingCanvasser) {
        setCanvassorDisplayValue(
          `${matchingCanvasser.canvasserCode} - ${matchingCanvasser.canvasserName}`
        );
        setSelectedCanvassorId(currentCanvassorId);
      }
    }
  }, [canvasserData, getValues]);

  // Initialize and map API response fields on component mount
  // Sync display value with form value when component loads with existing data
  useEffect(() => {
    const currentCanvassorId = getValues("canvasserIdentity");
    if (currentCanvassorId && canvasserData) {
      const matchingCanvasser = canvasserData.find(
        canvasser => canvasser.canvasserIdentity === currentCanvassorId
      );
      if (matchingCanvasser) {
        setCanvassorDisplayValue(
          `${matchingCanvasser.canvasserCode} - ${matchingCanvasser.canvasserName}`
        );
        setSelectedCanvassorId(currentCanvassorId);
      }
    }
  }, [canvasserData, getValues]);

  // Initialize and map API response fields on component mount
  useEffect(() => {
    const allValues = getValues();

    // Map API response fields to form fields
    const extendedValues = allValues as unknown as Record<string, unknown>;
    if (extendedValues.canvassedTypeIdentity && !allValues.canvassedType) {
      const canvassedTypeIdentity =
        extendedValues.canvassedTypeIdentity as string;
      setValue(
        "canvassedType",
        canvassedTypeIdentity as FirmProfile["canvassedType"],
        { shouldDirty: false }
      );
    }

    if (
      extendedValues.canvasserIdentity &&
      typeof extendedValues.canvasserIdentity === "number"
    ) {
      const numericCanvassorId = extendedValues.canvasserIdentity as number;
      setValue("canvasserIdentity", numericCanvassorId.toString());
      setCanvassorDisplayValue(numericCanvassorId.toString());
      setSelectedCanvassorId(numericCanvassorId.toString());
    } else if (allValues.canvasserIdentity && !canvassorDisplayValue) {
      setCanvassorDisplayValue(allValues.canvasserIdentity.toString());
      setSelectedCanvassorId(allValues.canvasserIdentity.toString());
    }
  }, [canvassorDisplayValue, getValues, setValue]);

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const handleSelectFirm = (firm: FirmProfile) => {
    setValue("typeOfFirm", firm.firmTypeIdentity);
    setValue("firmName", firm.firmName);
    setValue("productIndustryCategory", firm.productIndustryCategory);
    setValue("registrationNo", firm.registrationNo);
    setValue("registrationDate", firm.registrationDate);
    setValue("canvassedType", firm.canvassedTypeIdentity);
    setValue("canvasserIdentity", firm.canvasserIdentity);

    if (firm.firmIdentity) {
      localStorage.setItem("firmIdentity", firm.firmIdentity);
    }

    if (firm.associatedPersons && firm.associatedPersons?.length > 0) {
      setValue("associatedPersons", firm.associatedPersons);
    }

    if (onFirmSelected) {
      onFirmSelected({
        customerIdentity: firm.customerIdentity,
        firmIdentity: firm.firmIdentity,
        status: firm.status,
      });
    }
  };

  useEffect(() => {
    if (!canvasserByIdData || !canvasserByIdData.length) return;

    const canvasser = canvasserByIdData[0];

    setCanvassorDisplayValue(
      `${canvasser.canvasserCode} - ${canvasser.canvasserName}`
    );
    setSelectedCanvassorId(canvasser.canvasserIdentity);
  }, [canvasserByIdData]);

  return (
    <>
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <TitleHeader title="Firm Profile" />
          <CapsuleButton
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            label="Search"
            icon={Search}
            disabled={isLoading || readonly}
          />
        </div>

        <div className="mt-6">
          <Form.Row className="mt-4">
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Type of Firm" required>
                <Controller
                  name="typeOfFirm"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={field.onChange}
                      disabled={isLoading || readonly || isLoadingFirmTypes}
                      placeholder="Select Firm Type"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={firmTypeOptions}
                      loading={isLoadingFirmTypes}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
                <Form.Error error={errors.typeOfFirm} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={6} md={6} span={12}>
              <Form.Field label="Firm Name" required>
                <Input
                  {...register("firmName", {
                    onChange: e => {
                      e.target.value = e.target.value.replace(
                        /[^a-zA-Z0-9\s]/g,
                        ""
                      );
                    },
                  })}
                  placeholder="Enter firm name"
                  size="form"
                  className="uppercase"
                  variant="form"
                  disabled={isLoading || readonly}
                  onInput={e => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/[^a-zA-Z0-9\s]/g, "");
                  }}
                />
                <Form.Error error={errors.firmName} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Product/Industry Category" required>
                <Controller
                  name="productIndustryCategory"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={field.onChange}
                      disabled={
                        isLoading || readonly || isLoadingProductCategories
                      }
                      placeholder="Select Category"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={productCategoryOptions}
                      loading={isLoadingProductCategories}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
                <Form.Error error={errors.productIndustryCategory} />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row className="mt-4">
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Registration No." required>
                <Input
                  {...register("registrationNo")}
                  placeholder="Enter registration number"
                  size="form"
                  variant="form"
                  disabled={isLoading || readonly}
                  onInput={e => {
                    e.currentTarget.value = e.currentTarget.value
                      .toUpperCase()
                      .replace(/[^A-Za-z0-9]/g, "")
                      .slice(0, 20);
                  }}
                />
                <Form.Error error={errors.registrationNo} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Registration Date" required>
                <Controller
                  name="registrationDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value || undefined}
                      onChange={(value: string) => {
                        field.onChange(value);
                        trigger?.("registrationDate");
                      }}
                      onBlur={() => field.onBlur()}
                      placeholder="dd/mm/yyyy"
                      allowManualEntry={true}
                      size="form"
                      variant="form"
                      disableFutureDates={true}
                      disabled={isLoading || readonly}
                    />
                  )}
                />
                <Form.Error error={errors.registrationDate} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Canvassed Type" required>
                <Controller
                  name="canvassedType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={field.onChange}
                      disabled={
                        isLoading || readonly || isLoadingCannelmentTypes
                      }
                      placeholder="Select Type"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={canvassedTypeOptions}
                      loading={isLoadingCannelmentTypes}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
                <Form.Error error={errors.canvassedType} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Canvassor ID" required>
                <Controller
                  name="canvasserIdentity"
                  control={control}
                  render={({ field }) => (
                    <InputWithSearch
                      value={canvassorDisplayValue || ""}
                      onChange={e => {
                        const value = e.target.value.toUpperCase();
                        setCanvassorDisplayValue(value);
                        setSelectedCanvassorId("");
                        field.onChange(value || null);
                        setShowDropdown(value.length >= 2);
                      }}
                      placeholder="Search canvassor ID"
                      size="form"
                      variant="form"
                      disabled={isLoading || readonly || !canvassedType}
                      showDropdown={showDropdown && dropdownOptions.length > 0}
                      dropdownOptions={dropdownOptions}
                      onOptionSelect={option => {
                        const canvasserIdentity = option.value;

                        setSelectedCanvassorId(canvasserIdentity);
                        setCanvassorDisplayValue(option.label);
                        setShowDropdown(false);

                        field.onChange(canvasserIdentity);
                        setValue("canvasserIdentity", canvasserIdentity, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                      // onBlur={() => {
                      //   setTimeout(() => setShowDropdown(false), 200);
                      // }}
                      onFocus={() => {
                        if (canvassorDisplayValue.length >= 2) {
                          setShowDropdown(true);
                        }
                      }}
                      noResultsText={
                        !canvassedType
                          ? "Select canvassed type first"
                          : "No canvassers found"
                      }
                    />
                  )}
                />
                <Form.Error error={errors.canvasserIdentity} />
              </Form.Field>
            </Form.Col>
          </Form.Row>
        </div>
      </div>

      {/* Search Modal */}
      <FirmSearchModal
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        onSelectFirm={handleSelectFirm}
      />
    </>
  );
};
