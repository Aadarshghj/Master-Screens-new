import React from "react";
import { RotateCcw, Save, X } from "lucide-react";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input } from "@/components/ui";
import { Form, Textarea } from "@/components";
import type { SitePremiseType } from "@/types/customer-management/site-premise";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface SitePremiseProps {
  errors: FieldErrors<SitePremiseType>;
  register: UseFormRegister<SitePremiseType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const SitePremiseForm: React.FC<SitePremiseProps> = ({
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
          <Form.Row>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Premise Type Name"
                required
                error={errors.premiseTypeName}
              >
                <Input
                  {...register("premiseTypeName")}
                  placeholder="Enter Premise Type Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  restriction="alphabetic"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Description">
                <Textarea
                  {...register("description")}
                  placeholder="Enter Description"
                  size="form"
                  variant="form"
                  rows={3}
                  className="uppercase"
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
              <X className="h-3 w-3" />
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
              <Save className="h-3 w-3" />
              {isSubmitting ? "Saving..." : "Save Industry Category"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
