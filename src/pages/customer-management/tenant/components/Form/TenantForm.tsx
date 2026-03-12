import React, { useEffect, useRef } from "react";
import { RotateCcw, Save, X } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormClearErrors,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { FormContainer } from "@/components/ui/form-container";
import {
  Flex,
  Input,
  Select,
  InputWithSearch,
  TitleHeader,
  Switch,
  Label,
} from "@/components/ui";
import { Form } from "@/components";
import type { Option, TenantType } from "@/types/customer-management/tenant";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { TenantAddressForm } from "./TenantAddressForm";
import { TenantKeyValueTable } from "../Table/TenantKeyValueTable";
import type { useKeyValueTable } from "../Hooks/useKeyValueTable";

interface TenantProps {
  control: Control<TenantType>;
  errors: FieldErrors<TenantType>;
  register: UseFormRegister<TenantType>;
  watch: UseFormWatch<TenantType>;
   setValue: UseFormSetValue<TenantType>;
  clearErrors: UseFormClearErrors<TenantType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
  editId: string | null;
  tenantTypeOptions: Option[];
  addressTypeOptions: Option[];
  postOfficeOptions: Option[];
  siteFactoryPremiseOptions: Option[];
  timeZoneOptions: Option[];
  keyValueTable: ReturnType<typeof useKeyValueTable>;
  mode: "view" | "edit" | "create";
}

export const TenantForm: React.FC<TenantProps> = ({
  control,
  errors,
  register,
  watch,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
  setValue,
  clearErrors,
  tenantTypeOptions,
  addressTypeOptions,
  postOfficeOptions,
  siteFactoryPremiseOptions,
  timeZoneOptions,
  keyValueTable,
  mode,
  editId,
}) => {
  const tenantTypeValue = watch("tenantType");

useEffect(() => {
  if (tenantTypeValue?.toLowerCase() !== "nbfc") {
    setValue("rbiRegistrationNumber", "");
    clearErrors("rbiRegistrationNumber");
  }
}, [tenantTypeValue, setValue, clearErrors]);

  const selectedFile = watch("chooseFile");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isViewMode = mode === "view";

  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row className="mb-3">
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Tenant Code"
                required
                error={errors.tenantCode}
              >
                <Input
                  {...register("tenantCode")}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    const input = e.currentTarget;
                    input.value = input.value.replace(/[^A-Za-z0-9_]/g, "");
                  }}
                  placeholder="Enter Tenant Code"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  readOnly={!!editId || mode === "view"}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Tenant Name"
                required
                error={errors.tenantName}
              >
                <Input
                  {...register("tenantName")}
                  readOnly={isViewMode}
                  placeholder="Enter Tenant Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Legal Entity Name"
                required
                error={errors.legalEntityName}
              >
                <Input
                  {...register("legalEntityName")}
                  readOnly={isViewMode}
                  placeholder="Enter Legal Entity Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  maxLength={150}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Tenant Type"
                required
                error={errors.tenantType}
              >
                <Controller
                  name="tenantType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={
                        mode === "view" ? undefined : field.onChange
                      }
                      disabled={mode === "view"}
                      options={tenantTypeOptions}
                      placeholder="Select Tenant Type"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Registration No"
                required
                error={errors.registrationNo}
              >
                <Input
                  {...register("registrationNo")}
                  readOnly={isViewMode}
                  placeholder="Enter Registration Number"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  maxLength={50}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    const input = e.currentTarget;
                    input.value = input.value.replace(/[^A-Za-z0-9\/\-.]/g, "");
                  }}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row className="mb-3">
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="RBI Registration Number"
                required={tenantTypeValue?.toLowerCase() === "nbfc"}
                error={errors.rbiRegistrationNumber}
              >
                <Input
                  {...register("rbiRegistrationNumber")}
                  placeholder="Enter RBI Registration Number"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  maxLength={50}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    const input = e.currentTarget;
                    input.value = input.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9/.-]/g, "");
                  }}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="PAN Number" required error={errors.panNumber}>
                <Input
                  {...register("panNumber")}
                  placeholder="Enter PAN Number"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  maxLength={10}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    const input = e.currentTarget;
                    input.value = input.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                  }}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="GST Number" error={errors.gstNumber}>
                <Input
                  {...register("gstNumber")}
                  placeholder="Enter GST Number"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  maxLength={15}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    const input = e.currentTarget;
                    input.value = input.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                  }}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="CIN Number" error={errors.cinNumber}>
                <Input
                  {...register("cinNumber")}
                  placeholder="Enter CIN Number"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  maxLength={21}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    const input = e.currentTarget;
                    input.value = input.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                  }}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Contact Number"
                required
                error={errors.contactNumber}
              >
                <Input
                  {...register("contactNumber")}
                  readOnly={isViewMode}
                  placeholder="Enter Contact Number"
                  size="form"
                  variant="form"
                  maxLength={15}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    const input = e.currentTarget;
                    input.value = input.value.replace(/[^0-9]/g, "");
                  }}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row className="mb-3">
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Website" error={errors.website}>
                <InputWithSearch
                  {...register("website")}
                  placeholder="www.website.com"
                  size="form"
                  variant="form"
                  className="email"
                  maxLength={200}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Business Email"
                required
                error={errors.businessEmail}
              >
                <Input
                  {...register("businessEmail")}
                  placeholder="Enter Business Email"
                  size="form"
                  variant="form"
                  className="email"
                  maxLength={100}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    const input = e.currentTarget;
                    input.value = input.value.toLowerCase();
                  }}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Upload Tenant Logo"
                required
                error={errors.chooseFile}
              >
                <Controller
                  name="chooseFile"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif"
                        className="hidden"
                        onChange={e =>
                          field.onChange(e.target.files?.[0] ?? null)
                        }
                      />

                      <NeumorphicButton
                        type="button"
                        className="mb-2 w-49"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <span>Choose File</span>
                      </NeumorphicButton>
                    </>
                  )}
                />

                <p className="text-xxs text-blue-400">
                  {selectedFile && typeof selectedFile !== "string"
                    ? selectedFile.name
                    : "No File Chosen"}
                </p>
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12} className="ml-4 ">
              <Flex direction="col" gap={2} style={{ paddingTop: 22 }}>
                <Flex align="center" gap={2}>
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!editId}
                      />
                    )}
                  />
                  <Label>Active</Label>
                </Flex>
              </Flex>
            </Form.Col>
          </Form.Row>

          <TitleHeader title="Address" className=" mb-6" />

          <TenantAddressForm
            control={control}
            errors={errors}
            register={register}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onReset={onReset}
            addressTypeOptions={addressTypeOptions}
            postOfficeOptions={postOfficeOptions}
            siteFactoryPremiseOptions={siteFactoryPremiseOptions}
            timeZoneOptions={timeZoneOptions}
          />

          <section className="mt-5">
            <TenantKeyValueTable keyValueTable={keyValueTable} />
          </section>

          <Flex.ActionGroup className="mt-2 justify-end gap-4">
            <NeumorphicButton
              type="button"
              variant="grey"
              size="default"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="h-3 w-3" />
              Cancel
            </NeumorphicButton>

            <NeumorphicButton
              type="button"
              variant="secondary"
              size="secondary"
              onClick={onReset}
              disabled={isSubmitting}
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </NeumorphicButton>

            <NeumorphicButton
              type="submit"
              variant="default"
              size="default"
              disabled={isSubmitting}
            >
              <Save className="h-3 w-3" />
              {isSubmitting
                ? mode === "edit"
                  ? "Updating..."
                  : "Saving..."
                : mode === "edit"
                  ? "Update Tenant"
                  : "Save Tenant"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
