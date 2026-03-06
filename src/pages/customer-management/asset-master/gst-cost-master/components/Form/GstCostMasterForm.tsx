import React from "react";
import { CircleX, RefreshCcw, Save } from "lucide-react";
import {
    Controller,type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Switch,Label } from "@/components/ui";
import { Form, Textarea } from "@/components";
import type {
  GstCostMasterType,

} from "@/types/customer-management/asset-master/gst-cost-master";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { InputWithSearch } from "@/components/ui/input-with-search";

interface GstCostMasterProps {
    control: Control<GstCostMasterType>;
      errors: FieldErrors<GstCostMasterType>;
  register: UseFormRegister<GstCostMasterType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
  isEditMode: boolean;
}

export const GstCostMasterForm: React.FC<GstCostMasterProps> = ({
  control,
  errors,
  register,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
  isEditMode
}) => {
const [showGLDropdown, setShowGLDropdown] = React.useState(false);
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="GST Breakup" required error={errors.gstBreakup}
               
              >
                <Input
                  {...register("gstBreakup" ,{
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
                  placeholder="Enter GST Breakup"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
<Form.Field label="GL" required error={errors.gl}>
  <Controller
    control={control}
    name="gl"
    render={({ field }) => (
      <InputWithSearch
        value={field.value || ""}
        onChange={(e) => {
          let value = e.target.value
            .replace(/[^A-Za-z0-9.@ ]/g, "")
            .toUpperCase();

          if (value.startsWith(" ")) {
            value = value.trimStart();
          }

          field.onChange(value);
        }}
        placeholder="Search GL"
        size="form"
        showDropdown={showGLDropdown}
        dropdownOptions={[]}
        onOptionSelect={() => {
          setShowGLDropdown(false);
        }}
        noResultsText="No records found"
      />
    )}
  />
</Form.Field>
</Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Description">
                <Textarea
                  {...register("description")}
                  size="form"
                  variant="form"
                  rows={3}
                />
              </Form.Field>
            </Form.Col>
            
                        <Form.Col lg={2} md={6} span={12}>
                          <Flex direction="col" gap={1} style={{ paddingTop: 22, paddingLeft: 20 }}>
                            <Flex align="center" gap={2}>
                              <Controller
                                control={control}
                                name="isActive"
                                render={({ field }) => (
                                  <Switch
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditMode}
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
              {isSubmitting ? "Saving..." : "Save GST Cost Master"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
