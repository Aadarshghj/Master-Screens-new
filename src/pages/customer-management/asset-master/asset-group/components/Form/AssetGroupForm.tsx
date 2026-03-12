import React from "react";
import { RotateCcw, Save, X } from "lucide-react";
import {
  Controller,
  // useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, InputWithSearch, Label, Select, Switch } from "@/components/ui";
import { Form, Textarea } from "@/components";
import type { AssetGroupType } from "@/types/customer-management/asset-master/asset-group.types";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { Option } from "@/types/customer-management/designation";

interface AssetGroupProps {
  control: Control<AssetGroupType>;
  errors: FieldErrors<AssetGroupType>;
  register: UseFormRegister<AssetGroupType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
  assetTypeOptions: Option[];
}

export const AssetGroupForm: React.FC<AssetGroupProps> = ({
  control,
  errors,
  register,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
  assetTypeOptions,
}) => {
  // const assetTypeValue = useWatch({ control, name: "assetType" });
  // const enableAssetCode = !!assetTypeValue;
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Asset Group Code"
                required
                // disabled={!enableAssetCode}
                error={errors.assetCode}
              >
                <Input
                  {...register("assetCode")}
                  placeholder=" Enter Asset Group Code"
                  // disabled={!enableAssetCode}
                  // disabled
                  size="form"
                  variant="form"
                  className="uppercase"
                  restriction="alphanumeric"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Asset Type" required error={errors.assetType}>
                <Controller
                  name="assetType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      options={assetTypeOptions}
                      placeholder="Select Asset Type"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Asset Group Name"
                required
                error={errors.assetName}
              >
                <Input
                  {...register("assetName")}
                  placeholder="Enter Group Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                  restriction="alphanumeric"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Asset Posting GL"
                required
                error={errors.postingGL}
              >
                <InputWithSearch
                  {...register("postingGL")}
                  placeholder="Search Asset Posting GL"
                  size="form"
                  variant="form"
                  className="uppercase"
                  restriction="alphanumeric"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Asset Group Description">
                <Textarea
                  {...register("description")}
                  placeholder="Enter Description"
                  size="form"
                  variant="form"
                  rows={4}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Flex direction="col" gap={1} style={{ paddingTop: 22 }}>
                <Flex align="center" gap={2}>
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        disabled
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
              {isSubmitting ? "Saving..." : "Save Asset Group"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
