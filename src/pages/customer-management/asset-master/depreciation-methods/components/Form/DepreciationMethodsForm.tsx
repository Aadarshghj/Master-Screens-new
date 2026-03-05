import React from "react";
import { CircleX, RefreshCcw, Save } from "lucide-react";
import {
    Controller,type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Switch,Label } from "@/components/ui";
import { Form, Textarea } from "@/components";
import type {
  DepreciationMethodsType,

} from "@/types/customer-management/asset-master/depreciation-methods";

import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface DepreciationMethodsProps {
    control: Control<DepreciationMethodsType>;
    errors: FieldErrors<DepreciationMethodsType>;
  register: UseFormRegister<DepreciationMethodsType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
  isEditMode: boolean;
}

export const DepreciationMethodsForm: React.FC<DepreciationMethodsProps> = ({
  control,
  errors,
  register,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
  isEditMode
}) => { 
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}> 
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Depreciation Type" required error={errors.depreciationType}
               
              >
                <Input
                  {...register("depreciationType")}
                  placeholder="Enter Depreciation Type"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Calculation Logic">
                <Textarea
                  {...register("calculationLogic")}
                  placeholder="Enter Calculation Logic"
                  size="form"
                  variant="form"
                  rows={3}
                />
              </Form.Field>
            </Form.Col>
            
                        <Form.Col lg={2} md={6} span={12}>
                          <Flex direction="col" gap={1} style={{ paddingTop: 22, paddingLeft: 20 }}>
                            <Flex align="center" gap={2}>
                              <Controller
                                control={control}
                                name="isActive"
                                render={({ field }) => (
                                  <Switch
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditMode}
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
              <CircleX className="h-3 w-3" />
              Cancel
            </NeumorphicButton>

            <NeumorphicButton
              type="button"
              variant="secondary"
              size="secondary"
              onClick={onReset}
              disabled={isSubmitting}
            >
              <RefreshCcw className="h-3 w-3" />
              Reset
            </NeumorphicButton>

            <NeumorphicButton
              type="submit"
              variant="default"
              size="default"
              disabled={isSubmitting}
            >
              <Save className="h-3 w-3" />
              {isSubmitting ? "Saving..." : "Save Depreciation Methods"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
