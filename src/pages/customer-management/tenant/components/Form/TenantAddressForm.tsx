import type { Option, TenantType } from "@/types/customer-management/tenant";
import type React from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { Form } from "@/components";
import { Input, InputWithSearch, Select } from "@/components/ui";

interface TenantAddressProps {
  control: Control<TenantType>;
  errors: FieldErrors<TenantType>;
  register: UseFormRegister<TenantType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
  // editId: string | null;
  addressTypeOptions: Option[];
  postOfficeOptions: Option[];
  siteFactoryPremiseOptions: Option[];
  timeZoneOptions: Option[];
}

export const TenantAddressForm: React.FC<TenantAddressProps> = ({
  control,
  errors,
  register,
  addressTypeOptions,
  postOfficeOptions,
  siteFactoryPremiseOptions,
  timeZoneOptions,
}) => {
  return (
    <div className="mt-2">
      <Form.Row className="mb-3">
        <Form.Col lg={2} md={6} span={12}>
          <Form.Field
            label="Address Type"
            error={errors.tenantAddress?.addressType}
          >
            <Controller
              name="tenantAddress.addressType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={addressTypeOptions}
                  placeholder="Select Address Type"
                  size="form"
                  variant="form"
                  fullWidth
                  itemVariant="form"
                />
              )}
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={3} md={6} span={12}>
          <Form.Field
            label="Street/Lane Name"
            required
            error={errors.tenantAddress?.streetLaneName}
          >
            <Input
              {...register("tenantAddress.streetLaneName")}
              placeholder="Street/Lane Name"
              size="form"
              variant="form"
              className="uppercase"
              textTransform="uppercase"
              maxLength={200}
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={3} md={6} span={12}>
          <Form.Field
            label="Place Name"
            error={errors.tenantAddress?.placeName}
          >
            <Input
              {...register("tenantAddress.placeName")}
              placeholder="Place Name"
              size="form"
              variant="form"
              className="uppercase"
              textTransform="uppercase"
              maxLength={200}
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field
            label="PIN Code"
            required
            error={errors.tenantAddress?.pinCode}
          >
            <InputWithSearch
              {...register("tenantAddress.pinCode")}
              placeholder="e.g. 600001"
              size="form"
              variant="form"
              className="uppercase"
              maxLength={6}
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field
            label="Post Office"
            error={errors.tenantAddress?.postOffice}
          >
            <Controller
              name="tenantAddress.postOffice"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={postOfficeOptions}
                  placeholder="Select Option"
                  size="form"
                  variant="form"
                  fullWidth
                  itemVariant="form"
                />
              )}
            />
          </Form.Field>
        </Form.Col>
      </Form.Row>

      <Form.Row className="mb-3">
        <Form.Col lg={2} md={6} span={12}>
          <Form.Field
            label="Country"
            required
            error={errors.tenantAddress?.country}
          >
            <Input
              {...register("tenantAddress.country")}
              placeholder="Auto fetch from pincode"
              size="form"
              variant="form"
              className="uppercase"
              textTransform="uppercase"
              readOnly
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field
            label="State"
            required
            error={errors.tenantAddress?.state}
          >
            <Input
              {...register("tenantAddress.state")}
              placeholder="Auto fetch from pincode"
              size="form"
              variant="form"
              className="uppercase"
              textTransform="uppercase"
              readOnly
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field
            label="District"
            required
            error={errors.tenantAddress?.district}
          >
            <Input
              {...register("tenantAddress.district")}
              placeholder="Auto fetch from pincode"
              size="form"
              variant="form"
              className="uppercase"
              textTransform="uppercase"
              readOnly
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field label="City" required error={errors.tenantAddress?.city}>
            <Input
              {...register("tenantAddress.city")}
              placeholder="Auto fetch from pincode"
              size="form"
              variant="form"
              className="uppercase"
              textTransform="uppercase"
              readOnly
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={4} md={6} span={12}>
          <Form.Field
            label="Landmark"
            error={errors.tenantAddress?.landmark}
          >
            <Input
              {...register("tenantAddress.landmark")}
              placeholder="Enter Landmark"
              size="form"
              variant="form"
              className="uppercase"
              textTransform="uppercase"
            />
          </Form.Field>
        </Form.Col>
      </Form.Row>

      <Form.Row className="mb-3">
        <Form.Col lg={2} md={6} span={12}>
          <Form.Field
            label="Site/Factory Premise"
            error={errors.tenantAddress?.siteFactoryPremise}
          >
            <Controller
              name="tenantAddress.siteFactoryPremise"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={siteFactoryPremiseOptions}
                  placeholder="Select Option"
                  size="form"
                  variant="form"
                  fullWidth
                  itemVariant="form"
                />
              )}
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={3} md={6} span={12}>
          <Form.Field
            label="Name of the Owner"
            error={errors.tenantAddress?.nameOfTheOwner}
          >
            <Input
              {...register("tenantAddress.nameOfTheOwner")}
              placeholder="Enter Name"
              size="form"
              variant="form"
              className="uppercase"
              textTransform="uppercase"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={3} md={6} span={12}>
          <Form.Field
            label="Relationship with Tenant"
            error={errors.tenantAddress?.relationshipWithTenant}
          >
            <Input
              {...register("tenantAddress.relationshipWithTenant")}
              placeholder="Enter Relationship"
              size="form"
              variant="form"
              className="uppercase"
              textTransform="uppercase"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field
            label="Landline Number"
            error={errors.tenantAddress?.landlineNumber}
          >
            <Input
              {...register("tenantAddress.landlineNumber")}
              placeholder="Enter Number"
              size="form"
              variant="form"
              className="uppercase"
              textTransform="uppercase"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2} md={6} span={12}>
          <Form.Field
            label="Time Zone"
            error={errors.tenantAddress?.timeZone}
          >
            <Controller
              name="tenantAddress.timeZone"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={timeZoneOptions}
                  placeholder="Select"
                  size="form"
                  variant="form"
                  fullWidth
                  itemVariant="form"
                />
              )}
            />
          </Form.Field>
        </Form.Col>
      </Form.Row>
    </div>
  );
};
