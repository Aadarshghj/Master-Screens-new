import React from "react";
import { RotateCcw, Save, X } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Textarea,Input, Select } from "@/components/ui";
import { Form } from "@/components";
import type {
  AssetModelType,
  Option,
} from "@/types/customer-management/asset-master/asset-model";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface AssetModelFormProps {
  control: Control<AssetModelType>;
  errors: FieldErrors<AssetModelType>;
  register: UseFormRegister<AssetModelType>;
  isSubmitting: boolean;
  assetItemOptions: Option[];
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const AssetModelForm: React.FC<AssetModelFormProps> = ({
  control,
  errors,
  register,
  isSubmitting,
  assetItemOptions,
  onSubmit,
  onCancel,
  onReset,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
         
            <Form.Col lg={2} md={6} span={12} >
              <Form.Field label="Asset Item" required error={errors.assetItem}>
                <Controller
                  name="assetItem"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      options={assetItemOptions}
                      placeholder="Select Asset Item"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

           
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Asset Model Code"
                required
                error={errors.assetModelCode}
              >
                <Input
                  {...register("assetModelCode")}
                  placeholder="Enter Asset Model Code"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

           
            <Form.Col lg={3} md={12} span={12}>
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
                  rows={4}
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
              <RotateCcw className="h-3 w-3" />
              Reset
            </NeumorphicButton>

            <NeumorphicButton
              type="submit"
              variant="default"
              size="default"
              disabled={isSubmitting}
            >
              <Save width={13} />
              {isSubmitting ? "Saving..." : "Save Asset Model"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
