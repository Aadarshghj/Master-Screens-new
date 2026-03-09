import React from "react";
import { RefreshCcw, Save, CircleX } from "lucide-react";
import {
    Controller,
    type Control,
    type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Label, Switch } from "@/components/ui";
import { Form, Textarea } from "@/components";
import type {
  LoanSchemeTypeType,

} from "@/types/customer-management/loan-scheme-type";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface LoanSchemeTypeProps {
  register: UseFormRegister<LoanSchemeTypeType>;
    errors: FieldErrors<LoanSchemeTypeType>;
    control: Control<LoanSchemeTypeType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const LoanSchemeTypeForm: React.FC<LoanSchemeTypeProps> = ({
  register,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
  errors,
  control
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Scheme Type name" required error={errors.schemeTypeName}
               
              >
                <Input
                  {...register("schemeTypeName",{
                    onChange: e => {
                      let value = e.target.value
                        .replace(/[^A-Za-z0-9.@ ]/g, "")
                        .toUpperCase();
                      if (value.startsWith(" ")) {
                        value = value.trimStart();
                      }

                      e.target.value = value;
                    },
                  })}
                  placeholder="Enter Scheme Type Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Scheme Type Description" required error={errors.schemeTypeDescription}>
                <Textarea
                  {...register("schemeTypeDescription")}
                  placeholder="Enter Scheme Type Description"
                  size="form"
                  variant="form"
                  rows={3}
                />
              </Form.Field>
            </Form.Col>
             <Form.Col lg={2} md={6} span={12}>
              <Flex direction="col" gap={1} style={{ paddingTop: 22 }}>
                <Flex align="center" gap={2}>
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label>Status</Label>
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
              disabled={isSubmitting}
            >
              <CircleX className="h-3 w-3" />
              Cancel
            </NeumorphicButton>

            <NeumorphicButton
              type="button"
              variant="secondary"
              size="secondary"
              onClick={onReset}
              disabled={isSubmitting}
            >
              <RefreshCcw className="h-3 w-3" />
              Reset
            </NeumorphicButton>

            <NeumorphicButton
              type="submit"
              variant="default"
              size="default"
              disabled={isSubmitting}
            >
              <Save className="h-3 w-3" />
              {isSubmitting ? "Saving..." : "Save Loan Scheme Type"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
