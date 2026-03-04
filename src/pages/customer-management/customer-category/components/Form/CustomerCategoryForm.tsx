import React from "react";
import { RefreshCw, Save, X } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input } from "@/components/ui";
import { Form, Textarea } from "@/components";
import type { CustomerCategoryFormData } from "@/types/customer-management/customer-category";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface CustomerCategoryFormProps {
  register: UseFormRegister<CustomerCategoryFormData>;
  errors: FieldErrors<CustomerCategoryFormData>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const CustomerCategoryForm: React.FC<CustomerCategoryFormProps> = ({
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
                label="Customer Category Name"
                required
                error={errors.categoryName}
              >
                <Input
                  {...register("categoryName")}
                  placeholder="Enter Customer Category Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={6} span={12}>
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
              {isSubmitting ? "Saving..." : "Save Customer Category"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
