import React from "react";
import { RotateCcw, Save, X } from "lucide-react";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input } from "@/components/ui";
import { Form } from "@/components";
import type { CustomerGroupFormType } from "@/types/customer-management/customer-group-master";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface Props {
  register: UseFormRegister<CustomerGroupFormType>;
  errors: FieldErrors<CustomerGroupFormType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const CustomerGroupForm: React.FC<Props> = ({
  register,
  errors,
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
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Customer Group Name"
                required
                error={errors.customerGroupName}
              >
                <Input
                  {...register("customerGroupName")}
                  placeholder="Enter Customer Group Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  restriction="alphabetic"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Customer Group Code"
                required
                error={errors.customerGroupCode}
              >
                <Input
                  {...register("customerGroupCode")}
                  placeholder="Enter Customer Group Code"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  restriction="alphanumeric"
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
              {isSubmitting ? "Saving..." : "Save Customer Group Master"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
