import React from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { Flex, Input, Switch, Label, Select, DatePicker } from "@/components/ui";
import { Form } from "@/components";
import type {
  SupplierInformationType,
  Option,
} from "@/types/asset-management-system/supplier-management/supplier-information";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface SupplierDetailsProps {
  control: Control<SupplierInformationType>;
  errors: FieldErrors<SupplierInformationType>;
  register: UseFormRegister<SupplierInformationType>;
  isEditMode: boolean;
  supplierRiskCategoryOptions: Option[];
  gstRegistrationTypeOptions: Option[];
  msmeTypeOptions: Option[];
}

export const SupplierDetailsForm: React.FC<SupplierDetailsProps> = ({
  errors,
  register,
  control,
  isEditMode,
  supplierRiskCategoryOptions,
  gstRegistrationTypeOptions,
  msmeTypeOptions,
}) => {
  return (
    <div>
      <h3 className="text-xs font-semibold mb-2">Supplier Details</h3>

      <Form.Row>
        <Form.Col lg={2} md={6} span={12}>
          <Form.Field label="Supplier Name" required error={errors.supplierName}>
            <Input
              {...register("supplierName")}
              placeholder="Enter Supplier Name"
              size="form"
              variant="form"
              className="uppercase"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field label="Trade Name" error={errors.tradeName}>
            <Input
              {...register("tradeName")}
              placeholder="Enter Trade Name"
              size="form"
              variant="form"
              className="uppercase"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field
            label="Supplier Risk Category"
            required
            error={errors.supplierRiskCategory}
          >
            <Controller
              name="supplierRiskCategory"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={supplierRiskCategoryOptions}
                  placeholder="Select Supplier Risk Category"
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
          <Form.Field label="PAN Number" required error={errors.panNumber}>
            <Input
              {...register("panNumber")}
              placeholder="Enter PAN Number"
              size="form"
              variant="form"
              className="uppercase"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field label="Choose PAN" required error={errors.panFile}>
            <Controller
              name="panFile"
              control={control}
              render={({ field }) => (
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif"
                  className="hidden"
                  id="panUpload"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              )}
            />
            <label htmlFor="panUpload">
              <NeumorphicButton type="button" className="mb-2">
                <span>Choose File</span>
              </NeumorphicButton>
            </label>
            <p className="text-nano text-muted-foreground ml-2">
              Accepted format JPG, PNG, JPEG, PDF. Max size: 2MB
            </p>
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Flex direction="col" gap={1} style={{ paddingTop: 22 }}>
            <Flex align="center" gap={2}>
              <Controller
                control={control}
                name="panVerification"
                render={({ field }) => (
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    disabled={!isEditMode}
                  />
                )}
              />
              <Label>PAN Verified</Label>
            </Flex>
          </Flex>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field
            label="GST Registration Type"
            required
            error={errors.gstRegistrationType}
          >
            <Controller
              name="gstRegistrationType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={gstRegistrationTypeOptions}
                  placeholder="Select GST Register Type"
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
          <Form.Field label="GSTIN" error={errors.gstin}>
            <Input
              {...register("gstin")}
              placeholder="Enter GSTIN"
              size="form"
              variant="form"
              className="uppercase"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field label="Choose GSTIN" error={errors.gstinFile}>
            <Controller
              name="gstinFile"
              control={control}
              render={({ field }) => (
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif"
                  className="hidden"
                  id="gstinUpload"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              )}
            />
            <label htmlFor="gstinUpload">
              <NeumorphicButton type="button" className="mb-2">
                <span>Choose File</span>
              </NeumorphicButton>
            </label>
            <p className="text-nano text-muted-foreground ml-2">
              Accepted format JPG, PNG, JPEG, PDF. Max size: 2MB
            </p>
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field
            label="MSME Registration No"
            error={errors.msmeRegistrationNo}
          >
            <Input
              {...register("msmeRegistrationNo")}
              placeholder="Enter MSME Registration No"
              size="form"
              variant="form"
              className="uppercase"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field label="Choose MSME File" error={errors.msmeFile}>
            <Controller
              name="msmeFile"
              control={control}
              render={({ field }) => (
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif"
                  className="hidden"
                  id="msmeUpload"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              )}
            />
            <label htmlFor="msmeUpload">
              <NeumorphicButton type="button" className="mb-2">
                <span>Choose File</span>
              </NeumorphicButton>
            </label>
            <p className="text-nano text-muted-foreground ml-2">
              Accepted format JPG, PNG, JPEG, PDF. Max size: 2MB
            </p>
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field label="MSME Type" error={errors.msmeType}>
            <Controller
              name="msmeType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={msmeTypeOptions}
                  placeholder="Select MSME Type"
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
          <Form.Field label="CIN/LLPIN" required error={errors.cinOrLlpin}>
            <Input
              {...register("cinOrLlpin")}
              placeholder="Enter CIN/LLPIN"
              size="form"
              variant="form"
              className="uppercase"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field label="Choose CIN/LLPIN File" error={errors.cinFile}>
            <Controller
              name="cinFile"
              control={control}
              render={({ field }) => (
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif"
                  className="hidden"
                  id="cinUpload"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              )}
            />
            <label htmlFor="cinUpload">
              <NeumorphicButton type="button" className="mb-2">
                <span>Choose File</span>
              </NeumorphicButton>
            </label>
            <p className="text-nano text-muted-foreground ml-2">
              Accepted format JPG, PNG, JPEG, PDF. Max size: 2MB
            </p>
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2}>
          <Form.Field
            label="Incorporation Date"
            required
            error={errors.incorporationDate}
          >
            <Controller
              name="incorporationDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value || undefined}
                  onChange={(value: string) => field.onChange(value)}
                  onBlur={field.onBlur}
                  placeholder="dd/mm/yyyy"
                  allowManualEntry
                  size="form"
                  variant="form"
                  disableFutureDates={false}
                />
              )}
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field
            label="Contact Person Name"
            required
            error={errors.contactPersonName}
          >
            <Input
              {...register("contactPersonName")}
              placeholder="Enter Contact Person Name"
              size="form"
              variant="form"
              className="uppercase"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field label="Designation" error={errors.designation}>
            <Input
              {...register("designation")}
              placeholder="Enter Designation"
              size="form"
              variant="form"
              className="uppercase"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Flex direction="col" gap={1} style={{ paddingTop: 22, paddingLeft: 20 }}>
            <Flex align="center" gap={2}>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    disabled={!isEditMode}
                  />
                )}
              />
              <Label>Active</Label>
            </Flex>
          </Flex>
        </Form.Col>
      </Form.Row>
    </div>
  );
};