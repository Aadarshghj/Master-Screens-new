import React from "react";
import { RefreshCw, Save, X } from "lucide-react";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input } from "@/components/ui";
import { Form, Textarea } from "@/components";
import type { FirmData } from "@/types/customer-management/firm-type";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface FirmTypeFormProps {
  errors: FieldErrors<FirmData>;
  register: UseFormRegister<FirmData>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const FirmTypeForm: React.FC<FirmTypeFormProps> = ({
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
            <Form.Col lg={3} md={3} span={12}>
              <Form.Field label="Firm Type" required error={errors.firmType}>
                <Input
                  {...register("firmType")}
                  placeholder="Enter Firm Type"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  restriction="alphabetic"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={4} md={4} span={12}>
              <Form.Field label="Description">
                <Textarea
                  {...register("description")}
                  placeholder="Enter Description"
                  size="form"
                  variant="form"
                  rows={3}
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
              {isSubmitting ? "Saving..." : "Save Firm Type"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
