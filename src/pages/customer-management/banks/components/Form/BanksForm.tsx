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
import type { Bank, Option } from "@/types/customer-management/bank";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface BankFormProps {
  control: Control<Bank>;
  errors: FieldErrors<Bank>;
  register: UseFormRegister<Bank>;
  isSubmitting: boolean;
  countryOptions: Option[];
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const BankForm: React.FC<BankFormProps> = ({
  control,
  errors,
  register,
  isSubmitting,
  countryOptions,
  onSubmit,
  onCancel,
  onReset,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Bank Code" required error={errors.bankCode}>
                <Input
                  {...register("bankCode")}
                  placeholder="Enter Bank Code"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Bank Name" required error={errors.bankName}>
                <Input
                  {...register("bankName")}
                  placeholder="Enter Bank Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="SWIFT/BIC Code"
                required
                error={errors.swiftBicCode}
              >
                <Input
                  {...register("swiftBicCode")}
                  placeholder="Enter SWIFT/BIC Code"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Country" required error={errors.country}>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      options={countryOptions}
                      placeholder="Select Country"
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
              <Flex direction="col" gap={1} style={{ paddingTop: 22 }}>
                <Flex align="center" gap={2}>
                  <Controller
                    control={control}
                    name="psu"
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label>Psu</Label>
                </Flex>
              </Flex>
            </Form.Col>
          </Form.Row>

          <Flex.ActionGroup className="mt-2 justify-end gap-4">
            <NeumorphicButton
              type="button"
              variant="grey"
              size="default"
              onClick={onCancel}
            >
              <X width={13} />
              Cancel
            </NeumorphicButton>

            <NeumorphicButton
              type="button"
              variant="secondary"
              size="secondary"
              onClick={onReset}
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
              <Save width={13} />
              {isSubmitting ? "Saving..." : "Save Bank"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
