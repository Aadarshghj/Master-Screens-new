import React from "react";
import { RefreshCw, Save, X } from "lucide-react";
import { 
  Controller, 
  type Control,
  type FieldErrors, 
  type UseFormRegister, 
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Label, Switch } from "@/components/ui";
import { Form, Textarea } from "@/components";
import type { GstRegistrationType } from "@/types/customer-management/asset-master/gst-registration";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface GstRegistrationFormProps {
  control: Control<GstRegistrationType>;
  errors: FieldErrors<GstRegistrationType>;
  register: UseFormRegister<GstRegistrationType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const GstRegistrationForm: React.FC<GstRegistrationFormProps> = ({
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
            <Form.Col lg={3} md={3} span={12}>
              <Form.Field
                label="GST Registration Type"
                required
                error={errors.gstRegType}
              >
                <Input
                  {...register("gstRegType")}
                  placeholder="Enter GST Registration Type"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Description">
                <Textarea
                  {...register("description")}
                //   placeholder="Enter Description"
                  size="form"
                  variant="form"
                  rows={3}
                />
              </Form.Field>
            </Form.Col>      

            <Form.Col lg={2} md={4} span={12}>
              <Flex direction="col" gap={1} style={{ paddingTop: 20 }}>
                <Flex align="center" className="pl-10 gap-2">
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
              <X className="h-3 w-3" />
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
              <Save className="h-3 w-3" />
              {isSubmitting ? "Saving..." : "Save GST Registration Type" }
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};