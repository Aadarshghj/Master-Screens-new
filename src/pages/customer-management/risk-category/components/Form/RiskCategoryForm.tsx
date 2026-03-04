import React from "react";
import { RotateCcw, Save, X } from "lucide-react";
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input } from "@/components/ui";
import { Form } from "@/components";
import type { RiskCategoryType } from "@/types/customer-management/risk-category";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface RiskCategoryFormProps {
  control: Control<RiskCategoryType>;
  errors: FieldErrors<RiskCategoryType>;
  register: UseFormRegister<RiskCategoryType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const RiskCategoryForm: React.FC<RiskCategoryFormProps> = ({
  errors,
  register,
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
                label="Risk Category Name"
                required
                error={errors.riskCategoryName}
              >
                <Input
                  {...register("riskCategoryName")}
                  placeholder="Enter Risk Category Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Risk Category code"
                required
                error={errors.riskCategoryCode}
              >
                <Input
                  {...register("riskCategoryCode")}
                  placeholder="Enter Risk Category Code"
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
              {isSubmitting ? "Saving..." : "Save Risk Category"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
