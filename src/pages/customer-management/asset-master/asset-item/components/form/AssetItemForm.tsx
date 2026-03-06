import React from "react";
import {
  Controller,
  type FieldErrors,
  type UseFormRegister,
  type Control,
} from "react-hook-form";
import { RotateCcw, Save, X } from "lucide-react";
import {
  ASSET_TYPE_OPTIONS,
  ASSET_GROUP_OPTIONS,
  ASSET_CATEGORY_OPTIONS,
  DEPRECIATION_METHOD_OPTIONS,
  UNIT_OF_MEASUREMENT_OPTIONS,
} from "../../constants/AssetItemDefault";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Textarea, Select, Switch } from "@/components/ui";
import { Form } from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

import type { AssetItemType } from "@/types/customer-management/asset-item";

interface Props {
  errors: FieldErrors<AssetItemType>;
  register: UseFormRegister<AssetItemType>;
  control: Control<AssetItemType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const AssetItemForm: React.FC<Props> = ({
  errors,
  register,
  control,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row className="pb-2">
            <Form.Col lg={3} md={6} span={10}>
              <Form.Field
                label="Asset Item Name"
                required
                error={errors.assetItemName}
              >
                <Input
                  {...register("assetItemName")}
                  placeholder="Enter asset item name"
                  size="form"
                  variant="form"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Asset Type" required error={errors.assetType}>
                <Controller
                  control={control}
                  name="assetType"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      placeholder="Select Asset Type"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                      options={ASSET_TYPE_OPTIONS}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Asset Group"
                required
                error={errors.assetGroup}
              >
                <Controller
                  control={control}
                  name="assetGroup"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      placeholder="Select Asset Group"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                      options={ASSET_GROUP_OPTIONS}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Asset Category"
                required
                error={errors.assetCategory}
              >
                <Controller
                  control={control}
                  name="assetCategory"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      placeholder="Select Category"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                      options={ASSET_CATEGORY_OPTIONS}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Depreciation Rate"
                required
                error={errors.depreciationRate}
              >
                <Input
                  {...register("depreciationRate")}
                  type="text"
                  placeholder="Enter Rate"
                  size="form"
                  variant="form"
                  restriction="numeric"
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Depreciation Method">
                <Controller
                  control={control}
                  name="depreciationMethod"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      placeholder="Select Depreciation Method"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                      options={DEPRECIATION_METHOD_OPTIONS}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Unit of Measurement"
                required
                error={errors.unitOfMeasurement}
              >
                <Controller
                  control={control}
                  name="unitOfMeasurement"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      placeholder="Select Unit of Measurement"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                      options={UNIT_OF_MEASUREMENT_OPTIONS}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={12} span={12}>
              <Form.Field label="Asset Description">
                <Textarea
                  {...register("assetDescription")}
                  size="form"
                  variant="form"
                  rows={3}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={1} md={6} span={12} className="pt-1 pl-6">
              <Form.Field label="Tangible">
                <Controller
                  control={control}
                  name="tangible"
                  render={({ field }) => (
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      size="lg"
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={1} md={6} span={12} className="pt-1">
              <Form.Field label="Active">
                <Controller
                  control={control}
                  name="active"
                  render={({ field }) => (
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      size="lg"
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Flex.ActionGroup className="mt-2 justify-end gap-4 pt-7 pb-3">
            <NeumorphicButton type="button" variant="grey" onClick={onCancel}>
              <X className="h-3 w-3" />
              Cancel
            </NeumorphicButton>

            <NeumorphicButton
              type="button"
              variant="secondary"
              onClick={onReset}
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </NeumorphicButton>

            <NeumorphicButton
              type="submit"
              variant="default"
              disabled={isSubmitting}
            >
              <Save className="h-3 w-3" />
              {isSubmitting ? "Saving..." : "Save Asset Item"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
