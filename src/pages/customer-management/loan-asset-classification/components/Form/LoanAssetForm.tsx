import React from "react";
import { RefreshCw, Save, X } from "lucide-react";
import { type FieldErrors, type UseFormRegister, type Control, Controller} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Label, Switch } from "@/components/ui";
import { Form, Textarea } from "@/components";


import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { AssetClassificationType } from "@/types/customer-management/loan-asset-classification";

interface LoanAssetClassificationFormProps {
  control:Control<AssetClassificationType>
  errors: FieldErrors<AssetClassificationType>;
  register: UseFormRegister<AssetClassificationType>;
  isSubmitting: boolean;
  onSubmit: ()=>void;
  onCancel: () => void;
  onReset: () => void;
  isEdit:boolean;
}
// const isEdit = false;
export const LoanAssetClassificationForm: React.FC<
  LoanAssetClassificationFormProps
> = ({
  control,
  errors,
  register,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
  isEdit
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={3} md={3} span={12}>
              <Form.Field
                label="Asset Classification Name"
                required
                error={errors.assetClassificationName}
              >
                <Input
                  {...register("assetClassificationName")}
                  placeholder="Enter asset classification name"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={4} span={12}>
              <Form.Field 
                 label="Description"
                 error={errors.description}
>
                <Textarea
                  {...register("description")}
                  placeholder="Enter Description"
                  size="form"
                  variant="form"
                  className="uppercase"
                  rows={3}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={3} span={12} >
              
              <Flex direction="col" gap={1} style={{paddingTop:22,paddingLeft:20}}>
                <Flex align="center" gap={2}>
                  <Controller control={control}
                  name="isActive"
                  render={({field})=>(
                    <Switch
                       checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isEdit}
                    />
                  )}
                  />
                  <Label>Active</Label>
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
              {isSubmitting
                ? "Saving..."
                : isEdit
                ? "Update Loan Asset Classification Master"
                : "Save Loan Asset Classification Master"}

            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
