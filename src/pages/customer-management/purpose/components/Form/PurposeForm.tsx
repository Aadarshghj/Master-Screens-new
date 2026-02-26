import React from "react";
import { RotateCcw, Save, X } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input } from "@/components/ui";
import { Form } from "@/components";
import type { Purpose } from "@/types/customer-management/purpose";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface PurposeFormProps {
  register: UseFormRegister<Purpose>;
  errors: FieldErrors<Purpose>;
  isSubmitting: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  onCancel: () => void;
  onReset: () => void;
}

export const PurposeForm: React.FC<PurposeFormProps> = ({
  register,
  errors,
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
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Purpose Type"
                required
                error={errors.purposeType}
              >
                <Input
                  {...register("purposeType")}
                  placeholder="Enter Purpose Type"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Purpose Code"
                required
                error={errors.purposeCode}
              >
                <Input
                  {...register("purposeCode")}
                  placeholder="Enter Purpose Code"
                  size="form"
                  variant="form"
                  className="uppercase"
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
              {isSubmitting ? "Saving..." : "Save Purpose"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
