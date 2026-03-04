import React from "react";
import { RotateCcw, Save, X } from "lucide-react";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Textarea } from "@/components/ui";
import { Form } from "@/components";
import type { ProductServiceType } from "@/types/customer-management/product-service";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface ProductServiceProps {
  errors: FieldErrors<ProductServiceType>;
  register: UseFormRegister<ProductServiceType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const ProductServiceForm: React.FC<ProductServiceProps> = ({
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
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Product Name"
                required
                error={errors.productServiceName}
              >
                <Input
                  {...register("productServiceName")}
                  placeholder="Enter Product Service Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  restriction="alphabetic"
                />
              </Form.Field>
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
              {isSubmitting ? "Saving..." : "Save Product Service"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
