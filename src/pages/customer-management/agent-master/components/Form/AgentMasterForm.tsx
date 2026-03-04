import React from "react";
import { RefreshCw, Save, X } from "lucide-react";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input } from "@/components/ui";
import { Form } from "@/components";
import type { AgentMasterType } from "@/types/customer-management/agent-master";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface Props {
  register: UseFormRegister<AgentMasterType>;
  errors: FieldErrors<AgentMasterType>;
  isSubmitting: boolean;

  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const AgentMasterForm: React.FC<Props> = ({
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
              <Form.Field label="Agent Name" required error={errors.agentName}>
                <Input
                  {...register("agentName")}
                  placeholder="Enter Agent Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  restriction="alphabetic"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Agent Code" required error={errors.agentCode}>
                <Input
                  {...register("agentCode")}
                  placeholder="Enter Agent Code"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Address" required error={errors.address}>
                <Input
                  {...register("address")}
                  placeholder="Enter Address"
                  size="form"
                  variant="form"
                  textTransform="uppercase"
                  restriction="alphanumeric"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Contact Number"
                required
                error={errors.contactNumber}
              >
                <Input
                  {...register("contactNumber")}
                  placeholder="Enter Contact Number"
                  size="form"
                  variant="form"
                  restriction="numeric"
                  maxLength={10}
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
              {isSubmitting ? "Saving..." : "Save Agent Master"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
