import React from "react";
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
  Controller,
} from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { Map } from "lucide-react";
import type { Address, DropdownOption } from "@/types/firm/firm-address.types";

import { InputWithSearch } from "@/components/ui/input-with-search";
import { addressFieldPlaceholders } from "../constants/form.constants";
import { toUpperSafe } from "@/utils";
interface AddressSectionProps {
  control: Control<Address>;
  errors: FieldErrors<Address>;
  register: UseFormRegister<Address>;
  isLoading: boolean;
  readonly: boolean;
  addressTypeOptions: DropdownOption[];
  siteTypeOptions: DropdownOption[];
  postOfficeOptions: DropdownOption[];
  isLoadingAddressTypes: boolean;
  isLoadingSiteTypes: boolean;
  isFetchingPinCode: boolean;
  isFetchingLocation: boolean;
  onPinCodeLookup: (pinCode: string) => Promise<void>;
  onFetchLocation: () => Promise<void>;
  setValue: UseFormSetValue<Address>;
  watch: UseFormWatch<Address>;
}

export const AddressForm: React.FC<AddressSectionProps> = ({
  control,
  errors,
  register,
  isLoading,
  readonly,
  addressTypeOptions,
  siteTypeOptions,
  postOfficeOptions,
  isLoadingAddressTypes,
  isLoadingSiteTypes,
  isFetchingPinCode,
  isFetchingLocation,
  onPinCodeLookup,
  onFetchLocation,
  watch,
}) => {
  const pinCode = watch("pinCode");
  const addressType = watch("addressType");

  // Get the display name for the selected address type
  const getAddressTypeLabel = () => {
    if (!addressType) return "Address";
    const selectedOption = addressTypeOptions.find(
      option => option.value === addressType
    );
    return selectedOption ? selectedOption.label : "Address";
  };

  return (
    <div className="mt-8">
      <TitleHeader title={getAddressTypeLabel()} />

      <div className="mt-4 flex flex-col gap-4">
        {/* Row 1 */}
        <Form.Row className="mt-4">
          <Form.Col lg={4}>
            <Form.Field label="Address Type" required>
              {" "}
              <Controller
                name="addressType"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={field.onChange}
                      disabled={isLoading || readonly || isLoadingAddressTypes}
                      placeholder="Select Address Type"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                      options={addressTypeOptions}
                      loading={isLoadingAddressTypes}
                    />
                  );
                }}
              />{" "}
              <Form.Error error={errors.addressType} />{" "}
            </Form.Field>
          </Form.Col>

          <Form.Col lg={4}>
            <Form.Field label="Street /Lane Name" required>
              <Input
                {...register("streetLaneName", {
                  setValueAs: toUpperSafe,
                })}
                placeholder={addressFieldPlaceholders.streetLaneName}
                size="form"
                variant="form"
                disabled={isLoading || readonly}
                restriction="alphanumeric"
                maxLength={30}
                className="uppercase"
              />
              <Form.Error error={errors.streetLaneName} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={4}>
            <Form.Field label="Place Name" required>
              <Input
                {...register("placeName", {
                  setValueAs: toUpperSafe,
                })}
                placeholder={addressFieldPlaceholders.placeName}
                size="form"
                variant="form"
                disabled={isLoading || readonly}
                restriction="alphanumeric"
                className="uppercase"
                maxLength={30}
              />
              <Form.Error error={errors.placeName} />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        {/* Row 2 */}
        <Form.Row className="mt-4">
          <Form.Col lg={3}>
            <Form.Field label="PIN Code" required>
              <InputWithSearch
                {...register("pinCode")}
                placeholder={addressFieldPlaceholders.pinCode}
                size="form"
                variant="form"
                disabled={isLoading || readonly}
                maxLength={6}
                onSearch={() => onPinCodeLookup(pinCode)}
                isSearching={isFetchingPinCode}
              />
              <Form.Error error={errors.pinCode} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3}>
            <Form.Field label="Country" required>
              <Input
                {...register("country")}
                placeholder={addressFieldPlaceholders.country}
                size="form"
                variant="form"
                disabled
              />
              <Form.Error error={errors.country} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3}>
            <Form.Field label="State" required>
              <Input
                {...register("state")}
                placeholder={addressFieldPlaceholders.state}
                size="form"
                variant="form"
                disabled
              />
              <Form.Error error={errors.state} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3}>
            <Form.Field label="District" required>
              <Input
                {...register("district")}
                placeholder={addressFieldPlaceholders.district}
                size="form"
                variant="form"
                disabled
              />
              <Form.Error error={errors.district} />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        {/* Row 3 */}
        <Form.Row className="mt-4">
          <Form.Col lg={4}>
            <Form.Field label="Post Office" required>
              <Controller
                name="postOffice"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() || undefined}
                    onValueChange={field.onChange}
                    disabled={isLoading || readonly}
                    placeholder={addressFieldPlaceholders.postOffice}
                    size="form"
                    variant="form"
                    fullWidth
                    itemVariant="form"
                    options={postOfficeOptions}
                  />
                )}
              />
              <Form.Error error={errors.postOffice} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={4}>
            <Form.Field label="City" required>
              <Input
                {...register("city", {
                  setValueAs: toUpperSafe,
                })}
                placeholder={addressFieldPlaceholders.city}
                size="form"
                variant="form"
                disabled={isLoading || readonly}
                restriction="alphanumeric"
                className="uppercase"
                maxLength={20}
              />
              <Form.Error error={errors.city} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={4}>
            <Form.Field label="Landmark" required>
              <Input
                {...register("landmark", {
                  setValueAs: toUpperSafe,
                })}
                placeholder={addressFieldPlaceholders.landmark}
                size="form"
                variant="form"
                disabled={isLoading || readonly}
                restriction="alphanumeric"
                className="uppercase"
                maxLength={20}
              />
              <Form.Error error={errors.landmark} />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        {/* Row 4 */}
        <Form.Row className="mt-4">
          <Form.Col lg={3}>
            <Form.Field label="Digi pin">
              <Input
                {...register("digiPin")}
                placeholder={addressFieldPlaceholders.digiPin}
                size="form"
                variant="form"
                disabled
              />
              <Form.Error error={errors.digiPin} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={6}>
            <Form.Field label="Location">
              <div className="flex gap-2">
                <Input
                  {...register("latitude", {
                    onChange: e => {
                      const value = e.target.value;
                      if (value && !/^-?\d*\.?\d*$/.test(value)) {
                        e.target.value = value.slice(0, -1);
                        return;
                      }
                      const parts = value.split(".");
                      if (parts.length === 2 && parts[1].length > 5) {
                        e.target.value = parts[0] + "." + parts[1].slice(0, 5);
                      }
                    },
                  })}
                  placeholder={addressFieldPlaceholders.latitude}
                  size="form"
                  variant="form"
                  disabled={isLoading || readonly}
                />
                <Input
                  {...register("longitude", {
                    onChange: e => {
                      const value = e.target.value;
                      // Allow only numbers, decimal point, and negative sign
                      if (value && !/^-?\d*\.?\d*$/.test(value)) {
                        e.target.value = value.slice(0, -1);
                        return;
                      }
                      // Limit to 5 decimal places after the dot
                      const parts = value.split(".");
                      if (parts.length === 2 && parts[1].length > 5) {
                        e.target.value = parts[0] + "." + parts[1].slice(0, 5);
                      }
                    },
                  })}
                  placeholder={addressFieldPlaceholders.longitude}
                  size="form"
                  variant="form"
                  disabled={isLoading || readonly}
                />
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={onFetchLocation}
                  disabled={isLoading || readonly || isFetchingLocation}
                  className="whitespace-nowrap"
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3}>
            <Form.Field label="Site / Factory Premise">
              <Controller
                name="siteType"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() || undefined}
                    onValueChange={field.onChange}
                    disabled={isLoading || readonly || isLoadingSiteTypes}
                    placeholder={addressFieldPlaceholders.siteType}
                    size="form"
                    variant="form"
                    fullWidth
                    itemVariant="form"
                    options={siteTypeOptions}
                    loading={isLoadingSiteTypes}
                  />
                )}
              />
              <Form.Error error={errors.siteType} />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        {/* Row 5 */}
        <Form.Row className="mt-4">
          <Form.Col lg={3}>
            <Form.Field label="Name of the Owner">
              <Input
                {...register("ownerName", {
                  setValueAs: toUpperSafe,
                })}
                placeholder={addressFieldPlaceholders.ownerName}
                size="form"
                variant="form"
                disabled={isLoading || readonly}
                restriction="alphabetic"
                className="uppercase"
              />
              <Form.Error error={errors.ownerName} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3}>
            <Form.Field label="Relationship with Firm">
              <Input
                {...register("relationshipWithFirm", {
                  setValueAs: toUpperSafe,
                })}
                placeholder={addressFieldPlaceholders.relationshipWithFirm}
                size="form"
                variant="form"
                disabled={isLoading || readonly}
                restriction="alphabetic"
                className="uppercase"
              />
              <Form.Error error={errors.relationshipWithFirm} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3}>
            <Form.Field label="Landline Number">
              <Input
                {...register("landlineNumber")}
                placeholder={addressFieldPlaceholders.landlineNumber}
                size="form"
                variant="form"
                disabled={isLoading || readonly}
                restriction="numeric"
                maxLength={11}
              />
              <Form.Error error={errors.landlineNumber} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3}>
            <Form.Field label="Mobile Number">
              <Input
                {...register("mobileNumber")}
                placeholder={addressFieldPlaceholders.mobileNumber}
                size="form"
                variant="form"
                disabled={isLoading || readonly}
                maxLength={10}
                restriction="numeric"
              />
              <Form.Error error={errors.mobileNumber} />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        {/* Row 6 */}
        <Form.Row className="mt-4">
          <Form.Col lg={3}>
            <Form.Field label="Email ID">
              <Input
                {...register("emailId")}
                type="email"
                placeholder={addressFieldPlaceholders.emailId}
                size="form"
                variant="form"
                disabled={isLoading || readonly}
                restriction="email"
              />
              <Form.Error error={errors.emailId} />
            </Form.Field>
          </Form.Col>
        </Form.Row>
      </div>
    </div>
  );
};
