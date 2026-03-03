 import React from "react";
import { RefreshCw, Save, X } from "lucide-react";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { FormContainer } from "@/components/ui/form-container";
import { Flex,  Input,  Select } from "@/components/ui";
import { Form } from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { CoLendingSchemeMapType } from "@/types/loan-product-and-scheme-masters/co-lending-scheme-mapping/co-lending-scheme-map";
import { BANK_CODE_OPTIONS,  PRODUCT_CODE_OPTIONS, SAMPLE_CODE_OPTIONS } from "@/mocks/co-lending-scheme-mapping/co-lender-scheme-map";

interface SchemeMapFormProps {
  control: Control<CoLendingSchemeMapType>;
  errors: FieldErrors<CoLendingSchemeMapType>;
   register: UseFormRegister<CoLendingSchemeMapType>;
  isSubmitting: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  onReset: () => void;
}

export const CoLendingSchemeMapForm: React.FC<SchemeMapFormProps> = ({
  control,
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
          <Form.Row className="py-2">        
            <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="Product Code" required error={errors?.productcode}>
                    <Controller
                        name="productcode"
                        control={control}
                        render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          options={PRODUCT_CODE_OPTIONS}
                          placeholder="Select Product Code"
                          size="form"
                          variant="form"
                          fullWidth
                          itemVariant="form"
                        />
                        )}
                    />
                </Form.Field>
             </Form.Col>

            <Form.Col lg={3} md={6} span={12} className="pr-6">
                <Form.Field label="Scheme Code" required error={errors?.schemecode}>
                    <Controller
                        name="schemecode"
                        control={control}
                        render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          options={SAMPLE_CODE_OPTIONS}
                          placeholder="Select Scheme Code"
                          size="form"
                          variant="form"
                          fullWidth
                          itemVariant="form"
                        />
                        )}
                    />
                </Form.Field>
             </Form.Col>     

            <Form.Col lg={3} md={6} span={12} className="pr-6">
                <Form.Field label="Co-Lender Bank Code" required error={errors?.bankcode}>
                    <Controller
                        name="bankcode"
                        control={control}
                        render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          options={BANK_CODE_OPTIONS}
                          placeholder="Select Co-Lender Banks"
                          size="form"
                          variant="form"
                          fullWidth
                          itemVariant="form"
                        />
                        )}
                    />
                </Form.Field>
             </Form.Col>         
         
             <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Co-Lender Bank Name"  error={errors.bankname}>
                <Input
                  {...register("bankname")}               
                  size="form"
                  placeholder="Co-Lender Bank Name"
                  variant="form"
                  className="uppercase"
                  disabled
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
              {isSubmitting ? "Saving..." : "Save"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};