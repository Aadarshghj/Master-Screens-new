import React from "react";
import { RefreshCw, Save, X } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Label, Select, Switch } from "@/components/ui";
import { Form } from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { StaffFormData } from "@/types/customer-management/staffs";
import type { SelectOption } from "@/types";

interface StaffProps {
  control: Control<StaffFormData>;
  errors: FieldErrors<StaffFormData>;
  register: UseFormRegister<StaffFormData>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
  reportingPersonOption: SelectOption[];
  appUser: boolean;
}

export const StaffForm: React.FC<StaffProps> = ({
  control,
  errors,
  register,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
  reportingPersonOption,
  appUser,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Staff Name" required error={errors.staffName}>
                <Input
                  {...register("staffName")}
                  placeholder="Enter Staff Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  restriction="alphabetic"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Staff Code" required error={errors.staffCode}>
                <Input
                  {...register("staffCode")}
                  placeholder="Enter Staff Code"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Reporting To"
                required
                error={errors.reportingToIdentity}
              >
                <Controller
                  name="reportingToIdentity"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={reportingPersonOption}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Contact Address"
                required
                error={errors.contactAddress}
              >
                <Input
                  {...register("contactAddress")}
                  placeholder="Enter Contact Address"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Contact Phone"
                required
                error={errors.contactPhone}
              >
                <Input
                  {...register("contactPhone")}
                  placeholder="Enter Contact Number"
                  size="form"
                  variant="form"
                  restriction="numeric"
                  maxLength={10}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Email" required error={errors.email}>
                <Input
                  {...register("email")}
                  placeholder="Enter Email"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12} className="lg:ml-14">
              <Flex direction="col" gap={1} style={{ paddingTop: 22 }}>
                <Flex align="center" gap={2}>
                  <Controller
                    control={control}
                    name="isAppUser"
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label>AppUser</Label>
                </Flex>
              </Flex>
            </Form.Col>

            {appUser && (
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="AppUser Reference Id"
                  required
                  error={errors.appUserRefId}
                >
                  <Input
                    {...register("appUserRefId")}
                    placeholder="Enter AppUser Reference Id"
                    size="form"
                    variant="form"
                  />
                </Form.Field>
              </Form.Col>
            )}
          </Form.Row>

          <Flex.ActionGroup className="mt-2 justify-end gap-4">
            <NeumorphicButton
              type="button"
              variant="grey"
              size="default"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X width={13} />
              Cancel
            </NeumorphicButton>

            <NeumorphicButton
              type="button"
              variant="secondary"
              size="secondary"
              onClick={onReset}
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
              <Save width={13} />
              {isSubmitting ? "Saving..." : "Save Staff"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
