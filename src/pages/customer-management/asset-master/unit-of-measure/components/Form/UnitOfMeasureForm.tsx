import React from "react";
import { RefreshCcw, Save, CircleX } from "lucide-react";
import {
  type UseFormRegister,
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input } from "@/components/ui";
import { Form, Textarea } from "@/components";
import type {
  UnitOfMeasureType,

} from "@/types/customer-management/asset-master/unit-of-measure";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface UnitOfMeasureProps {
  register: UseFormRegister<UnitOfMeasureType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const UnitOfMeasureForm: React.FC<UnitOfMeasureProps> = ({
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
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Unit Code"
               
              >
                <Input
                  {...register("unitCode",{
                    onChange: e => {
                      let value = e.target.value
                        .replace(/[^A-Za-z0-9.@ ]/g, "")
                        .toUpperCase();
                      if (value.startsWith(" ")) {
                        value = value.trimStart();
                      }

                      e.target.value = value;
                    },
                  })}
                  placeholder="Enter Unit Code"
                  size="form"
                  variant="form"
                  className="uppercase"
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
              {isSubmitting ? "Saving..." : "Save Asset Unit"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
