import React from "react"
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form"

import { Flex, Input, Switch, Label, Select } from "@/components/ui"
import { Form } from "@/components"

import type {
  SupplierAssetGroupType,
  Option,
} from "@/types/asset-management-system/supplier-management/supplier-information"

interface SupplierAssetGroupProps {
  control: Control<SupplierAssetGroupType>
  errors: FieldErrors<SupplierAssetGroupType>
  register: UseFormRegister<SupplierAssetGroupType>
  isEditMode: boolean
  assetGroupOptions: Option[]
}

export const SupplierAssetGroupForm: React.FC<SupplierAssetGroupProps> = ({
  errors,
  register,
  control,
  isEditMode,
  assetGroupOptions,
}) => {
  return (
    <div>
      <h3 className="text-xs font-semibold mb-2">Supplier Contact Management</h3>

      <Form.Row>
        <Form.Col lg={2} md={6} span={12}>
          <Form.Field label="Asset Group" required error={errors.assetGroup}>
            <Controller
              name="assetGroup"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={assetGroupOptions}
                  placeholder="Select Asset Group"
                  size="form"
                  variant="form"
                  fullWidth
                  itemVariant="form"
                />
              )}
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
                    checked={field.value}
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
    </div>
  )
}