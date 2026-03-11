import React from "react"
import { Controller, useForm } from "react-hook-form"

import { Flex, Switch, Label, Select } from "@/components/ui"
import { Form } from "@/components"

import type {
  SupplierAssetGroupType,
  Option,
} from "@/types/asset-management-system/supplier-management/supplier-information"

import { DEFAULT_ASSET_GROUP } from "../../constants/SupplierInformation"
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button"
import { PlusCircle } from "lucide-react"

interface SupplierAssetGroupProps {
  assetGroupOptions: Option[]
  setAssetGroups: React.Dispatch<
    React.SetStateAction<SupplierAssetGroupType[]>
  >
}

export const SupplierAssetGroupForm: React.FC<SupplierAssetGroupProps> = ({
  assetGroupOptions,
  setAssetGroups,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierAssetGroupType>({
    defaultValues: DEFAULT_ASSET_GROUP,
  })

  const onSubmit = (data: SupplierAssetGroupType) => {
    setAssetGroups(prev => [...prev, data])
    reset(DEFAULT_ASSET_GROUP)
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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
              />
            )}
          />
          <Label>Active</Label>
        </Flex>
      </Flex>
    </Form.Col>

    <Form.Col lg={8} md={6} span={12}>
      <Flex justify="end" align="end" className="h-full pt-6">
        <NeumorphicButton type="submit" variant="default">
          <PlusCircle className="mr-1 h-3 w-3" />
          Add Asset Group
        </NeumorphicButton>
      </Flex>
    </Form.Col>
  </Form.Row>
</Form>
  )
}