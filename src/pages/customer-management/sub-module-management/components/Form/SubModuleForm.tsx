import React from "react";
import { RotateCcw, Save, X } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { Flex, Input, Label, Select, Switch } from "@/components/ui";
import { FormContainer } from "@/components/ui/form-container";
import { Form } from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

import type { SubModuleFormValues } from "../Hooks/UseSubModuleForm";

interface SubModuleFormProps {
  control: Control<SubModuleFormValues>;
  errors: FieldErrors<SubModuleFormValues>;
  register: UseFormRegister<SubModuleFormValues>;
  isSubmitting: boolean;
  isEdit: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onCancel: () => void;
  onReset: () => void;
  moduleOptions: { label: string; value: string }[];
  isLoadingModules: boolean;
}

export const SubModuleForm: React.FC<SubModuleFormProps> = ({
  control,
  errors,
  register,
  isSubmitting,
  isEdit,
  onSubmit,
  onCancel,
  onReset,
  moduleOptions,
  isLoadingModules,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={4} md={6} span={12}>
              {/* Optional: if your Form.Field expects a string, you might need errors.module?.message */}
              <Form.Field label="Module" required error={errors.module}>
                <Controller
                  name="module"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      options={moduleOptions}
                      placeholder={
                        isLoadingModules
                          ? "Loading Modules..."
                          : "Select Module"
                      }
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={6} span={12}>
              <Form.Field
                label="Sub Module Code"
                required
                error={errors.subModuleCode}
              >
                <Input
                  {...register("subModuleCode")}
                  placeholder="Enter Sub Module Code"
                  size="form"
                  variant="form"
                  className="uppercase"
                  disabled={isEdit} // Keeps code immutable during edits
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={6} span={12}>
              <Form.Field
                label="Sub Module Name"
                required
                error={errors.subModuleName}
              >
                <Input
                  {...register("subModuleName")}
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={12} span={12}>
              <Form.Field
                label="Sub Module Description"
                required
                error={errors.subModuleDescription}
              >
                <Input
                  {...register("subModuleDescription")}
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Flex
                direction="col"
                gap={2}
                style={{ marginLeft: "10px", marginTop: "20px" }}
              >
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
                  <Label>Active Status</Label>
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
              <X className="h-3 w-3" /> Cancel
            </NeumorphicButton>

            <NeumorphicButton
              type="button"
              variant="secondary"
              size="secondary"
              onClick={onReset}
              disabled={isSubmitting}
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </NeumorphicButton>

            <NeumorphicButton
              type="submit"
              variant="default"
              size="default"
              disabled={isSubmitting}
            >
              <Save className="h-3 w-3" />
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Update Sub Module"
                  : "Save Sub Module"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
