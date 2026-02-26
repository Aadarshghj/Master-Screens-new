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
import { Form, Textarea } from "@/components";
import type { BranchContactFormData } from "@/types/customer-management/branch-contact";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { SelectOption } from "@/types";

interface BranchContactFormProps {
  control: Control<BranchContactFormData>;
  register: UseFormRegister<BranchContactFormData>;
  errors: FieldErrors<BranchContactFormData>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
  branchOption: SelectOption[];
}

export const BranchContactForm: React.FC<BranchContactFormProps> = ({
  control,
  register,
  errors,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
  branchOption,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Branch Contact Channel"
                required
                error={errors.channel}
              >
                <Input
                  {...register("channel")}
                  placeholder="Enter channel"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  restriction="alphabetic"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Branches" error={errors.branch} required>
                <Controller
                  name="branch"
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
                      options={branchOption}
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Value" required error={errors.value}>
                <Input
                  {...register("value")}
                  placeholder="Enter Contact Value"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={4} md={6} span={12}>
              <Form.Field label="Remarks">
                <Textarea
                  {...register("remarks")}
                  placeholder="Enter Remarks"
                  size="form"
                  variant="form"
                  rows={3}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={1} md={6} span={12}>
              <Flex direction="col" gap={1} style={{ paddingTop: 22 }}>
                <Flex align="center" gap={2}>
                  <Controller
                    control={control}
                    name="isPrimary"
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label>Primary</Label>
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
              {isSubmitting ? "Saving..." : "Save Branch Contact"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
