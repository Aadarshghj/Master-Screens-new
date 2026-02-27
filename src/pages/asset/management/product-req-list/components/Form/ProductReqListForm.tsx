import React from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
} from "react-hook-form";

import { FormContainer } from "../../../../../../components/ui/form-container";
import { Flex, Select } from "../../../../../../components/ui";
import { Form } from "../../../../../../components";

import {
  PRODUCT_REQ_PRODUCT_OPTIONS,
  PRODUCT_REQ_STATUS_OPTIONS,
} from "../../constants/ProductReqListDefault";

import type { ProductReqList } from "../../../../../../types/asset-mgmt/product-req-list";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { Filter } from "lucide-react";

interface ProductReqListFormProps {
  control: Control<ProductReqList>;
  errors: FieldErrors<ProductReqList>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onReset: () => void;
}

export const ProductReqListForm: React.FC<ProductReqListFormProps> = ({
  control,
  errors,
  isSubmitting,
  onSubmit,
  onReset,
}) => {
  return (
    <FormContainer className="px-0">
      <Form>
        <div className="mt-2">
          <Form.Row>

            <Form.Col lg={2} md={6} span={9}>
              <Form.Field
                label="Product"
                required
                error={errors.product}
              >
                <Controller
                  control={control}
                  name="product"
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={PRODUCT_REQ_PRODUCT_OPTIONS}
                      placeholder="Select Product"
                      size="form"
                      variant="form"
                      fullWidth
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Status"
                required
                error={errors.status}
              >
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={PRODUCT_REQ_STATUS_OPTIONS}
                      placeholder="Select Status"
                      size="form"
                      variant="form"
                      fullWidth
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={8} md={6} span={3}>
             <Flex.ActionGroup className="mt-4 flex items-center justify-end">
            <NeumorphicButton type="button" variant="default">
              <Filter className="h-5 w-4" />
              Filter
            </NeumorphicButton>
            </Flex.ActionGroup>
            </Form.Col>
          </Form.Row>
        </div>
      </Form>
    </FormContainer>
  );
};