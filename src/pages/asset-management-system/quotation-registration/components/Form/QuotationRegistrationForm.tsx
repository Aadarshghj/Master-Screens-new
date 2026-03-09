import React from "react";
import { 
  Controller, 
  type Control,
  type FieldErrors, 
  type UseFormRegister, 
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { 
  // Flex,
  Input, 
  DatePicker
 } from "@/components/ui";
import { Form } from "@/components";
import type { QuotReqDetails } from "@/types/asset-management/quotation-registration-type";

interface QuotReqDetailsFormProps {
  control: Control<QuotReqDetails>;
  errors: FieldErrors<QuotReqDetails>;
  register: UseFormRegister<QuotReqDetails>;
  isEdit: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const AdminUnitTypeForm: React.FC<QuotReqDetailsFormProps> = ({
  control,
  errors,
  register,
  // isEdit,
  // isSubmitting,
  onSubmit,
  // onCancel,
  // onReset,
}) => {

return (
  <FormContainer className="px-0">
    <Form onSubmit={onSubmit}>
      <div className="mt-2">
        <Form.Row className="py-2">
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field
              label="Leave From"
              error={errors.quotReqDate}
              required
            >
              <Controller
                name="quotReqDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value || undefined}
                    onChange={(value: string) => {
                      field.onChange(value);
                      // trigger?.("leaveFrom");
                    }}
                    onBlur={() => field.onBlur()}
                    placeholder="dd/mm/yyyy"
                    allowManualEntry={true}
                    size="form"
                    variant="form"
                    disableFutureDates={false}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={3} span={12}>
            <Form.Field
                label="Quotation Request ID"
                required
                error={errors.quotReqId}
            >
              <Input
                  {...register("quotReqId")}
                  placeholder="Enter Quotation Request ID"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  restriction="alphabetic"
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={3} span={12}>
            <Form.Field
                label="Requested By"
                required
                error={errors.reqBy}
            >
              <Input
                  {...register("reqBy")}
                  placeholder="Enter Quotation Request ID"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  disabled
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Description">
              <Input
                  {...register("description")}
                  placeholder="Enter Description"
                  size="form"
                  variant="form"
                  disabled
              />
            </Form.Field>
          </Form.Col>
        </Form.Row>

       
        </div>
      </Form>
    </FormContainer>
  );
};
/* 
<FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
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
    </FormContainer> */