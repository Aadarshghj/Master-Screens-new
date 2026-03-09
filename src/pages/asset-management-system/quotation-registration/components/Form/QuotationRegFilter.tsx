import React, { useEffect } from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Select, Input } from "@/components/ui";
import { Form } from "@/components";

import {
  STATUS_OPTIONS,
} from "../../constants/QuotationRegDefault";

import { useForm } from "react-hook-form";
import type { QuotationFilter } from "@/types/asset-management/quotation-registration-type";
import { QUOTATION_FILTER_DEFAULT_VALUES } from "../../constants/QuotationRegDefault";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { Filter } from "lucide-react";

interface QuotationFilterFormProps {
  control: Control<QuotationFilter>;
  errors: FieldErrors<QuotationFilter>;
  onSubmit: () => void;
  onReset: () => void;
}

export const QuotationFilterForm: React.FC<QuotationFilterFormProps> = ({
  onSubmit,
  errors,
}) => {

  const { control, handleSubmit, reset } = useForm({
    defaultValues: QUOTATION_FILTER_DEFAULT_VALUES,
  });

  useEffect(() => {
    reset(QUOTATION_FILTER_DEFAULT_VALUES);
  }, [reset]);

  return (
    <FormContainer className="border-0 bg-transparent p-0 shadow-none">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={2} md={6} span={9}>
              <Form.Field
                label="Request ID"
                required
                error={errors.reqId}>
                    <Input
                      {...control.register("reqId")}
                      placeholder="Enter Quotation Request ID"
                      size="form"
                      variant="form"
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
                      options={STATUS_OPTIONS}
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      size="form"
                      variant="form"
                      fullWidth
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={8} md={6} span={3}>
             <Flex.ActionGroup className="mt-4 mr-5 flex items-center justify-end">
            <NeumorphicButton variant="default" type="submit">
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