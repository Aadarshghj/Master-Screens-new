import React from "react";
import { RotateCcw, Save, X } from "lucide-react";
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { Flex, Input, Textarea, Label, Switch } from "@/components/ui";
import { FormContainer } from "@/components/ui/form-container";
import { Form } from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { RoleManagementType } from "@/types/customer-management/role-management";

interface RoleManagementProps {
  control: Control<RoleManagementType>;
  errors: FieldErrors<RoleManagementType>;
  register: UseFormRegister<RoleManagementType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
  isEdit: boolean;
}

// const isEdit = false

export const RoleManagementForm: React.FC<RoleManagementProps> = ({
  control,
  errors,
  register,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
  isEdit,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Role Name" required error={errors.roleName}>
                <Input
                  {...register("roleName")}
                  placeholder="Enter Role Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={12} span={12}>
              <Form.Field label="Description" error={errors.roleShortDesc}>
                <Textarea
                  {...register("roleShortDesc")}
                  placeholder="Enter Description"
                  size="form"
                  variant="form"
                  className="uppercase"
                  rows={3}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Flex
                direction="col"
                gap={2}
                style={{ marginLeft: "25px", marginTop: "20px" }}
              >
                <Flex align="center" gap={2}>
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isEdit}
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
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Saving..."
                : isEdit
                  ? "Update Role"
                  : "Save Role"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
