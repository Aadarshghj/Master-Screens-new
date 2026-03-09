import React from "react";
import { RefreshCw, Save, X } from "lucide-react";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Label, Switch,
  //  Textarea 
  } from "@/components/ui";
import { Form } from "@/components";
import type { ModuleType } from "@/types/customer-management/module-management";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface ModuleTypeFormProps {
  control: Control<ModuleType>;
  errors: FieldErrors<ModuleType>;
  register: UseFormRegister<ModuleType>;
  isEdit: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const ModuleTypeForm: React.FC<ModuleTypeFormProps> = ({
  control,
  errors,
  register,
  isEdit,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row className="py-2">
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Module Code"
                required
                error={errors.moduleCode}
              >
                <Input
                  {...register("moduleCode")}
                  disabled={isEdit}
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Module Name"
                required
                error={errors.moduleName}
              >
                <Input
                  {...register("moduleName")}
                  placeholder="Eg: Customer Management"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Module Description"
                required
                error={errors.description}
              >
                {/* <Textarea */}
                <Input
                  {...register("description")}
                  placeholder="Enter Description"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={4} span={12}>
                <Flex align="center" gap={2} style={{ paddingTop: 20, paddingLeft:20 }}>
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
                    <Label>Active</Label>
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
              {isSubmitting ? "Saving..." : isEdit ? "Update" : "Submit"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
