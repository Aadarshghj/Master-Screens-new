import React from "react";
// import { Controller } from "react-hook-form";
import { RefreshCw, Save, X } from "lucide-react";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Select, Switch } from "@/components/ui";
import { Form, Textarea } from "@/components";
import type { AssetItemAttributeBase } from "@/types/customer-management/asset-master/asset-item-attributes.types";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface AssetItemAttributeFormProps {
  errors: FieldErrors<AssetItemAttributeBase>;
  register: UseFormRegister<AssetItemAttributeBase>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const AssetItemAttributeForm: React.FC<AssetItemAttributeFormProps> = ({
  // control,
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
              <Form.Field label="Asset Item" required error={errors.assetItem}>
                <Select
                  placeholder="Select Asset item"
                  options={[
                    {
                      label: "Asset Item Attribute",
                      value: "asset-item-attribute",
                    },
                    {
                      label: "Gold Loan",
                      value: "gold-loan"
                    }
                  ]}
                  size="form"
                  variant="form"
                  fullWidth
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={3} span={12}>
              <Form.Field
                label="Attribute Key"
                required
                error={errors.attributeKey}
              >
                <Input
                  {...register("attributeKey")}
                  placeholder="//Unique, validate text"
                  size="form"
                  variant="form"
                  // disabled={isLoading || readonly}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Attribute Name"
                required
                error={errors.attributeName}
              >
                <Input
                  {...register("attributeName")}
                  placeholder="Enter Attribute Name"
                  size="form"
                  variant="form"
                  // disabled={isLoading || readonly}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Data Type" required error={errors.dataType}
              // helperText="Select the appropriate data type for the attribute"
              >
                <Select
                  placeholder="Select Data Type"
                  options={[
                    {
                      label: "Data Type",
                      value: "data-type",
                    },
                    {
                      label: "DECIMAL",
                      value: "decimal",
                    },
                    {
                      label: "VARCHAR",
                      value: "varchar",
                    }
                  ]}
                  size="form"
                  variant="form"
                  fullWidth
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Default Value"
                required
                error={errors.defaultValue}
                // helperText="Enter the default value according to selected data type"
              >
                <Input
                  {...register("defaultValue")}
                  placeholder="Enter Default Values"
                  size="form"
                  variant="form"
                  // disabled={isLoading || readonly}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row className="mt-4">
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="List Values * (Memory(4GB, 8GB, 16GB)"
                required
                error={errors.listValues}
              >
                <Input
                  {...register("listValues")}
                  placeholder="Enter List Value"
                  size="form"
                  variant="form"
                  // disabled={isLoading || readonly}
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
                  //   cols={6}
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={4} md={6} span={12}>
              <div className="flex h-full items-center gap-8 pt-6">
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <span className="text-xxs font-medium">Required</span>
                </div>

                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <span className="text-xxs font-medium">Active</span>
                </div>
              </div>
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
              {isSubmitting ? "Saving..." : "Save"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
