import React from "react";
import { RefreshCcw, Save, XCircle } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { FormContainer } from "../../../../../../components/ui/form-container";
import { Flex, Input, Label, Switch } from "../../../../../../components/ui";
import { Form, Textarea } from "../../../../../../components";
import NeumorphicButton from "../../../../../../components/ui/neumorphic-button/neumorphic-button";
import type { ContactType } from '../../../../../../types/asset-mgmt/contact-type';

interface ContactTypeFormProps {
  control: Control<ContactType>;
  errors: FieldErrors<ContactType>;
  register: UseFormRegister<ContactType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const ContactTypeForm: React.FC<ContactTypeFormProps> = ({
  errors,
  control,
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
          <Form.Row gap={10}>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Contact Type"
                required
                error={errors.contactType}
              >
                <Input
                  {...register("contactType")}
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  max={20}
                  placeholder="Enter Contact Type"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={12} span={12}>
              <Form.Field label="Description">
                <Textarea
                  {...register("contactTypeDesc")}
                  placeholder="Enter Description"
                  size="form"
                  variant="form"
                  rows={3}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Flex direction="col" gap={1} style={{ paddingTop: 22 }}>
                <Flex align="center" gap={2}>
                  <Controller
                    control={control}
                    name="status"
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
              <XCircle className="h-3 w-3" />
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
              {isSubmitting ? "Saving..." : "Save Contact Type"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
