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
import { Form, Textarea } from "@/components";
import type {
  DesignationType,
  Option,
} from "@/types/customer-management/designation";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface DesignationProps {
  control: Control<DesignationType>;
  errors: FieldErrors<DesignationType>;
  register: UseFormRegister<DesignationType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
  occupationOptions: Option[];
}

export const DesignationForm: React.FC<DesignationProps> = ({
  control,
  errors,
  register,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
  occupationOptions,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Designation Name"
                required
                error={errors.designationName}
              >
                <Input
                  {...register("designationName")}
                  placeholder="Enter Designation Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Designation Code"
                required
                error={errors.designationCode}
              >
                <Input
                  {...register("designationCode")}
                  placeholder="Enter Designation Code"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Level" required error={errors.level}>
                <Input
                  {...register("level")}
                  placeholder="Enter Level"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Occupation" required error={errors.occupation}>
                <Controller
                  name="occupation"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      options={occupationOptions}
                      placeholder="Select Occupation"
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
                    name="managerial"
                    render={({ field }) => (
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label>Managerial</Label>
                </Flex>
              </Flex>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Description">
                <Textarea
                  {...register("description")}
                  placeholder="Enter Description"
                  size="form"
                  variant="form"
                  rows={3}
                />
              </Form.Field>
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
              {isSubmitting ? "Saving..." : "Save Designation"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
