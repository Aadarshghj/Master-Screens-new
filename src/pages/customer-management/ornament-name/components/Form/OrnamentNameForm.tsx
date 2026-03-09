import React from "react";
import { RefreshCw, Save, X } from "lucide-react";
import { 
  Controller, 
  type Control,
  type FieldErrors, 
  type UseFormRegister, 
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Label, Switch, Textarea, Select } from "@/components/ui";
import { Form } from "@/components";
import type { OrnamentNameData } from "@/types/customer-management/ornament-name";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface OrnamentNameFormProps {
  control: Control<OrnamentNameData>;
  errors: FieldErrors<OrnamentNameData>;
  register: UseFormRegister<OrnamentNameData>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const OrnamentNameForm: React.FC<OrnamentNameFormProps> = ({
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
            <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Ornament Type" error={errors.ornamentType}
                // helperText="Select the appropriate ornament type"
                >
                  <Select
                    placeholder="Select Ornament Type"
                    options={[
                      {
                        label: "Bangle",
                        value: "bangle",
                      },
                      {
                        label: "Ring",
                        value: "Ring",
                      },
                      {
                        label: "Chain",
                        value: "chain",
                      }
                    ]}
                    size="form"
                    variant="form"
                    
                    fullWidth
                  />
                </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={3} span={12}>
              <Form.Field
                label="Ornament Code"
                required
                error={errors.ornamentCode}
              >
                <Input
                  {...register("ornamentCode")}
                  placeholder="Enter Ornament Code"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Ornament Name"
                  required
                  error={errors.ornamentName}
                >
                <Input
                {...register("ornamentName")}
                placeholder="Ornament Name"
                size="form"
                variant="form"
                />
                </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={3} span={12}>
              <Form.Field
                label="Description"
                required
                error={errors.description}
              >
                <Textarea
                  {...register("description")}
                  placeholder="Enter Description"
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
                  <Label>Status</Label>
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
              {isSubmitting ? "Saving..." : "Save Ornament Name" }
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};