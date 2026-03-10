import React from "react";
import { 
  Controller, 
  type Control,
  type FieldErrors, 
  type UseFormRegister, 
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Input, InputWithSearch, DatePicker } from "@/components/ui";
import { Form } from "@/components";
import type { SupplierDetails } from "@/types/asset-management/quotation-registration-type";

interface SupplierDetailsFormProps {
  control: Control<SupplierDetails>;
  errors: FieldErrors<SupplierDetails>;
  register: UseFormRegister<SupplierDetails>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const SupplierDetailsForm: React.FC<SupplierDetailsFormProps> = ({
  control,
  errors,
  register,
//   isSubmitting,
  onSubmit,
//   onCancel,
//   onReset,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row className="py-2">
            <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Supplier Name" error={errors.supplierName}
                >
                  <InputWithSearch
                    placeholder="Select Supplier Name"
                    size="form"
                    variant="form"
                    
                  />
                </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={3} span={12}>
              <Form.Field
                label="Quotation Number"
                required
                error={errors.quotationNumber}
              >
                <Input
                  {...register("quotationNumber")}
                  placeholder="Enter Quotation Number"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
             <Form.Field
              label="Leave From"
              error={errors.quotationDate}
              required
            >
              <Controller
                name="quotationDate"
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
                label="Quotation Amount"
                required
                error={errors.quotationAmount}
              >
                <Input
                  {...register("quotationAmount")}
                  placeholder="Enter Quotation Amount"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>
        </div>
      </Form>
    </FormContainer>
  );
};