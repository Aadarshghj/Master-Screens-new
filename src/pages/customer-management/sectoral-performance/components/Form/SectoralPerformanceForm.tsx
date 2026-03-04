import React from "react";
import { RefreshCw, Save, X } from "lucide-react";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input } from "@/components/ui";
import { Form } from "@/components";
import type { sectoralPerformanceFormData } from "@/types/customer-management/sectoral-performance";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface SectoralPerformanceFormProps {
  register: UseFormRegister<sectoralPerformanceFormData>;
  errors: FieldErrors<sectoralPerformanceFormData>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const SectoralPerformanceForm: React.FC<
  SectoralPerformanceFormProps
> = ({ register, errors, isSubmitting, onSubmit, onCancel, onReset }) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Sectoral Performance Type"
                required
                error={errors.sectorName}
              >
                <Input
                  {...register("sectorName")}
                  placeholder="Enter Sectoral Performance Type"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                  restriction="alphabetic"
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
              <RefreshCw width={12} /> Reset
            </NeumorphicButton>

            <NeumorphicButton
              type="submit"
              variant="default"
              size="default"
              disabled={isSubmitting}
            >
              <Save className="h-3 w-3" />
              {isSubmitting ? "Saving..." : "Save Sector"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
