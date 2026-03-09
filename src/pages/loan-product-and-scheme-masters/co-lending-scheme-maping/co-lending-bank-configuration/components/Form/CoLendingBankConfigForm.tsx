import React from "react";
import { RefreshCw, Save, X } from "lucide-react";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Label, Select, Switch } from "@/components/ui";
import { Form } from "@/components";
import type { BankConfig } from "@/types/loan-product-and-scheme-masters/co-lending-scheme-mapping/co-lending-bank-config.types";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { interestCalcOnOptions, handoffOptions } from "../../constants/coLendingBankConfigDefault";

interface BankConfigFormProps {
  control: Control<BankConfig>;
  errors: FieldErrors<BankConfig>;
  register: UseFormRegister<BankConfig>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const BankConfigForm: React.FC<BankConfigFormProps> = ({
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
            <Form.Col lg={2} md={3} span={12}>
              <Form.Field
                label="Bank Code"
                required
                error={errors.bankCode}
              >
                <Input
                  {...register("bankCode")}
                  placeholder="Enter Bank Code"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12} className="pr-4">
              <Form.Field
                label="Bank Name"
                required
                error={errors.bankName}
              >
                <Input
                  {...register("bankName")}
                  placeholder="Enter Bank Name"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={1} md={4} span={12}>
              <Label>Enable/Disable</Label>
              <Flex direction="col" gap={1} style={{ paddingTop: 10 }}>
                <Flex align="center" className="pl-6" >
                  <Controller
                    control={control}
                    name="isActive"
                    defaultValue={true}
                    render={({ field }) => (
                      <Switch 
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                    />
                  )}
                />
              </Flex>
            </Flex>
          </Form.Col>  

            <Form.Col lg={3} md={3} span={12} className="pl-6">
              <Form.Field
                label="Interest %"
                required
                error={errors.interestRate}
              >
                <Input
                  {...register("interestRate")}
                  placeholder="Enter Interest Percentage"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="Interest Calculated On" required error={errors.interestCalcOn}>
                    <Controller
                        name="interestCalcOn"
                        control={control}
                        render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          options={interestCalcOnOptions}
                          placeholder="Select Interest Calculated On"
                          size="form"
                          variant="form"
                          fullWidth
                          itemVariant="form"
                        />
                        )}
                    />
                </Form.Field>
             </Form.Col>
          </Form.Row>

          <Form.Row className="mt-4">
            <Form.Col lg={2} md={6} span={12} className="pr-4">
                <Form.Field label="Hand-off File" required error={errors.handoff}>
                    <Controller
                        name="handoff"
                        control={control}
                        render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          options={handoffOptions}
                          placeholder="Select Hand-off File"
                          size="form"
                          variant="form"
                          fullWidth
                          itemVariant="form"
                        />
                        )}
                    />
                </Form.Field>
             </Form.Col>
          
            <Form.Col lg={2} md={4} span={12}>
              <Label>API Mode/SFTP Mode</Label>
              <Flex direction="col" gap={1} style={{ paddingTop: 10 }}>
                <Flex align="center" className="pl-10 gap-2">
                  <Controller
                    control={control}
                    name="mode"
                    defaultValue={true}
                    render={({ field }) => (
                      <Switch 
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                    />
                  )}
                />
              </Flex>
            </Flex>
          </Form.Col>  
            
          <Form.Col lg={2} md={4} span={12}>
            <Label>CLM1/CLM2</Label>
            <Flex direction="col" gap={1} style={{ paddingTop: 10 }}>
              <Flex align="center" className="pl-5">
                <Controller
                    control={control}
                    name="clmId"
                    defaultValue={true}
                    render={({ field }) => (
                      <Switch 
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                    />
                  )}
                />
              </Flex>
            </Flex>
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
