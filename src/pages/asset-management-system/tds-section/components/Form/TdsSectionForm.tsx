import React from "react";
import { RotateCcw, Save, X } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Textarea,Input, Switch,Label } from "@/components/ui";
import { Form } from "@/components";

import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { TdsSectionTypes } from "@/types/asset-management-system/tds-section";

interface TdsSectionFormProps {
  control: Control<TdsSectionTypes>;
  errors: FieldErrors<TdsSectionTypes>;
  register: UseFormRegister<TdsSectionTypes>;
  isSubmitting: boolean;
    onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
  isEdit:boolean;
}

export const TdsSectionForm: React.FC<TdsSectionFormProps> = ({
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
                label="TDS Section Type"
                required
                error={errors.tdsSectionType}
              >
                <Input
                  {...register("tdsSectionType")}
                  placeholder="Enter TDS Section Type"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                 // restriction="alphanumeric"
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
          {/* Action Buttons */}
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
