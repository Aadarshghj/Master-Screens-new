import React from "react";
import { RotateCcw, Save, X } from "lucide-react";
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

import type { AddressTypeMaster } from "@/types/customer-management/address-type-master";
import { ADDRESS_TYPE_OPTIONS } from "@/mocks/customer-management-master/address-type";

interface AddressTypeProps {
  control: Control<AddressTypeMaster>;
  errors: FieldErrors<AddressTypeMaster>;
  register: UseFormRegister<AddressTypeMaster>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const AddressTypeForm: React.FC<AddressTypeProps> = ({
  control,
  errors,
  register,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            {/* Address Type */}
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Address Type"
                required
                error={errors.addressType}
              >
                <Controller
                  control={control}
                  name="addressType"
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={ADDRESS_TYPE_OPTIONS}
                      value={field.value}
                      onValueChange={value => field.onChange(value)}
                      placeholder="Select Address Type"
                      size="form"
                      variant="form"
                      fullWidth
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            {/* Context */}
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Context" required error={errors.context}>
                <Input
                  {...register("context")}
                  placeholder="Enter Context"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            {/* Mandatory */}
            <Form.Col lg={2} md={6} span={12}>
              <Flex direction="col" gap={1} style={{ paddingTop: 22 }}>
                <Flex align="center" gap={2}>
                  <Controller
                    control={control}
                    name="isMandatory"
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label>Is Mandatory</Label>
                </Flex>
              </Flex>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Flex direction="col" gap={1} style={{ paddingTop: 22 }}>
                <Flex align="center" gap={2}>
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label>Active</Label>
                </Flex>
              </Flex>
            </Form.Col>
          </Form.Row>

          {/* Buttons */}
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
              {isSubmitting ? "Saving..." : "Save Address Type"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
