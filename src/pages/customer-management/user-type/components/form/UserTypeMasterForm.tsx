import React from "react";
import { RotateCcw, Save, X } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { FormContainer } from "../../../../../components/ui/form-container";
import { Flex, Input, Label, Switch } from "../../../../../components/ui";
import { Form, Textarea } from "../../../../../components";
import NeumorphicButton from "../../../../../components/ui/neumorphic-button/neumorphic-button";
import type { UserType } from "@/types/customer-management/user-type";

interface UserTypeFormProps {
  control: Control<UserType>;
  errors: FieldErrors<UserType>;
  register: UseFormRegister<UserType>;
  isSubmitting: boolean;
  isEdit: boolean;
  userTypeCode?: string;
  onSubmit: (e?: React.BaseSyntheticEvent) => void | Promise<void>;
  onCancel: () => void;
  onReset: () => void;
}

export const UserTypeForm: React.FC<UserTypeFormProps> = ({
  control,
  errors,
  register,
  isSubmitting,
  isEdit,
  userTypeCode,
  onSubmit,
  onCancel,
  onReset,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="User Code">
                <Input
                  value={
                    isEdit && userTypeCode ? userTypeCode : "Auto Generated"
                  }
                  readOnly
                  size="form"
                  variant="form"
                  className="bg-muted text-muted-foreground cursor-not-allowed"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="User Type Name"
                required
                error={errors.userTypeName}
              >
                <Input
                  {...register("userTypeName")}
                  placeholder="Enter User Type Name"
                  size="form"
                  variant="form"
                  className="uppercase placeholder:text-gray-400"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={4} span={12}>
              <Form.Field label="Description" error={errors.userTypeDesc}>
                <Textarea
                  {...register("userTypeDesc")}
                  placeholder="Enter Description"
                  size="form"
                  variant="form"
                  className="uppercase placeholder:text-gray-400"
                  rows={3}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
              <Flex direction="col" gap={1}>
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
            >
              <X className="h-3 w-3" />
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
              <Save className="h-3 w-3" />
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Update User Type"
                  : "Save User Type"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
