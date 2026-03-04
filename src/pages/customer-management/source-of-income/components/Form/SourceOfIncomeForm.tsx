import React from "react";
import { RefreshCw, Save, X } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input } from "@/components/ui";
import { Form } from "@/components";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { SourceOfIncomeFormData } from "@/types/customer-management/source-income";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface SourceOfIncomeFormProps {
  register: UseFormRegister<SourceOfIncomeFormData>;
  errors: FieldErrors<SourceOfIncomeFormData>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const SourceOfIncomeForm: React.FC<SourceOfIncomeFormProps> = ({
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
                label="Source of Income Name"
                required
                error={errors.name}
              >
                <Input
                  {...register("name")}
                  placeholder="Enter Source of Income Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Source of Income Code"
                required
                error={errors.code}
              >
                <Input
                  {...register("code")}
                  placeholder="Enter Source of Income Code"
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
              {isSubmitting ? "Saving..." : "Save Source of Income"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
